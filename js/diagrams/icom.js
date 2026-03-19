import { svgEscape } from './svg.js';

export function renderIcomDiagram(spec) {
    const width = spec?.width ?? 980;
    const height = spec?.height ?? 320;

    const title = spec?.title ?? '功能（Function）';
    const subtitle = spec?.subtitle ?? '把一个主题描述成 I/C/O/M';
    const input = spec?.input ?? '资料/需求/触发';
    const output = spec?.output ?? '结果/交付物';
    const control = spec?.control ?? '规则/约束/标准';
    const mechanism = spec?.mechanism ?? '人/组织/工具';

    const arrowId = spec?.markerId ?? 'icomArrow';
    const arrowColor = spec?.arrowColor ?? 'hsl(var(--bc) / 0.45)';

    return `
        <svg viewBox="0 0 ${width} ${height}" class="${svgEscape(spec?.className || 'w-full h-auto')}">
            <defs>
                <marker id="${svgEscape(arrowId)}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill="${svgEscape(arrowColor)}"></path>
                </marker>
            </defs>

            <rect x="360" y="110" width="260" height="120" rx="18" fill="hsl(var(--p) / 0.10)" stroke="hsl(var(--p) / 0.35)" stroke-width="2.5"></rect>
            <text x="490" y="150" text-anchor="middle" font-size="14" font-weight="900" fill="hsl(var(--bc))">${svgEscape(title)}</text>
            <text x="490" y="173" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">${svgEscape(subtitle)}</text>

            <path d="M80 170 L360 170" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#${svgEscape(arrowId)})"></path>
            <rect x="30" y="140" width="190" height="60" rx="16" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"></rect>
            <text x="125" y="168" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">输入（Input）</text>
            <text x="125" y="188" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">${svgEscape(input)}</text>

            <path d="M620 170 L900 170" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#${svgEscape(arrowId)})"></path>
            <rect x="760" y="140" width="190" height="60" rx="16" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"></rect>
            <text x="855" y="168" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">输出（Output）</text>
            <text x="855" y="188" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">${svgEscape(output)}</text>

            <path d="M490 50 L490 110" stroke="hsl(var(--bc) / 0.35)" stroke-width="2.5" marker-end="url(#${svgEscape(arrowId)})"></path>
            <rect x="390" y="20" width="200" height="56" rx="16" fill="hsl(var(--er) / 0.08)" stroke="hsl(var(--er) / 0.25)"></rect>
            <text x="490" y="46" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">控制（Control）</text>
            <text x="490" y="66" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">${svgEscape(control)}</text>

            <path d="M490 230 L490 290" stroke="hsl(var(--bc) / 0.35)" stroke-width="2.5" marker-end="url(#${svgEscape(arrowId)})"></path>
            <rect x="360" y="268" width="260" height="44" rx="16" fill="hsl(var(--s) / 0.08)" stroke="hsl(var(--s) / 0.25)"></rect>
            <text x="490" y="296" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">机制（Mechanism）= ${svgEscape(mechanism)}</text>
        </svg>
    `;
}

