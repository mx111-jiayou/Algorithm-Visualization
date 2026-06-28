<template>
  <div class="compare-container">
    <!-- 控制面板 -->
    <div class="compare-controls">
      <div class="control-row">
        <div class="control-group">
          <label class="control-label">参与对比的算法</label>
          <div class="algo-checkboxes">
            <label v-for="algo in allAlgorithms" :key="algo.id" class="algo-checkbox">
              <input
                type="checkbox"
                :value="algo.id"
                v-model="selectedAlgos"
              />
              <span>{{ algo.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <label class="control-label">输入数据</label>
          <div class="input-row">
            <input
              v-model="arrayInput"
              placeholder="如: 38,27,43,3,9,82,10"
              class="data-input"
            />
            <button class="btn" @click="applyArray">使用输入</button>
            <button class="btn btn-accent" @click="randomArray">随机生成</button>
            <button class="btn btn-outline" @click="selectAllAlgos">全选</button>
          </div>
          <div class="size-control">
            <label>数组大小:
              <input v-model.number="arraySize" type="number" min="3" max="30" class="num-input" />
            </label>
            <span class="current-size">当前 {{ parsedArray.length }} 个元素</span>
          </div>
        </div>
      </div>

      <div class="control-row">
        <button class="btn-run" @click="startCompare" :disabled="selectedAlgos.length < 2 || parsedArray.length < 2">
          ▶ 运行对比
        </button>
        <span v-if="selectedAlgos.length < 2" class="hint">至少选择 2 个算法</span>
      </div>
    </div>

    <!-- 对比结果 -->
    <div v-if="results.length > 0" class="compare-results">
      <h3 class="results-title">对比结果（按总操作数升序）</h3>

      <!-- 柱状图 -->
      <div class="chart-section">
        <div class="chart-title">总操作次数对比（比较 + 交换 + 移动）</div>
        <div class="bar-chart">
          <div
            v-for="(r, idx) in results"
            :key="r.id"
            class="bar-row"
          >
            <div class="bar-label">{{ r.name }}</div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: getBarWidth(r.totalOperations) + '%', background: getBarColor(idx) }"
              >
                <span class="bar-value">{{ r.totalOperations }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细数据表 -->
      <div class="table-section">
        <div class="chart-title">详细指标</div>
        <table class="compare-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>算法</th>
              <th>时间复杂度</th>
              <th>步骤数</th>
              <th>比较次数</th>
              <th>交换次数</th>
              <th>移动次数</th>
              <th>总操作数</th>
              <th>耗时(ms)</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in results" :key="r.id" :class="{ best: idx === 0 }">
              <td class="rank">
                <span class="rank-badge" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</span>
              </td>
              <td class="algo-name">{{ r.name }}</td>
              <td>{{ r.timeComplexity }}</td>
              <td>{{ r.totalSteps }}</td>
              <td>{{ r.comparisons }}</td>
              <td>{{ r.swaps }}</td>
              <td>{{ r.moves }}</td>
              <td class="highlight">{{ r.totalOperations }}</td>
              <td>{{ r.duration }}</td>
              <td>
                <span :class="r.correct ? 'status-ok' : 'status-fail'">
                  {{ r.correct ? '✓ 正确' : '✗ 错误' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 结论 -->
      <div class="conclusion">
        <div class="conclusion-item">
          <span class="conclusion-label">操作数最少：</span>
          <span class="conclusion-value">{{ results[0].name }} ({{ results[0].totalOperations }} 次)</span>
        </div>
        <div class="conclusion-item">
          <span class="conclusion-label">耗时最短：</span>
          <span class="conclusion-value">{{ fastestAlgo.name }} ({{ fastestAlgo.duration }} ms)</span>
        </div>
        <div class="conclusion-item">
          <span class="conclusion-label">步骤最少：</span>
          <span class="conclusion-value">{{ fewestStepsAlgo.name }} ({{ fewestStepsAlgo.totalSteps }} 步)</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="hasRun" class="empty-results">
      <div class="empty-icon">📊</div>
      <p>没有可对比的结果，请检查输入数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { comparableAlgorithms, runCompare, generateCompareArray } from '../utils/algorithmCompare'

const allAlgorithms = comparableAlgorithms
const selectedAlgos = ref(comparableAlgorithms.map(a => a.id))
const arrayInput = ref('64,34,25,12,22,11,90')
const arraySize = ref(10)
const results = ref([])
const hasRun = ref(false)

const parsedArray = computed(() => {
  return arrayInput.value
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n))
})

const fastestAlgo = computed(() => {
  if (results.value.length === 0) return {}
  return [...results.value].sort((a, b) => a.duration - b.duration)[0]
})

const fewestStepsAlgo = computed(() => {
  if (results.value.length === 0) return {}
  return [...results.value].sort((a, b) => a.totalSteps - b.totalSteps)[0]
})

function applyArray() {
  if (parsedArray.value.length < 2) {
    alert('请输入至少 2 个数字')
    return
  }
  results.value = []
  hasRun.value = false
}

function randomArray() {
  const arr = generateCompareArray(arraySize.value)
  arrayInput.value = arr.join(',')
  results.value = []
  hasRun.value = false
}

function selectAllAlgos() {
  selectedAlgos.value = comparableAlgorithms.map(a => a.id)
}

function startCompare() {
  if (selectedAlgos.value.length < 2) {
    alert('请至少选择 2 个算法')
    return
  }
  if (parsedArray.value.length < 2) {
    alert('请输入至少 2 个数字')
    return
  }
  hasRun.value = true
  results.value = runCompare(selectedAlgos.value, parsedArray.value)
}

function getBarWidth(value) {
  if (results.value.length === 0) return 0
  const max = Math.max(...results.value.map(r => r.totalOperations))
  return max === 0 ? 0 : Math.max(8, (value / max) * 100)
}

function getBarColor(idx) {
  const colors = ['#C9A96E', '#8B7355', '#A89B8C', '#6D5D4B', '#B8A589', '#9B8B7A']
  return colors[idx % colors.length]
}
</script>

<style scoped>
.compare-container {
  padding: 24px 32px;
  background: var(--bg-dark);
  min-height: 100%;
  overflow-y: auto;
}

.compare-controls {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(26, 26, 26, 0.04);
}

.control-row {
  margin-bottom: 16px;
}

.control-row:last-child {
  margin-bottom: 0;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.algo-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.algo-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: all 0.15s;
}

.algo-checkbox:hover {
  border-color: var(--primary);
}

.algo-checkbox input {
  accent-color: var(--gold);
  cursor: pointer;
}

.input-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.data-input {
  flex: 1;
  min-width: 280px;
  padding: 8px 12px;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 13px;
}

.data-input:focus {
  outline: none;
  border-color: var(--primary);
}

.num-input {
  width: 70px;
  padding: 4px 8px;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 13px;
}

.btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: var(--bg-panel);
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn:hover { background: var(--primary); }
.btn-accent { background: var(--gold); color: #fff; }
.btn-accent:hover { background: var(--accent-hover); }
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-secondary); }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }

.size-control {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.current-size {
  color: var(--text-muted);
}

.btn-run {
  padding: 10px 28px;
  border: none;
  border-radius: 6px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-run:hover:not(:disabled) {
  background: var(--gold);
}

.btn-run:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 8px;
}

.compare-results {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(26, 26, 26, 0.04);
}

.results-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-section, .table-section {
  margin-bottom: 28px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 90px;
  font-size: 13px;
  color: var(--text-primary);
  text-align: right;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  background: var(--bg-dark);
  border-radius: 4px;
  height: 28px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  transition: width 0.5s ease;
  min-width: 40px;
}

.bar-value {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.compare-table th, .compare-table td {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.compare-table th {
  background: var(--bg-dark);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.compare-table td.algo-name {
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
}

.compare-table tr.best {
  background: rgba(201, 169, 110, 0.08);
}

.compare-table tr.best td.algo-name::before {
  content: '★ ';
  color: var(--gold);
}

.compare-table td.highlight {
  font-weight: 700;
  color: var(--gold);
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  background: var(--bg-panel);
  color: var(--text-primary);
}

.rank-badge.rank-1 { background: #C9A96E; color: #fff; }
.rank-badge.rank-2 { background: #A89B8C; color: #fff; }
.rank-badge.rank-3 { background: #8B7355; color: #fff; }

.status-ok { color: var(--success); font-weight: 600; }
.status-fail { color: var(--danger); font-weight: 600; }

.conclusion {
  display: flex;
  gap: 32px;
  padding: 16px;
  background: var(--bg-dark);
  border-radius: 8px;
  flex-wrap: wrap;
}

.conclusion-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.conclusion-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.conclusion-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--gold);
}

.empty-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .compare-container {
    padding: 16px;
  }
  .compare-table {
    font-size: 11px;
  }
  .compare-table th, .compare-table td {
    padding: 6px 4px;
  }
  .conclusion {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
