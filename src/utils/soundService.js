// Web Audio API 音效服务
// 为算法可视化提供音效反馈

class SoundService {
  constructor() {
    this.audioContext = null
    this.enabled = true
    this.volume = 0.3
    this.init()
  }

  init() {
    try {
      // 创建 AudioContext
      const AudioContext = window.AudioContext || window.webkitAudioContext
      this.audioContext = new AudioContext()
    } catch (e) {
      console.warn('Web Audio API not supported:', e)
      this.enabled = false
    }
  }

  // 确保 AudioContext 已启动（某些浏览器需要用户交互后才能播放）
  ensureContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  // 播放音效
  playSound(type, options = {}) {
    if (!this.enabled || !this.audioContext) return
    this.ensureContext()

    const { frequency, duration, waveType } = this.getSoundParams(type, options)
    this.createTone(frequency, duration, waveType)
  }

  // 获取不同类型音效的参数
  getSoundParams(type, options) {
    const defaults = {
      compare: { frequency: 440, duration: 0.08, waveType: 'sine' },      // A4 - 比较元素
      swap: { frequency: 660, duration: 0.12, waveType: 'square' },       // E5 - 交换元素
      sorted: { frequency: 880, duration: 0.15, waveType: 'sine' },       // A5 - 元素已排序
      complete: { frequency: 1047, duration: 0.3, waveType: 'sine' },     // C6 - 完成
      error: { frequency: 200, duration: 0.2, waveType: 'square' },       // 错误音效
      click: { frequency: 600, duration: 0.05, waveType: 'sine' },        // UI点击
      success: { frequency: 523, duration: 0.2, waveType: 'triangle' },   // C5 - 成功操作
      move: { frequency: 300, duration: 0.1, waveType: 'sine' },          // 移动元素
      insert: { frequency: 500, duration: 0.15, waveType: 'triangle' },   // 插入元素
      delete: { frequency: 350, duration: 0.15, waveType: 'sawtooth' },   // 删除元素
      visit: { frequency: 400, duration: 0.1, waveType: 'sine' },         // 访问节点
      found: { frequency: 700, duration: 0.2, waveType: 'triangle' }      // 找到目标
    }

    return { ...defaults[type], ...options }
  }

  // 创建音调
  createTone(frequency, duration, waveType = 'sine') {
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = waveType
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    // 音量淡入淡出效果
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // 播放和弦（用于完成提示）
  playChord(frequencies, duration = 0.3) {
    if (!this.enabled || !this.audioContext) return
    this.ensureContext()

    frequencies.forEach(freq => {
      this.createTone(freq, duration, 'sine')
    })
  }

  // 播放完成音效（和弦）
  playCompleteSound() {
    // C major chord: C4, E4, G4, C5
    this.playChord([261.63, 329.63, 392.00, 523.25], 0.5)
  }

  // 播放渐变音效（用于动画过程）
  playProgressiveSound(startFreq, endFreq, duration) {
    if (!this.enabled || !this.audioContext) return
    this.ensureContext()

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime)
    oscillator.frequency.linearRampToValueAtTime(endFreq, this.audioContext.currentTime + duration)

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // 播放节奏音效序列
  playSequence(soundTypes, interval = 0.1) {
    if (!this.enabled) return

    soundTypes.forEach((type, index) => {
      setTimeout(() => {
        this.playSound(type)
      }, index * interval * 1000)
    })
  }

  // 启用/禁用音效
  setEnabled(enabled) {
    this.enabled = enabled
  }

  // 设置音量 (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // 获取当前状态
  getStatus() {
    return {
      enabled: this.enabled,
      volume: this.volume,
      supported: this.audioContext !== null
    }
  }
}

// 导出单例实例
export const soundService = new SoundService()

// 导出类以便需要时创建新实例
export default SoundService