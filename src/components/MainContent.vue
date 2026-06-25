<template>
  <main class="main-content">
    <div v-if="!currentAlgorithm" class="empty-state">
      <div class="empty-icon">🎯</div>
      <h2>选择一个算法开始学习</h2>
      <p>从左侧菜单选择一个算法进行可视化学习</p>
    </div>
    <div v-else class="algorithm-content">
      <Header :algorithm="currentAlgorithm" />
      <div class="content-body">
        <div class="visualization-panel">
          <VisualizationCanvas :algorithm="currentAlgorithm" />
          <Controls />
        </div>
        <div class="right-panel">
          <CodePanel :algorithm="currentAlgorithm" />
          <StepsPanel />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Header from './Header.vue'
import VisualizationCanvas from './VisualizationCanvas.vue'
import Controls from './Controls.vue'
import CodePanel from './CodePanel.vue'
import StepsPanel from './StepsPanel.vue'

defineProps({
  currentAlgorithm: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.algorithm-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 15px;
  gap: 15px;
}

.visualization-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.right-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>