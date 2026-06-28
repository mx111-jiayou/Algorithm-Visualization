<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="top-bar">
      <div class="logo">
        <span class="logo-icon">◇</span>
        <span class="logo-text">算法过程可视化系统</span>
      </div>
      <nav class="tab-bar">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="tab-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span class="tab-icon">{{ cat.icon }}</span>
          {{ cat.name }}
        </button>
      </nav>
      <div class="top-actions">
        <button
          class="btn-compare"
          :class="{ active: compareMode }"
          @click="toggleCompareMode"
          title="算法对比"
        >
          ⚖ 算法对比
        </button>
        <button class="btn-export" @click="showExportModal = true" title="导出测试历史">
          📊 导出历史
        </button>
      </div>
    </header>

    <!-- 算法对比视图 -->
    <div v-if="compareMode" class="compare-view">
      <AlgorithmCompare />
    </div>

    <div v-else class="main-layout">
      <!-- 左侧控制面板 -->
      <aside class="left-panel">
        <!-- 算法选择 -->
        <div class="panel-section">
          <div class="panel-title">选择算法</div>
          <div class="algo-list">
            <button
              v-for="algo in currentCategoryAlgos"
              :key="algo.id"
              class="algo-btn"
              :class="{ active: store.currentAlgoId === algo.id }"
              @click="selectAlgorithm(algo)"
            >
              <span class="algo-name">{{ algo.name }}</span>
              <span class="difficulty-badge" :class="algo.difficulty">{{ algo.difficulty }}</span>
            </button>
          </div>
        </div>

        <!-- 输入数据 -->
        <div class="panel-section" v-if="currentAlgo">
          <div class="panel-title">输入数据</div>
          <div v-if="currentAlgo.inputType === 'array'" class="input-group">
            <input v-model="arrayInput" placeholder="如: 38,27,43,3,9" class="data-input" />
            <div class="input-actions">
              <button class="btn btn-sm" @click="applyArrayInput">使用输入</button>
              <button class="btn btn-sm btn-accent" @click="randomData">随机生成</button>
            </div>
          </div>
          <div v-else-if="currentAlgo.inputType === 'graph'" class="input-group">
            <div class="graph-input">
              <label>节点数: <input v-model.number="graphNodes" type="number" min="2" max="15" class="num-input" /></label>
              <label>源点: <input v-model.number="graphSource" type="number" min="0" class="num-input" /></label>
            </div>
            <textarea v-model="graphEdgesInput" placeholder="起点,终点,权重 (每行一条)" class="data-textarea" rows="4"></textarea>
            <div class="input-actions">
              <button class="btn btn-sm" @click="applyGraphInput">使用输入</button>
              <button class="btn btn-sm btn-accent" @click="randomData">随机图</button>
            </div>
          </div>
          <div v-else-if="currentAlgo.inputType === 'number'" class="input-group">
            <label>{{ currentAlgo.id === 'hanoi' ? '盘子数' : '参数k' }}:
              <input v-model.number="numberInput" type="number" :min="1" :max="currentAlgo.id === 'hanoi' ? 7 : 4" class="num-input" />
            </label>
            <div class="input-actions">
              <button class="btn btn-sm" @click="applyNumberInput">使用输入</button>
            </div>
          </div>
          <div v-else-if="currentAlgo.inputType === 'string'" class="input-group">
            <input v-model="stringInput" :placeholder="currentAlgo.id === 'bracket-match' ? '如: {[()]}' : '如: 3+5*2-1'" class="data-input" />
            <div class="input-actions">
              <button class="btn btn-sm" @click="applyStringInput">使用输入</button>
              <button class="btn btn-sm btn-accent" @click="randomData">随机</button>
            </div>
          </div>
          <div v-else-if="currentAlgo.inputType === 'maze'" class="input-group">
            <button class="btn btn-sm btn-accent" @click="randomData">随机迷宫</button>
          </div>

          <!-- 预置测试用例 -->
          <div v-if="currentAlgo.testCases" class="test-cases">
            <div class="panel-subtitle">预置用例</div>
            <button v-for="(tc, i) in currentAlgo.testCases" :key="i" class="btn btn-sm btn-outline" @click="loadTestCase(tc)">
              {{ tc.name }}
            </button>
          </div>
        </div>

        <!-- 播放控制 -->
        <div class="panel-section" v-if="store.steps.length > 0">
          <div class="panel-title">播放控制</div>
          <div class="control-buttons">
            <button class="ctrl-btn" @click="store.reset()" title="重置 (R)">⟲</button>
            <button class="ctrl-btn" @click="store.stepBack()" title="上一步 (←)">◁</button>
            <button class="ctrl-btn play-btn" @click="store.togglePlay()" :title="store.playState === 'running' ? '暂停 (Space)' : '播放 (Space)'">
              {{ store.playState === 'running' ? '❚❚' : '▶' }}
            </button>
            <button class="ctrl-btn" @click="store.stepForward()" title="下一步 (→)">▷</button>
          </div>
          <div class="speed-control">
            <span class="speed-label">速度</span>
            <input type="range" :min="100" :max="2000" :value="2100 - store.playSpeed" @input="store.setSpeed(2100 - $event.target.value)" class="speed-slider" />
            <span class="speed-value">{{ store.playSpeed }}ms</span>
          </div>
          <!-- 音效控制 -->
          <div class="sound-control">
            <button class="sound-toggle" @click="toggleSound" :title="store.soundEnabled ? '关闭音效' : '开启音效'">
              {{ store.soundEnabled ? '🔊' : '🔇' }}
            </button>
            <input type="range" min="0" max="100" value="30" @input="setVolume($event.target.value)" class="volume-slider" :disabled="!store.soundEnabled" />
          </div>
          <div class="progress-info">{{ store.progressText }}</div>
        </div>

        <!-- 当前步骤说明 -->
        <div class="panel-section" v-if="store.stepInfo">
          <div class="panel-title">当前步骤</div>
          <div class="step-description">{{ store.stepInfo.description }}</div>
        </div>

        <!-- 复杂度信息 -->
        <div class="panel-section" v-if="currentAlgo">
          <div class="panel-title">复杂度</div>
          <div class="complexity-info">
            <div class="comp-row"><span class="comp-label">时间</span><span class="comp-value">{{ currentAlgo.timeComplexity }}</span></div>
            <div class="comp-row"><span class="comp-label">空间</span><span class="comp-value">{{ currentAlgo.spaceComplexity }}</span></div>
          </div>
        </div>
      </aside>

      <!-- 中央可视化画布 -->
      <main class="canvas-area">
        <div v-if="!currentAlgo" class="empty-state">
          <div class="empty-icon">◇</div>
          <h2>算法过程可视化系统</h2>
          <p>从左侧选择一个算法开始可视化学习</p>
        </div>
        <template v-else>
          <div class="canvas-header">
            <span class="algo-title">{{ currentAlgo.name }}</span>
            <span class="difficulty-badge" :class="currentAlgo.difficulty">{{ currentAlgo.difficulty }}</span>
            <span class="algo-desc">{{ currentAlgo.description }}</span>
          </div>
          <VisualizationCanvas :algo-id="store.currentAlgoId" :step="store.stepInfo" :step-index="store.currentStep" />
        </template>
      </main>

      <!-- 右侧代码与步骤面板 -->
      <aside class="right-panel" v-if="currentAlgo">
        <CodePanel :code="currentAlgo.code" :highlight-line="store.stepInfo?.codeLine ?? -1" />
        <StepsPanel />
      </aside>
    </div>

    <!-- 导出历史模态框 -->
    <div v-if="showExportModal" class="export-modal" @click.self="showExportModal = false">
      <div class="export-modal-content">
        <div class="export-modal-header">
          <h3>📊 导出测试历史报告</h3>
          <button class="btn-close" @click="showExportModal = false">✕</button>
        </div>
        <div class="export-modal-body">
          <div class="export-option">
            <label>导出范围:</label>
            <select v-model="exportOptions.exportRange">
              <option value="all">全部记录</option>
              <option value="recent10">最近10条</option>
              <option value="recent20">最近20条</option>
              <option value="recent50">最近50条</option>
            </select>
          </div>
          <div class="export-option">
            <label>
              <input type="checkbox" v-model="exportOptions.includeSteps" />
              包含详细步骤
            </label>
          </div>
          <div class="export-option">
            <label>每条记录最大步骤数:</label>
            <input type="number" v-model.number="exportOptions.maxSteps" min="1" max="100" />
          </div>
          <div class="export-preview">
            <h4>预览统计:</h4>
            <p>总记录数: {{ historyRecords.length }} 条</p>
            <p>测试算法数: {{ Object.keys(algorithmStats).length }} 种</p>
          </div>
        </div>
        <div class="export-modal-footer">
          <button class="btn btn-cancel" @click="showExportModal = false">取消</button>
          <button class="btn btn-primary" @click="exportHistory">导出Markdown文档</button>
          <button class="btn btn-secondary" @click="viewHistory">查看历史记录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAlgorithmStore } from './store/algorithmStore'
import { algorithmRegistry, categories } from './algorithms/registry'
import { executeAlgorithm, generateRandomData } from './algorithms/executor'
import { historyService } from './utils/historyService'
import VisualizationCanvas from './components/VisualizationCanvas.vue'
import CodePanel from './components/CodePanel.vue'
import StepsPanel from './components/StepsPanel.vue'
import AlgorithmCompare from './components/AlgorithmCompare.vue'

const store = useAlgorithmStore()
const activeCategory = ref('sort')
const compareMode = ref(false)

function toggleCompareMode() {
  compareMode.value = !compareMode.value
}
const arrayInput = ref('')
const graphNodes = ref(5)
const graphSource = ref(0)
const graphEdgesInput = ref('')
const numberInput = ref(3)
const stringInput = ref('')
const showExportModal = ref(false)
const exportOptions = ref({
  exportRange: 'all',
  includeSteps: true,
  maxSteps: 20
})

const currentAlgo = computed(() => store.currentAlgoId ? algorithmRegistry[store.currentAlgoId] : null)
const currentCategoryAlgos = computed(() => {
  return Object.values(algorithmRegistry).filter(a => a.category === activeCategory.value)
})

// 历史记录相关
const historyRecords = computed(() => historyService.getAllRecords())
const algorithmStats = computed(() => {
  const stats = {}
  historyRecords.value.forEach(record => {
    stats[record.algorithm] = (stats[record.algorithm] || 0) + 1
  })
  return stats
})

function selectAlgorithm(algo) {
  store.setAlgorithm(algo.id)
  // 设置默认数据
  if (algo.inputType === 'array') {
    arrayInput.value = algo.defaultData.join(',')
  } else if (algo.inputType === 'graph') {
    graphNodes.value = algo.defaultData.nodes
    graphEdgesInput.value = algo.defaultData.edges.map(e => e.join(',')).join('\n')
  } else if (algo.inputType === 'number') {
    numberInput.value = algo.defaultData
  } else if (algo.inputType === 'string') {
    stringInput.value = algo.defaultData
  }
  // 自动执行
  runAlgorithm(algo.defaultData)
}

function runAlgorithm(data) {
  const startTime = Date.now()
  const steps = executeAlgorithm(store.currentAlgoId, data)
  const endTime = Date.now()
  store.setSteps(steps)
  
  // 记录到历史
  if (currentAlgo.value) {
    historyService.addRecord({
      algorithm: store.currentAlgoId,
      algorithmName: currentAlgo.value.name,
      category: currentAlgo.value.category,
      inputData: data,
      inputType: currentAlgo.value.inputType,
      steps: steps,
      totalSteps: steps.length,
      timeComplexity: currentAlgo.value.timeComplexity,
      spaceComplexity: currentAlgo.value.spaceComplexity,
      duration: endTime - startTime,
      description: `执行${currentAlgo.value.name}算法`
    })
  }
}

function applyArrayInput() {
  const arr = arrayInput.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
  if (arr.length > 0) runAlgorithm(arr)
}

function applyGraphInput() {
  const edges = graphEdgesInput.value.trim().split('\n')
    .map(line => line.trim().split(',').map(s => parseInt(s.trim())))
    .filter(e => e.length >= 3 && !e.some(isNaN))
  if (edges.length > 0) {
    runAlgorithm({ nodes: graphNodes.value, edges })
  }
}

function applyNumberInput() {
  runAlgorithm(numberInput.value)
}

function applyStringInput() {
  if (stringInput.value.trim()) runAlgorithm(stringInput.value.trim())
}

function randomData() {
  if (!currentAlgo.value) return
  const data = generateRandomData(currentAlgo.value.inputType, store.currentAlgoId)
  if (currentAlgo.value.inputType === 'array') {
    arrayInput.value = data.join(',')
  } else if (currentAlgo.value.inputType === 'graph') {
    graphNodes.value = data.nodes
    graphEdgesInput.value = data.edges.map(e => e.join(',')).join('\n')
  } else if (currentAlgo.value.inputType === 'number') {
    numberInput.value = data
  } else if (currentAlgo.value.inputType === 'string') {
    stringInput.value = data
  }
  runAlgorithm(data)
}

function loadTestCase(tc) {
  if (currentAlgo.value.inputType === 'array') {
    arrayInput.value = tc.data.join(',')
  } else if (currentAlgo.value.inputType === 'graph') {
    graphNodes.value = tc.data.nodes
    graphEdgesInput.value = tc.data.edges.map(e => e.join(',')).join('\n')
  } else if (currentAlgo.value.inputType === 'number') {
    numberInput.value = tc.data
  } else if (currentAlgo.value.inputType === 'string') {
    stringInput.value = tc.data
  }
  runAlgorithm(tc.data)
}

// 音效控制
function toggleSound() {
  store.setSoundEnabled(!store.soundEnabled)
}

function setVolume(value) {
  const volume = parseInt(value) / 100
  store.setSoundVolume(volume)
}

// 导出历史记录
function exportHistory() {
  const options = {
    title: '算法可视化测试历史报告',
    includeSteps: exportOptions.value.includeSteps,
    maxSteps: exportOptions.value.maxSteps
  }

  // 根据选择范围调整导出选项
  if (exportOptions.value.exportRange === 'recent10') {
    options.recentCount = 10
  } else if (exportOptions.value.exportRange === 'recent20') {
    options.recentCount = 20
  } else if (exportOptions.value.exportRange === 'recent50') {
    options.recentCount = 50
  }

  // 导出并下载Markdown文件
  const content = historyService.downloadMarkdown(options)
  
  // 关闭模态框
  showExportModal.value = false
  
  // 提示用户
  alert('历史记录已导出为Markdown文档！')
}

// 查看历史记录
function viewHistory() {
  // 这里可以打开一个新的页面或模态框来显示详细的历史记录
  // 为了简单，我们先打印到控制台
  console.log('历史记录:', historyRecords.value)
  alert(`共有 ${historyRecords.value.length} 条历史记录\n请在浏览器控制台查看详细数据`)
}

// 清空历史记录
function clearHistory() {
  if (confirm('确定要清空所有历史记录吗？')) {
    historyService.clearHistory()
    alert('历史记录已清空')
  }
}

// 键盘快捷键
function handleKeydown(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  switch (e.key) {
    case ' ': e.preventDefault(); store.togglePlay(); break
    case 'ArrowRight': store.stepForward(); break
    case 'ArrowLeft': store.stepBack(); break
    case 'r': case 'R': store.reset(); break
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶部导航 */
.top-bar {
  display: flex;
  align-items: center;
  height: 56px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  gap: 30px;
  flex-shrink: 0;
  box-shadow: 0 1px 12px rgba(26, 26, 26, 0.04);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 22px;
  color: var(--gold);
}

.logo-text {
  font-family: 'Cormorant Garamond', Georgia, 'Microsoft YaHei', serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-primary);
  white-space: nowrap;
}

.tab-bar {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover { background: var(--bg-panel); color: var(--text-primary); }
.tab-btn.active { background: var(--primary); color: #fff; }
.tab-icon { font-size: 14px; }

/* 主布局 */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧面板 */
.left-panel {
  width: 280px;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  flex-shrink: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 1px 0 12px rgba(26, 26, 26, 0.03);
}

.panel-section {
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 4px;
}

.panel-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
}

.panel-subtitle {
  font-size: 11px;
  color: var(--text-muted);
  margin: 8px 0 4px;
}

/* 算法列表 */
.algo-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.algo-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: none;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 13px;
  border-radius: 6px;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
}

.algo-btn:hover { background: var(--bg-panel); }
.algo-btn.active { background: var(--primary); color: #fff; }

.algo-name { flex: 1; }

.difficulty-badge {
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.difficulty-badge.简单 { background: var(--success); color: #fff; }
.difficulty-badge.中等 { background: var(--accent); color: #000; }
.difficulty-badge.中等\+ { background: #F97316; color: #fff; }
.difficulty-badge.高 { background: var(--danger); color: #fff; }

/* 输入区域 */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-input, .data-textarea {
  width: 100%;
  padding: 8px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 13px;
  resize: vertical;
}

.data-input:focus, .data-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.num-input {
  width: 60px;
  padding: 4px 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 13px;
}

.graph-input {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.input-actions {
  display: flex;
  gap: 6px;
}

.btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  transition: all 0.15s;
}

.btn-sm { padding: 5px 12px; }
.btn { background: var(--bg-panel); color: var(--text-primary); }
.btn:hover { background: var(--primary); }
.btn-accent { background: var(--accent); color: #000; }
.btn-accent:hover { background: var(--accent-hover); }
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-secondary); }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }

.test-cases {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

/* 播放控制 */
.control-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.ctrl-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: var(--bg-panel);
  color: var(--text-primary);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.ctrl-btn:hover { background: var(--primary); }
.ctrl-btn.play-btn { background: var(--primary); font-size: 14px; width: 48px; }
.ctrl-btn.play-btn:hover { background: var(--primary-hover); }

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.speed-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: var(--bg-panel);
  border-radius: 2px;
  outline: none;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

.speed-value { min-width: 45px; text-align: right; }

/* 音效控制 */
.sound-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.sound-toggle {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sound-toggle:hover {
  background: var(--bg-panel);
  border-color: var(--gold);
}

.volume-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: var(--bg-panel);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--gold);
  cursor: pointer;
}

.volume-slider:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.volume-slider:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.progress-info {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 6px;
}

/* 步骤说明 */
.step-description {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.6;
  padding: 8px;
  background: var(--bg-card);
  border-radius: 6px;
  border-left: 3px solid var(--primary);
}

/* 复杂度 */
.complexity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comp-label {
  font-size: 12px;
  color: var(--text-muted);
}

.comp-value {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
}

/* 中央画布区域 */
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-dark);
}

.canvas-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.algo-title {
  font-family: 'Cormorant Garamond', Georgia, 'Microsoft YaHei', serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.algo-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: auto;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 64px;
  color: var(--gold);
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state h2 {
  font-family: 'Cormorant Garamond', Georgia, 'Microsoft YaHei', serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
}

/* 右侧代码面板 */
.right-panel {
  width: 360px;
  background: var(--bg-dark);
  border-left: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  overflow: hidden;
}

/* 导出按钮和模态框样式 */
.top-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.btn-export {
  padding: 8px 16px;
  background: var(--gold);
  color: var(--bg-dark);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-export:hover {
  background: var(--gold-light);
  transform: translateY(-2px);
}

/* 算法对比按钮 */
.btn-compare {
  padding: 8px 16px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-compare:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-compare.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

/* 对比视图 */
.compare-view {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.export-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.export-modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.export-modal-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.export-modal-header h3 {
  font-size: 18px;
  color: var(--text);
}

.btn-close {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 18px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: var(--bg-panel);
  color: var(--text);
}

.export-modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.export-option {
  margin-bottom: 16px;
}

.export-option label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-muted);
  font-size: 14px;
}

.export-option select,
.export-option input[type="number"] {
  width: 100%;
  padding: 8px 12px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-size: 14px;
}

.export-option input[type="checkbox"] {
  margin-right: 8px;
}

.export-preview {
  margin-top: 20px;
  padding: 12px;
  background: var(--bg-panel);
  border-radius: 8px;
}

.export-preview h4 {
  font-size: 14px;
  color: var(--gold);
  margin-bottom: 8px;
}

.export-preview p {
  color: var(--text-muted);
  font-size: 13px;
  margin: 4px 0;
}

.export-modal-footer {
  padding: 20px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.export-modal-footer .btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-cancel {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.btn-cancel:hover {
  background: var(--bg-dark);
  color: var(--text);
}

.btn-primary {
  background: var(--gold);
  border: none;
  color: var(--bg-dark);
}

.btn-primary:hover {
  background: var(--gold-light);
}

.btn-secondary {
  background: var(--bg-dark);
  border: 1px solid var(--gold);
  color: var(--gold);
}

.btn-secondary:hover {
  background: var(--bg-panel);
}

/* 移动端导出模态框适配 */
@media (max-width: 768px) {
  .top-actions {
    position: fixed;
    top: 12px;
    right: 60px;
    z-index: 1000;
  }

  .btn-export {
    padding: 6px 12px;
    font-size: 12px;
  }

  .export-modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .export-modal-header {
    padding: 15px;
  }

  .export-modal-body {
    padding: 15px;
  }

  .export-modal-footer {
    padding: 15px;
    flex-wrap: wrap;
  }

  .export-modal-footer .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
