import { textbookContentSlots } from '../data.js';

function normalizeText(s) {
    return (s || '').toString().trim().toLowerCase();
}

function slotProgress(slot) {
    const hasSummary = !!normalizeText(slot.summary);
    const hasKeyPoints = Array.isArray(slot.keyPoints) && slot.keyPoints.length > 0;
    const hasPitfalls = Array.isArray(slot.pitfalls) && slot.pitfalls.length > 0;
    const hasExam = Array.isArray(slot.examPatterns) && slot.examPatterns.length > 0;
    const hasTerms = Array.isArray(slot.terms) && slot.terms.length > 0;
    const done = [hasSummary, hasKeyPoints, hasPitfalls, hasExam, hasTerms].filter(Boolean).length;
    return { done, total: 5 };
}

function flatSlotText(slot) {
    const parts = [
        slot.id,
        slot.title,
        `第${slot.ref?.chapter || ''}章`,
        `p${slot.ref?.page || ''}`
    ];
    return parts.join(' ').toLowerCase();
}

export function renderContentWorkbench() {
    const slots = Object.values(textbookContentSlots || {});
    const sampleSlots = slots
        .filter(s => s?.ref?.chapter === 6 || s?.ref?.chapter === 7)
        .sort((a, b) => (a.ref.chapter - b.ref.chapter) || (a.id.localeCompare(b.id)));

    const total = sampleSlots.length;
    const progressAgg = sampleSlots.reduce((acc, s) => acc + slotProgress(s).done, 0);
    const progressMax = total * 5;
    const pct = progressMax ? Math.round((progressAgg / progressMax) * 100) : 0;

    const rows = sampleSlots.map((s) => {
        const p = slotProgress(s);
        const percent = p.total ? Math.round((p.done / p.total) * 100) : 0;

        const badges = `
            <div class="flex flex-wrap gap-2">
                <span class="badge badge-outline font-black opacity-60">summary</span>
                <span class="badge badge-outline font-black opacity-60">keyPoints</span>
                <span class="badge badge-outline font-black opacity-60">pitfalls</span>
                <span class="badge badge-outline font-black opacity-60">exam</span>
                <span class="badge badge-outline font-black opacity-60">terms</span>
            </div>
        `;

        const summaryBlock = s.summary
            ? `<div class="text-sm text-base-content/80 font-medium leading-relaxed">${s.summary}</div>`
            : `<div class="text-sm text-base-content/60">（待补充：一句话结论）</div>`;

        const listBlock = (arr, emptyText) => {
            const xs = Array.isArray(arr) ? arr.filter(Boolean) : [];
            if (!xs.length) return `<div class="text-sm text-base-content/60">${emptyText}</div>`;
            return `
                <div class="space-y-2">
                    ${xs.map(x => `
                        <div class="flex items-start gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-none opacity-50"></div>
                            <div class="text-sm text-base-content/80 leading-relaxed">${x}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        };

        const examBlock = (() => {
            const xs = Array.isArray(s.examPatterns) ? s.examPatterns : [];
            if (!xs.length) return `<div class="text-sm text-base-content/60">（待补充：题型模板：题干信号 → 考点 → 陷阱 → 表达）</div>`;
            return `
                <div class="space-y-3">
                    ${xs.map((e, idx) => `
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="flex items-center justify-between gap-3">
                                <div class="font-black">模板 ${idx + 1}</div>
                                <span class="badge badge-error badge-sm font-black text-white">考法</span>
                            </div>
                            <div class="mt-2 text-sm text-base-content/70">${e.signal || '（题干信号）'}</div>
                            <div class="mt-2 text-sm text-base-content/80 font-medium">${e.ask || '（问什么）'}</div>
                            <div class="mt-2 text-sm text-base-content/70">${e.trap || '（常见陷阱）'}</div>
                            <div class="mt-2 text-sm text-base-content/80">${e.answer || '（标准表达）'}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        })();

        return `
            <div class="toc-slot space-y-4" data-slot-text="${flatSlotText(s)}">
                <div class="collapse collapse-arrow bg-base-100 border border-base-300 rounded-2xl">
                    <input type="checkbox" />
                    <div class="collapse-title text-base font-black flex items-center justify-between gap-3">
                        <div class="min-w-0">
                            <div class="truncate">${s.id} ${s.title}</div>
                            <div class="text-xs text-base-content/60 font-black mt-1">第${s.ref.chapter}章 · p${s.ref.page}</div>
                        </div>
                        <div class="flex items-center gap-3 flex-none">
                            <div class="w-28 hidden md:block">
                                <progress class="progress progress-primary w-full" value="${percent}" max="100"></progress>
                            </div>
                            <span class="badge badge-outline font-black opacity-60">${p.done}/${p.total}</span>
                        </div>
                    </div>
                    <div class="collapse-content">
                        <div class="pt-2 pb-5 space-y-6">
                            ${badges}
                            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                                <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Summary</div>
                                ${summaryBlock}
                            </div>
                            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                                    <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Key Points</div>
                                    ${listBlock(s.keyPoints, '（待补充：3~7条要点，每条可成为选项）')}
                                </div>
                                <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                                    <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Pitfalls</div>
                                    ${listBlock(s.pitfalls, '（待补充：易错点/陷阱点，考试价值最高）')}
                                </div>
                            </div>
                            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                                <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Exam Patterns</div>
                                ${examBlock}
                            </div>
                            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                                <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Terms</div>
                                ${listBlock(s.terms, '（待补充：术语列表，后续要能点击跳转到术语库）')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="space-y-8">
            <div class="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
                <div class="p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
                    <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        <div class="space-y-3">
                            <div class="flex flex-wrap gap-2 items-center">
                                <span class="badge badge-primary badge-outline font-black">内容建设</span>
                                <span class="badge badge-ghost font-black opacity-60">工作台</span>
                                <span class="badge badge-outline font-black opacity-60">小节颗粒度</span>
                                <span class="badge badge-outline font-black opacity-60">先做样板</span>
                            </div>
                            <div class="text-2xl lg:text-3xl font-black tracking-tight">样板章：第6章 + 第7章（按教材小节拆解）</div>
                            <div class="text-sm text-base-content/70 leading-relaxed max-w-3xl">
                                这里的每一条就是后续内容建设的“标准模板”。先把样板章打磨到高质量，再把同样的方法复制到剩余章节。
                            </div>
                        </div>
                        <div class="stats shadow border border-base-300 bg-base-100">
                            <div class="stat py-4">
                                <div class="stat-title">小节模板</div>
                                <div class="stat-value text-primary text-2xl">${total}</div>
                                <div class="stat-desc">第6/7章</div>
                            </div>
                            <div class="stat py-4">
                                <div class="stat-title">完成度</div>
                                <div class="stat-value text-secondary text-2xl">${pct}%</div>
                                <div class="stat-desc">${progressAgg}/${progressMax}</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-2">筛选</div>
                            <input class="input input-bordered w-full" placeholder="输入关键字：比如 变更 / 过程组 / 可行性" oninput="filterContentWorkbench(event)" />
                            <div class="text-xs text-base-content/60 mt-2">会筛选出匹配的小节模板</div>
                        </div>
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-2">验收标准</div>
                            <div class="text-sm text-base-content/80 font-medium">Summary + 要点 + 易错 + 考法模板 + 术语</div>
                            <div class="text-xs text-base-content/60 mt-2">每个小节至少补齐这5项</div>
                        </div>
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-2">下一步</div>
                            <div class="text-sm text-base-content/80 font-medium">从 6.2 与 7.2 开始填充（最常考、最能出题）</div>
                            <div class="text-xs text-base-content/60 mt-2">并把术语同步沉淀到全局术语库</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                ${rows}
            </div>
        </div>
    `;
}

