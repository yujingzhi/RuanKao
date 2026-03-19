export function svgEscape(text) {
    return (text ?? '').toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function tag(name, attrs, children) {
    const a = attrs ? Object.entries(attrs)
        .filter(([, v]) => v !== undefined && v !== null && v !== false)
        .map(([k, v]) => v === true ? `${k}` : `${k}="${svgEscape(v)}"`).join(' ') : '';
    const open = a ? `<${name} ${a}>` : `<${name}>`;
    if (children === undefined || children === null) return `${open}</${name}>`;
    return `${open}${children}</${name}>`;
}

export function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
