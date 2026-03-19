import { textbookToc } from '../data.js';

function flatText(ch) {
    const parts = [`第${ch.chapter}章`, ch.title, `p${ch.page}`];
    (ch.sections || []).forEach(s => {
        parts.push(s.id, s.title, `p${s.page}`);
        (s.subsections || []).forEach(ss => {
            parts.push(ss.id, ss.title, `p${ss.page}`);
        });
    });
    return parts.join(' ').toLowerCase();
}

export function renderTextbookToc() {
    const chapters = textbookToc || [];
    const totalSections = chapters.reduce((acc, ch) => acc + (ch.sections ? ch.sections.length : 0), 0);

    const chapterBlocks = chapters.map((ch, idx) => {
        const sections = (ch.sections || []).map((s, sIdx) => {
            const subs = (s.subsections || []).map(ss => `
                <div class="flex items-start gap-3 py-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-none opacity-50"></div>
                    <div class="min-w-0">
                        <div class="text-sm font-black">${ss.id} ${ss.title}</div>
                        <div class="text-xs text-base-content/60">p${ss.page}</div>
                    </div>
                </div>
            `).join('');

            return `
                <div class="collapse collapse-arrow bg-base-100 border border-base-300 rounded-2xl">
                    <input type="checkbox" ${idx === 0 && sIdx === 0 ? 'checked' : ''} />
                    <div class="collapse-title text-base font-black flex items-center justify-between gap-3">
                        <div class="min-w-0 truncate">${s.id} ${s.title}</div>
                        <span class="badge badge-sm badge-ghost opacity-50 font-black flex-none">p${s.page}</span>
                    </div>
                    <div class="collapse-content">
                        <div class="pt-2 pb-5">
                            ${subs || `<div class="text-sm text-base-content/60">（无三级小节）</div>`}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="toc-chapter space-y-4" data-toc-text="${flatText(ch)}">
                <div class="card bg-base-100 border border-base-300 shadow-xl">
                    <div class="p-6 lg:p-8">
                        <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                            <div>
                                <div class="text-xs font-black uppercase tracking-widest opacity-60">第 ${ch.chapter} 章</div>
                                <div class="text-2xl font-black tracking-tight mt-1">${ch.title}</div>
                            </div>
                            <span class="badge badge-outline font-black opacity-60">p${ch.page}</span>
                        </div>
                        <div class="mt-6 space-y-4">
                            ${sections}
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
                                <span class="badge badge-primary badge-outline font-black">第4版口径</span>
                                <span class="badge badge-ghost font-black opacity-60">教材目录</span>
                                <span class="badge badge-outline font-black opacity-60">覆盖清单</span>
                                <span class="badge badge-outline font-black opacity-60">可检索</span>
                            </div>
                            <div class="text-2xl lg:text-3xl font-black tracking-tight">以教材目录作为全站内容建设标准</div>
                            <div class="text-sm text-base-content/70 leading-relaxed max-w-3xl">
                                后续每一条知识点、术语、题型模板，都要能挂到这里的某个章节/小节上，才能保证“完整、真实、有用”。
                            </div>
                        </div>
                        <div class="stats shadow border border-base-300 bg-base-100">
                            <div class="stat py-4">
                                <div class="stat-title">章节</div>
                                <div class="stat-value text-primary text-2xl">${chapters.length}</div>
                                <div class="stat-desc">第1章~第24章</div>
                            </div>
                            <div class="stat py-4">
                                <div class="stat-title">节</div>
                                <div class="stat-value text-secondary text-2xl">${totalSections}</div>
                                <div class="stat-desc">含“本章练习”</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-2">目录搜索</div>
                            <input class="input input-bordered w-full" placeholder="输入关键字：比如 变更 / 风险 / 绩效域 / 采购" oninput="filterTextbookToc(event)" />
                            <div class="text-xs text-base-content/60 mt-2">会筛选出包含该关键字的章节卡片</div>
                        </div>
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-2">建设规则</div>
                            <div class="text-sm text-base-content/80 font-medium">每条内容必须绑定到某个小节（章节ID + 页码）</div>
                            <div class="text-xs text-base-content/60 mt-2">这样才能追溯口径与批量验收覆盖</div>
                        </div>
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-2">下一步</div>
                            <div class="text-sm text-base-content/80 font-medium">按目录逐章填充：知识点 → 术语库 → 题型模板 → 可视化</div>
                            <div class="text-xs text-base-content/60 mt-2">先把第6/7章打磨成样板章</div>
                        </div>
                    </div>
                </div>
            </div>
            ${chapterBlocks}
        </div>
    `;
}

