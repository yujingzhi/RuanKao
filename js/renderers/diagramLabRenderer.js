import { renderList } from '../ui/knowledgeUi.js';
import { renderFlowchart } from '../diagrams/flowchart.js';
import { renderTopology } from '../diagrams/topology.js';
import { renderIcomDiagram } from '../diagrams/icom.js';
import { renderHeatmap } from '../diagrams/heatmap.js';
import { renderDonut, renderStackedBar } from '../diagrams/proportion.js';
import { renderGraphSvg } from '../diagrams/graph.js';

export function renderDiagramLab() {
    const uiSpec = `
        <div class="space-y-6">
            <div class="card bg-base-100 border border-base-300 shadow-xl">
                <div class="p-6 lg:p-8">
                    <div class="flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
                        <div>
                            <div class="text-xs font-black uppercase tracking-widest opacity-60">UI 规范</div>
                            <div class="text-xl font-black tracking-tight mt-1">全站统一的视觉与交互语言（在这里定稿）</div>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <span class="badge badge-outline font-black opacity-60">Typography</span>
                            <span class="badge badge-outline font-black opacity-60">Color</span>
                            <span class="badge badge-outline font-black opacity-60">Spacing</span>
                            <span class="badge badge-outline font-black opacity-60">Components</span>
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                            <div class="text-sm font-black mb-3">排版（标题层级）</div>
                            <div class="space-y-3">
                                <div class="text-3xl font-black tracking-tight">H1 主标题</div>
                                <div class="text-2xl font-black tracking-tight">H2 分区标题</div>
                                <div class="text-xl font-black tracking-tight">H3 卡片标题</div>
                                <div class="text-sm text-base-content/70 leading-relaxed">
                                    正文默认用 <span class="font-black">text-sm</span>，强调用 <span class="font-black">font-black</span>，弱化信息用 <span class="font-black">text-base-content/70</span>。
                                </div>
                            </div>
                        </div>
                        <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                            <div class="text-sm font-black mb-3">颜色与语义（DaisyUI tokens）</div>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div class="p-3 rounded-xl border border-base-300 bg-base-100/70">
                                    <div class="text-xs font-black opacity-60 mb-2">Primary</div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge-primary font-black">主操作</span>
                                        <span class="text-xs text-base-content/60">hsl(var(--p))</span>
                                    </div>
                                </div>
                                <div class="p-3 rounded-xl border border-base-300 bg-base-100/70">
                                    <div class="text-xs font-black opacity-60 mb-2">Secondary</div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge-secondary font-black">次操作</span>
                                        <span class="text-xs text-base-content/60">hsl(var(--s))</span>
                                    </div>
                                </div>
                                <div class="p-3 rounded-xl border border-base-300 bg-base-100/70">
                                    <div class="text-xs font-black opacity-60 mb-2">Accent</div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge-accent font-black">高亮</span>
                                        <span class="text-xs text-base-content/60">hsl(var(--a))</span>
                                    </div>
                                </div>
                                <div class="p-3 rounded-xl border border-base-300 bg-base-100/70">
                                    <div class="text-xs font-black opacity-60 mb-2">Info</div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge-info font-black">提示</span>
                                        <span class="text-xs text-base-content/60">badge-info</span>
                                    </div>
                                </div>
                                <div class="p-3 rounded-xl border border-base-300 bg-base-100/70">
                                    <div class="text-xs font-black opacity-60 mb-2">Warning</div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge-warning font-black">注意</span>
                                        <span class="text-xs text-base-content/60">badge-warning</span>
                                    </div>
                                </div>
                                <div class="p-3 rounded-xl border border-base-300 bg-base-100/70">
                                    <div class="text-xs font-black opacity-60 mb-2">Error</div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge-error font-black text-white">风险</span>
                                        <span class="text-xs text-base-content/60">badge-error</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 text-sm text-base-content/70">规则：不要自造颜色；只使用语义色 + opacity 组合，保证暗色模式一致。</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div class="card bg-base-100 border border-base-300 shadow-xl">
                    <div class="p-6 lg:p-8">
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <div class="text-xs font-black uppercase tracking-widest opacity-60">组件规范</div>
                                <div class="text-xl font-black tracking-tight mt-1">按钮 / 标签 / 提示 / 进度</div>
                            </div>
                        </div>
                        <div class="mt-6 space-y-6">
                            <div class="space-y-3">
                                <div class="text-sm font-black">按钮</div>
                                <div class="flex flex-wrap gap-2">
                                    <button class="btn btn-primary font-black">Primary</button>
                                    <button class="btn btn-secondary font-black">Secondary</button>
                                    <button class="btn btn-outline font-black">Outline</button>
                                    <button class="btn btn-ghost font-black">Ghost</button>
                                    <button class="btn btn-disabled font-black">Disabled</button>
                                    <button class="btn btn-sm btn-circle"><i class="fa-solid fa-bolt"></i></button>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <div class="text-sm font-black">徽章 / 状态</div>
                                <div class="flex flex-wrap gap-2">
                                    <span class="badge badge-primary badge-outline font-black">术语</span>
                                    <span class="badge badge-outline font-black opacity-60">分类</span>
                                    <span class="badge badge-success badge-outline font-black">通过</span>
                                    <span class="badge badge-warning badge-outline font-black">注意</span>
                                    <span class="badge badge-error badge-sm font-black text-white">高频</span>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <div class="text-sm font-black">提示 / 反馈</div>
                                <div class="grid grid-cols-1 gap-3">
                                    <div class="alert alert-info">
                                        <i class="fa-solid fa-circle-info"></i>
                                        <span class="font-black">Info：用于解释、提示下一步</span>
                                    </div>
                                    <div class="alert alert-warning">
                                        <i class="fa-solid fa-triangle-exclamation"></i>
                                        <span class="font-black">Warning：用于易错点/风险点</span>
                                    </div>
                                    <div class="alert alert-error">
                                        <i class="fa-solid fa-circle-exclamation"></i>
                                        <span class="font-black">Error：用于关键错误/高风险</span>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <div class="text-sm font-black">进度 / 统计</div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                                        <div class="text-xs font-black opacity-60 mb-2">掌握度</div>
                                        <progress class="progress progress-primary w-full" value="62" max="100"></progress>
                                        <div class="text-xs text-base-content/60 mt-2">示例：62%</div>
                                    </div>
                                    <div class="stats shadow border border-base-300 bg-base-100">
                                        <div class="stat py-4">
                                            <div class="stat-title">示例</div>
                                            <div class="stat-value text-primary text-2xl">18</div>
                                            <div class="stat-desc">已掌握</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card bg-base-100 border border-base-300 shadow-xl">
                    <div class="p-6 lg:p-8">
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <div class="text-xs font-black uppercase tracking-widest opacity-60">表单与表格</div>
                                <div class="text-xl font-black tracking-tight mt-1">输入 / 搜索 / 选择 / 表格</div>
                            </div>
                        </div>
                        <div class="mt-6 space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input class="input input-bordered w-full" placeholder="输入框：搜索术语/关键字" />
                                <select class="select select-bordered w-full">
                                    <option>下拉选择：维度</option>
                                    <option>概念</option>
                                    <option>组织</option>
                                    <option>流程</option>
                                </select>
                                <label class="flex items-center gap-3 p-3 rounded-2xl border border-base-300 bg-base-200/20">
                                    <input type="checkbox" class="toggle toggle-primary toggle-sm" checked />
                                    <span class="text-sm font-black opacity-70">开关：默写模式示例</span>
                                </label>
                                <label class="flex items-center gap-3 p-3 rounded-2xl border border-base-300 bg-base-200/20">
                                    <input type="radio" name="ui-radio-demo" class="radio radio-primary radio-sm" checked />
                                    <span class="text-sm font-black opacity-70">单选：筛选示例</span>
                                </label>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th class="w-32">列</th>
                                            <th>语义</th>
                                            <th class="w-40">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>术语</th>
                                            <td>可点击查看知识延伸</td>
                                            <td><span class="badge badge-primary badge-outline font-black">可跳转</span></td>
                                        </tr>
                                        <tr>
                                            <th>考点</th>
                                            <td>用于高频提示</td>
                                            <td><span class="badge badge-error badge-sm font-black text-white">高频</span></td>
                                        </tr>
                                        <tr>
                                            <th>说明</th>
                                            <td>弱化信息/口径</td>
                                            <td><span class="badge badge-ghost font-black opacity-60">辅助</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                                <div class="text-xs font-black opacity-60 mb-2">空状态</div>
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-2xl bg-base-100/70 border border-base-300 flex items-center justify-center">
                                        <i class="fa-solid fa-circle-notch opacity-40"></i>
                                    </div>
                                    <div class="min-w-0">
                                        <div class="text-sm font-black">暂无数据</div>
                                        <div class="text-xs text-base-content/60">用于列表/搜索无结果</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const hero = `
        <div class="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
            <div class="p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-base-100 to-accent/10">
                <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div class="space-y-3">
                        <div class="flex flex-wrap gap-2 items-center">
                            <span class="badge badge-primary badge-outline font-black">实验室</span>
                            <span class="badge badge-ghost font-black opacity-60">图形组件样式预览</span>
                            <span class="badge badge-outline font-black opacity-60">统一 UI</span>
                            <span class="badge badge-outline font-black opacity-60">多类型图</span>
                        </div>
                        <div class="text-2xl lg:text-3xl font-black tracking-tight">流程图 / 拓扑图 / 功能分析图：统一页面调样式</div>
                        <div class="text-sm text-base-content/70 leading-relaxed max-w-3xl">
                            这个页面用于你先快速调 UI：卡片层级、留白、边框、背景、标签、响应式尺寸。确认好看之后，再把图形组件抽到 <span class="font-black">js/diagrams/</span> 做数据驱动复用。
                        </div>
                    </div>
                    <div class="stats shadow border border-base-300 bg-base-100">
                        <div class="stat py-4">
                            <div class="stat-title">目标</div>
                            <div class="stat-value text-primary text-2xl">统一风格</div>
                            <div class="stat-desc">不同图形，同一套卡片语言</div>
                        </div>
                        <div class="stat py-4">
                            <div class="stat-title">下一步</div>
                            <div class="stat-value text-secondary text-2xl">组件化</div>
                            <div class="stat-desc">nodes/edges → SVG</div>
                        </div>
                    </div>
                </div>
                <div class="mt-6 p-5 rounded-2xl border border-base-300 bg-base-100/70">
                    <div class="text-xs font-black uppercase tracking-widest opacity-60 mb-4">建议你先看这些点</div>
                    ${renderList(['边框与背景对比度是否舒适', '在移动端是否需要横向滚动', '标题区与图形区的层级是否明确', '同一类型图的“紧凑/标准/宽屏”三种版式是否都好看'])}
                </div>
            </div>
        </div>
    `;

    const flowchartSvg = renderFlowchart({
        width: 980,
        height: 240,
        nodes: [
            { id: 'need', x: 20, y: 70, w: 135, h: 60, rx: 16, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '识别需求', subLabel: '商业论证/立项' },
            { id: 'init', x: 185, y: 70, w: 135, h: 60, rx: 16, fill: 'hsl(var(--p) / 0.08)', stroke: 'hsl(var(--p) / 0.25)', label: '启动', subLabel: '章程授权' },
            { id: 'plan', x: 350, y: 70, w: 135, h: 60, rx: 16, fill: 'hsl(var(--s) / 0.08)', stroke: 'hsl(var(--s) / 0.25)', label: '规划', subLabel: '计划/基线' },
            { id: 'exec', x: 515, y: 70, w: 135, h: 60, rx: 16, fill: 'hsl(var(--a) / 0.08)', stroke: 'hsl(var(--a) / 0.25)', label: '执行', subLabel: '交付成果' },
            { id: 'monitor', x: 680, y: 70, w: 135, h: 60, rx: 16, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '监控', subLabel: '测量/报告' },
            { id: 'change', x: 862, y: 70, w: 86, h: 60, shape: 'diamond', fill: 'hsl(var(--er) / 0.08)', stroke: 'hsl(var(--er) / 0.35)', label: '变更？', subLabel: '范围/成本/进度', subLabelSize: 10 },
            { id: 'ccb', x: 680, y: 165, w: 180, h: 55, rx: 16, fill: 'hsl(var(--er) / 0.08)', stroke: 'hsl(var(--er) / 0.35)', label: '评估影响 + CCB 审批', subLabel: '批准后更新基线' },
            { id: 'close', x: 845, y: 165, w: 115, h: 55, rx: 16, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '收尾', subLabel: '验收/移交' }
        ],
        edges: [
            { from: 'need', to: 'init' },
            { from: 'init', to: 'plan' },
            { from: 'plan', to: 'exec' },
            { from: 'exec', to: 'monitor' },
            { from: 'monitor', to: 'change' },
            { from: 'change', fromPort: 'bottom', to: 'ccb', toPort: 'top' },
            { from: 'change', fromPort: 'right', to: 'ccb', toPort: 'right', via: [{ x: 960, y: 100 }, { x: 960, y: 192 }, { x: 860, y: 192 }], style: { opacity: 0.8 } },
            { from: 'ccb', fromPort: 'left', to: 'plan', toPort: 'bottom', curve: 'hv', midX: 485, style: { opacity: 0.8 } },
            { from: 'ccb', to: 'close' }
        ],
        extra: `
            <text x="918" y="155" font-size="11" font-weight="900" fill="hsl(var(--bc) / 0.6)">是</text>
            <text x="955" y="92" font-size="11" font-weight="900" fill="hsl(var(--bc) / 0.6)">否</text>
            <text x="580" y="182" font-size="11" font-weight="900" fill="hsl(var(--bc) / 0.6)">更新计划/基线</text>
        `
    });

    const flowchart = `
        <div class="space-y-4">
            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20 overflow-x-auto">
                <div class="min-w-[980px]">
                    ${flowchartSvg}
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">用途</div>
                    <div class="text-sm text-base-content/80">适合把“主线 + 回路/异常路径”说清楚</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">关注</div>
                    <div class="text-sm text-base-content/80">节点圆角、箭头粗细、横向滚动体验</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">改造方向</div>
                    <div class="text-sm text-base-content/80">下一步用 steps/edges 数据驱动生成</div>
                </div>
            </div>
        </div>
    `;

    const topologySvg = renderTopology({
        width: 980,
        height: 360,
        defs: `
            <filter id="labNodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(0,0,0,0.12)"/>
            </filter>
        `,
        nodes: [
            { id: 'core', x: 410, y: 140, w: 160, h: 80, rx: 20, fill: 'hsl(var(--p) / 0.12)', stroke: 'hsl(var(--p) / 0.35)', filter: 'url(#labNodeShadow)', label: '核心主题', subLabel: '在此聚合要点', labelSize: 12, subLabelSize: 11 },
            { id: 'concept', x: 200, y: 48, w: 160, h: 64, rx: 18, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '概念', subLabel: '定义/边界' },
            { id: 'constraint', x: 620, y: 48, w: 160, h: 64, rx: 18, fill: 'hsl(var(--er) / 0.08)', stroke: 'hsl(var(--er) / 0.35)', label: '约束', subLabel: '权衡/联动' },
            { id: 'org', x: 130, y: 148, w: 180, h: 64, rx: 18, fill: 'hsl(var(--s) / 0.08)', stroke: 'hsl(var(--s) / 0.30)', label: '组织', subLabel: '权力/资源' },
            { id: 'role', x: 670, y: 148, w: 180, h: 64, rx: 18, fill: 'hsl(var(--a) / 0.08)', stroke: 'hsl(var(--a) / 0.30)', label: '角色', subLabel: '责任/RACI' },
            { id: 'process', x: 200, y: 248, w: 160, h: 64, rx: 18, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '流程', subLabel: '过程组/阶段' },
            { id: 'env', x: 620, y: 248, w: 160, h: 64, rx: 18, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '环境', subLabel: 'EEF/OPA' },
            { id: 'extraTop', x: 410, y: 10, w: 160, h: 54, rx: 18, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '补充节点', subLabel: '可扩展' },
            { id: 'extraBottom', x: 410, y: 296, w: 160, h: 54, rx: 18, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '补充节点', subLabel: '可扩展' }
        ],
        edges: [
            { from: 'core', fromPort: 'left', to: 'concept', toPort: 'right' },
            { from: 'core', fromPort: 'right', to: 'constraint', toPort: 'left' },
            { from: 'core', fromPort: 'left', to: 'org', toPort: 'right' },
            { from: 'core', fromPort: 'right', to: 'role', toPort: 'left' },
            { from: 'core', fromPort: 'left', to: 'process', toPort: 'right' },
            { from: 'core', fromPort: 'right', to: 'env', toPort: 'left' },
            { from: 'core', fromPort: 'top', to: 'extraTop', toPort: 'bottom' },
            { from: 'core', fromPort: 'bottom', to: 'extraBottom', toPort: 'top' }
        ]
    });

    const topology = `
        <div class="space-y-4">
            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20 overflow-x-auto">
                <div class="min-w-[980px]">
                    ${topologySvg}
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">用途</div>
                    <div class="text-sm text-base-content/80">适合把“知识块之间的关系”可视化</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">关注</div>
                    <div class="text-sm text-base-content/80">连线密度、节点阴影、视线动线</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">改造方向</div>
                    <div class="text-sm text-base-content/80">下一步用 nodes/links 自动布局</div>
                </div>
            </div>
        </div>
    `;

    const icomSvg = renderIcomDiagram({
        width: 980,
        height: 320,
        title: '功能（Function）',
        subtitle: '把一个主题描述成 I/C/O/M',
        input: '资料/需求/触发',
        output: '结果/交付物',
        control: '规则/约束/标准',
        mechanism: '人/组织/工具'
    });

    const icom = `
        <div class="space-y-4">
            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20 overflow-x-auto">
                <div class="min-w-[980px]">
                    ${icomSvg}
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">用途</div>
                    <div class="text-sm text-base-content/80">适合把“概念题/归类题”拆成结构</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">关注</div>
                    <div class="text-sm text-base-content/80">文字密度、箭头位置、标题对齐</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">改造方向</div>
                    <div class="text-sm text-base-content/80">下一步让章节只提供 I/C/O/M 文案</div>
                </div>
            </div>
        </div>
    `;

    const heatmapSvg = renderHeatmap({
        width: 720,
        height: 260,
        title: '网格图（Heatmap）示例',
        footnote: '用途：把“维度 × 过程组/章节”的强弱分布快速可视化。',
        rows: ['启动', '规划', '执行', '监控', '收尾'],
        cols: ['范围', '进度', '成本', '质量', '风险', '沟通'],
        values: [
            [20, 35, 18, 28, 22, 30],
            [75, 62, 55, 48, 40, 52],
            [55, 50, 45, 42, 38, 35],
            [68, 60, 58, 44, 62, 50],
            [25, 18, 20, 22, 15, 16]
        ]
    });

    const heatmap = `
        <div class="space-y-4">
            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20 overflow-x-auto">
                <div class="min-w-[720px]">
                    ${heatmapSvg}
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">用途</div>
                    <div class="text-sm text-base-content/80">强弱分布、覆盖度、热度</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">关注</div>
                    <div class="text-sm text-base-content/80">颜色梯度、单元格密度、可读性</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">改造方向</div>
                    <div class="text-sm text-base-content/80">输入 matrix 数据自动渲染</div>
                </div>
            </div>
        </div>
    `;

    const donutSvg = renderDonut({
        size: 220,
        radius: 78,
        strokeWidth: 26,
        centerTitle: '占比',
        centerValue: '62%',
        centerValueColor: 'hsl(var(--p))',
        segments: [
            { label: '规划', value: 62, color: 'hsl(var(--p))' },
            { label: '执行', value: 25, color: 'hsl(var(--s))' },
            { label: '监控', value: 13, color: 'hsl(var(--a))' }
        ]
    });

    const stackedBarHtml = renderStackedBar({
        segments: [
            { label: '范围', value: 45, color: 'hsl(var(--p))' },
            { label: '进度', value: 30, color: 'hsl(var(--s))' },
            { label: '成本', value: 15, color: 'hsl(var(--a))' },
            { label: '风险', value: 10, color: 'hsl(var(--er))' }
        ]
    });

    const proportionCharts = `
        <div class="space-y-4">
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <div class="text-sm font-black">占比图：Donut</div>
                            <div class="text-xs text-base-content/60 mt-1">用于“知识点/题型/过程组占比”</div>
                        </div>
                        <span class="badge badge-outline font-black opacity-60">SVG</span>
                    </div>
                    <div class="mt-5 flex flex-col md:flex-row gap-6 items-center">
                        <div class="w-56 h-56">${donutSvg}</div>
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-sm">
                                <span class="w-3 h-3 rounded-sm" style="background: hsl(var(--p));"></span>
                                <span class="font-black">规划</span>
                                <span class="text-base-content/60">62%</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm">
                                <span class="w-3 h-3 rounded-sm" style="background: hsl(var(--s));"></span>
                                <span class="font-black">执行</span>
                                <span class="text-base-content/60">25%</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm">
                                <span class="w-3 h-3 rounded-sm" style="background: hsl(var(--a));"></span>
                                <span class="font-black">监控</span>
                                <span class="text-base-content/60">13%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <div class="text-sm font-black">占比图：Stacked Bar</div>
                            <div class="text-xs text-base-content/60 mt-1">用于“结构对比/构成对比”</div>
                        </div>
                        <span class="badge badge-outline font-black opacity-60">CSS</span>
                    </div>
                    <div class="mt-6 space-y-4">
                        <div class="text-xs font-black opacity-60">项目成功要素构成（示例）</div>
                        ${stackedBarHtml}
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm" style="background: hsl(var(--p));"></span><span class="font-black">范围</span><span class="text-base-content/60">45%</span></div>
                            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm" style="background: hsl(var(--s));"></span><span class="font-black">进度</span><span class="text-base-content/60">30%</span></div>
                            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm" style="background: hsl(var(--a));"></span><span class="font-black">成本</span><span class="text-base-content/60">15%</span></div>
                            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm" style="background: hsl(var(--er));"></span><span class="font-black">风险</span><span class="text-base-content/60">10%</span></div>
                        </div>
                        <div class="text-xs text-base-content/60">规则：如果用堆叠条形，必须配图例与百分比。</div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">用途</div>
                    <div class="text-sm text-base-content/80">占比、构成、资源分配</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">关注</div>
                    <div class="text-sm text-base-content/80">颜色一致性、图例可读性</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">改造方向</div>
                    <div class="text-sm text-base-content/80">输入 segments 自动生成</div>
                </div>
            </div>
        </div>
    `;

    const logicSvg = renderGraphSvg({
        width: 980,
        height: 300,
        markerId: 'labLogicArrow',
        edgeStyle: { color: 'hsl(var(--bc) / 0.35)', width: 2.5, opacity: 1 },
        nodes: [
            { id: 'fact', x: 40, y: 60, w: 200, h: 56, rx: 16, fill: 'hsl(var(--p) / 0.10)', stroke: 'hsl(var(--p) / 0.30)', label: '事实（题干）', subLabel: '发生了什么' },
            { id: 'dim', x: 300, y: 30, w: 220, h: 56, rx: 16, fill: 'hsl(var(--s) / 0.10)', stroke: 'hsl(var(--s) / 0.30)', label: '识别维度', subLabel: '范围/进度/成本/风险' },
            { id: 'owner', x: 300, y: 110, w: 220, h: 56, rx: 16, fill: 'hsl(var(--a) / 0.10)', stroke: 'hsl(var(--a) / 0.30)', label: '找责任主体', subLabel: '发起人/PM/团队/PMO' },
            { id: 'process', x: 580, y: 70, w: 220, h: 56, rx: 16, fill: 'hsl(var(--bc) / 0.04)', stroke: 'hsl(var(--bc) / 0.18)', label: '匹配流程', subLabel: '启规执监收/变更控制' },
            { id: 'result', x: 820, y: 70, w: 120, h: 56, rx: 16, fill: 'hsl(var(--er) / 0.08)', stroke: 'hsl(var(--er) / 0.28)', label: '结论', subLabel: '答案表达' }
        ],
        edges: [
            { from: 'fact', to: 'dim', curve: 'hv', midX: 280 },
            { from: 'fact', to: 'owner', curve: 'hv', midX: 280 },
            { from: 'dim', to: 'process', curve: 'hv', midX: 560 },
            { from: 'owner', to: 'process', curve: 'hv', midX: 560 },
            { from: 'process', to: 'result' }
        ],
        extra: `<text x="40" y="250" font-size="11" font-weight="800" fill="hsl(var(--bc) / 0.55)">用途：把“做题思路”画成逻辑链路（也可用于知识点推导）。</text>`
    });

    const logicGraph = `
        <div class="space-y-4">
            <div class="p-5 rounded-2xl border border-base-300 bg-base-200/20 overflow-x-auto">
                <div class="min-w-[980px]">
                    ${logicSvg}
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">用途</div>
                    <div class="text-sm text-base-content/80">推理路径、决策逻辑、解题框架</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">关注</div>
                    <div class="text-sm text-base-content/80">节点对齐、线条收敛、信息密度</div>
                </div>
                <div class="p-4 rounded-2xl border border-base-300 bg-base-200/20">
                    <div class="text-xs font-black opacity-60 mb-2">改造方向</div>
                    <div class="text-sm text-base-content/80">输入 steps/branches 自动布局</div>
                </div>
            </div>
        </div>
    `;

    const tabbed = `
        <div class="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
            <div class="p-6 lg:p-8">
                <div class="flex items-center justify-between gap-4 flex-col lg:flex-row">
                    <div>
                        <div class="text-xs font-black uppercase tracking-widest opacity-60">图形展示样式</div>
                        <div class="text-xl font-black tracking-tight mt-1">同一套卡片 UI，不同图形类型</div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="badge badge-outline font-black opacity-60">UI 规范</span>
                        <span class="badge badge-outline font-black opacity-60">流程图</span>
                        <span class="badge badge-outline font-black opacity-60">拓扑图</span>
                        <span class="badge badge-outline font-black opacity-60">功能分析图</span>
                        <span class="badge badge-outline font-black opacity-60">逻辑图</span>
                        <span class="badge badge-outline font-black opacity-60">网格图</span>
                        <span class="badge badge-outline font-black opacity-60">占比图</span>
                    </div>
                </div>
                <div class="mt-6">
                    <div role="tablist" class="tabs tabs-lifted">
                        <input type="radio" name="diagram-lab-tabset" role="tab" class="tab font-black" aria-label="UI 规范" checked />
                        <div role="tabpanel" class="tab-content pt-6">
                            ${uiSpec}
                        </div>
                        <input type="radio" name="diagram-lab-tabset" role="tab" class="tab font-black" aria-label="流程图" />
                        <div role="tabpanel" class="tab-content pt-6">
                            ${flowchart}
                        </div>
                        <input type="radio" name="diagram-lab-tabset" role="tab" class="tab font-black" aria-label="拓扑图" />
                        <div role="tabpanel" class="tab-content pt-6">
                            ${topology}
                        </div>
                        <input type="radio" name="diagram-lab-tabset" role="tab" class="tab font-black" aria-label="功能分析图" />
                        <div role="tabpanel" class="tab-content pt-6">
                            ${icom}
                        </div>
                        <input type="radio" name="diagram-lab-tabset" role="tab" class="tab font-black" aria-label="逻辑图" />
                        <div role="tabpanel" class="tab-content pt-6">
                            ${logicGraph}
                        </div>
                        <input type="radio" name="diagram-lab-tabset" role="tab" class="tab font-black" aria-label="网格图" />
                        <div role="tabpanel" class="tab-content pt-6">
                            ${heatmap}
                        </div>
                        <input type="radio" name="diagram-lab-tabset" role="tab" class="tab font-black" aria-label="占比图" />
                        <div role="tabpanel" class="tab-content pt-6">
                            ${proportionCharts}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return `
        <div class="space-y-8">
            ${hero}
            ${tabbed}
        </div>
    `;
}
