import { clamp, svgEscape } from './svg.js';

export function renderHeatmap(spec) {
    const width = spec?.width ?? 720;
    const height = spec?.height ?? 260;
    const rows = Array.isArray(spec?.rows) ? spec.rows : [];
    const cols = Array.isArray(spec?.cols) ? spec.cols : [];
    const values = Array.isArray(spec?.values) ? spec.values : [];

    const originX = spec?.originX ?? 140;
    const originY = spec?.originY ?? 74;
    const cellW = spec?.cellW ?? 64;
    const cellH = spec?.cellH ?? 22;
    const gapX = spec?.gapX ?? 16;
    const gapY = spec?.gapY ?? 10;

    const minOpacity = spec?.minOpacity ?? 0.08;
    const maxOpacity = spec?.maxOpacity ?? 0.33;

    const title = spec?.title ?? '';
    const footnote = spec?.footnote ?? '';

    const headerText = cols.map((c, i) => {
        const x = originX + i * (cellW + gapX) + cellW / 2;
        return `<text x="${x}" y="60" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">${svgEscape(c)}</text>`;
    }).join('');

    const rowText = rows.map((r, i) => {
        const y = originY + i * (cellH + gapY) + cellH - 4;
        return `<text x="20" y="${y}" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">${svgEscape(r)}</text>`;
    }).join('');

    const cells = rows.map((_, r) => {
        const rowVals = Array.isArray(values[r]) ? values[r] : [];
        return cols.map((__, c) => {
            const v = rowVals[c] ?? 0;
            const t = clamp(Number(v) || 0, 0, 100) / 100;
            const op = minOpacity + t * (maxOpacity - minOpacity);
            const x = originX + c * (cellW + gapX);
            const y = originY + r * (cellH + gapY);
            return `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="8" fill="hsl(var(--p) / ${op.toFixed(3)})" stroke="hsl(var(--bc) / 0.12)"></rect>`;
        }).join('');
    }).join('');

    return `
        <svg viewBox="0 0 ${width} ${height}" class="${svgEscape(spec?.className || 'w-full h-auto')}">
            ${title ? `<text x="20" y="28" font-size="12" font-weight="900" fill="hsl(var(--bc) / 0.75)">${svgEscape(title)}</text>` : ''}
            <g font-family="ui-sans-serif, system-ui">
                ${headerText}
                ${rowText}
                ${cells}
            </g>
            ${footnote ? `<text x="20" y="${height - 12}" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.55)">${svgEscape(footnote)}</text>` : ''}
        </svg>
    `;
}

