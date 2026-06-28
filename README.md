# 算法过程可视化系统

一个基于 Vue 3 的交互式数据结构与算法可视化教学系统。通过动画逐步演示算法的执行过程，并实时高亮对应的 C 语言源代码行，帮助学习者直观理解算法原理。

涵盖 **线性表、栈和队列、树、图、排序、递归与回溯** 六大类，共 **32 个**经典算法与数据结构。

![系统截图](https://via.placeholder.com/800x400?text=算法可视化系统界面)

---

## 🎯 项目亮点

- **完整的教学系统** —— 32个经典算法全覆盖，从基础到进阶
- **沉浸式学习体验** —— Canvas动画 + 代码高亮 + 步骤说明三位一体
- **智能音效反馈** —— Web Audio API音效系统，增强学习感知
- **历史记录追踪** —— 自动记录测试历史，支持导出Markdown报告
- **移动端友好** —— 完全响应式设计，手机平板都能流畅使用
- **专业测试覆盖** —— 75+测试用例，确保算法正确性
- **⚖ 算法对比分析** —— 同一数据集上多算法并行运行，柱状图直观对比操作次数/耗时
- **📚 题目讲解模式** —— 关键步骤弹出讲解文字，标注算法原理与关键点
- **⚠ 输入校验提示** —— 输入错误时友好提示，覆盖范围/格式/合法性检查

---

## ✨ 功能特性

### 核心可视化功能
- **逐步动画演示** —— Canvas绘制算法每一步状态变化，支持播放/暂停/单步/重置
- **代码同步高亮** —— 实时高亮当前执行代码行，左右对照学习
- **步骤说明面板** —— 全步骤列表+文字说明，点击任意步骤跳转
- **多种数据输入** —— 手动输入数组/图/字符串/数值，一键随机生成，预置测试用例

### 智能辅助功能
- **🔊 Web Audio音效** —— 12种音效类型，根据算法操作自动播放（比较/交换/插入/完成等）
- **📊 历史记录导出** —— 自动记录每次算法执行，支持导出完整Markdown测试报告
- **📱 移动端适配** —— 响应式布局，滑出式面板，完美适配手机平板
- **⌨️ 键盘快捷键** —— 空格播放、方向键单步、R重置，提升操作效率

### 信息展示功能
- **播放速度调节** —— 100ms~2000ms可调，适应不同学习节奏
- **复杂度信息** —— 每个算法标注时间/空间复杂度与难度等级
- **进度追踪** —— 实时显示当前步骤/总步骤数
- **测试用例提示** —— 预置典型测试数据，一键加载

### 教学辅助功能（v1.1 新增）
- **⚖ 算法对比** —— 在同一输入数据上同时运行 6 种排序算法，柱状图直观展示总操作次数，详细数据表对比步骤数、比较次数、交换次数、移动次数、耗时，自动得出"最少操作/最快耗时/最少步骤"结论
- **📚 题目讲解模式** —— 覆盖 11 个核心算法（6种排序+汉诺塔+Dijkstra+BFS+DFS+二叉排序树），每个算法定义 3-4 个关键讲解点，包含标题、原理说明、关键点提示；切换讲解模式后底部浮层跟随播放进度自动显示对应讲解
- **⚠ 输入校验与错误提示** —— 四类输入全部校验：数组（元素数 2-20、数值范围）、图（节点数 2-15、自环检测、顶点编号范围）、数字（汉诺塔 1-7 等）、字符串（括号配对、合法字符集）；错误时右上角 Toast 友好提示，3 秒自动消失

### 主题设计
- **大理石奢华主题** —— 暖白大理石背景 + 玄武岩黑 + 金色点缀
- **优雅动画过渡** —— 流畅的界面切换和元素动效
- **一致性设计语言** —— 统一的视觉风格和交互模式

---

## 🛠 技术栈与版本说明

### 核心技术栈

| 类别 | 技术 | 版本 | 说明 |
| --- | --- | --- | --- |
| **运行环境** | Node.js | v18+ | JavaScript运行时环境 |
| **包管理器** | npm | v9+ | Node包管理工具 |
| **前端框架** | Vue | v3.5.13 | 渐进式JavaScript框架（Composition API） |
| **状态管理** | Pinia | v2.3.0 | Vue官方状态管理库 |
| **路由管理** | Vue Router | v4.5.0 | Vue官方路由管理器 |
| **构建工具** | Vite | v6.0.0 | 下一代前端构建工具 |
| **测试框架** | Vitest | v2.1.8 | Vite原生单元测试框架 |
| **可视化** | Canvas 2D API | - | 原生绘图API |
| **音效系统** | Web Audio API | - | 浏览器原生音频API |
| **数据存储** | localStorage | - | 浏览器本地存储API |

### 开发环境配置

```json
{
  "dependencies": {
    "vue": "^3.5.13",         // Vue 3 Composition API
    "vue-router": "^4.5.0",   // SPA路由管理
    "pinia": "^2.3.0"         // 全局状态管理
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.3",  // Vite Vue插件
    "vite": "^6.0.0",                // 构建工具
    "vitest": "^2.1.8"               // 测试框架
  }
}
```

### 编程规范与最佳实践

#### 1. 代码风格规范
- **ES6+ 语法**：使用现代JavaScript特性（箭头函数、模块化、解构赋值等）
- **Vue 3 Composition API**：使用 `<script setup>` 语法糖，代码更简洁
- **函数式编程**：使用纯函数，避免副作用
- **模块化设计**：单一职责原则，组件/函数职责清晰

#### 2. 组件化开发规范
```
src/
├── components/        # 可复用UI组件
│   ├── VisualizationCanvas.vue  # 单一职责：可视化渲染
│   ├── CodePanel.vue            # 单一职责：代码展示
│   ├── StepsPanel.vue           # 单一职责：步骤列表
│   ├── AlgorithmCompare.vue     # 算法对比视图（v1.1）
│   ├── ExplanationPanel.vue     # 题目讲解浮层（v1.1）
│   └── Toast.vue                # 错误提示组件（v1.1）
├── algorithms/        # 算法逻辑模块
│   ├── registry.js              # 算法注册表
│   ├── executor.js              # 执行调度器
│   ├── sorting.js               # 排序算法实现
│   ├── graph.js                 # 图算法实现
│   └── dataStructures.js        # 数据结构实现
├── store/             # 状态管理
│   └── algorithmStore.js        # 全局状态（步骤、播放、讲解、提示）
└── utils/             # 工具函数
    ├── soundService.js          # 音效服务
    ├── historyService.js        # 历史记录服务
    ├── algorithmCompare.js      # 算法对比工具（v1.1）
    ├── teachingContent.js       # 讲解内容库（v1.1）
    └── inputValidator.js        # 输入校验工具（v1.1）
```

#### 3. 注释规范
```javascript
/**
 * 执行冒泡排序算法，生成可视化步骤序列
 * @param {Array<number>} arr - 待排序数组
 * @returns {Array<Object>} 步骤序列，每步包含数组状态和说明
 */
function bubbleSort(arr) {
  // 步骤1：初始化
  const steps = []
  // 步骤2：遍历数组进行比较
  for (let i = 0; i < arr.length; i++) {
    // ... 算法实现
  }
  return steps
}
```

#### 4. 错误处理规范
```javascript
// 输入验证
function runAlgorithm(data) {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('Invalid input: expected non-empty array')
    return []
  }
  // ... 算法执行
}
```

---

## 🚀 快速开始

### 环境要求

#### 必需环境
- **Node.js**: v18.0.0 或更高版本
  - 下载地址: https://nodejs.org/
  - 验证安装: `node --version`
  
- **npm**: v9.0.0 或更高版本（随Node.js安装）
  - 验证安装: `npm --version`

#### 推荐环境
- **VSCode**: 最新版本 + Volar插件（Vue 3语法高亮）
- **浏览器**: Chrome 90+ / Firefox 88+ / Safari 14+（支持现代Web API）

#### 操作系统支持
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+, Debian 10+)

### 安装与运行

#### 步骤1：环境验证
```bash
# 检查Node.js版本（需要v18+）
node --version
# 输出示例: v18.17.0

# 检查npm版本（需要v9+）
npm --version
# 输出示例: v9.6.7
```

#### 步骤2：克隆项目
```bash
# 从GitHub克隆
git clone https://github.com/mx111-jiayou/Algorithm-Visualization.git

# 或从Gitee克隆（国内更快）
git clone https://gitee.com/mx111jiayou/algorithm-visualization.git

# 进入项目目录
cd Algorithm-Visualization
```

#### 步骤3：安装依赖
```bash
# 安装所有依赖包（首次运行必须）
npm install

# 安装过程输出示例：
# added 312 packages in 15s
# 
# 主要依赖：
# - vue@3.5.13
# - pinia@2.3.0
# - vite@6.0.0
# - vitest@2.1.8
```

#### 步骤4：启动开发服务器
```bash
# 启动Vite开发服务器（支持热重载）
npm run dev

# 输出示例：
#   VITE v6.0.0  ready in 500 ms
# 
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: http://192.168.1.100:5173/
#   ➜  press h + enter to show help
```

#### 步骤5：访问应用
- 打开浏览器访问: http://localhost:5173/
- 推荐浏览器: Chrome 90+ / Firefox 88+ / Safari 14+

#### 步骤6：构建生产版本（可选）
```bash
# 构建优化后的生产版本
npm run build

# 输出示例：
# dist/index.html                  0.45 kB
# dist/assets/index-abc123.css     5.23 kB
# dist/assets/index-def456.js      120 kB
# 
# 构建完成时间: 10s

# 本地预览构建产物
npm run preview
# 访问: http://localhost:4173/
```

#### 步骤7：运行测试（可选）
```bash
# 运行所有单元测试
npm run test

# 输出示例：
#  ✓ test/sorting.test.js (25)
#  ✓ test/graph.test.js (20)
#  ✓ test/dataStructures.test.js (30)
# 
#  Tests  75 passed (75)
#  Duration  2.5s

# 监听模式（开发时使用）
npm run test:watch
```

### 在线访问

- **GitHub Pages**: https://mx111-jiayou.github.io/Algorithm-Visualization/
- **Gitee Pages**: https://mx111jiayou.gitee.io/algorithm-visualization/

### 常见问题与解决方案

#### Q1: Node.js版本过低怎么办？
```bash
# 检查当前版本
node --version

# 如果版本低于v18，请升级Node.js：
# Windows/Mac: 从 https://nodejs.org/ 下载最新LTS版本
# Linux: 使用nvm工具安装
nvm install 18
nvm use 18
```

#### Q2: npm install失败怎么办？
```bash
# 清除npm缓存
npm cache clean --force

# 使用国内镜像源（推荐）
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

#### Q3: 开发服务器启动失败？
```bash
# 检查端口占用（5173端口）
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux

# 使用其他端口启动
npm run dev -- --port 5174
```

#### Q4: 构建后页面空白？
```bash
# 检查dist目录是否生成
ls dist/

# 使用preview命令预览（而非直接打开dist/index.html）
npm run preview
```

#### Q5: 测试运行失败？
```bash
# 检查vitest配置
cat vitest.config.js

# 单独运行某个测试文件
npm run test sorting.test.js
```

---

### 编译运行完整流程总结

#### 最小运行步骤（快速体验）
```bash
# 1. 安装Node.js 18+
# 2. 克隆项目
git clone https://gitee.com/mx111jiayou/algorithm-visualization.git
cd algorithm-visualization

# 3. 安装依赖
npm install

# 4. 启动服务器
npm run dev

# 5. 浏览器访问 http://localhost:5173
```

#### 完整开发流程（推荐）
```bash
# 1. 环境准备
node --version  # 确认Node.js 18+
npm --version   # 确认npm 9+

# 2. 获取源码
git clone https://github.com/mx111-jiayou/Algorithm-Visualization.git
cd Algorithm-Visualization

# 3. 安装依赖
npm install

# 4. 开发调试
npm run dev      # 启动开发服务器
npm run test     # 运行测试验证

# 5. 构建发布
npm run build    # 构建生产版本
npm run preview  # 预览构建结果

# 6. 部署上线
# 将dist/目录内容上传到服务器或GitHub Pages
```

#### 项目运行验证清单
- ✅ Node.js v18+ 已安装
- ✅ npm v9+ 已安装
- ✅ 项目依赖已安装（npm install）
- ✅ 开发服务器启动成功（http://localhost:5173）
- ✅ 页面正常显示（顶部导航、左侧控制面板、中间画布）
- ✅ 算法选择和播放功能正常
- ✅ Canvas动画正常渲染
- ✅ 音效播放正常（Web Audio API）
- ✅ 历史记录导出功能正常
- ✅ 测试全部通过（75+用例）

---

---

## 📖 使用说明

### 基本操作流程

1. **选择分类** —— 顶部导航栏切换六大算法分类
2. **选择算法** —— 左侧面板点击具体算法，系统自动加载默认数据
3. **输入数据** —— 手动输入或使用预置用例/随机生成
4. **播放控制** —— 使用按钮或快捷键观看演示
5. **对照学习** —— 观察画布动画、代码高亮、步骤说明联动

### 数据输入格式

| 类型 | 格式示例 | 说明 |
| --- | --- | --- |
| 数组 | `38,27,43,3,9` | 英文逗号分隔 |
| 图 | 节点数: 5，边: `0,1,4`（起点,终点,权重） | 每行一条边 |
| 字符串 | `{[()]}` 或 `3+5*2-1` | 括号匹配/表达式计算 |
| 数值 | `3` | 汉诺塔盘子数/棋盘阶数 |

### 键盘快捷键

| 按键 | 功能 |
| --- | --- |
| `空格` | 播放 / 暂停 |
| `→` | 单步前进 |
| `←` | 单步回退 |
| `R` | 重置 |

### 高级功能

#### 音效控制
- 点击音效按钮（🔊/🔇）开关音效
- 使用音量滑块调节音量
- 自动根据算法操作类型播放对应音效

#### 历史记录导出
1. 点击右上角"📊 导出历史"按钮
2. 选择导出范围（全部/最近10/20/50条）
3. 设置是否包含详细步骤
4. 点击"导出Markdown文档"，自动下载.md文件

#### 算法对比（v1.1 新增）
1. 点击右上角"⚖ 算法对比"按钮进入对比视图
2. 勾选要参与对比的排序算法（默认全选 6 种）
3. 输入数组或点击"随机生成"，调整数组大小
4. 点击"运行对比"，查看柱状图、详细数据表和自动结论

#### 题目讲解模式（v1.1 新增）
1. 选择支持讲解的算法（如冒泡排序、Dijkstra 等 11 个算法）
2. 点击右上角"📚 讲解模式"按钮开启（按钮变金色）
3. 播放算法动画，底部浮层会跟随当前步骤显示讲解
4. 讲解包含步骤标题、原理解释、关键点提示

> 注：不支持讲解的算法按钮会自动禁用。

#### 输入校验提示（v1.1 新增）
- 输入错误数据时，右上角会弹出红色 Toast 提示具体错误
- 校验范围：数组元素数与数值、图节点数与顶点编号、汉诺塔盘子数、括号配对
- 提示 3 秒后自动消失，或可手动点 ✕ 关闭

---

## 📚 算法清单

### 线性表（7个）
- 顺序表-数组
- 单链表（带/不带头节点）
- 双链表（带/不带头节点）
- 循环单链表
- 循环双链表

### 栈和队列（7个）
- 栈-顺序表实现
- 栈-链表实现
- 队列-顺序表实现
- 队列-链表实现
- 循环队列
- 括号匹配
- 表达式计算

### 树结构（3个）
- 二叉树-链式存储
- 二叉排序树（BST）
- 哈夫曼树构造

### 图结构（5个）
- 邻接矩阵
- 邻接链表
- BFS广度优先搜索
- DFS深度优先搜索
- Dijkstra最短路径

### 排序算法（6个）
- 冒泡排序
- 快速排序
- 直接插入排序
- 希尔排序
- 简单选择排序
- 归并排序

### 递归与回溯（4个）
- 汉诺塔
- 棋盘覆盖
- 图着色
- 迷宫求解

---

## 📂 项目结构

```
算法可视化/
├── index.html                 # 入口HTML
├── vite.config.js             # Vite配置
├── package.json               # 项目依赖
├── vitest.config.js           # 测试配置
├── README.md                  # 项目文档
│
├── src/
│   ├── main.js                # 应用入口
│   ├── App.vue                # 主界面组件
│   ├── style.css              # 全局样式
│   │
│   ├── algorithms/            # 算法核心模块
│   │   ├── registry.js        # 算法注册表（元数据）
│   │   ├── executor.js        # 执行调度器
│   │   ├── sorting.js         # 排序算法实现
│   │   ├── graph.js           # 图算法实现
│   │   ├── recursion.js       # 递归回溯实现
│   │   └── dataStructures.js  # 数据结构实现
│   │
│   ├── store/
│   │   └── algorithmStore.js  # Pinia状态管理（含讲解模式/Toast状态）
│   │
│   ├── utils/
│   │   ├── soundService.js    # 音效服务
│   │   ├── historyService.js  # 历史记录服务
│   │   ├── algorithmCompare.js # 算法对比工具 (v1.1)
│   │   ├── teachingContent.js # 讲解内容库 (v1.1)
│   │   └── inputValidator.js  # 输入校验工具 (v1.1)
│   │
│   └── components/
│       ├── VisualizationCanvas.vue  # 可视化画布
│       ├── CodePanel.vue            # 代码面板
│       ├── StepsPanel.vue           # 步骤面板
│       ├── AlgorithmCompare.vue     # 算法对比视图 (v1.1)
│       ├── ExplanationPanel.vue     # 题目讲解浮层 (v1.1)
│       └── Toast.vue                # 错误提示组件 (v1.1)
│
├── test/                      # 测试文件
│   ├── sorting.test.js        # 排序算法测试
│   ├── graph.test.js          # 图算法测试
│   ├── dataStructures.test.js # 数据结构测试
│   ├── executor.test.js       # 执行器测试
│   └── recursion.test.js      # 递归算法测试
│
└── docs/                      # 项目文档
    ├── 成员分工表.md
    ├── 需求分析文档.md
    ├── 任务书.md
    └── 测试说明.md
```

---

## 🧪 测试

### 测试覆盖

项目包含完整的测试框架，覆盖75+测试用例：

- **排序算法测试** (25+用例) —— 功能正确性、边界情况、性能验证
- **图算法测试** (20+用例) —— Dijkstra、BFS、DFS、连通性、环形图
- **数据结构测试** (30+用例) —— 线性表、栈队列、树结构

### 运行测试

```bash
# 运行所有测试
npm run test

# 运行特定测试文件
npm run test sorting.test.js

# 监听模式（开发时使用）
npm run test --watch
```

### 测试文档

详细的测试说明见 [`测试说明.md`](./测试说明.md)

---

## 🎨 主题设计

界面采用「大理石奢华 (Marble Luxury)」配色方案：

| 变量 | 色值 | 用途 |
| --- | --- | --- |
| `--bg-dark` | `#F8F6F3` | 大理石暖白背景 |
| `--primary` | `#1A1A1A` | 玄武岩黑（主色） |
| `--accent` | `#C9A96E` | 金色点缀 |
| `--text-secondary` | `#8A7968` | 灰褐文字 |
| `--success` | `#85BD73` | 绿色（成功） |
| `--danger` | `#C0564B` | 赤陶红（警告） |

如需切换主题，修改 `src/style.css` 的 CSS 变量即可。

---

## 📊 性能优化

- **Canvas优化** —— 分层渲染，减少重绘范围
- **状态管理优化** —— Pinia计算属性缓存，避免重复计算
- **音效优化** —— 音效淡入淡出，避免刺耳
- **存储优化** —— localStorage限制100条记录，防止溢出
- **响应式优化** —— 移动端滑出式面板，减少布局计算

---

## 🔧 开发说明

### 添加新算法

1. 在 `src/algorithms/` 中实现算法步骤生成逻辑
2. 在 `src/algorithms/registry.js` 注册算法元数据
3. 在 `src/components/VisualizationCanvas.vue` 添加渲染函数
4. 在 `test/` 中添加对应测试

### 自定义音效

修改 `src/utils/soundService.js` 的 `getSoundParams` 方法，调整频率、时长、波形类型。

### 导出格式定制

修改 `src/utils/historyService.js` 的 `exportToMarkdown` 方法，自定义报告格式。

---

## 📄 相关文档

- [`成员分工表.md`](./成员分工表.md) —— 团队成员分工
- [`需求分析文档.md`](./需求分析文档.md) —— 需求分析
- [`任务书.md`](./任务书.md) —— 项目任务书
- [`测试说明.md`](./测试说明.md) —— 测试用例说明
- [`算法过程可视化系统_论文格式.md`](./算法过程可视化系统_论文格式.md) —— 课程设计论文

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 更新日志

### v1.1.0 (2026-06-29)
- ✨ 新增算法对比功能（同一数据集上 6 种排序算法并行对比）
- ✨ 新增题目讲解模式（11 个算法关键步骤讲解，底部浮层自动跟随）
- ✨ 新增输入校验与错误提示（四类输入全覆盖，Toast 友好提示）
- ✨ 新增邻接矩阵/邻接链表图形化界面
- 🐛 修复棋盘覆盖、图着色、迷宫求解音效缺失问题

### v1.0.0 (2026-06-25)
- ✅ 完整的32个算法可视化实现
- ✅ Web Audio API音效反馈系统
- ✅ 历史记录导出Markdown功能
- ✅ 移动端响应式适配
- ✅ 完整的测试框架（75+用例）
- ✅ GitHub Pages & Gitee Pages部署

---

## 📌 备注

- 字体通过 Google Fonts 加载，离线环境自动回退到系统字体
- localStorage存储历史记录，清除浏览器数据会丢失历史
- 本项目为课程设计作品，仅用于教学演示
- 部分算法实现为教学简化版本，生产环境请使用优化实现

---

## 📞 联系方式

- 项目地址: [GitHub](https://github.com/mx111-jiayou/Algorithm-Visualization) | [Gitee](https://gitee.com/mx111jiayou/algorithm-visualization)
- 团队成员: 孟欣、李佳乐、宋启悦、冀文卓

---

## 📜 许可证

本项目仅供学习和教学使用，未经授权不得用于商业目的。
