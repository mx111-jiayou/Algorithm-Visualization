<template>
  <div class="steps-card">
    <div class="card-header">
      <span class="card-title">步骤</span>
      <span class="step-count">{{ store.totalSteps ? store.currentStep + 1 : 0 }}/{{ store.totalSteps }}</span>
    </div>
    <div class="steps-body" ref="bodyRef">
      <div
        v-for="(step, index) in store.steps"
        :key="index"
        ref="itemRefs"
        class="step-row"
        :class="{ active: index === store.currentStep }"
        @click="goto(index)"
      >
        <span class="step-no">#{{ index + 1 }}</span>
        <span class="step-title">{{ step.title || '步骤' }}</span>
        <span class="step-desc">{{ step.description }}</span>
      </div>
      <div v-if="!store.steps.length" class="empty">暂无步骤</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useAlgorithmStore } from '../store/algorithmStore'

const store = useAlgorithmStore()
const bodyRef = ref(null)
const itemRefs = ref([])

function goto(index) {
  const diff = index - store.currentStep
  if (diff > 0) for (let k = 0; k < diff; k++) store.stepForward()
  else for (let k = 0; k < -diff; k++) store.stepBack()
}

watch(() => store.currentStep, async () => {
  await nextTick()
  const el = itemRefs.value[store.currentStep]
  if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
})
</script>

<style scoped>
.steps-card {
  display: flex;
  flex-direction: column;
  height: 320px;
  flex-shrink: 0;
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

.step-count {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 12px;
  color: #A89B8C;
}

.steps-body {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.step-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 7px 16px;
  cursor: pointer;
  transition: background 0.12s;
}

.step-row:hover { background: #F8F6F3; }

.step-row.active {
  background: #1A1A1A;
  box-shadow: inset 3px 0 0 #C9A96E;
}

.step-no {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 12px;
  color: #A89B8C;
  min-width: 28px;
  flex-shrink: 0;
}

.step-row.active .step-no { color: #C9A96E; }

.step-title {
  font-size: 13px;
  font-weight: 700;
  color: #2A2622;
  min-width: 56px;
  flex-shrink: 0;
}

.step-row.active .step-title { color: #FFFFFF; }

.step-desc {
  font-size: 12.5px;
  color: #8A7968;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-row.active .step-desc { color: #E8E0D6; }

.empty {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: #A89B8C;
}

.steps-body::-webkit-scrollbar { width: 6px; }
.steps-body::-webkit-scrollbar-track { background: #EFEAE2; }
.steps-body::-webkit-scrollbar-thumb { background: #A89B8C; border-radius: 3px; }
</style>
