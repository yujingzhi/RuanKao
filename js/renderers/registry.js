import { renderPmIntroDashboard } from './pmIntroRenderer.js';
import { renderPmInitDashboard } from './pmInitRenderer.js';
import { renderDiagramLab } from './diagramLabRenderer.js';
import { renderTextbookToc } from './textbookTocRenderer.js';
import { renderContentWorkbench } from './contentWorkbenchRenderer.js';

export const knowledgeDashboardRenderers = {
    'diagram-lab': renderDiagramLab,
    'textbook-toc': renderTextbookToc,
    'content-workbench': renderContentWorkbench,
    'pm-intro': renderPmIntroDashboard,
    'pm-init': renderPmInitDashboard
};

export function getKnowledgeDashboardRenderer(areaId) {
    return knowledgeDashboardRenderers[areaId];
}
