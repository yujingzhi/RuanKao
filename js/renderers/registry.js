import { renderPmIntroDashboard } from './pmIntroRenderer.js';
import { renderPmInitDashboard } from './pmInitRenderer.js';
import { renderDiagramLab } from './diagramLabRenderer.js';
import { renderTextbookToc } from './textbookTocRenderer.js';

export const knowledgeDashboardRenderers = {
    'diagram-lab': renderDiagramLab,
    'textbook-toc': renderTextbookToc,
    'pm-intro': renderPmIntroDashboard,
    'pm-init': renderPmInitDashboard
};

export function getKnowledgeDashboardRenderer(areaId) {
    return knowledgeDashboardRenderers[areaId];
}
