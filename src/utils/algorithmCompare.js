// 算法对比工具 - 在同一输入数据上运行多个排序算法并统计指标
import { bubbleSort, quickSort, insertionSort, shellSort, selectionSort, mergeSort } from '../algorithms/sorting'
import { algorithmRegistry } from '../algorithms/registry'

// 支持对比的排序算法列表
export const comparableAlgorithms = [
  { id: 'bubble-sort', name: '冒泡排序', fn: bubbleSort },
  { id: 'insertion-sort', name: '直接插入', fn: insertionSort },
  { id: 'selection-sort', name: '选择排序', fn: selectionSort },
  { id: 'shell-sort', name: '希尔排序', fn: shellSort },
  { id: 'merge-sort', name: '归并排序', fn: mergeSort },
  { id: 'quick-sort', name: '快速排序', fn: quickSort }
]

// 统计单个算法的关键指标
function analyzeSteps(steps) {
  let comparisons = 0
  let swaps = 0
  let moves = 0

  steps.forEach(step => {
    const desc = step.description || ''
    if (desc.includes('比较')) comparisons++
    if (desc.includes('交换')) swaps++
    if (desc.includes('移动')) moves++
  })

  return {
    totalSteps: steps.length,
    comparisons,
    swaps,
    moves,
    totalOperations: comparisons + swaps + moves
  }
}

// 运行单个算法并返回完整对比数据
export function runAlgorithmForCompare(algoId, inputArray) {
  const algoDef = comparableAlgorithms.find(a => a.id === algoId)
  if (!algoDef) return null

  const meta = algorithmRegistry[algoId]
  const arr = [...inputArray]

  const startTime = performance.now()
  const steps = algoDef.fn(arr)
  const endTime = performance.now()
  const duration = endTime - startTime

  const stats = analyzeSteps(steps)

  return {
    id: algoId,
    name: algoDef.name,
    timeComplexity: meta ? meta.timeComplexity : '',
    spaceComplexity: meta ? meta.spaceComplexity : '',
    duration: Number(duration.toFixed(3)),
    inputSize: inputArray.length,
    finalArray: steps.length > 0 ? steps[steps.length - 1].array : [...arr],
    correct: isSorted(steps.length > 0 ? steps[steps.length - 1].array : arr),
    ...stats
  }
}

// 批量运行多个算法进行对比
export function runCompare(algoIds, inputArray) {
  return algoIds
    .map(id => runAlgorithmForCompare(id, inputArray))
    .filter(Boolean)
    .sort((a, b) => a.totalOperations - b.totalOperations)
}

// 检查数组是否已排序
function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) return false
  }
  return true
}

// 生成随机数组
export function generateCompareArray(size = 10) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1)
}
