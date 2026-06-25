<template>
  <header class="header">
    <div class="header-left">
      <h2>{{ algorithm.name }}</h2>
      <p>{{ algorithm.description || '点击播放按钮开始可视化演示' }}</p>
    </div>
    <div class="header-right">
      <span class="difficulty-tag" :class="algorithm.difficulty">
        {{ algorithm.difficulty }}难度
      </span>
    </div>
  </header>
</template>

<script setup>
defineProps({
  algorithm: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--bg-panel);
}

.header-left h2 {
  font-size: 18px;
  font-weight: 600;
}

.header-left p {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.difficulty-tag {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

.difficulty-tag.低 {
  background: rgba(0, 184, 148, 0.2);
  color: var(--success);
}

.difficulty-tag.中 {
  background: rgba(253, 203, 110, 0.2);
  color: var(--warning);
}

.difficulty-tag.高 {
  background: rgba(255, 107, 107, 0.2);
  color: var(--danger);
}
</style>