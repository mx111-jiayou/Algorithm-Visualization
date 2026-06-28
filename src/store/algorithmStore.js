import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { algorithmRegistry } from '../algorithms/registry'
import { soundService } from '../utils/soundService'

export const useAlgorithmStore = defineStore('algorithm', () => {
  // 当前算法ID
  const currentAlgoId = ref(null)
  // 播放状态: idle / running / paused / completed
  const playState = ref('idle')
  // 当前步骤索引
  const currentStep = ref(0)
  // 步骤列表
  const steps = ref([])
  // 播放速度 (ms)
  const playSpeed = ref(700)
  // 输入数据
  const inputData = ref(null)
  // 音效启用状态
  const soundEnabled = ref(true)
  // 计时器
  let timer = null

  const currentAlgo = computed(() => {
    if (!currentAlgoId.value) return null
    return algorithmRegistry[currentAlgoId.value] || null
  })

  const totalSteps = computed(() => steps.value.length)
  const stepInfo = computed(() => {
    if (steps.value.length === 0) return null
    return steps.value[currentStep.value] || null
  })
  const progressText = computed(() => {
    if (totalSteps.value === 0) return '步骤 0 / 0'
    return `步骤 ${currentStep.value + 1} / ${totalSteps.value}`
  })

  function setAlgorithm(id) {
    stopTimer()
    currentAlgoId.value = id
    playState.value = 'idle'
    currentStep.value = 0
    steps.value = []
    inputData.value = null
  }

  function setSteps(newSteps) {
    steps.value = newSteps
    currentStep.value = 0
    playState.value = 'idle'
  }

  function setInputData(data) {
    inputData.value = data
  }

  function play() {
    if (steps.value.length === 0) return
    if (currentStep.value >= steps.value.length - 1) {
      playState.value = 'completed'
      return
    }
    playState.value = 'running'
    startTimer()
  }

  function pause() {
    playState.value = 'paused'
    stopTimer()
  }

  function togglePlay() {
    if (playState.value === 'running') pause()
    else play()
  }

  // 根据步骤内容触发对应的音效
  function playStepSound(step) {
    if (!soundEnabled.value || !step) return

    // 根据步骤描述判断音效类型
    const desc = step.description || ''
    
    if (desc.includes('比较') || desc.includes('Compare')) {
      soundService.playSound('compare')
    } else if (desc.includes('交换') || desc.includes('Swap')) {
      soundService.playSound('swap')
    } else if (desc.includes('插入') || desc.includes('Insert')) {
      soundService.playSound('insert')
    } else if (desc.includes('删除') || desc.includes('Delete')) {
      soundService.playSound('delete')
    } else if (desc.includes('访问') || desc.includes('Visit')) {
      soundService.playSound('visit')
    } else if (desc.includes('找到') || desc.includes('Found') || desc.includes('到达')) {
      soundService.playSound('found')
    } else if (desc.includes('完成') || desc.includes('Complete')) {
      soundService.playCompleteSound()
    } else if (desc.includes('移动') || desc.includes('Move')) {
      soundService.playSound('move')
    } else if (desc.includes('Push') || desc.includes('push')) {
      soundService.playSound('insert')
    } else if (desc.includes('Pop') || desc.includes('pop')) {
      soundService.playSound('delete')
    } else if (desc.includes('Enqueue') || desc.includes('入队')) {
      soundService.playSound('insert')
    } else if (desc.includes('Dequeue') || desc.includes('出队')) {
      soundService.playSound('delete')
    } else if (desc.includes('覆盖')) {
      // 棋盘覆盖：每次覆盖L型骨牌
      soundService.playSound('insert')
    } else if (desc.includes('着色成功')) {
      // 图着色：成功着色
      soundService.playSound('success')
    } else if (desc.includes('尝试给') || desc.includes('着色')) {
      // 图着色：尝试着色
      soundService.playSound('compare')
    } else if (desc.includes('探索')) {
      // 迷宫求解：探索新位置
      soundService.playSound('visit')
    } else if (desc.includes('回溯')) {
      // 迷宫求解/图着色：回溯
      soundService.playSound('error')
    } else if (step.highlights && Object.keys(step.highlights).length > 0) {
      // 有高亮标记的步骤，默认播放操作音效
      const highlightTypes = Object.values(step.highlights)
      if (highlightTypes.includes('compare')) {
        soundService.playSound('compare')
      } else if (highlightTypes.includes('swap')) {
        soundService.playSound('swap')
      } else if (highlightTypes.includes('visited')) {
        soundService.playSound('visit')
      } else if (highlightTypes.includes('sorted')) {
        soundService.playSound('sorted')
      } else {
        soundService.playSound('click')
      }
    }
  }

  function stepForward() {
    if (currentStep.value < steps.value.length - 1) {
      currentStep.value++
      // 播放当前步骤的音效
      playStepSound(steps.value[currentStep.value])
      
      if (currentStep.value >= steps.value.length - 1) {
        playState.value = 'completed'
        stopTimer()
        // 完成时播放完成音效
        soundService.playCompleteSound()
      } else if (playState.value === 'idle') {
        playState.value = 'paused'
      }
    }
  }

  function stepBack() {
    if (currentStep.value > 0) {
      currentStep.value--
      if (playState.value === 'completed') playState.value = 'paused'
      // 播放点击音效
      soundService.playSound('click')
    }
  }

  function reset() {
    stopTimer()
    currentStep.value = 0
    playState.value = 'idle'
    // 重置音效
    soundService.playSound('click')
  }

  function setSpeed(ms) {
    playSpeed.value = ms
    if (playState.value === 'running') {
      stopTimer()
      startTimer()
    }
  }

  function setSoundEnabled(enabled) {
    soundEnabled.value = enabled
    soundService.setEnabled(enabled)
  }

  function setSoundVolume(volume) {
    soundService.setVolume(volume)
  }

  function startTimer() {
    stopTimer()
    timer = setInterval(() => {
      if (currentStep.value < steps.value.length - 1) {
        currentStep.value++
        // 播放当前步骤的音效
        playStepSound(steps.value[currentStep.value])
      } else {
        playState.value = 'completed'
        stopTimer()
        // 完成时播放完成音效
        soundService.playCompleteSound()
      }
    }, playSpeed.value)
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    currentAlgoId, playState, currentStep, steps, playSpeed, inputData, soundEnabled,
    totalSteps, stepInfo, progressText,
    setAlgorithm, setSteps, setInputData,
    play, pause, togglePlay, stepForward, stepBack, reset, setSpeed,
    setSoundEnabled, setSoundVolume
  }
})
