import { renderGraphSvg } from './graph.js';

export function renderFlowchart(spec) {
    return renderGraphSvg({
        width: spec?.width ?? 980,
        height: spec?.height ?? 240,
        markerId: spec?.markerId ?? 'flowArrow',
        edgeStyle: spec?.edgeStyle ?? { color: 'hsl(var(--bc) / 0.45)', width: 2.5, opacity: 1 },
        nodes: Array.isArray(spec?.nodes) ? spec.nodes : [],
        edges: Array.isArray(spec?.edges) ? spec.edges : [],
        defs: spec?.defs,
        extra: spec?.extra,
        className: spec?.className
    });
}
