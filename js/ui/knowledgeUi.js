export function escAttr(s) {
    return (s || '').toString().replace(/'/g, '&#39;');
}

export function uniq(arr) {
    return Array.from(new Set((arr || []).filter(Boolean)));
}

export function createTermChips(knowledgeBase) {
    const has = (term) => Object.prototype.hasOwnProperty.call(knowledgeBase, term);
    return (terms, size) => {
        const valid = uniq(terms).filter(has);
        if (!valid.length) return '';
        const btnClass = size === 'sm' ? 'btn btn-xs btn-outline' : 'btn btn-sm btn-outline';
        return `
            <div class="flex flex-wrap gap-2">
                ${valid.map(t => `<button class="${btnClass}" onclick="showKnowledge('${escAttr(t)}', event)">${t}</button>`).join('')}
            </div>
        `;
    };
}

export function renderList(items) {
    return `
        <div class="space-y-2">
            ${(items || []).map(x => `
                <div class="flex items-start gap-3">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-none opacity-50"></div>
                    <div class="text-sm text-base-content/80 leading-relaxed">${x}</div>
                </div>
            `).join('')}
        </div>
    `;
}

export function renderExamList(items) {
    const list = (items || []).filter(Boolean);
    if (!list.length) return '';
    return `
        <div class="mt-4 p-4 rounded-2xl bg-base-200/40 border border-base-300">
            <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-xl bg-error/10 flex items-center justify-center">
                    <i class="fa-solid fa-circle-exclamation text-error text-xs"></i>
                </div>
                <div class="text-xs font-black uppercase tracking-widest opacity-60">高频考点</div>
            </div>
            <div class="space-y-2">
                ${list.map(e => `
                    <div class="text-sm text-base-content/80 font-medium">
                        <span class="badge badge-error badge-sm text-white font-black mr-2">考点</span>
                        ${e}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
