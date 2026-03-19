import { clamp, svgEscape } from './svg.js';

function nodePort(node, port) {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const w = node.w ?? 0;
    const h = node.h ?? 0;
    if (port === 'top') return { x: x + w / 2, y };
    if (port === 'bottom') return { x: x + w / 2, y: y + h };
    if (port === 'left') return { x, y: y + h / 2 };
    return { x: x + w, y: y + h / 2 };
}

function arrowMarkerDef(markerId, color) {
    return `
        <marker id="${svgEscape(markerId)}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="${svgEscape(color)}"></path>
        </marker>
    `;
}

function normalizeStrokeWidth(w) {
    const n = Number(w);
    return Number.isFinite(n) ? clamp(n, 0.5, 10) : 2.5;
}

function normalizeOpacity(o, def = 1) {
    const n = Number(o);
    return Number.isFinite(n) ? clamp(n, 0, 1) : def;
}

export function renderGraphSvg(spec) {
    const width = spec?.width ?? 980;
    const height = spec?.height ?? 300;
    const nodes = Array.isArray(spec?.nodes) ? spec.nodes : [];
    const edges = Array.isArray(spec?.edges) ? spec.edges : [];

    const markerId = spec?.markerId || 'gArrow';
    const markerColor = spec?.edgeStyle?.color ?? 'hsl(var(--bc) / 0.45)';
    const marker = arrowMarkerDef(markerId, markerColor);

    const defs = `
        <defs>
            ${marker}
            ${spec?.defs || ''}
        </defs>
    `;

    const edgeStyle = {
        color: spec?.edgeStyle?.color ?? 'hsl(var(--bc) / 0.35)',
        width: normalizeStrokeWidth(spec?.edgeStyle?.width),
        opacity: normalizeOpacity(spec?.edgeStyle?.opacity, 1),
        markerEnd: spec?.edgeStyle?.markerEnd === false ? '' : `url(#${markerId})`,
        linecap: spec?.edgeStyle?.linecap ?? 'round'
    };

    const edgePaths = edges.map(e => {
        const fromNode = nodes.find(n => n.id === e.from);
        const toNode = nodes.find(n => n.id === e.to);
        if (!fromNode || !toNode) return '';

        const from = nodePort(fromNode, e.fromPort || 'right');
        const to = nodePort(toNode, e.toPort || 'left');

        let d = '';
        if (Array.isArray(e.via) && e.via.length) {
            const pts = [from, ...e.via, to];
            d = `M${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L${p.x} ${p.y}`).join(' ');
        } else if (e.curve === 'hv') {
            const midX = e.midX ?? ((from.x + to.x) / 2);
            d = `M${from.x} ${from.y} L${midX} ${from.y} L${midX} ${to.y} L${to.x} ${to.y}`;
        } else if (e.curve === 'vh') {
            const midY = e.midY ?? ((from.y + to.y) / 2);
            d = `M${from.x} ${from.y} L${from.x} ${midY} L${to.x} ${midY} L${to.x} ${to.y}`;
        } else if (e.curve === 'cubic') {
            const dx = (to.x - from.x);
            const c = e.curveStrength ?? 0.45;
            const c1x = from.x + dx * c;
            const c2x = to.x - dx * c;
            d = `M${from.x} ${from.y} C${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`;
        } else {
            d = `M${from.x} ${from.y} L${to.x} ${to.y}`;
        }

        const style = e.style || {};
        const stroke = style.color ?? edgeStyle.color;
        const strokeWidth = normalizeStrokeWidth(style.width ?? edgeStyle.width);
        const strokeOpacity = normalizeOpacity(style.opacity ?? edgeStyle.opacity, edgeStyle.opacity);
        const markerEnd = style.markerEnd === false ? '' : (edgeStyle.markerEnd || '');

        return `
            <path d="${svgEscape(d)}"
                  fill="none"
                  stroke="${svgEscape(stroke)}"
                  stroke-width="${strokeWidth}"
                  stroke-opacity="${strokeOpacity}"
                  stroke-linecap="${svgEscape(edgeStyle.linecap)}"
                  ${markerEnd ? `marker-end="${svgEscape(markerEnd)}"` : ''}></path>
        `;
    }).join('');

    const nodeShapes = nodes.map(n => {
        const x = n.x ?? 0;
        const y = n.y ?? 0;
        const w = n.w ?? 0;
        const h = n.h ?? 0;
        const rx = n.rx ?? 16;
        const fill = n.fill ?? 'hsl(var(--bc) / 0.04)';
        const stroke = n.stroke ?? 'hsl(var(--bc) / 0.18)';
        const strokeWidth = normalizeStrokeWidth(n.strokeWidth ?? 2);
        const fontFamily = n.fontFamily ?? 'ui-sans-serif, system-ui';
        const label = n.label ?? '';
        const sub = n.subLabel ?? '';
        const labelColor = n.labelColor ?? 'hsl(var(--bc))';
        const subColor = n.subLabelColor ?? 'hsl(var(--bc) / 0.65)';
        const labelWeight = n.labelWeight ?? 900;
        const subWeight = n.subLabelWeight ?? 800;
        const labelSize = n.labelSize ?? 12;
        const subSize = n.subLabelSize ?? 11;
        const centerX = x + w / 2;
        const labelY = y + h / 2 + (sub ? -2 : 4);
        const subY = y + h / 2 + 18;

        const filterAttr = n.filter ? ` filter="${svgEscape(n.filter)}"` : '';
        const shape = (n.shape || 'rect') === 'diamond'
            ? `<polygon points="${svgEscape(`${centerX},${y} ${x},${y + h / 2} ${centerX},${y + h} ${x + w},${y + h / 2}`)}" fill="${svgEscape(fill)}" stroke="${svgEscape(stroke)}" stroke-width="${strokeWidth}"${filterAttr}></polygon>`
            : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${svgEscape(fill)}" stroke="${svgEscape(stroke)}" stroke-width="${strokeWidth}"${filterAttr}></rect>`;

        const labelEl = label ? `<text x="${centerX}" y="${labelY}" text-anchor="middle" font-size="${labelSize}" font-weight="${labelWeight}" fill="${svgEscape(labelColor)}">${svgEscape(label)}</text>` : '';
        const subEl = sub ? `<text x="${centerX}" y="${subY}" text-anchor="middle" font-size="${subSize}" font-weight="${subWeight}" fill="${svgEscape(subColor)}">${svgEscape(sub)}</text>` : '';

        return `
            <g font-family="${svgEscape(fontFamily)}">
                ${shape}
                ${labelEl}
                ${subEl}
            </g>
        `;
    }).join('');

    const extra = spec?.extra || '';

    return `
        <svg viewBox="0 0 ${width} ${height}" class="${svgEscape(spec?.className || 'w-full h-auto')}">
            ${defs}
            ${spec?.background || ''}
            ${edgePaths}
            ${nodeShapes}
            ${extra}
        </svg>
    `;
}
