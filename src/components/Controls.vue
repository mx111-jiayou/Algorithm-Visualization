<template>
  <div class="controls">
    <div class="control-group">
      <button class="control-btn" @click="$emit('reset')" title="重置">
        <span>🔄</span>
        <span>重置</span>
      </button>
      <button class="control-btn" @click="$emit('step-back')" title="上一步">
        <span>⏮</span>
        <span>上一步</span>
      </button>
      <button class="control-btn play-btn" @click="$emit('toggle-play')" :title="isPlaying ? '暂停' : '播放'">
        <span>{{ isPlaying ? '⏸' : '▶' }}</span>
        <span>{{ isPlaying ? '暂停' : '播放' }}</span>
      </button>
      <button class="control-btn" @click="$emit('step-forward')" title="下一步">
        <span>⏭</span>
        <span>下一步</span>
      </button>
    </div>
    <div class="speed-control">
      <span>速度:</span>
      <input type="range" min="1" max="10" v-model="speed" @change="$emit('speed-change', speed)" />
      <span>{{ speed }}x</span>
    </div>
    <div class="data-input">
      <input type="text" v-model="inputData" placeholder="输入数据（逗号分隔）" @keyup.enter="$emit('data-change', inputData)" />
      <button @click="$emit('data-change', inputData)">应用</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isPlaying: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-play', 'step-forward', 'step-back', 'reset', 'speed-change', 'data-change'])

const speed = ref(5)
const inputData = ref('')
</script>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: var(--bg-card);
  border-radius: 10px;
  gap: 15px;
}

.control-group {
  display: flex;
  gap: 8px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-panel);
  border: none;
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: var(--primary);
}

.control-btn.play-btn {
  background: var(--primary);
}

.control-btn.play-btn:hover {
  background: var(--secondary);
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.speed-control input[type="range"] {
  width: 80px;
}

.data-input {
  display: flex;
  gap: 8px;
}

.data-input input {
  padding: 6px 12px;
  background: var(--bg-panel);
  border: 1px solid var(--bg-panel);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 13px;
  width: 200px;
}

.data-input input:focus {
  outline: none;
  border-color: var(--primary);
}

.data-input button {
  padding: 6px 12px;
  background: var(--primary);
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.data-input button:hover {
  background: var(--secondary);
}
</style>