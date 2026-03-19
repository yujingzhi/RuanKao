// 核心变量池
let currentAreaId = 'integration';
const masteredProcesses = new Set(); // 存储已掌握的过程ID

const knowledgeIndex = [];

// 动态主题配色方案 (自适应明暗模式)
const themeStyles = {
    blue: {
        boxBg: "itto-box-blue",
        titleColor: "text-blue-700 dark:text-blue-300",
        bgIconColor: "bg-blue-600 dark:bg-blue-500",
        textIconColor: "text-white",
        badgeColor: "blue"
    },
    emerald: {
        boxBg: "itto-box-emerald",
        titleColor: "text-emerald-700 dark:text-emerald-300",
        bgIconColor: "bg-emerald-600 dark:bg-emerald-500",
        textIconColor: "text-white",
        badgeColor: "emerald"
    },
    orange: {
        boxBg: "itto-box-orange",
        titleColor: "text-orange-700 dark:text-orange-300",
        bgIconColor: "bg-orange-600 dark:bg-orange-500",
        textIconColor: "text-white",
        badgeColor: "orange"
    }
};

// 初始化应用
function initApp() {
    renderSidebar();
    renderArea(currentAreaId);
    initTheme();
    buildKnowledgeIndex();
    initKnowledgeIndexUI();
    initKnowledgePanelUI();
    
    // 监听默写模式切换
    document.getElementById('reciteModeToggle').addEventListener('change', function(e) {
        if (e.target.checked) {
            document.body.classList.add('recitation-mode');
            document.querySelectorAll('.recitation-mode-only').forEach(el => el.classList.remove('hidden'));
        } else {
            document.body.classList.remove('recitation-mode');
            document.querySelectorAll('.recitation-mode-only').forEach(el => el.classList.add('hidden'));
        }
    });

    // 监听黑夜模式切换
    document.getElementById('themeToggle').addEventListener('change', function(e) {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ruankao-theme', theme);
    });
}

function buildKnowledgeIndex() {
    const terms = new Set();
    Object.keys(knowledgeBase || {}).forEach(k => terms.add(k));
    (pmbokData || []).forEach(area => {
        // 处理 ITTO 过程
        (area.processes || []).forEach(process => {
            ['i', 't', 'o'].forEach(typeKey => {
                (process[typeKey] || []).forEach(item => {
                    const text = (item || '').toString().replace('⭐', '');
                    const cleanItem = text.replace(/\(.*?\)/g, '').replace(/（.*?）/g, '').trim();
                    if (cleanItem) terms.add(cleanItem);
                });
            });
        });
        // 处理 核心考点 模式
        (area.knowledgePoints || []).forEach(point => {
            (point.terms || []).forEach(t => {
                const s = (t || '').toString().trim();
                if (s) terms.add(s);
            });
            (point.content || []).forEach(item => {
                const text = (item || '').toString().replace('⭐', '');
                const cleanItem = text.replace(/\(.*?\)/g, '').replace(/（.*?）/g, '').trim();
                if (cleanItem) terms.add(cleanItem);
            });
        });
    });

    knowledgeIndex.length = 0;
    Array.from(terms)
        .filter(t => t.length >= 2)
        .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
        .forEach(t => knowledgeIndex.push(t));
}

function initKnowledgeIndexUI() {
    const btn = document.getElementById('knowledgeIndexBtn');
    const modal = document.getElementById('knowledge-index-modal');
    const search = document.getElementById('knowledgeIndexSearch');

    if (btn && modal) {
        btn.addEventListener('click', () => {
            renderKnowledgeIndexList('');
            if (search) search.value = '';
            modal.showModal();
            if (search) setTimeout(() => search.focus(), 0);
        });
    }

    if (search) {
        search.addEventListener('input', () => {
            renderKnowledgeIndexList(search.value || '');
        });
    }
}

function renderKnowledgeIndexList(query) {
    const list = document.getElementById('knowledgeIndexList');
    if (!list) return;

    const q = normalizeText(query);
    const filtered = q
        ? knowledgeIndex.filter(term => normalizeText(term).includes(q))
        : knowledgeIndex;

    if (!filtered.length) {
        list.innerHTML = `<div class="text-sm opacity-60 px-2 py-6 text-center">没有匹配的术语</div>`;
        return;
    }

    list.innerHTML = filtered.map(term => `
        <button class="btn btn-ghost justify-start w-full text-left font-medium" data-knowledge-term="${term}">
            <span class="truncate">${term}</span>
        </button>
    `).join('');

    list.querySelectorAll('[data-knowledge-term]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const t = e.currentTarget.getAttribute('data-knowledge-term');
            const modal = document.getElementById('knowledge-index-modal');
            if (modal) modal.close();
            window.showKnowledge(t, e);
        });
    });
}

function initKnowledgePanelUI() {
    const overlay = document.getElementById('knowledge-panel-overlay');
    const closeBtn = document.getElementById('knowledge-panel-close');

    if (overlay) overlay.addEventListener('click', closeKnowledgePanel);
    if (closeBtn) closeBtn.addEventListener('click', closeKnowledgePanel);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeKnowledgePanel();
    });
}

function openKnowledgePanel(title, html) {
    const overlay = document.getElementById('knowledge-panel-overlay');
    const panel = document.getElementById('knowledge-panel');
    const titleEl = document.getElementById('knowledge-panel-title');
    const contentEl = document.getElementById('knowledge-panel-content');

    if (!overlay || !panel || !titleEl || !contentEl) return false;

    titleEl.innerText = title || '知识点';
    contentEl.innerHTML = html || '';
    overlay.classList.remove('hidden');
    panel.classList.remove('translate-x-full');
    return true;
}

function closeKnowledgePanel() {
    const overlay = document.getElementById('knowledge-panel-overlay');
    const panel = document.getElementById('knowledge-panel');
    if (!overlay || !panel) return;
    overlay.classList.add('hidden');
    panel.classList.add('translate-x-full');
}

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('ruankao-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').checked = (savedTheme === 'dark');
}

// 渲染左侧导航
function renderSidebar() {
    const sidebarNav = document.getElementById('sidebar-nav');
    sidebarNav.innerHTML = pmbokData.map(area => {
        const count = area.type === 'knowledge' 
            ? (area.knowledgePoints ? area.knowledgePoints.length : 0) 
            : (area.processes ? area.processes.length : 0);
            
        return `
            <li onclick="switchArea('${area.id}')">
                <a id="nav-${area.id}" class="flex items-center justify-between py-3 rounded-xl ${area.id === currentAreaId ? 'active' : ''}">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center">
                            <i class="fa-solid ${area.icon} text-sm"></i>
                        </div>
                        <span class="text-sm font-bold">${area.name}</span>
                    </div>
                    <span class="badge badge-sm badge-ghost opacity-50 font-black">${count}</span>
                </a>
            </li>
        `;
    }).join('');
}

// 切换管理领域
function switchArea(areaId) {
    document.querySelector(`#sidebar-nav a.active`)?.classList.remove('active');
    document.getElementById(`nav-${areaId}`).classList.add('active');
    currentAreaId = areaId;
    renderArea(areaId);
    
    // 移动端点击后自动关闭抽屉
    const drawerToggle = document.getElementById('my-drawer');
    if (drawerToggle.checked) drawerToggle.checked = false;
}

// 渲染主内容区
function renderArea(areaId) {
    const area = pmbokData.find(a => a.id === areaId);
    const container = document.getElementById('processes-container');
    const guideCard = document.getElementById('area-guide-card');
    
    // 更新头部信息
    document.getElementById('area-title').innerText = area.name;
    document.getElementById('area-chapter').innerText = `第 ${area.chapter} 章`;
    document.getElementById('area-desc').innerHTML = area.desc;
    document.getElementById('area-mnemonic').innerText = area.mnemonic;

    // 更新进度
    updateProgress();

    // 渲染卡片 (适配两种模式)
    if (area.type === 'knowledge') {
        if (area.id === 'pm-intro') {
            if (guideCard) guideCard.classList.add('hidden');
            container.innerHTML = renderPmIntroDashboard(area);
            return;
        }
        if (area.id === 'pm-init') {
            if (guideCard) guideCard.classList.add('hidden');
            container.innerHTML = renderPmInitDashboard(area);
            return;
        }
        if (guideCard) guideCard.classList.remove('hidden');
        const hasKnowledgeEntry = (term) => {
            if (!term) return false;
            return Object.prototype.hasOwnProperty.call(knowledgeBase, term);
        };

        const renderTermsRow = (terms) => {
            if (!Array.isArray(terms) || !terms.length) return '';
            const valid = terms.filter(t => hasKnowledgeEntry(t));
            if (!valid.length) return '';
            return `
                <div class="flex flex-wrap gap-2 mb-5">
                    ${valid.map(t => `
                        <button class="btn btn-xs btn-outline" onclick="showKnowledge('${t}', event)">${t}</button>
                    `).join('')}
                </div>
            `;
        };

        const renderList = (items) => {
            return `
                <div class="space-y-3">
                    ${(items || []).map(raw => {
                        const s = (raw || '').toString();
                        const isStar = s.includes('⭐');
                        const text = s.replace('⭐', '');
                        const badgeStyle = isStar ? `bg-primary/10 text-primary font-black px-1.5 rounded-md dark:bg-primary/20 dark:text-blue-300` : '';
                        return `
                            <div class="flex items-start gap-3">
                                <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-none opacity-40"></div>
                                <div class="text-sm leading-relaxed text-base-content/80">
                                    <span class="${badgeStyle}">${text}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        };

        const renderGrid = (items) => {
            return `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${(items || []).map(raw => {
                        const s = (raw || '').toString();
                        const isStar = s.includes('⭐');
                        const text = s.replace('⭐', '');
                        const cleanItem = text.replace(/\(.*?\)/g, '').replace(/（.*?）/g, '').trim();
                        const badgeStyle = isStar ? `bg-primary/10 text-primary font-black px-1.5 rounded-md dark:bg-primary/20 dark:text-blue-300` : '';
                        const canOpen = hasKnowledgeEntry(cleanItem);

                        const spanAttr = canOpen
                            ? `onclick="showKnowledge('${cleanItem}', event)" class="${badgeStyle} cursor-help border-b border-dotted border-base-content/20 hover:border-primary/60 transition-colors"`
                            : `class="${badgeStyle}"`;

                        return `
                            <div class="flex items-start gap-3 p-3 rounded-xl bg-base-200/50 border border-transparent hover:border-primary/20 transition-all group">
                                <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-none opacity-40 group-hover:opacity-100"></div>
                                <span ${spanAttr}>${text}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        };

        container.innerHTML = area.knowledgePoints.map((point, index) => {
            const layout = point.layout || 'grid';
            const contentHtml = layout === 'list'
                ? renderList(point.content)
                : renderGrid(point.content);

            return `
                <div class="card bg-base-100 shadow-xl border border-base-300 animate-slide-up" style="animation-delay: ${index * 0.1}s">
                    <div class="card-body p-0">
                        <div class="px-6 py-5 bg-base-200/30 border-b border-base-300 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="badge badge-outline badge-md font-black opacity-50">${point.id || (index + 1)}</div>
                                <h3 class="text-lg font-black tracking-tight">${point.title}</h3>
                            </div>
                        </div>

                        <div class="p-6">
                            ${renderTermsRow(point.terms)}
                            ${contentHtml}
                        </div>

                        ${point.exam ? `
                        <div class="px-6 py-4 bg-base-200/50 border-t border-base-300">
                            <div class="flex items-start gap-4">
                                <div class="w-8 h-8 rounded-full bg-error/10 flex-none flex items-center justify-center">
                                    <i class="fa-solid fa-circle-exclamation text-error text-xs"></i>
                                </div>
                                <div class="space-y-2 py-1">
                                    ${point.exam.map(e => `
                                        <div class="text-sm text-base-content/80 font-medium">
                                            <span class="badge badge-error badge-sm text-white font-black mr-2">考点</span>
                                            ${e}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } else {
        if (guideCard) guideCard.classList.remove('hidden');
        container.innerHTML = area.processes.map((process, index) => `
            <div id="card-${process.id}" class="card bg-base-100 shadow-xl border border-base-300 animate-slide-up" style="animation-delay: ${index * 0.1}s">
                <!-- 原有的 ITTO 渲染逻辑 -->
                <div class="card-body p-0">
                    <div class="px-6 py-5 bg-base-200/30 border-b border-base-300 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="badge badge-outline badge-md font-black opacity-50">${process.id}</div>
                            <h3 class="text-lg font-black tracking-tight">${process.name}</h3>
                            <div class="badge badge-primary badge-outline text-[10px] font-bold uppercase">${process.group}</div>
                        </div>
                        <div class="flex items-center gap-2">
                            <div id="stats-${process.id}" class="hidden recitation-mode-only text-xs font-black mr-2"></div>
                            <div class="tooltip tooltip-left" data-tip="${masteredProcesses.has(process.id) ? '取消掌握' : '标记已掌握'}">
                                <button onclick="toggleMastery('${process.id}', '${areaId}')" 
                                        class="btn btn-circle btn-sm ${masteredProcesses.has(process.id) ? 'btn-success text-white' : 'btn-ghost border-base-300'}">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ITTO 核心区 -->
                    <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        ${renderIttoSection(process, 'i', '输入 (Inputs)', 'I', 'blue', 'fa-solid fa-arrow-right-to-bracket')}
                        ${renderIttoSection(process, 't', '工具与技术 (T&T)', 'T', 'emerald', 'fa-solid fa-screwdriver-wrench')}
                        ${renderIttoSection(process, 'o', '输出 (Outputs)', 'O', 'orange', 'fa-solid fa-arrow-right-from-bracket')}
                    </div>

                    <!-- 考点提示 -->
                    ${process.exam ? `
                    <div class="px-6 py-4 bg-base-200/50 border-t border-base-300 recitation-hide">
                        <div class="flex items-start gap-4">
                            <div class="w-8 h-8 rounded-full bg-error/10 dark:bg-error/20 flex-none flex items-center justify-center">
                                <i class="fa-solid fa-circle-exclamation text-error dark:text-red-400 text-xs"></i>
                            </div>
                            <div class="space-y-3 py-1">
                                ${process.exam.map(e => `
                                    <div class="text-sm">
                                        <span class="badge badge-error badge-sm text-white font-black mr-2">${e.type}</span>
                                        <span class="text-base-content/80 leading-relaxed font-medium">${e.desc}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

function renderPmIntroDashboard(area) {
    const esc = (s) => (s || '').toString().replace(/'/g, '&#39;');
    const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));
    const has = (term) => Object.prototype.hasOwnProperty.call(knowledgeBase, term);

    const termChips = (terms, size) => {
        const valid = uniq(terms).filter(has);
        if (!valid.length) return '';
        const btnClass = size === 'sm' ? 'btn btn-xs btn-outline' : 'btn btn-sm btn-outline';
        return `
            <div class="flex flex-wrap gap-2">
                ${valid.map(t => `<button class="${btnClass}" onclick="showKnowledge('${esc(t)}', event)">${t}</button>`).join('')}
            </div>
        `;
    };

    const renderList = (items) => `
        <div class="space-y-2">
            ${(items || []).map(x => `
                <div class="flex items-start gap-3">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-none opacity-50"></div>
                    <div class="text-sm text-base-content/80 leading-relaxed">${x}</div>
                </div>
            `).join('')}
        </div>
    `;

    const renderExamList = (items) => {
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
    };

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
            ${conceptCompare}
            ${structure}
            ${roles}
            ${lifecycle}
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

function renderPmInitDashboard(area) {
    const esc = (s) => (s || '').toString().replace(/'/g, '&#39;');
    const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));
    const has = (term) => Object.prototype.hasOwnProperty.call(knowledgeBase, term);

    const termChips = (terms, size) => {
        const valid = uniq(terms).filter(has);
        if (!valid.length) return '';
        const btnClass = size === 'sm' ? 'btn btn-xs btn-outline' : 'btn btn-sm btn-outline';
        return `
            <div class="flex flex-wrap gap-2">
                ${valid.map(t => `<button class="${btnClass}" onclick="showKnowledge('${esc(t)}', event)">${t}</button>`).join('')}
            </div>
        `;
    };

    const renderList = (items) => `
        <div class="space-y-2">
            ${(items || []).map(x => `
                <div class="flex items-start gap-3">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-none opacity-50"></div>
                    <div class="text-sm text-base-content/80 leading-relaxed">${x}</div>
                </div>
            `).join('')}
        </div>
    `;

    const renderExamList = (items) => {
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
    };

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

// 渲染单个 ITTO 区块
function renderIttoSection(process, typeKey, titleStr, iconChar, theme, listIconClass) {
    const expectedArr = process[typeKey];
    const t = themeStyles[theme];

    const renderListItems = (arr) => {
        return arr.map((item, index) => {
            const isStar = item.includes('⭐');
            const text = item.replace('⭐', '');
            const cleanItem = text.replace(/\(.*?\)/g, '').replace(/（.*?）/g, '').trim();
            
            const badgeStyle = isStar ? `bg-primary/10 text-primary font-black px-1.5 rounded-md dark:bg-primary/20 dark:text-blue-300` : '';
            const canOpen = Object.prototype.hasOwnProperty.call(knowledgeBase, cleanItem);
            const interactionAttr = canOpen
                ? `onclick="showKnowledge('${cleanItem}', event)" class="${badgeStyle} cursor-help border-b-2 border-dotted border-primary/30 hover:border-primary/60 dark:border-blue-400/50"`
                : `class="${badgeStyle}"`;
            
            return `
                <li class="flex items-start gap-3 group">
                    <span class="text-[10px] font-black opacity-20 mt-1.5">${(index + 1).toString().padStart(2, '0')}</span>
                    <span ${interactionAttr}>${text}</span>
                </li>`;
        }).join('');
    };

    const viewHtml = `
        <div class="view-mode-element space-y-4 p-4 rounded-2xl ${t.boxBg}">
            <h4 class="flex items-center gap-3 text-xs font-black uppercase tracking-widest ${t.titleColor}">
                <div class="w-6 h-6 rounded-lg ${t.bgIconColor} ${t.textIconColor} flex items-center justify-center text-[10px] shadow-lg shadow-current/20">${iconChar}</div>
                ${titleStr}
            </h4>
            <ul class="text-[13px] space-y-2.5 text-base-content/80 dark:text-white/70">
                ${renderListItems(expectedArr)}
            </ul>
        </div>
    `;

    const reciteHtml = `
        <div class="recite-mode-element space-y-4">
             <h4 class="flex items-center gap-3 text-xs font-black uppercase tracking-widest ${t.titleColor}">
                <div class="w-6 h-6 rounded-lg ${t.bgIconColor} ${t.textIconColor} flex items-center justify-center text-[10px] shadow-lg shadow-current/20">${iconChar}</div>
                ${titleStr}
                <span class="ml-auto badge badge-ghost badge-sm font-normal opacity-50">${expectedArr.length} 项</span>
            </h4>
            <div class="space-y-3">
                ${expectedArr.map((_, idx) => `
                    <div class="flex flex-col gap-1 group">
                        <div class="flex items-center gap-3">
                            <span class="text-[10px] font-black opacity-10">${(idx + 1).toString().padStart(2, '0')}</span>
                            <input type="text" 
                                   data-process-id="${process.id}" 
                                   data-type="${typeKey}" 
                                   class="recite-input w-full text-sm py-1 border-b border-base-content/10 focus:border-primary outline-none bg-transparent placeholder-base-content/10" 
                                   placeholder="记忆填充...">
                        </div>
                        <div class="recite-correct-answer pl-8 hidden"></div>
                    </div>
                `).join('')}
            </div>
            <div class="recite-missing-list pl-8 hidden" data-process-id="${process.id}" data-type="${typeKey}"></div>
        </div>
    `;

    return viewHtml + reciteHtml;
}

function toggleMastery(processId, areaId) {
    if (masteredProcesses.has(processId)) {
        masteredProcesses.delete(processId);
    } else {
        masteredProcesses.add(processId);
    }
    renderArea(areaId); 
}

function updateProgress() {
    const totalProcesses = pmbokData.reduce((acc, area) => {
        const count = area.type === 'knowledge' 
            ? (area.knowledgePoints ? area.knowledgePoints.length : 0) 
            : (area.processes ? area.processes.length : 0);
        return acc + count;
    }, 0);
    const masteredCount = masteredProcesses.size;
    const percentage = totalProcesses > 0 ? Math.round((masteredCount / totalProcesses) * 100) : 0;
    
    const progress = document.getElementById('mastery-progress');
    const text = document.getElementById('mastery-text');
    
    if (progress) progress.value = percentage;
    if (text) text.innerText = `${percentage}%`;
}

// 知识延伸弹窗逻辑
window.showKnowledge = function(term, event) {
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();

    const t = (term || '').toString().trim();
    if (!t) return;

    const data = getKnowledgeData(t);
    const { examPoints, occurrences } = splitKnowledgeExam(data.exam || []);
    const meta = data.meta || {};

    const metaBadges = [
        meta.categoryLabel ? `<span class="badge badge-outline">${meta.categoryLabel}</span>` : '',
        typeof meta.total === 'number' && meta.total > 0 ? `<span class="badge badge-primary badge-outline">出现 ${meta.total} 次</span>` : ''
    ].filter(Boolean).join('');

    const metaLineParts = (typeof meta.total === 'number' && meta.total > 0)
        ? [
            meta.typeHint ? `常见角色：${meta.typeHint}` : '',
            meta.groupHint ? `常见过程组：${meta.groupHint}` : '',
            meta.areaHint ? `常见领域：${meta.areaHint}` : ''
        ].filter(Boolean)
        : [];

    const metaLine = metaLineParts.length
        ? `<div class="text-xs text-base-content/60 mt-2">${metaLineParts.join(' ｜ ')}</div>`
        : '';

    const points = Array.isArray(data.points) ? data.points : [];
    const recite = Array.isArray(data.recite) ? data.recite : [];
    const exams = Array.isArray(examPoints) ? examPoints : [];

    const empty = !points.length && !recite.length && !exams.length && !(occurrences || []).length;
    const safePoints = empty ? [`暂无「${t}」的专门词条，可通过“知识点索引”检索相近术语学习。`] : points;

    const html = `
        <section>
            <div class="flex flex-wrap items-center gap-2">
                ${metaBadges}
            </div>
            ${metaLine}
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div class="border border-base-300 rounded-2xl p-5 bg-base-200/20">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <i class="fa-solid fa-compass text-primary text-sm"></i>
                    </div>
                    <h4 class="text-xs font-black uppercase tracking-widest opacity-60">了解要点</h4>
                </div>
                <ul class="space-y-3 pl-1">
                    ${(safePoints || []).map(p => `
                        <li class="text-sm leading-relaxed flex items-start gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-none"></div>
                            <span class="text-base-content/80">${p}</span>
                        </li>`).join('')}
                </ul>
            </div>

            <div class="border border-base-300 rounded-2xl p-5 bg-base-200/20">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
                        <i class="fa-solid fa-brain text-warning text-sm"></i>
                    </div>
                    <h4 class="text-xs font-black uppercase tracking-widest opacity-60">背诵重点</h4>
                </div>
                <ul class="space-y-3 pl-1">
                    ${(recite || []).length ? (recite || []).map(p => `
                        <li class="text-sm leading-relaxed flex items-start gap-3">
                            <i class="fa-solid fa-star text-warning text-[10px] mt-1.5 flex-none"></i>
                            <span class="text-base-content/80">${p}</span>
                        </li>`).join('') : `<li class="text-sm opacity-60">暂无</li>`}
                </ul>
            </div>
        </section>

        <section class="pt-1">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <i class="fa-solid fa-bullseye text-primary text-sm"></i>
                </div>
                <h4 class="text-xs font-black uppercase tracking-widest opacity-60">高频考点</h4>
            </div>
            <div class="space-y-3">
                ${(exams && exams.length ? exams : ['暂无']).map(p => `
                    <div class="status-box-primary border border-primary/10 rounded-2xl p-4 text-sm flex items-start gap-3 shadow-none">
                        <i class="fa-solid fa-circle-check mt-1"></i>
                        <span class="font-medium">${p}</span>
                    </div>`).join('')}
            </div>
        </section>

        ${(occurrences || []).length ? `
            <section class="pt-1">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-8 h-8 rounded-xl bg-base-200 flex items-center justify-center">
                        <i class="fa-solid fa-location-dot text-base-content/70 text-sm"></i>
                    </div>
                    <h4 class="text-xs font-black uppercase tracking-widest opacity-60">出现位置</h4>
                </div>
                <div class="border border-base-300 rounded-2xl p-4 bg-base-200/20">
                    <ul class="space-y-2 text-sm">
                        ${(occurrences || []).map(x => `
                            <li class="flex items-start gap-3">
                                <span class="badge badge-ghost badge-sm font-black opacity-60 mt-0.5">ITTO</span>
                                <span class="text-base-content/80">${x}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </section>
        ` : ''}
    `;

    if (openKnowledgePanel(t, html)) return;

    const modal = document.getElementById('knowledge-modal');
    const content = document.getElementById('knowledge-content');
    if (!modal || !content) return;
    content.innerHTML = html;
    modal.showModal();
};

function splitKnowledgeExam(examArr) {
    const examPoints = [];
    const occurrences = [];
    (examArr || []).forEach(line => {
        const s = (line || '').toString();
        if (s.startsWith('【出现】')) {
            occurrences.push(s.replace(/^【出现】/g, '').trim());
        } else {
            examPoints.push(s);
        }
    });
    return { examPoints, occurrences };
}

function summarizeOccurrences(occurrences) {
    const groupCounts = {};
    const areaCounts = {};
    (occurrences || []).forEach(o => {
        const g = o.processGroup || '';
        const a = o.area || '';
        if (g) groupCounts[g] = (groupCounts[g] || 0) + 1;
        if (a) areaCounts[a] = (areaCounts[a] || 0) + 1;
    });

    const formatTop = (counts, maxItems) => Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxItems)
        .map(([k, v]) => `${k}${v}`)
        .join(' / ');

    return {
        groupCounts,
        areaCounts,
        groupHint: formatTop(groupCounts, 3),
        areaHint: formatTop(areaCounts, 3)
    };
}

function getKnowledgeData(term) {
    const data = knowledgeBase[term];
    const occurrences = findTermOccurrences(term);
    const total = occurrences.length;
    const typeCount = occurrences.reduce((acc, o) => {
        acc[o.type] = (acc[o.type] || 0) + 1;
        return acc;
    }, {});

    const typeHint = [
        typeCount.i ? `输入${typeCount.i}` : null,
        typeCount.t ? `工具与技术${typeCount.t}` : null,
        typeCount.o ? `输出${typeCount.o}` : null
    ].filter(Boolean).join(' / ');

    const occurrenceLines = total
        ? occurrences.slice(0, 12).map(o => `【出现】${o.area} · ${o.processId} ${o.processName}（${o.typeLabel}）`)
        : [];

    const categoryLabel = detectTermCategory(term || '').label || '';
    const summary = summarizeOccurrences(occurrences);
    const meta = {
        term,
        total,
        typeHint,
        categoryLabel,
        groupHint: summary.groupHint,
        areaHint: summary.areaHint
    };

    if (data) {
        const merged = {
            points: Array.isArray(data.points) ? [...data.points] : [],
            recite: Array.isArray(data.recite) ? [...data.recite] : [],
            exam: Array.isArray(data.exam) ? [...data.exam] : [],
            meta
        };

        if (occurrenceLines.length) merged.exam.push(...occurrenceLines);
        return merged;
    }

    const generated = generateKnowledgeData(term, occurrences, typeHint);
    generated.meta = meta;
    return generated;
}

function generateKnowledgeData(term, occurrences, typeHint) {
    const total = occurrences.length;
    const roleSummary = total ? `在 ITTO 中常作为：<strong>${typeHint || '输入/工具与技术/输出'}</strong>` : '在 ITTO 中的角色：需要结合具体过程判断。';
    const name = term || '';

    const category = detectTermCategory(name);
    const common = getCategoryCommonPoints(category, name);
    const confusion = getCommonConfusions(category, name);
    const memory = getReciteHints(category, name, typeHint, total);
    const exam = getExamHints(category, name, total, occurrences);

    const points = [
        `术语：<strong>${name}</strong>`,
        category.label ? `类型归类：<strong>${category.label}</strong>` : '类型归类：通用术语/项目管理名词',
        roleSummary,
        ...common,
        ...confusion
    ].filter(Boolean);

    const occurrenceLines = total
        ? occurrences.slice(0, 12).map(o => `【出现】${o.area} · ${o.processId} ${o.processName}（${o.typeLabel}）`)
        : [];

    const result = {
        points,
        recite: memory,
        exam: [...exam, ...occurrenceLines]
    };
    return ensureMinimumKnowledgeDepth(result, name, category, total);
}

function detectTermCategory(term) {
    const t = term || '';
    if (t === '可交付成果' || t.includes('可交付成果')) return { key: 'deliverable', label: '可交付成果' };
    if (t.includes('工作分解结构') || t.includes('WBS')) return { key: 'wbs', label: '工作分解结构（WBS）' };
    if (t.endsWith('说明书')) return { key: 'statement', label: '说明书/文档' };
    if (t === '需求文件') return { key: 'requirements', label: '需求文件' };
    if (t === '需求跟踪矩阵') return { key: 'rtm', label: '需求跟踪矩阵' };
    if (t === '核实的可交付成果') return { key: 'verified_deliverables', label: '核实的可交付成果' };
    if (t === '验收的可交付成果') return { key: 'accepted_deliverables', label: '验收的可交付成果' };
    if (t === '事业环境因素') return { key: 'eef', label: '事业环境因素' };
    if (t === '组织过程资产') return { key: 'opa', label: '组织过程资产' };
    if (t.includes('项目管理计划') || t.endsWith('管理计划') || t.endsWith('计划')) return { key: 'plan', label: '计划/子计划' };
    if (t.endsWith('基准')) return { key: 'baseline', label: '基准' };
    if (t.includes('登记册')) return { key: 'register', label: '登记册' };
    if (t.includes('日志')) return { key: 'log', label: '日志' };
    if (t.includes('矩阵')) return { key: 'matrix', label: '矩阵' };
    if (t.includes('报告')) return { key: 'report', label: '报告' };
    if (t.includes('数据')) return { key: 'data', label: '数据' };
    if (t.includes('信息')) return { key: 'info', label: '信息' };
    if (t === '专家判断') return { key: 'tool_expert', label: '工具与技术：专家判断' };
    if (t === '会议') return { key: 'tool_meeting', label: '工具与技术：会议' };
    if (t === '数据分析') return { key: 'tool_analysis', label: '工具与技术：数据分析' };
    if (t === '数据收集') return { key: 'tool_collect', label: '工具与技术：数据收集' };
    if (t === '数据表现') return { key: 'tool_display', label: '工具与技术：数据表现' };
    if (t === '决策') return { key: 'tool_decision', label: '工具与技术：决策' };
    if (t === '人际关系与团队技能') return { key: 'tool_people', label: '工具与技术：人际关系与团队技能' };
    if (t === '项目管理信息系统') return { key: 'tool_pmis', label: '工具与技术：项目管理信息系统' };
    if (t.includes('协议') || t.includes('合同')) return { key: 'agreement', label: '协议/合同类输入输出' };
    if (t.includes('变更请求')) return { key: 'change', label: '变更请求' };
    return { key: 'generic', label: '' };
}

function getCategoryCommonPoints(category, term) {
    const key = category.key;
    const t = term || '';

    if (key === 'eef') {
        return [
            '定义：来自组织外部或内部环境的条件，对项目产生约束或提供条件。',
            '常见维度：组织文化与结构、市场条件、法规政策、基础设施与资源可得性等。',
            '在 ITTO 中常作为输入，帮助制定计划、评估影响或约束决策边界。',
            '记忆抓手：EEF 是“环境”，项目团队一般<strong>不能直接更新</strong>它，只能识别并适配。',
            '答题抓手：题干出现“政策/法规变化、市场波动、组织结构调整、资源可得性”，优先考虑 EEF。'
        ];
    }

    if (key === 'opa') {
        return [
            '定义：组织沉淀的过程、模板、政策、知识与经验资产，为项目提供“可复用的做法”。',
            '常见内容：流程与规范、模板/表单、历史数据库、经验教训、配置管理知识库等。',
            '在 ITTO 中既常作为输入（复用组织资产），也可能作为输出被更新（沉淀经验）。',
            '记忆抓手：OPA 往往会在项目执行/收尾阶段被<strong>更新并沉淀</strong>，用于“反哺组织”。',
            '答题抓手：题干出现“模板/历史数据/经验教训/标准流程/知识库”，优先考虑 OPA。'
        ];
    }

    if (key === 'plan') {
        return [
            '定义：用于规定“怎么做、谁来做、做到什么程度”，属于项目管理计划或其子计划。',
            '与“项目文件”区别：计划偏<strong>规则与策略</strong>；文件偏<strong>记录与产出</strong>。',
            '常见结构：方法与流程、角色与职责、阈值与标准、沟通与审批机制。',
            '变更要点：计划通常受配置管理与整体变更控制影响，调整需要更严格的审批与版本管理。'
        ];
    }

    if (key === 'baseline') {
        return [
            '定义：经批准的版本，用于后续对比与控制，回答“现在偏离了吗？偏了多少？”。',
            '常见：范围基准 / 进度基准 / 成本基准；基准不是随便改，调整通常需要走变更流程。',
            '在监控过程组中，基准是偏差分析与预测的“对比尺”。',
            '做题抓手：题干出现“与基准比较”“偏差分析”“控制范围/进度/成本”，通常指向监控类过程与数据分析。'
        ];
    }

    if (key === 'register') {
        return [
            '定义：登记册用于结构化记录某一类信息，并在项目全生命周期持续维护。',
            '典型字段：条目、状态、责任人、触发条件、更新时间、关联文档/决策。',
            '常见做题口径：登记册通常“产生于某过程”，后续过程不断更新；题干出现“登记、维护、跟踪”，优先联想到登记册。',
            '背诵抓手：登记册更像“清单 + 状态”，强调持续更新与责任人。'
        ];
    }

    if (key === 'log') {
        return [
            '定义：日志强调“动态记录”，用于跟踪随时间变化的信息与决策依据。',
            '典型字段：日期、事件/事实、影响、责任人、处理动作、结果与关闭条件。',
            '常见：假设日志、问题日志、变更日志等；题干出现“记录假设/记录问题/跟踪处理”，优先联想到日志。',
            '背诵抓手：日志 = 时间线 + 状态变化 + 责任人/处理动作。'
        ];
    }

    if (key === 'matrix') {
        return [
            '定义：矩阵用于“映射关系”，把两个或多个维度建立可追踪链接。',
            '常见：需求跟踪矩阵（需求 ⇄ 交付物/测试/验收标准），责任分配矩阵（工作 ⇄ 角色）。',
            '做题抓手：题干出现“追踪”“对应”“关联”“覆盖”，通常需要矩阵类工件。'
        ];
    }

    if (key === 'requirements') {
        return [
            '定义：需求文件用于记录干系人/客户对产品与项目的需求（功能、非功能、约束、接口、验收等）。',
            '常由收集需求过程输出，用于范围定义、WBS 分解、测试与验收等活动。',
            '质量要求：明确、可验证、可追踪、可测量，避免“笼统、不可验收”的描述。',
            '常见分类：业务需求、干系人需求、解决方案需求（功能/非功能）、过渡与项目需求。',
            '答题抓手：题干出现“上线后发现漏功能、需求反复变更、验收争议”，往往是需求文件或跟踪机制不完善。'
        ];
    }

    if (key === 'rtm') {
        return [
            '定义：需求跟踪矩阵用于把“需求”与“交付物/设计/测试/验收标准”等建立对应关系。',
            '核心价值：确保需求不遗漏、不重复、不镀金；同时能做影响分析（变更牵一发动全身）。',
            '用法抓手：需求→WBS→测试用例→验收标准，任一环节缺失都可能导致漏测/漏验收。',
            '常见字段：需求编号、来源、优先级、状态、对应交付物、验证方式、验收人。',
            '答题抓手：题干出现“需求可追踪性、覆盖率、影响分析”，优先选需求跟踪矩阵。'
        ];
    }

    if (key === 'wbs') {
        return [
            '定义：工作分解结构（WBS）是以可交付成果为导向的分解，用于把项目范围逐层细化到可管理的工作包。',
            '核心原则：100% 原则；WBS 覆盖全部范围，层级之间不重叠、不遗漏。',
            '关键术语：底层节点为“工作包”；管理控制点为“控制账户”。',
            '作用：便于估算、排程、分派责任、控制范围与防止范围蔓延。',
            '答题抓手：题干出现“范围分解、工作包、控制账户、100%原则”，优先联想到 WBS。'
        ];
    }

    if (key === 'deliverable') {
        return [
            '定义：可交付成果是为完成项目或阶段而产生的独特、可核实的产品、服务或成果。',
            '与活动区别：活动是“做什么”；可交付成果是“产出什么”。',
            '与里程碑区别：里程碑是“时间点”；可交付成果是“产出物”。',
            '生命周期：产生→质量控制核实→范围确认验收→移交与收尾。',
            '答题抓手：题干出现“交付、验收、移交、成果”，重点围绕可交付成果及其核实/验收。'
        ];
    }

    if (key === 'verified_deliverables') {
        return [
            '定义：核实的可交付成果是经过控制质量过程检查/测试后，确认符合质量标准的成果。',
            '定位：先核实（内部质量控制），再验收（客户/发起人确认范围）。',
            '常见产出路径：控制质量 → 核实的可交付成果 → 确认范围 → 验收的可交付成果。',
            '答题抓手：题干强调“内部检查/测试通过”，通常对应核实的可交付成果。',
            '易错点：不要把“核实的”与“验收的”混淆。'
        ];
    }

    if (key === 'accepted_deliverables') {
        return [
            '定义：验收的可交付成果是经客户/发起人确认范围并正式接受的成果。',
            '定位：范围确认关注“是否满足验收标准”；质量控制关注“是否符合质量要求”。',
            '常见产出路径：控制质量 → 核实的可交付成果 → 确认范围 → 验收的可交付成果。',
            '答题抓手：题干出现“客户签字、正式验收、提交验收单”，对应验收的可交付成果。',
            '易错点：先 QC 后确认范围；顺序错是经典陷阱。'
        ];
    }

    if (key === 'report') {
        return [
            '定义：报告面向干系人，用于传达汇总后的状态、偏差、预测与决策建议。',
            '与“数据/信息”区分：报告一般是<strong>对信息的整理呈现</strong>，偏决策与沟通。',
            '做题抓手：题干出现“向管理层汇报/发布报告/例会汇报材料”，优先想到报告。'
        ];
    }

    if (key === 'data') {
        return [
            '数据通常是最原始的观察值或记录，未经解释与汇总。',
            '与信息/报告区分：数据→（分析/整合）→信息→（汇总呈现）→报告。',
            '做题抓手：题干出现“采集数据/记录测量值/原始记录”，优先想到数据。'
        ];
    }

    if (key === 'info') {
        return [
            '信息是对数据进行分析、整合后的结果，可用于判断当前状态。',
            '与数据/报告区分：信息强调“解释后的含义”，报告强调“面向干系人的呈现”。',
            '做题抓手：题干出现“分析后得出”“解释原因”“形成结论”，多为信息。'
        ];
    }

    if (key === 'tool_expert') {
        return [
            '依靠领域专家/经验人员进行判断，补足数据不足或不确定性较高的情境。',
            '常用于：制定计划、评估影响、识别问题与风险、形成决策建议。',
            '做题抓手：题干出现“请资深专家评审/判断”“凭经验估算”，多为专家判断。'
        ];
    }

    if (key === 'tool_meeting') {
        return [
            '会议用于对齐认知、澄清分歧、形成共识与决策记录。',
            '常用于：启动会、规划评审会、变更评审会、回顾与经验教训会议等。',
            '做题抓手：题干出现“召开会议讨论并形成决议/纪要”，大概率是会议工具。'
        ];
    }

    if (key === 'tool_analysis') {
        return [
            '数据分析用于从数据/信息中识别偏差、趋势、原因与预测，支撑决策。',
            '常见目的：偏差分析、根因分析、趋势分析、备选方案分析。',
            '做题抓手：题干出现“分析原因/算指标/做预测”，优先联想到数据分析。'
        ];
    }

    if (key === 'tool_collect') {
        return [
            '数据收集强调“获取信息的手段”，把需求/意见/度量结果收上来。',
            '常见方式：访谈、焦点小组、问卷调查、检查表、标杆对照等。',
            '做题抓手：题干出现“访谈、问卷、焦点小组”一类，属于数据收集范畴。'
        ];
    }

    if (key === 'tool_display') {
        return [
            '数据表现用于把信息可视化（表格/图形/矩阵），提升沟通效率与洞察。',
            '常见形式：趋势图、直方图、鱼骨图、控制图、矩阵图等。',
            '做题抓手：题干出现“用图表展示”“可视化”，通常对应数据表现。'
        ];
    }

    if (key === 'tool_decision') {
        return [
            '决策用于在备选方案之间作出选择，并记录选择依据与责任。',
            '常见方法：投票、排序、加权评分模型、决策树等。',
            '做题抓手：题干出现“选择方案/优先级排序/加权评分”，多为决策。'
        ];
    }

    if (key === 'tool_people') {
        return [
            '人际关系与团队技能用于沟通协作、谈判冲突、引导会议与管理干系人期望。',
            '常见关键词：谈判、引导、冲突管理、团队建设、影响力。',
            '做题抓手：题干强调“协调、沟通、说服、谈判”，优先考虑此类技能。'
        ];
    }

    if (key === 'tool_pmis') {
        return [
            '项目管理信息系统用于计划编制、执行跟踪、信息汇总与报告发布的系统支撑。',
            '可能包含：进度/成本工具、配置管理、文档管理、协同与仪表盘等能力。',
            '做题抓手：题干出现“系统自动汇总、生成报表、配置控制平台”，多指 PMIS。'
        ];
    }

    if (key === 'agreement') {
        return [
            '协议/合同用于明确双方权责、交付标准、付款与变更条款，是重要的约束性文件。',
            '常与采购过程联动：招标、选定卖方、签订合同、履约与索赔。',
            '做题抓手：题干出现“合同条款、索赔、付款、违约责任”，优先联想到协议/合同。'
        ];
    }

    if (key === 'change') {
        return [
            '变更请求是对范围/进度/成本/质量/资源等基准或计划的调整申请。',
            '通常流程：提出→评估影响→审批→执行→记录与通知。',
            '做题抓手：题干出现“未经审批私自修改/直接加需求”，答案多指“走变更控制流程”。'
        ];
    }

    return [];
}

function getCommonConfusions(category, term) {
    const key = category.key;
    const t = term || '';

    if (t === '工作绩效数据' || t === '工作绩效信息' || t === '工作绩效报告') {
        return [
            '高频辨析：工作绩效数据（原始记录）→工作绩效信息（分析后的状态）→工作绩效报告（面向干系人的汇总呈现）。'
        ];
    }

    if (key === 'plan' && (t.includes('范围') || t.includes('进度') || t.includes('成本'))) {
        return [
            '高频辨析：管理计划（怎么管理）≠基准（批准后的对比标准）。题干问“控制偏差”优先找基准。'
        ];
    }

    if (key === 'baseline') {
        return [
            '高频辨析：基准不是“当前计划版本”，而是“经批准的对比标准”，变更基准通常需要审批。'
        ];
    }

    if (key === 'register' && t.includes('干系人')) {
        return [
            '高频辨析：干系人登记册偏“谁+属性”；干系人参与计划偏“怎么让他们参与”。'
        ];
    }

    if (key === 'matrix' && t.includes('需求')) {
        return [
            '高频辨析：需求文件记录“需求是什么”；需求跟踪矩阵保证“需求到交付/测试/验收可追踪”。'
        ];
    }

    if (t === '核实的可交付成果' || t === '验收的可交付成果') {
        return [
            '高频辨析：控制质量输出“核实的可交付成果”；确认范围输出“验收的可交付成果”。先 QC，后确认范围。'
        ];
    }

    return [];
}

function getReciteHints(category, term, typeHint, total) {
    const key = category.key;
    const t = term || '';
    const hints = [];

    if (total > 0) {
        hints.push(`位置抓手：它在 ITTO 中主要作为【${typeHint || '输入/工具/输出'}】出现。`);
    }

    if (key === 'plan') {
        hints.push('口诀：计划 = 规则/策略/流程；题干出现“怎么管理、按什么标准做”先想计划。');
    } else if (key === 'baseline') {
        hints.push('口诀：基准 = 对比尺；题干出现“偏差/预测/控制”先找基准。');
    } else if (key === 'register') {
        hints.push('口诀：登记册 = 清单 + 状态；题干出现“登记、跟踪、责任人”先想登记册。');
    } else if (key === 'log') {
        hints.push('口诀：日志 = 时间线；题干出现“记录、更新、追踪处理”先想日志。');
    } else if (key === 'eef') {
        hints.push('口诀：EEF = 环境约束；更多是识别与适配，不是项目团队自己制定。');
    } else if (key === 'opa') {
        hints.push('口诀：OPA = 组织沉淀；能复用，也常在项目执行/收尾被更新。');
    } else if (key === 'change') {
        hints.push('口诀：变更 = 先评估后审批再执行；不走流程就是典型错误点。');
    }

    return hints;
}

function getExamHints(category, term, total, occurrences) {
    const key = category.key;
    const t = term || '';

    const lines = [];
    if (key === 'eef') lines.push('常考：区分事业环境因素与组织过程资产；EEF 偏环境约束与条件。');
    if (key === 'opa') lines.push('常考：组织过程资产常作为输入，也可能作为输出被更新沉淀。');
    if (key === 'plan') lines.push('常考：计划与文件的区别；计划强调“怎么做”，文件强调“记录什么”。');
    if (key === 'baseline') lines.push('常考：基准用于控制与绩效比较，调整基准通常需要走变更流程。');
    if (key === 'register') lines.push('常考：登记册是持续维护的记录载体，往往“创建于某过程”，后续过程不断更新。');
    if (key === 'log') lines.push('常考：日志用于跟踪动态信息（假设、问题、变更等），强调状态与时间线。');
    if (key === 'matrix') lines.push('常考：矩阵用于建立映射关系，题干出现“可追踪/覆盖/对应”优先选矩阵。');
    if (key === 'data') lines.push('常考：数据/信息/报告的层级关系；数据是最原始记录。');
    if (key === 'info') lines.push('常考：信息是分析整合后的结论，报告是面向干系人的呈现物。');
    if (key === 'report') lines.push('常考：报告通常用于干系人沟通，强调汇总、预测与决策建议。');
    if (key === 'change') lines.push('常考：未经审批私自变更是错误操作；应按整体变更控制流程处理。');
    if (key === 'requirements') lines.push('常考：需求文件与需求跟踪矩阵的作用区分；缺少跟踪会导致漏功能/漏验收。');
    if (key === 'rtm') lines.push('常考：需求可追踪性、覆盖率、影响分析，优先选择需求跟踪矩阵。');
    if (key === 'wbs') lines.push('常考：100%原则、工作包、控制账户；WBS 是范围基准的重要组成。');
    if (key === 'deliverable') lines.push('常考：活动≠可交付成果；里程碑是时间点，成果是产出物。');
    if (key === 'verified_deliverables') lines.push('常考：先 QC 得到核实的可交付成果，再确认范围得到验收的可交付成果。');
    if (key === 'accepted_deliverables') lines.push('常考：客户/发起人验收并接受的成果，常与验收标准、签字确认关联。');

    if (t === '工作绩效数据' || t === '工作绩效信息' || t === '工作绩效报告') {
        lines.push('高频辨析：数据→信息→报告，题干问“给干系人看”通常选报告。');
    }

    if (!total) return lines;

    const hot = occurrences.slice(0, 3).map(o => `${o.processId} ${o.processName}`).join('、');
    if (hot) lines.push(`高频出现过程（示例）：${hot}。`);
    return lines;
}

function ensureMinimumKnowledgeDepth(data, term, category, total) {
    const points = Array.isArray(data.points) ? [...data.points] : [];
    const recite = Array.isArray(data.recite) ? [...data.recite] : [];
    const exam = Array.isArray(data.exam) ? [...data.exam] : [];

    // 移除无意义的凑数逻辑，保持内容精简和专业
    if (points.length === 0) {
        points.push(`<strong>${term}</strong> 是项目管理中的重要概念，请结合其在具体过程中的上下文进行理解。`);
    }

    return { ...data, points, recite, exam };
}

function findTermOccurrences(term) {
    const result = [];
    const target = normalizeText(term);
    if (!target) return result;

    (pmbokData || []).forEach(area => {
        (area.processes || []).forEach(process => {
            ['i', 't', 'o'].forEach(typeKey => {
                (process[typeKey] || []).forEach(item => {
                    const cleanItem = (item || '').toString()
                        .replace(/⭐/g, '')
                        .replace(/\(.*?\)/g, '')
                        .replace(/（.*?）/g, '')
                        .trim();
                    if (normalizeText(cleanItem) === target) {
                        result.push({
                            area: area.name,
                            processId: process.id,
                            processName: process.name,
                            processGroup: process.group,
                            type: typeKey,
                            typeLabel: typeKey === 'i' ? '输入' : typeKey === 't' ? '工具与技术' : '输出'
                        });
                    }
                });
            });
        });
    });

    return result;
}

// 默写模式校验逻辑
window.checkRecitation = function(processId) {
    const card = document.getElementById(`card-${processId}`);
    const area = pmbokData.find(a => a.processes.some(p => p.id === processId));
    const process = area.processes.find(p => p.id === processId);
    
    let totalItems = 0;
    let correctCount = 0;

    card.querySelectorAll('.recite-input').forEach(input => input.classList.remove('recite-result-correct', 'recite-result-wrong'));
    card.querySelectorAll('.recite-correct-answer').forEach(el => {
        el.classList.add('hidden');
        el.innerHTML = '';
    });
    card.querySelectorAll('.recite-missing-list').forEach(el => {
        el.classList.add('hidden');
        el.innerHTML = '';
    });

    // 校验每个类型的 ITTO
    ['i', 't', 'o'].forEach(type => {
        const expectedRaw = (process[type] || []).map(item => (item || '').toString().replace(/⭐/g, ''));
        const expectedCounts = new Map();
        const expectedDisplay = new Map();
        expectedRaw.forEach(raw => {
            const clean = raw.replace(/\(.*?\)/g, '').replace(/（.*?）/g, '').trim();
            const key = normalizeText(clean);
            if (!key) return;
            expectedCounts.set(key, (expectedCounts.get(key) || 0) + 1);
            if (!expectedDisplay.has(key)) expectedDisplay.set(key, clean);
        });

        const inputs = Array.from(card.querySelectorAll(`.recite-input[data-type="${type}"]`));
        totalItems += expectedRaw.length;

        inputs.forEach(inputEl => {
            const rawValue = (inputEl.value || '').toString().trim();
            if (!rawValue) return;

            const tokens = splitReciteTerms(rawValue);
            if (!tokens.length) return;

            let allMatched = true;
            let anyMatched = false;

            tokens.forEach(token => {
                const key = normalizeText(token);
                if (!key) return;
                const left = expectedCounts.get(key) || 0;
                if (left > 0) {
                    expectedCounts.set(key, left - 1);
                    correctCount++;
                    anyMatched = true;
                } else {
                    allMatched = false;
                }
            });

            if (anyMatched && allMatched) {
                inputEl.classList.add('recite-result-correct');
            } else {
                inputEl.classList.add('recite-result-wrong');
            }
        });

        const missing = [];
        expectedCounts.forEach((count, key) => {
            const label = expectedDisplay.get(key) || key;
            for (let i = 0; i < count; i++) missing.push(label);
        });

        const missingEl = card.querySelector(`.recite-missing-list[data-type="${type}"]`);
        if (missingEl) {
            if (missing.length) {
                missingEl.classList.remove('hidden');
                missingEl.innerHTML = `<div class="recite-result-missing">未匹配答案：${missing.join('、')}</div>`;
            } else {
                missingEl.classList.add('hidden');
                missingEl.innerHTML = '';
            }
        }
    });

    // 更新统计信息
    const accuracy = Math.round((correctCount / totalItems) * 100);
    const statsEl = document.getElementById(`stats-${processId}`);
    statsEl.classList.remove('hidden');
    statsEl.innerHTML = `
        <span class="badge ${accuracy === 100 ? 'badge-success' : 'badge-warning'} badge-sm font-black">
            正确率 ${accuracy}%
        </span>
    `;

    // 禁用输入
    card.querySelectorAll('.recite-input').forEach(input => input.disabled = true);
};

window.resetRecitation = function(processId) {
    const card = document.getElementById(`card-${processId}`);
    card.querySelectorAll('.recite-input').forEach(input => {
        input.value = '';
        input.disabled = false;
        input.classList.remove('recite-result-correct', 'recite-result-wrong');
    });
    card.querySelectorAll('.recite-correct-answer').forEach(el => {
        el.classList.add('hidden');
        el.innerHTML = '';
    });
    card.querySelectorAll('.recite-missing-list').forEach(el => {
        el.classList.add('hidden');
        el.innerHTML = '';
    });
    document.getElementById(`stats-${processId}`).classList.add('hidden');
};

function splitReciteTerms(text) {
    return (text || '')
        .toString()
        .split(/[\n,，;；、/|]+/g)
        .map(s => s.trim())
        .filter(Boolean);
}

// 文本标准化工具 (更科学的文本匹配算法)
function normalizeText(text) {
    if (!text) return "";
    const s = text.toString()
        .replace(/⭐/g, '') // 去除星号
        .replace(/\(.*?\)/g, '') // 去除英文括号及内容
        .replace(/（.*?）/g, '') // 去除中文括号及内容
        .replace(/相关方/g, '干系人')
        .replace(/制定/g, '制订')
        .replace(/[和及]/g, '与')
        .replace(/[\s\p{P}]/gu, '') // 去除所有空白字符、中英文标点符号
        .toLowerCase() // 转换为小写（针对可能存在的英文术语）
        .trim();
    return s;
}

// 启动
document.addEventListener('DOMContentLoaded', initApp);
