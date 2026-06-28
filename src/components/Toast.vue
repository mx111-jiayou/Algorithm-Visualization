<template>
  <transition-group name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="'toast-' + toast.type"
    >
      <span class="toast-icon">{{ iconMap[toast.type] }}</span>
      <span class="toast-message">{{ toast.message }}</span>
      <button class="toast-close" @click="removeToast(toast.id)">✕</button>
    </div>
  </transition-group>
</template>

<script setup>
import { computed } from 'vue'
import { useAlgorithmStore } from '../store/algorithmStore'

const store = useAlgorithmStore()
const toasts = computed(() => store.toasts)

const iconMap = {
  error: '⚠',
  warning: '⚠',
  success: '✓',
  info: 'ℹ'
}

function removeToast(id) {
  store.removeToast(id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: 380px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: #FFFFFF;
  border-left: 4px solid;
  pointer-events: auto;
  font-size: 13.5px;
  color: #2A2622;
}

.toast-error {
  border-left-color: #E74C3C;
  background: #FEF5F4;
}

.toast-warning {
  border-left-color: #F39C12;
  background: #FEFAF3;
}

.toast-success {
  border-left-color: #27AE60;
  background: #F4FBF6;
}

.toast-info {
  border-left-color: #3498DB;
  background: #F4F9FD;
}

.toast-icon {
  font-size: 16px;
  flex-shrink: 0;
  font-weight: bold;
}

.toast-error .toast-icon { color: #E74C3C; }
.toast-warning .toast-icon { color: #F39C12; }
.toast-success .toast-icon { color: #27AE60; }
.toast-info .toast-icon { color: #3498DB; }

.toast-message {
  flex: 1;
  line-height: 1.4;
  word-break: break-word;
}

.toast-close {
  background: transparent;
  border: none;
  color: #A89B8C;
  cursor: pointer;
  font-size: 12px;
  padding: 0 4px;
  transition: color 0.15s;
  flex-shrink: 0;
}

.toast-close:hover {
  color: #2A2622;
}

/* 进入/离开动画 */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.25s ease;
}

@media (max-width: 768px) {
  .toast-container {
    top: 70px;
    right: 12px;
    left: 12px;
    max-width: none;
  }
}
</style>
