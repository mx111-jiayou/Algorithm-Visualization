<template>
  <transition name="slide-up">
    <div v-if="store.teachingMode && store.hasTeaching" class="explanation-panel">
      <div class="panel-header">
        <span class="panel-icon">📚</span>
        <span class="panel-title">题目讲解</span>
        <span class="panel-step">{{ store.progressText }}</span>
      </div>

      <div v-if="explanation" class="panel-body">
        <div class="explain-title">
          <span class="title-dot"></span>
          {{ explanation.title }}
        </div>
        <p class="explain-content">{{ explanation.content }}</p>
        <div class="explain-keypoint">
          <span class="keypoint-label">关键点</span>
          <span class="keypoint-text">{{ explanation.keyPoint }}</span>
        </div>
      </div>

      <div v-else class="panel-body empty">
        <span class="empty-icon">⋯</span>
        <p>当前步骤暂无讲解，继续播放查看下一关键步骤</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useAlgorithmStore } from '../store/algorithmStore'

const store = useAlgorithmStore()
const explanation = computed(() => store.currentExplanation)
</script>

<style scoped>
.explanation-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #2A2622 0%, #1A1A1A 100%);
  color: #FFFFFF;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.18);
  z-index: 100;
  max-height: 38vh;
  overflow-y: auto;
  border-top: 2px solid #C9A96E;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(201, 169, 110, 0.2);
  background: rgba(201, 169, 110, 0.06);
}

.panel-icon {
  font-size: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #C9A96E;
  letter-spacing: 0.05em;
}

.panel-step {
  margin-left: auto;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 12px;
  color: #A89B8C;
}

.panel-body {
  padding: 16px 24px 20px;
}

.explain-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 10px;
}

.title-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #C9A96E;
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.6);
  flex-shrink: 0;
}

.explain-content {
  margin: 0 0 12px 18px;
  font-size: 14px;
  line-height: 1.7;
  color: #E8E0D6;
}

.explain-keypoint {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-left: 18px;
  padding: 10px 14px;
  background: rgba(201, 169, 110, 0.1);
  border-left: 3px solid #C9A96E;
  border-radius: 4px;
}

.keypoint-label {
  font-size: 11px;
  font-weight: 700;
  color: #C9A96E;
  text-transform: uppercase;
  letter-spacing: 1px;
  flex-shrink: 0;
  padding-top: 2px;
}

.keypoint-text {
  font-size: 13px;
  color: #F3EFE9;
  line-height: 1.6;
}

.panel-body.empty {
  text-align: center;
  padding: 24px;
  color: #A89B8C;
}

.empty-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 6px;
  letter-spacing: 4px;
}

.panel-body.empty p {
  margin: 0;
  font-size: 13px;
}

/* 进入/离开动画 */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.explanation-panel::-webkit-scrollbar { width: 6px; }
.explanation-panel::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
.explanation-panel::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.4); border-radius: 3px; }

@media (max-width: 768px) {
  .explanation-panel {
    max-height: 42vh;
  }
  .panel-body {
    padding: 12px 16px 16px;
  }
  .explain-title {
    font-size: 14px;
  }
  .explain-content {
    font-size: 13px;
    margin-left: 8px;
  }
  .explain-keypoint {
    margin-left: 8px;
    padding: 8px 10px;
  }
}
</style>
