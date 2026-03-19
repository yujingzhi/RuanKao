import { clamp, svgEscape } from './svg.js';

function circumference(r) {
    return 2 * Math.PI * r;
}

export function renderDonut(spec) {
    const size = spec?.size ?? 220;
    const cx = size / 2;
    const cy = size / 2;
    const r = spec?.radius ?? 78;
    const strokeW = spec?.strokeWidth ?? 26;
    const bgStroke = spec?.bgStroke ?? 'hsl(var(--bc) / 0.12)';
    const segments = Array.isArray(spec?.segments) ? spec.segments : [];

    const c = circumference(r);
    const total = segments.reduce((acc, s) => acc + (Number(s.value) || 0), 0) || 1;

    let angle = spec?.startAngle ?? -90;
    const segCircles = segments.map((s, idx) => {
        const v = (Number(s.value) || 0);
        const frac = v / total;
        const dash = frac * c;
        const gap = c - dash;
        const color = s.color ?? 'hsl(var(--p))';
        const rot = angle;
        angle += frac * 360;
        return `
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
                    stroke="${svgEscape(color)}"
                    stroke-width="${strokeW}"
                    stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
                    stroke-linecap="${svgEscape(s.linecap ?? 'round')}"
                    transform="rotate(${rot} ${cx} ${cy})"></circle>
        `;
    }).join('');

    const centerTitle = spec?.centerTitle ?? '';
    const centerValue = spec?.centerValue ?? '';
    const centerValueColor = spec?.centerValueColor ?? 'hsl(var(--p))';

    return `
        <svg viewBox="0 0 ${size} ${size}" class="${svgEscape(spec?.className || '')}">
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${svgEscape(bgStroke)}" stroke-width="${strokeW}"></circle>
            ${segCircles}
            ${centerTitle ? `<text x="${cx}" y="${cy - 5}" text-anchor="middle" font-size="14" font-weight="900" fill="hsl(var(--bc))">${svgEscape(centerTitle)}</text>` : ''}
            ${centerValue ? `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="22" font-weight="900" fill="${svgEscape(centerValueColor)}">${svgEscape(centerValue)}</text>` : ''}
        </svg>
    `;
}

export function renderStackedBar(spec) {
    const segments = Array.isArray(spec?.segments) ? spec.segments : [];
    const total = segments.reduce((acc, s) => acc + (Number(s.value) || 0), 0) || 1;
    const heightClass = spec?.heightClass ?? 'h-4';
    const containerClass = spec?.containerClass ?? 'rounded-full bg-base-100/70 border border-base-300 overflow-hidden flex';

    const bars = segments.map((s, idx) => {
        const v = Number(s.value) || 0;
        const pct = clamp((v / total) * 100, 0, 100);
        const color = s.color ?? 'hsl(var(--p))';
        return `<div class="${heightClass}" style="width: ${pct.toFixed(2)}%; background: ${svgEscape(color)};"></div>`;
    }).join('');

    return `<div class="${svgEscape(containerClass)} ${svgEscape(heightClass)}">${bars}</div>`;
}

