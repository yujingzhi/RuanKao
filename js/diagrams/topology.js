import { renderGraphSvg } from './graph.js';

export function renderTopology(spec) {
    return renderGraphSvg({
        width: spec?.width ?? 980,
        height: spec?.height ?? 360,
        markerId: spec?.markerId ?? 'topoArrow',
        edgeStyle: spec?.edgeStyle ?? { color: 'hsl(var(--bc) / 0.25)', width: 2.5, opacity: 1 },
        nodes: Array.isArray(spec?.nodes) ? spec.nodes : [],
        edges: Array.isArray(spec?.edges) ? spec.edges : [],
        defs: spec?.defs,
        extra: spec?.extra,
        className: spec?.className
    });
}
