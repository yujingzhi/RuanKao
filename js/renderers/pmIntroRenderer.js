import { knowledgeBase } from '../data.js';
import { createTermChips, renderExamList, renderList, uniq } from '../ui/knowledgeUi.js';

export function renderPmIntroDashboard(area) {
    const termChips = createTermChips(knowledgeBase);

    const points = Array.isArray(area.knowledgePoints) ? area.knowledgePoints : [];
    const allTerms = uniq(points.flatMap(p => p.terms || []));

    const hero = `
        <div class="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
            <div class="p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
                <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div class="space-y-3">
                        <div class="flex flex-wrap gap-2 items-center">
                            <span class="badge badge-primary badge-outline font-black">第6章</span>
                            <span class="badge badge-ghost font-black opacity-60">项目管理概论</span>
                            <span class="badge badge-outline font-black opacity-60">基础高频</span>
                            <span class="badge badge-outline font-black opacity-60">概念区分/结构/过程组</span>
                        </div>
                        <div class="text-2xl lg:text-3xl font-black tracking-tight">一图建立项目管理“底层地图”</div>
                        <div class="text-sm text-base-content/70 leading-relaxed max-w-3xl">
                            这章的核心不是背长段落，而是把四件事串起来：<span class="font-black">项目是什么</span>、<span class="font-black">怎么管</span>、<span class="font-black">在什么组织里管</span>、<span class="font-black">按什么流程推进</span>。
                        </div>
                        <div class="pt-1">${termChips(['项目', '运营', '项目管理', '三重制约', '组织结构', '项目生命周期', '过程组', '项目发起人', '项目经理', '项目团队', '干系人', 'PMO', '事业环境因素', '组织过程资产'], 'sm')}</div>
                    </div>
                    <div class="stats shadow border border-base-300 bg-base-100">
                        <div class="stat py-4">
                            <div class="stat-title">先记</div>
                            <div class="stat-value text-primary text-2xl">临时 + 独特</div>
                            <div class="stat-desc">项目的两大特征</div>
                        </div>
                        <div class="stat py-4">
                            <div class="stat-title">再记</div>
                            <div class="stat-value text-secondary text-2xl">启规执监收</div>
                            <div class="stat-desc">五大过程组</div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-100/70">
                    <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-4">概念总览图</div>
                    <ul class="steps steps-vertical lg:steps-horizontal w-full">
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('项目', event)">项目</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('组织结构', event)">组织结构</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('项目生命周期', event)">生命周期</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('过程组', event)">过程组</button></li>
                        <li class="step step-primary"><span class="font-black">交付价值</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    const quadrant = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">维度一：工作性质</div>
                        <div class="text-xl font-black tracking-tight mt-1">临时/持续 × 独特/重复（四象限秒区分）</div>
                    </div>
                    ${termChips(['项目', '运营'], 'sm')}
                </div>
                <div class="mt-6">
                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                            <div class="text-xs font-black opacity-60">持续 + 重复</div>
                            <div class="mt-2 flex items-center gap-2">
                                <span class="badge badge-secondary badge-outline font-black">运营</span>
                                <span class="text-sm text-base-content/70">稳定运行/重复产出</span>
                            </div>
                            <div class="mt-3">${renderList(['流程固定', '以效率/可靠性为导向'])}</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                            <div class="text-xs font-black opacity-60">持续 + 独特</div>
                            <div class="mt-2 flex items-center gap-2">
                                <span class="badge badge-outline font-black opacity-70">持续改进</span>
                                <span class="text-sm text-base-content/70">长期演进/持续交付</span>
                            </div>
                            <div class="mt-3">${renderList(['产品迭代', '组织变革/能力建设'])}</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                            <div class="text-xs font-black opacity-60">临时 + 重复</div>
                            <div class="mt-2 flex items-center gap-2">
                                <span class="badge badge-outline font-black opacity-70">批处理/迁移</span>
                                <span class="text-sm text-base-content/70">一次性动作，但方法可复制</span>
                            </div>
                            <div class="mt-3">${renderList(['数据迁移', '批量上线/割接'])}</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-primary/10">
                            <div class="text-xs font-black opacity-60">临时 + 独特</div>
                            <div class="mt-2 flex items-center gap-2">
                                <span class="badge badge-primary badge-outline font-black">项目</span>
                                <span class="text-sm text-base-content/70">交付独特成果/价值</span>
                            </div>
                            <div class="mt-3">${renderList(['明确开始与结束', '目标与范围可定义'])}</div>
                        </div>
                    </div>
                    <div class="mt-4 text-sm text-base-content/70">
                        做题时先抓这两个关键词：<span class="font-black">是否临时</span>、<span class="font-black">产出是否独特</span>。
                    </div>
                </div>
            </div>
        </div>
    `;

    const conceptCompare = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-100 border border-base-300 shadow-xl">
                <div class="p-6 lg:p-8">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <div class="text-xs font-black uppercase tracking-widest opacity-60">概念对比</div>
                            <div class="text-xl font-black tracking-tight mt-1">项目 vs 运营</div>
                        </div>
                        ${termChips(['项目', '运营'], 'sm')}
                    </div>
                    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <i class="fa-solid fa-flag-checkered text-primary"></i>
                                </div>
                                <div class="font-black">项目</div>
                            </div>
                            ${renderList(['临时性：有明确开始与结束', '独特性：产出不重复', '目标导向：交付成果与价值'])}
                        </div>
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-9 h-9 rounded-2xl bg-secondary/10 flex items-center justify-center">
                                    <i class="fa-solid fa-gear text-secondary"></i>
                                </div>
                                <div class="font-black">运营</div>
                            </div>
                            ${renderList(['持续性：长期运行不断档', '重复性：产出可复制', '稳定性：维持业务与效率'])}
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 border border-base-300 shadow-xl">
                <div class="p-6 lg:p-8">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <div class="text-xs font-black uppercase tracking-widest opacity-60">约束框架</div>
                            <div class="text-xl font-black tracking-tight mt-1">三重制约怎么出题</div>
                        </div>
                        ${termChips(['三重制约'], 'sm')}
                    </div>
                    <div class="mt-5">
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-9 h-9 rounded-2xl bg-warning/10 flex items-center justify-center">
                                    <i class="fa-solid fa-triangle-exclamation text-warning"></i>
                                </div>
                                <div class="font-black">做题抓手</div>
                            </div>
                            ${renderList(['范围/进度/成本是联动关系', '变更会影响至少一个约束', '真实成功还要看价值、风险与满意度'])}
                            <div class="mt-4 text-sm text-base-content/70">
                                题干出现“加需求/赶工/压成本”，通常是在考你如何权衡约束与风险。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const tripleConstraintViz = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">维度二：约束与成功</div>
                        <div class="text-xl font-black tracking-tight mt-1">三重制约三角形（变更=联动）</div>
                    </div>
                    ${termChips(['三重制约', '变更控制'], 'sm')}
                </div>
                <div class="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="max-w-md mx-auto">
                            <svg viewBox="0 0 360 300" class="w-full h-auto">
                                <defs>
                                    <linearGradient id="pmTriFill" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stop-color="hsl(var(--p))" stop-opacity="0.10"/>
                                        <stop offset="100%" stop-color="hsl(var(--s))" stop-opacity="0.12"/>
                                    </linearGradient>
                                </defs>
                                <polygon points="180,30 40,250 320,250" fill="url(#pmTriFill)" stroke="hsl(var(--bc) / 0.35)" stroke-width="3" />
                                <circle cx="180" cy="30" r="16" fill="hsl(var(--p))" opacity="0.95"/>
                                <circle cx="40" cy="250" r="16" fill="hsl(var(--s))" opacity="0.95"/>
                                <circle cx="320" cy="250" r="16" fill="hsl(var(--a))" opacity="0.95"/>

                                <rect x="148" y="2" width="64" height="22" rx="11" fill="hsl(var(--p) / 0.18)" stroke="hsl(var(--p) / 0.35)" />
                                <text x="180" y="17" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">范围</text>

                                <rect x="12" y="270" width="56" height="22" rx="11" fill="hsl(var(--s) / 0.18)" stroke="hsl(var(--s) / 0.35)" />
                                <text x="40" y="285" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">成本</text>

                                <rect x="292" y="270" width="56" height="22" rx="11" fill="hsl(var(--a) / 0.18)" stroke="hsl(var(--a) / 0.35)" />
                                <text x="320" y="285" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">进度</text>

                                <text x="180" y="150" text-anchor="middle" font-size="14" font-weight="900" fill="hsl(var(--bc))">质量 / 价值</text>
                                <text x="180" y="170" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.6)">满意度、风险、收益</text>
                            </svg>
                        </div>
                        <div class="mt-4 text-sm text-base-content/70">题目出现“范围/工期/预算/质量”任意一项变化，都要默认<strong>至少牵连一个</strong>其他约束。</div>
                    </div>
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="text-sm font-black mb-3">把题干翻译成“联动语句”</div>
                        <div class="space-y-3">
                            <div class="p-4 rounded-2xl border border-base-300 bg-base-100/70">
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-primary badge-outline font-black">加需求</span>
                                    <span class="text-sm text-base-content/70">范围↑ → 进度↑ 或 成本↑ 或 风险↑</span>
                                </div>
                            </div>
                            <div class="p-4 rounded-2xl border border-base-300 bg-base-100/70">
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-outline font-black opacity-70">赶工</span>
                                    <span class="text-sm text-base-content/70">进度↓ → 成本↑ 或 质量↓ 或 风险↑</span>
                                </div>
                            </div>
                            <div class="p-4 rounded-2xl border border-base-300 bg-base-100/70">
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-secondary badge-outline font-black">压成本</span>
                                    <span class="text-sm text-base-content/70">成本↓ → 范围↓ 或 进度↑ 或 风险↑</span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">${renderList(['答题关键词：权衡、变更影响分析、更新基线/计划、沟通干系人期望'])}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const structure = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">组织结构</div>
                        <div class="text-xl font-black tracking-tight mt-1">PM 权力梯度（高频选择题）</div>
                    </div>
                    ${termChips(['组织结构', '职能型组织', '矩阵型组织', '项目型组织', '弱矩阵', '平衡矩阵', '强矩阵'], 'sm')}
                </div>

                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-100/70">
                    <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-4">梯度图</div>
                    <ul class="steps steps-vertical lg:steps-horizontal w-full">
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('职能型组织', event)">职能型</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('弱矩阵', event)">弱矩阵</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('平衡矩阵', event)">平衡矩阵</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('强矩阵', event)">强矩阵</button></li>
                        <li class="step step-primary"><button class="btn btn-ghost btn-sm font-black" onclick="showKnowledge('项目型组织', event)">项目型</button></li>
                    </ul>
                    <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/30">
                            <div class="text-xs font-black opacity-60 mb-2">一眼辨识</div>
                            <div class="text-sm text-base-content/80">资源归部门、PM 协调为主 → 偏职能/弱矩阵</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/30">
                            <div class="text-xs font-black opacity-60 mb-2">冲突来源</div>
                            <div class="text-sm text-base-content/80">矩阵型常见“资源冲突”，靠机制与沟通解决</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-200/30">
                            <div class="text-xs font-black opacity-60 mb-2">答题表达</div>
                            <div class="text-sm text-base-content/80">用“权力/资源/汇报线”三件套描述结构</div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th class="w-32">结构</th>
                                <th>PM 权力</th>
                                <th>资源归属</th>
                                <th>典型特征</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>职能型</th>
                                <td><span class="badge badge-ghost font-black opacity-60">最弱</span></td>
                                <td>职能部门</td>
                                <td>PM 多为协调；部门目标优先</td>
                            </tr>
                            <tr>
                                <th>弱矩阵</th>
                                <td>偏弱</td>
                                <td>职能部门</td>
                                <td>接近职能型；职能经理更强势</td>
                            </tr>
                            <tr>
                                <th>平衡矩阵</th>
                                <td>均衡</td>
                                <td>共享</td>
                                <td>双线汇报；冲突需要协商</td>
                            </tr>
                            <tr>
                                <th>强矩阵</th>
                                <td>偏强</td>
                                <td>共享</td>
                                <td>接近项目型；PM 更能调度资源</td>
                            </tr>
                            <tr>
                                <th>项目型</th>
                                <td><span class="badge badge-success badge-outline font-black">最强</span></td>
                                <td>项目团队</td>
                                <td>团队多为全职；响应快，沟通直接</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="flex items-center justify-between gap-4 flex-col lg:flex-row">
                        <div>
                            <div class="font-black text-base">PMO（项目管理办公室）</div>
                            <div class="text-sm text-base-content/70 mt-1">理解“支持/控制/指令”三种定位，题目基本就能秒选。</div>
                        </div>
                        ${termChips(['PMO'], 'sm')}
                    </div>
                    <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="badge badge-outline font-black opacity-60 mb-2">支持型</div>
                            <div class="text-sm text-base-content/80">提供模板、培训、方法论与咨询</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="badge badge-outline font-black opacity-60 mb-2">控制型</div>
                            <div class="text-sm text-base-content/80">要求合规、审计与标准化流程</div>
                        </div>
                        <div class="p-4 rounded-2xl border border-base-300 bg-base-100/70">
                            <div class="badge badge-outline font-black opacity-60 mb-2">指令型</div>
                            <div class="text-sm text-base-content/80">直接管理项目，权力最大</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const authorityBars = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">维度三：组织与权力</div>
                        <div class="text-xl font-black tracking-tight mt-1">一眼看懂：PM 权力/资源控制/人员专职程度</div>
                    </div>
                    ${termChips(['组织结构', '矩阵型组织', '项目型组织'], 'sm')}
                </div>
                <div class="mt-6 overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th class="w-32">结构</th>
                                <th class="min-w-[240px]">PM 权力</th>
                                <th class="min-w-[240px]">资源控制</th>
                                <th class="min-w-[240px]">人员专职</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>职能型</th>
                                <td><progress class="progress progress-primary w-56" value="15" max="100"></progress></td>
                                <td><progress class="progress progress-secondary w-56" value="15" max="100"></progress></td>
                                <td><progress class="progress progress-accent w-56" value="10" max="100"></progress></td>
                            </tr>
                            <tr>
                                <th>弱矩阵</th>
                                <td><progress class="progress progress-primary w-56" value="30" max="100"></progress></td>
                                <td><progress class="progress progress-secondary w-56" value="30" max="100"></progress></td>
                                <td><progress class="progress progress-accent w-56" value="25" max="100"></progress></td>
                            </tr>
                            <tr>
                                <th>平衡矩阵</th>
                                <td><progress class="progress progress-primary w-56" value="50" max="100"></progress></td>
                                <td><progress class="progress progress-secondary w-56" value="50" max="100"></progress></td>
                                <td><progress class="progress progress-accent w-56" value="45" max="100"></progress></td>
                            </tr>
                            <tr>
                                <th>强矩阵</th>
                                <td><progress class="progress progress-primary w-56" value="70" max="100"></progress></td>
                                <td><progress class="progress progress-secondary w-56" value="70" max="100"></progress></td>
                                <td><progress class="progress progress-accent w-56" value="60" max="100"></progress></td>
                            </tr>
                            <tr>
                                <th>项目型</th>
                                <td><progress class="progress progress-primary w-56" value="90" max="100"></progress></td>
                                <td><progress class="progress progress-secondary w-56" value="90" max="100"></progress></td>
                                <td><progress class="progress progress-accent w-56" value="85" max="100"></progress></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 text-sm text-base-content/70">
                    选择题常问“PM 权力最大/最小、资源归属、汇报线”。遇到矩阵，就优先想到“资源冲突”与“双线汇报”。
                </div>
            </div>
        </div>
    `;

    const lifecycle = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">生命周期与过程组</div>
                        <div class="text-xl font-black tracking-tight mt-1">用一条主线记牢：启规执监收</div>
                    </div>
                    ${termChips(['项目生命周期', '过程组'], 'sm')}
                </div>

                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-100/70">
                    <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-4">过程组图</div>
                    <ul class="steps steps-vertical lg:steps-horizontal w-full">
                        <li class="step step-primary"><span class="font-black">启动</span></li>
                        <li class="step step-primary"><span class="font-black">规划</span></li>
                        <li class="step step-primary"><span class="font-black">执行</span></li>
                        <li class="step step-primary"><span class="font-black">监控</span></li>
                        <li class="step step-primary"><span class="font-black">收尾</span></li>
                    </ul>
                    <div class="mt-4 text-sm text-base-content/70">
                        过程组不是阶段；一个阶段里可能同时发生规划与监控活动。
                    </div>
                </div>
            </div>
        </div>
    `;

    const lifecycleCurves = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">维度四：生命周期</div>
                        <div class="text-xl font-black tracking-tight mt-1">两条曲线：不确定性↓，资源投入∩</div>
                    </div>
                    ${termChips(['项目生命周期'], 'sm')}
                </div>
                <div class="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="text-sm font-black mb-3">风险/不确定性（前期最高）</div>
                        <svg viewBox="0 0 420 180" class="w-full h-auto">
                            <path d="M30 40 C 140 20, 220 90, 390 150" fill="none" stroke="hsl(var(--er))" stroke-width="4" stroke-linecap="round"/>
                            <path d="M30 150 L390 150" fill="none" stroke="hsl(var(--bc) / 0.15)" stroke-width="2"/>
                            <text x="30" y="168" font-size="12" fill="hsl(var(--bc) / 0.6)">启动</text>
                            <text x="150" y="168" font-size="12" fill="hsl(var(--bc) / 0.6)">规划</text>
                            <text x="240" y="168" font-size="12" fill="hsl(var(--bc) / 0.6)">执行/监控</text>
                            <text x="360" y="168" font-size="12" fill="hsl(var(--bc) / 0.6)">收尾</text>
                        </svg>
                        <div class="mt-3 text-sm text-base-content/70">前期决策影响最大：越早识别风险与干系人，返工越少。</div>
                    </div>
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="text-sm font-black mb-3">成本/人员投入（中期最高）</div>
                        <svg viewBox="0 0 420 180" class="w-full h-auto">
                            <path d="M30 150 C 120 140, 140 60, 210 50 C 280 40, 320 110, 390 150" fill="none" stroke="hsl(var(--p))" stroke-width="4" stroke-linecap="round"/>
                            <path d="M30 150 L390 150" fill="none" stroke="hsl(var(--bc) / 0.15)" stroke-width="2"/>
                            <text x="30" y="168" font-size="12" fill="hsl(var(--bc) / 0.6)">启动</text>
                            <text x="150" y="168" font-size="12" fill="hsl(var(--bc) / 0.6)">规划</text>
                            <text x="240" y="168" font-size="12" fill="hsl(var(--bc) / 0.6)">执行/监控</text>
                            <text x="360" y="168" font-size="12" fill="hsl(var(--bc) / 0.6)">收尾</text>
                        </svg>
                        <div class="mt-3 text-sm text-base-content/70">中期是“干活最多、沟通最密、变更最频”的阶段。</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const eefOpa = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">维度五：环境与资产</div>
                        <div class="text-xl font-black tracking-tight mt-1">EEF vs OPA（一个是约束，一个是沉淀）</div>
                    </div>
                    ${termChips(['事业环境因素', '组织过程资产'], 'sm')}
                </div>
                <div class="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-10 h-10 rounded-2xl bg-error/10 flex items-center justify-center">
                                <i class="fa-solid fa-earth-asia text-error"></i>
                            </div>
                            <div class="font-black">EEF（环境约束）</div>
                        </div>
                        ${renderList(['法律/政策/市场', '组织文化与结构', '现有系统/工具', '供应商与外部条件'])}
                        <div class="mt-4 text-sm text-base-content/70">特点：团队通常不可控，但必须遵守/适应。</div>
                    </div>
                    <div class="flex items-center justify-center">
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-100/70 w-full">
                            <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-2">输入到项目管理</div>
                            <div class="flex items-center gap-3">
                                <div class="flex-1">
                                    <div class="h-2 rounded-full bg-error/15 overflow-hidden">
                                        <div class="h-2 bg-error/40 w-[55%]"></div>
                                    </div>
                                    <div class="text-[11px] mt-2 text-base-content/60">约束/机会影响规划与执行</div>
                                </div>
                                <i class="fa-solid fa-arrow-right-long opacity-40"></i>
                                <div class="flex-1">
                                    <div class="h-2 rounded-full bg-primary/15 overflow-hidden">
                                        <div class="h-2 bg-primary/40 w-[70%]"></div>
                                    </div>
                                    <div class="text-[11px] mt-2 text-base-content/60">复用资产提升效率与一致性</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <i class="fa-solid fa-box-archive text-primary"></i>
                            </div>
                            <div class="font-black">OPA（组织沉淀）</div>
                        </div>
                        ${renderList(['流程/规范/方法论', '模板/清单/表单', '经验教训库', '历史数据与基准'])}
                        <div class="mt-4 text-sm text-base-content/70">特点：可复用，可更新，越用越强。</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const pmFlowchart = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">关联视图 A：流程图</div>
                        <div class="text-xl font-black tracking-tight mt-1">主线：启规执监收 + 变更控制回路</div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="badge badge-outline font-black opacity-60">流程图</span>
                        <span class="badge badge-outline font-black opacity-60">回路</span>
                        <span class="badge badge-outline font-black opacity-60">一眼辨错</span>
                    </div>
                </div>
                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-200/20 overflow-x-auto">
                    <div class="min-w-[980px]">
                        <svg viewBox="0 0 980 240" class="w-full h-auto">
                            <defs>
                                <marker id="pmArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--bc) / 0.45)"></path>
                                </marker>
                            </defs>

                            <g font-family="ui-sans-serif, system-ui" font-size="12" font-weight="800" fill="hsl(var(--bc))">
                                <rect x="20" y="70" width="135" height="60" rx="16" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                                <text x="87.5" y="95" text-anchor="middle">识别需求</text>
                                <text x="87.5" y="115" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">商业论证/立项</text>

                                <rect x="185" y="70" width="135" height="60" rx="16" fill="hsl(var(--p) / 0.08)" stroke="hsl(var(--p) / 0.25)"/>
                                <text x="252.5" y="95" text-anchor="middle">启动</text>
                                <text x="252.5" y="115" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">章程授权</text>

                                <rect x="350" y="70" width="135" height="60" rx="16" fill="hsl(var(--s) / 0.08)" stroke="hsl(var(--s) / 0.25)"/>
                                <text x="417.5" y="95" text-anchor="middle">规划</text>
                                <text x="417.5" y="115" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">计划/基线</text>

                                <rect x="515" y="70" width="135" height="60" rx="16" fill="hsl(var(--a) / 0.08)" stroke="hsl(var(--a) / 0.25)"/>
                                <text x="582.5" y="95" text-anchor="middle">执行</text>
                                <text x="582.5" y="115" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">交付成果</text>

                                <rect x="680" y="70" width="135" height="60" rx="16" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                                <text x="747.5" y="95" text-anchor="middle">监控</text>
                                <text x="747.5" y="115" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">测量/报告</text>

                                <polygon points="862,100 905,70 948,100 905,130" fill="hsl(var(--er) / 0.08)" stroke="hsl(var(--er) / 0.35)"/>
                                <text x="905" y="97" text-anchor="middle">变更？</text>
                                <text x="905" y="114" text-anchor="middle" font-size="10" fill="hsl(var(--bc) / 0.6)">范围/成本/进度</text>

                                <rect x="680" y="165" width="180" height="55" rx="16" fill="hsl(var(--er) / 0.08)" stroke="hsl(var(--er) / 0.35)"/>
                                <text x="770" y="190" text-anchor="middle">评估影响 + CCB 审批</text>
                                <text x="770" y="209" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">批准后更新基线</text>

                                <rect x="845" y="165" width="115" height="55" rx="16" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                                <text x="902.5" y="190" text-anchor="middle">收尾</text>
                                <text x="902.5" y="209" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">验收/移交</text>
                            </g>

                            <path d="M155 100 L185 100" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#pmArrow)"/>
                            <path d="M320 100 L350 100" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#pmArrow)"/>
                            <path d="M485 100 L515 100" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#pmArrow)"/>
                            <path d="M650 100 L680 100" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#pmArrow)"/>
                            <path d="M815 100 L862 100" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#pmArrow)"/>

                            <path d="M905 130 L905 165" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#pmArrow)"/>
                            <text x="918" y="155" font-size="11" font-weight="900" fill="hsl(var(--bc) / 0.6)">是</text>

                            <path d="M862 100 L845 100" stroke="none"/>
                            <path d="M948 100 L960 100 L960 192 L860 192" fill="none" stroke="hsl(var(--bc) / 0.35)" stroke-width="2.5" marker-end="url(#pmArrow)"/>
                            <text x="955" y="92" font-size="11" font-weight="900" fill="hsl(var(--bc) / 0.6)">否</text>

                            <path d="M680 192 L485 192" fill="none" stroke="hsl(var(--bc) / 0.35)" stroke-width="2.5" marker-end="url(#pmArrow)"/>
                            <text x="580" y="182" font-size="11" font-weight="900" fill="hsl(var(--bc) / 0.6)">更新计划/基线</text>
                        </svg>
                    </div>
                </div>
                <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="text-xs font-black opacity-60 mb-2">一眼辨错</div>
                        <div class="text-sm text-base-content/80">没有章程就进入规划/执行，通常就是错</div>
                    </div>
                    <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="text-xs font-black opacity-60 mb-2">核心句式</div>
                        <div class="text-sm text-base-content/80">变更必须先评估影响，再批准，再更新基线</div>
                    </div>
                    <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="text-xs font-black opacity-60 mb-2">联动记忆</div>
                        <div class="text-sm text-base-content/80">变更回路会触发三重制约的重新权衡</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const pmTopology = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">关联视图 B：拓扑/逻辑图</div>
                        <div class="text-xl font-black tracking-tight mt-1">把“概念—组织—流程—约束—环境”连成网络</div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="badge badge-outline font-black opacity-60">拓扑图</span>
                        <span class="badge badge-outline font-black opacity-60">逻辑图</span>
                        <span class="badge badge-outline font-black opacity-60">关联</span>
                    </div>
                </div>
                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-200/20 overflow-x-auto">
                    <div class="min-w-[980px]">
                        <svg viewBox="0 0 980 360" class="w-full h-auto">
                            <defs>
                                <marker id="pmTopoArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--bc) / 0.35)"></path>
                                </marker>
                                <filter id="pmNodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(0,0,0,0.12)"/>
                                </filter>
                            </defs>

                            <g stroke="hsl(var(--bc) / 0.25)" stroke-width="2.5" marker-end="url(#pmTopoArrow)" fill="none">
                                <path d="M490 180 L280 80"/>
                                <path d="M490 180 L700 80"/>
                                <path d="M490 180 L220 180"/>
                                <path d="M490 180 L760 180"/>
                                <path d="M490 180 L280 280"/>
                                <path d="M490 180 L700 280"/>
                                <path d="M490 180 L490 40"/>
                                <path d="M490 180 L490 320"/>
                            </g>

                            <g font-family="ui-sans-serif, system-ui" font-size="12" font-weight="900" fill="hsl(var(--bc))">
                                <rect x="410" y="140" width="160" height="80" rx="20" fill="hsl(var(--p) / 0.12)" stroke="hsl(var(--p) / 0.35)" filter="url(#pmNodeShadow)"/>
                                <text x="490" y="172" text-anchor="middle">项目管理</text>
                                <text x="490" y="195" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">整合：目标/资源/沟通</text>

                                <rect x="200" y="48" width="160" height="64" rx="18" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                                <text x="280" y="76" text-anchor="middle">项目 vs 运营</text>
                                <text x="280" y="98" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">临时独特 / 持续重复</text>

                                <rect x="620" y="48" width="160" height="64" rx="18" fill="hsl(var(--er) / 0.08)" stroke="hsl(var(--er) / 0.35)"/>
                                <text x="700" y="76" text-anchor="middle">三重制约</text>
                                <text x="700" y="98" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">范围/进度/成本联动</text>

                                <rect x="130" y="148" width="180" height="64" rx="18" fill="hsl(var(--s) / 0.08)" stroke="hsl(var(--s) / 0.30)"/>
                                <text x="220" y="176" text-anchor="middle">组织结构</text>
                                <text x="220" y="198" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">决定 PM 权力/资源</text>

                                <rect x="670" y="148" width="180" height="64" rx="18" fill="hsl(var(--a) / 0.08)" stroke="hsl(var(--a) / 0.30)"/>
                                <text x="760" y="176" text-anchor="middle">角色与责任</text>
                                <text x="760" y="198" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">发起人/PM/团队</text>

                                <rect x="200" y="248" width="160" height="64" rx="18" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                                <text x="280" y="276" text-anchor="middle">过程组</text>
                                <text x="280" y="298" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">启规执监收</text>

                                <rect x="620" y="248" width="160" height="64" rx="18" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                                <text x="700" y="276" text-anchor="middle">生命周期</text>
                                <text x="700" y="298" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">阶段 ≠ 过程组</text>

                                <rect x="410" y="10" width="160" height="54" rx="18" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                                <text x="490" y="40" text-anchor="middle">EEF / OPA</text>
                                <text x="490" y="58" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">环境约束 / 组织沉淀</text>

                                <rect x="410" y="296" width="160" height="54" rx="18" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                                <text x="490" y="326" text-anchor="middle">PMO</text>
                                <text x="490" y="344" text-anchor="middle" font-size="11" fill="hsl(var(--bc) / 0.65)">支持/控制/指令</text>
                            </g>
                        </svg>
                    </div>
                </div>
                <div class="mt-4 text-sm text-base-content/70">做题时先定位“在问哪一块”，再沿着网络回到<strong>组织/流程/约束</strong>，答案通常就出来了。</div>
            </div>
        </div>
    `;

    const pmIdef0 = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">关联视图 C：功能分析图</div>
                        <div class="text-xl font-black tracking-tight mt-1">用 ICOM 框架描述“项目管理到底在干什么”</div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="badge badge-outline font-black opacity-60">功能分析</span>
                        <span class="badge badge-outline font-black opacity-60">输入/控制</span>
                        <span class="badge badge-outline font-black opacity-60">机制/输出</span>
                    </div>
                </div>
                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-200/20 overflow-x-auto">
                    <div class="min-w-[980px]">
                        <svg viewBox="0 0 980 320" class="w-full h-auto">
                            <defs>
                                <marker id="pmIcoArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--bc) / 0.45)"></path>
                                </marker>
                            </defs>

                            <rect x="360" y="110" width="260" height="120" rx="18" fill="hsl(var(--p) / 0.10)" stroke="hsl(var(--p) / 0.35)" stroke-width="2.5"/>
                            <text x="490" y="150" text-anchor="middle" font-size="14" font-weight="900" fill="hsl(var(--bc))">项目管理（整合与协调）</text>
                            <text x="490" y="173" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">把目标/资源/沟通/风险串成一条线</text>

                            <path d="M80 170 L360 170" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#pmIcoArrow)"/>
                            <rect x="30" y="140" width="190" height="60" rx="16" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                            <text x="125" y="168" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">输入（Input）</text>
                            <text x="125" y="188" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">需求/商业论证/章程</text>

                            <path d="M620 170 L900 170" stroke="hsl(var(--bc) / 0.45)" stroke-width="2.5" marker-end="url(#pmIcoArrow)"/>
                            <rect x="760" y="140" width="190" height="60" rx="16" fill="hsl(var(--bc) / 0.04)" stroke="hsl(var(--bc) / 0.18)"/>
                            <text x="855" y="168" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">输出（Output）</text>
                            <text x="855" y="188" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">可交付成果/价值/复盘</text>

                            <path d="M490 50 L490 110" stroke="hsl(var(--bc) / 0.35)" stroke-width="2.5" marker-end="url(#pmIcoArrow)"/>
                            <rect x="390" y="20" width="200" height="56" rx="16" fill="hsl(var(--er) / 0.08)" stroke="hsl(var(--er) / 0.25)"/>
                            <text x="490" y="46" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">控制（Control）</text>
                            <text x="490" y="66" text-anchor="middle" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.65)">EEF/OPA/制度/标准</text>

                            <path d="M490 230 L490 290" stroke="hsl(var(--bc) / 0.35)" stroke-width="2.5" marker-end="url(#pmIcoArrow)"/>
                            <rect x="360" y="268" width="260" height="44" rx="16" fill="hsl(var(--s) / 0.08)" stroke="hsl(var(--s) / 0.25)"/>
                            <text x="490" y="296" text-anchor="middle" font-size="12" font-weight="900" fill="hsl(var(--bc))">机制（Mechanism）= PM/团队/工具/PMO</text>
                        </svg>
                    </div>
                </div>
                <div class="mt-4 text-sm text-base-content/70">把题目中的名词放进 ICOM 四格里，很多“概念题/归类题”会立刻清晰。</div>
            </div>
        </div>
    `;

    const roles = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">角色速记</div>
                        <div class="text-xl font-black tracking-tight mt-1">题干写错责任人，就按这张卡纠偏</div>
                    </div>
                    ${termChips(['项目发起人', '项目经理', '项目团队', '干系人', '项目章程'], 'sm')}
                </div>
                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <i class="fa-solid fa-user-tie text-primary"></i>
                            </div>
                            <div class="font-black">发起人/赞助人</div>
                        </div>
                        ${renderList(['提供资源支持', '批准关键决策', '发布项目章程，正式授权项目成立'])}
                        <div class="mt-4">${termChips(['项目发起人', '项目章程'], 'sm')}</div>
                    </div>
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
                                <i class="fa-solid fa-diagram-project text-secondary"></i>
                            </div>
                            <div class="font-black">项目经理</div>
                        </div>
                        ${renderList(['对目标负责（范围/进度/成本/风险）', '整合与协调各方', '平衡约束条件与干系人期望'])}
                        <div class="mt-4">${termChips(['项目经理', '组织结构'], 'sm')}</div>
                    </div>
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-10 h-10 rounded-2xl bg-warning/10 flex items-center justify-center">
                                <i class="fa-solid fa-people-group text-warning"></i>
                            </div>
                            <div class="font-black">项目团队</div>
                        </div>
                        ${renderList(['执行项目工作', '产出可交付成果', '在矩阵组织中常见双线汇报'])}
                        <div class="mt-4">${termChips(['项目团队', '矩阵型组织'], 'sm')}</div>
                    </div>
                    <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                                <i class="fa-solid fa-user-group text-accent"></i>
                            </div>
                            <div class="font-black">干系人</div>
                        </div>
                        ${renderList(['能影响/被影响/自认为会被影响', '关键是持续沟通与管理期望', '题干常把“谁需要被沟通”写漏'])}
                        <div class="mt-4">${termChips(['干系人'], 'sm')}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const raci = `
        <div class="card bg-base-100 border border-base-300 shadow-xl">
            <div class="p-6 lg:p-8">
                <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">维度六：角色与责任</div>
                        <div class="text-xl font-black tracking-tight mt-1">RACI 责任矩阵（案例找茬就靠它）</div>
                    </div>
                    ${termChips(['项目发起人', '项目经理', '项目团队', '干系人', 'PMO', '项目章程'], 'sm')}
                </div>
                <div class="mt-6 overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th class="w-36">活动</th>
                                <th class="min-w-[120px]">发起人</th>
                                <th class="min-w-[120px]">项目经理</th>
                                <th class="min-w-[120px]">团队</th>
                                <th class="min-w-[120px]">PMO</th>
                                <th class="min-w-[120px]">干系人</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>发布章程</th>
                                <td><span class="badge badge-primary badge-outline font-black">A</span></td>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                                <td><span class="badge badge-ghost font-black opacity-60">I</span></td>
                                <td><span class="badge badge-ghost font-black opacity-60">I</span></td>
                                <td><span class="badge badge-ghost font-black opacity-60">I</span></td>
                            </tr>
                            <tr>
                                <th>制定计划</th>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                                <td><span class="badge badge-secondary badge-outline font-black">R</span></td>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                                <td><span class="badge badge-ghost font-black opacity-60">I</span></td>
                            </tr>
                            <tr>
                                <th>执行交付</th>
                                <td><span class="badge badge-ghost font-black opacity-60">I</span></td>
                                <td><span class="badge badge-secondary badge-outline font-black">A/R</span></td>
                                <td><span class="badge badge-secondary badge-outline font-black">R</span></td>
                                <td><span class="badge badge-ghost font-black opacity-60">I</span></td>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                            </tr>
                            <tr>
                                <th>审批变更</th>
                                <td><span class="badge badge-primary badge-outline font-black">A</span></td>
                                <td><span class="badge badge-secondary badge-outline font-black">R</span></td>
                                <td><span class="badge badge-ghost font-black opacity-60">I</span></td>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                            </tr>
                            <tr>
                                <th>验收收尾</th>
                                <td><span class="badge badge-primary badge-outline font-black">A</span></td>
                                <td><span class="badge badge-secondary badge-outline font-black">R</span></td>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                                <td><span class="badge badge-ghost font-black opacity-60">I</span></td>
                                <td><span class="badge badge-outline font-black opacity-70">C</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 text-sm text-base-content/70">
                    A=最终负责（拍板/批准），R=执行负责，C=被征询，I=被告知。遇到“PM 自己批准章程/变更”基本就是错。
                </div>
            </div>
        </div>
    `;

    const tabbed = `
        <div class="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
            <div class="p-6 lg:p-8">
                <div class="flex items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">第六章一图梳理</div>
                        <div class="text-xl font-black tracking-tight mt-1">按“不同维度”把知识装进脑子</div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="badge badge-outline font-black opacity-60">概念</span>
                        <span class="badge badge-outline font-black opacity-60">约束</span>
                        <span class="badge badge-outline font-black opacity-60">组织</span>
                        <span class="badge badge-outline font-black opacity-60">流程</span>
                        <span class="badge badge-outline font-black opacity-60">环境</span>
                        <span class="badge badge-outline font-black opacity-60">责任</span>
                        <span class="badge badge-outline font-black opacity-60">关联</span>
                    </div>
                </div>
                <div class="mt-6">
                    <div role="tablist" class="tabs tabs-lifted">
                        <input type="radio" name="pm-intro-tabset" role="tab" class="tab font-black" aria-label="概念" checked />
                        <div role="tabpanel" class="tab-content pt-6">
                            <div class="space-y-6">
                                ${quadrant}
                                ${conceptCompare}
                            </div>
                        </div>
                        <input type="radio" name="pm-intro-tabset" role="tab" class="tab font-black" aria-label="约束" />
                        <div role="tabpanel" class="tab-content pt-6">
                            <div class="space-y-6">
                                ${tripleConstraintViz}
                            </div>
                        </div>
                        <input type="radio" name="pm-intro-tabset" role="tab" class="tab font-black" aria-label="组织" />
                        <div role="tabpanel" class="tab-content pt-6">
                            <div class="space-y-6">
                                ${authorityBars}
                                ${structure}
                            </div>
                        </div>
                        <input type="radio" name="pm-intro-tabset" role="tab" class="tab font-black" aria-label="流程" />
                        <div role="tabpanel" class="tab-content pt-6">
                            <div class="space-y-6">
                                ${lifecycle}
                                ${lifecycleCurves}
                            </div>
                        </div>
                        <input type="radio" name="pm-intro-tabset" role="tab" class="tab font-black" aria-label="环境" />
                        <div role="tabpanel" class="tab-content pt-6">
                            <div class="space-y-6">
                                ${eefOpa}
                            </div>
                        </div>
                        <input type="radio" name="pm-intro-tabset" role="tab" class="tab font-black" aria-label="责任" />
                        <div role="tabpanel" class="tab-content pt-6">
                            <div class="space-y-6">
                                ${roles}
                                ${raci}
                            </div>
                        </div>
                        <input type="radio" name="pm-intro-tabset" role="tab" class="tab font-black" aria-label="关联" />
                        <div role="tabpanel" class="tab-content pt-6">
                            <div class="space-y-6">
                                ${pmFlowchart}
                                ${pmTopology}
                                ${pmIdef0}
                            </div>
                        </div>
                    </div>
                </div>
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

    return `
        <div class="space-y-8">
            ${hero}
            ${tabbed}
            <div class="card bg-base-100 border border-base-300 shadow-xl">
                <div class="p-6 lg:p-8">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <div class="text-xs font-black uppercase tracking-widest opacity-60">学习笔记</div>
                            <div class="text-xl font-black tracking-tight mt-1">展开即答案（按考题问法整理）</div>
                        </div>
                    </div>
                    <div class="mt-6 space-y-4">${collapses}</div>
                </div>
            </div>
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
