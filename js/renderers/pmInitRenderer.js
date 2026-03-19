import { knowledgeBase } from '../data.js';
import { createTermChips, renderExamList, renderList, uniq } from '../ui/knowledgeUi.js';

export function renderPmInitDashboard(area) {
    const termChips = createTermChips(knowledgeBase);

    const points = Array.isArray(area.knowledgePoints) ? area.knowledgePoints : [];
    const allTerms = uniq(points.flatMap(p => p.terms || []));

    const stageFlowTerms = ['项目建议书', '可行性研究', '初步可行性研究', '详细可行性研究', '项目评估', '项目评估程序', '项目章程', '两必两预测', '有无比较法', '增量净效益法', '投资估算法'];

    const dimensions = [
        { title: '技术可行性', icon: 'fa-microchip', term: '技术可行性分析', bgClass: 'bg-primary/10', iconClass: 'text-primary', bullets: ['开发风险', '人力资源有效性', '技术能力可能性', '物资（产品）可用性'], pitfall: '易错：人力资源有效性属于技术可行性' },
        { title: '经济可行性', icon: 'fa-coins', term: '经济可行性分析', bgClass: 'bg-warning/10', iconClass: 'text-warning', bullets: ['支出：一次性/非一次性', '收益：直接/间接/其他', '投资回报/回收', '敏感性分析'], pitfall: '易错：设备购置费属于一次性支出；敏感性分析属于经济可行性' },
        { title: '社会效益', icon: 'fa-handshake-angle', term: '社会效益可行性分析', bgClass: 'bg-secondary/10', iconClass: 'text-secondary', bullets: ['内部：品牌/竞争力/创新/人员提升', '外部：公共/文化/环境/责任'], pitfall: '易错：人员提升、技术创新属于社会效益' },
        { title: '运行环境', icon: 'fa-building', term: '运行环境可行性分析', bgClass: 'bg-accent/10', iconClass: 'text-accent', bullets: ['管理体制/方法/制度', '工作习惯与人员素质', '数据资源积累', '基础软硬件平台'], pitfall: '易错：管理体制、人员素质、数据积累属于运行环境' },
        { title: '其他可行性', icon: 'fa-scale-balanced', term: '其他可行性分析', bgClass: 'bg-base-200', iconClass: 'text-base-content/70', bullets: ['法律可行性', '政策可行性', '合规边界与约束'], pitfall: '易错：把政策/法规约束误判为经济效益或技术能力' }
    ];

    const compareTable = `
        <div class="overflow-x-auto">
            <table class="table table-zebra">
                <thead>
                    <tr>
                        <th class="w-40">对比项</th>
                        <th>初步可行性研究</th>
                        <th>详细可行性研究</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>地位</th>
                        <td>可合并/可省略</td>
                        <td><span class="badge badge-error badge-outline font-black">不可缺少</span></td>
                    </tr>
                    <tr>
                        <th>深度</th>
                        <td>资源占有少、研究细节较粗</td>
                        <td>费时费力、调查分析更系统全面</td>
                    </tr>
                    <tr>
                        <th>结论</th>
                        <td>与详细可研结果基本一致</td>
                        <td>作为评估与决策的核心依据</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    const compareMethods = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <i class="fa-solid fa-scale-unbalanced-flip text-primary text-sm"></i>
                    </div>
                    <div class="font-black">有无比较法（增量净效益法）</div>
                </div>
                ${renderList(['比较“有项目”与“无项目”的成本效益差异', '能更好剔除外部环境变化干扰', '结论更客观、更接近真实增量价值'])}
                <div class="mt-4">${termChips(['有无比较法', '增量净效益法'], 'sm')}</div>
            </div>
            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
                        <i class="fa-solid fa-clock-rotate-left text-warning text-sm"></i>
                    </div>
                    <div class="font-black">前后比较法</div>
                </div>
                ${renderList(['比较“实施前”与“实施后”', '易受外部环境变化影响', '通常不如有无比较法准确'])}
                <div class="mt-4">${termChips(['前后比较法'], 'sm')}</div>
            </div>
        </div>
    `;

    const collapses = points.map((p, idx) => `
        <div class="collapse collapse-arrow bg-base-100 border border-base-300 rounded-2xl">
            <input type="checkbox" ${idx === 0 ? 'checked' : ''} />
            <div class="collapse-title text-base font-black flex items-center gap-3">
                <span class="badge badge-outline font-black opacity-60">${p.id || (idx + 1)}</span>
                <span class="flex-1 min-w-0 truncate">${p.title || '未命名'}</span>
            </div>
            <div class="collapse-content">
                <div class="pt-2 pb-5 space-y-4">
                    ${termChips(p.terms || [], 'sm')}
                    ${renderList((p.content || []).map(x => x.toString()))}
                    ${renderExamList(p.exam || [])}
                </div>
            </div>
        </div>
    `).join('');

    const hero = `
        <div class="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
            <div class="p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-base-100 to-warning/10">
                <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div class="space-y-3">
                        <div class="flex flex-wrap gap-2 items-center">
                            <span class="badge badge-primary badge-outline font-black">第7章</span>
                            <span class="badge badge-ghost font-black opacity-60">立项管理</span>
                            <span class="badge badge-outline font-black opacity-60">选择题≈2分</span>
                            <span class="badge badge-outline font-black opacity-60">案例★★</span>
                        </div>
                        <div class="text-2xl lg:text-3xl font-black tracking-tight">一图读懂：项目为什么能立项</div>
                        <div class="text-sm text-base-content/70 leading-relaxed max-w-3xl">
                            立项管理的本质是回答三个问题：<span class="font-black">值不值得做</span>、<span class="font-black">能不能做</span>、<span class="font-black">怎么做更划算</span>。
                        </div>
                        <div class="pt-1">${termChips(stageFlowTerms, 'sm')}</div>
                    </div>
                    <div class="stats shadow border border-base-300 bg-base-100">
                        <div class="stat py-4">
                            <div class="stat-title">必背</div>
                            <div class="stat-value text-primary text-2xl">两必两预测</div>
                            <div class="stat-desc">项目建议书核心内容</div>
                        </div>
                        <div class="stat py-4">
                            <div class="stat-title">必记</div>
                            <div class="stat-value text-error text-2xl">详可研不可少</div>
                            <div class="stat-desc">初步可研可合并</div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-100/70">
                    <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-4">流程图</div>
                    <ul class="steps steps-vertical lg:steps-horizontal w-full">
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('项目建议书', event)">建议/立项申请</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('可行性研究', event)">可行性研究</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('项目评估', event)">评估</button></li>
                        <li class="step step-primary"><span class="font-black">决策</span></li>
                    </ul>
                    <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/30">
                            <div class="text-xs font-black opacity-60 mb-2">考题抓手</div>
                            <div class="text-sm text-base-content/80">先记顺序，再抓“谁做/依据是什么/能否省略”</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/30">
                            <div class="text-xs font-black opacity-60 mb-2">一眼辨错</div>
                            <div class="text-sm text-base-content/80">看到“项目章程”出现在投资前阶段/评估依据中 → 多半是错</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/30">
                            <div class="text-xs font-black opacity-60 mb-2">必背口诀</div>
                            <div class="text-sm font-black tracking-tight">建议 → 可研(初/详) → 评估 → 决策</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const dimensionCards = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">可行性研究</div>
                        <div class="text-xl font-black tracking-tight mt-1">五大维度（做题就按它归类）</div>
                    </div>
                    <div class="badge badge-outline font-black opacity-60">技 / 经 / 社 / 运 / 其</div>
                </div>
                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    ${dimensions.map(d => `
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20 hover:bg-base-200/30 transition-colors">
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-1">
                                    <div class="font-black text-base">${d.title}</div>
                                    <div class="text-xs opacity-60">${d.pitfall}</div>
                                </div>
                                <div class="w-10 h-10 rounded-2xl ${d.bgClass} flex items-center justify-center flex-none">
                                    <i class="fa-solid ${d.icon} ${d.iconClass}"></i>
                                </div>
                            </div>
                            <div class="mt-4">
                                ${renderList(d.bullets)}
                            </div>
                            <div class="mt-4">
                                ${termChips([d.term], 'sm')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    const compare = `
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div class="card bg-base-100 border border-base-300 shadow-xl">
                <div class="p-6 lg:p-8">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <div class="text-xs font-black uppercase tracking-widest opacity-60">对比表</div>
                            <div class="text-xl font-black tracking-tight mt-1">初步 vs 详细（最常考）</div>
                        </div>
                        <div class="flex gap-2">
                            ${termChips(['初步可行性研究', '详细可行性研究'], 'sm')}
                        </div>
                    </div>
                    <div class="mt-5">${compareTable}</div>
                </div>
            </div>
            <div class="card bg-base-100 border border-base-300 shadow-xl">
                <div class="p-6 lg:p-8">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <div class="text-xs font-black uppercase tracking-widest opacity-60">方法题</div>
                            <div class="text-xl font-black tracking-tight mt-1">有无比较法为什么更准确</div>
                        </div>
                    </div>
                    <div class="mt-5">${compareMethods}</div>
                </div>
            </div>
        </div>
    `;

    const notes = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">学习笔记</div>
                        <div class="text-xl font-black tracking-tight mt-1">按“题目怎么问”来记</div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="badge badge-outline font-black opacity-60">谁来做？</span>
                        <span class="badge badge-outline font-black opacity-60">依据是什么？</span>
                        <span class="badge badge-outline font-black opacity-60">哪些可省？</span>
                        <span class="badge badge-outline font-black opacity-60">怎么归类？</span>
                    </div>
                </div>
                <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <i class="fa-solid fa-user-check text-primary"></i>
                            </div>
                            <div class="font-black">谁来做</div>
                        </div>
                        ${renderList(['项目建议书：建设单位提交', '可行性研究：建设方组织论证', '项目评估：第三方（国家/银行/机构）', '项目章程：发起人/赞助人发布'])}
                        <div class="mt-4">${termChips(['项目建议书', '项目评估', '项目章程'], 'sm')}</div>
                    </div>
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-9 h-9 rounded-2xl bg-warning/10 flex items-center justify-center">
                                <i class="fa-solid fa-triangle-exclamation text-warning"></i>
                            </div>
                            <div class="font-black">高频避坑</div>
                        </div>
                        ${renderList(['投资前阶段不含“制定项目章程”', '详可研不可缺少；初步可合并', '人力资源有效性→技术可行性', '管理体制/人员素质/数据积累→运行环境'])}
                    </div>
                </div>

                <div class="mt-6">
                    <div class="text-sm font-black mb-3">章节细节（展开即是答案）</div>
                    <div class="space-y-4">${collapses}</div>
                </div>
            </div>
        </div>
    `;

    return `
        <div class="space-y-8">
            ${hero}
            ${dimensionCards}
            ${compare}
            ${notes}
            <div class="card bg-base-100 border border-base-300 shadow-xl">
                <div class="p-6 lg:p-8">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <div class="text-xs font-black uppercase tracking-widest opacity-60">快速导航</div>
                            <div class="text-xl font-black tracking-tight mt-1">本章常用术语（点一个就能学）</div>
                        </div>
                    </div>
                    <div class="mt-5">
                        ${termChips(allTerms, 'sm')}
                    </div>
                </div>
            </div>
        </div>
    `;
}
