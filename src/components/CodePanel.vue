<template>
  <div class="code-card">
    <div class="card-header">
      <span class="card-title">代码</span>
      <span class="card-hint">高亮当前执行行</span>
    </div>

    <div class="exec-bar" v-if="currentLineText">
      <span class="exec-label">执行</span>
      <span class="exec-line">L{{ highlightLine + 1 }}</span>
      <span class="exec-code">{{ currentLineText }}</span>
    </div>

    <div class="code-body">
      <div v-for="(line, i) in codeLines" :key="i"
        class="code-line"
        :class="{ highlighted: i === highlightLine }"
      >
        <span class="marker">{{ i === highlightLine ? '▶' : '' }}</span>
        <span class="line-num">{{ i + 1 }}</span>
        <span class="line-content">{{ line }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  code: { type: String, default: '' },
  highlightLine: { type: Number, default: -1 }
})

const codeLines = computed(() => {
  if (!props.code) return []
  return props.code.split('\n')
})

const currentLineText = computed(() => {
  if (props.highlightLine < 0) return ''
  return (codeLines.value[props.highlightLine] || '').trim()
})
</script>

<style scoped>
.code-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #E8E0D6;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(26, 26, 26, 0.04);
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #EFEAE2;
  flex-shrink: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #1A1A1A;
}

.card-hint {
  font-size: 12px;
  color: #A89B8C;
}

.exec-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #F8F6F3;
  border-bottom: 1px solid #EFEAE2;
  flex-shrink: 0;
  overflow: hidden;
}

.exec-label {
  font-size: 12px;
  font-weight: 600;
  color: #8A7968;
  flex-shrink: 0;
}

.exec-line {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #8A6A2E;
  background: #F0E6D2;
  padding: 1px 7px;
  border-radius: 4px;
  flex-shrink: 0;
}

.exec-code {
  font-family: 'JetBrains Mono', 'Consolas', 'Fira Code', monospace;
  font-size: 12px;
  color: #1A1A1A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.code-body {
  font-family: 'JetBrains Mono', 'Consolas', 'Fira Code', monospace;
  font-size: 12.5px;
  line-height: 1.9;
  background: #FFFFFF;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
  flex: 1;
  min-height: 0;
}

.code-line {
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: background 0.15s;
}

.code-line.highlighted {
  background: #F6EFE0;
  box-shadow: inset 3px 0 0 #C9A96E;
}

.marker {
  width: 14px;
  color: #C9A96E;
  font-size: 10px;
  flex-shrink: 0;
  text-align: center;
}

.line-num {
  color: #C4B6A6;
  min-width: 24px;
  text-align: right;
  margin-right: 14px;
  user-select: none;
  flex-shrink: 0;
}

.code-line.highlighted .line-num {
  color: #8A6A2E;
  font-weight: 700;
}

.line-content {
  color: #2A2622;
  white-space: pre;
  flex: 1;
}

.code-body::-webkit-scrollbar { width: 6px; }
.code-body::-webkit-scrollbar-track { background: #EFEAE2; }
.code-body::-webkit-scrollbar-thumb { background: #A89B8C; border-radius: 3px; }
</style>
