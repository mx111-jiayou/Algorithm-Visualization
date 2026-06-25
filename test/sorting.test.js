import { describe, it, expect } from 'vitest'
import { bubbleSort, quickSort, insertionSort, shellSort, selectionSort, mergeSort } from '../src/algorithms/sorting'

describe('排序算法测试', () => {
  // 辅助函数：验证步骤序列中的数组最终有序
  function isSorted(steps) {
    const lastStep = steps[steps.length - 1]
    const arr = lastStep.array
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false
    }
    return true
  }

  // 辅助函数：验证步骤格式正确
  function validateSteps(steps) {
    expect(steps.length).toBeGreaterThan(0)
    steps.forEach(step => {
      expect(step).toHaveProperty('array')
      expect(step).toHaveProperty('description')
      expect(step).toHaveProperty('codeLine')
      expect(Array.isArray(step.array)).toBe(true)
    })
  }

  describe('冒泡排序', () => {
    it('应该正确排序普通数组', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90]
      const steps = bubbleSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理已排序数组', () => {
      const arr = [1, 2, 3, 4, 5]
      const steps = bubbleSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理逆序数组', () => {
      const arr = [5, 4, 3, 2, 1]
      const steps = bubbleSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理空数组', () => {
      const arr = []
      const steps = bubbleSort(arr)
      expect(steps.length).toBeGreaterThan(0)
    })

    it('应该处理单元素数组', () => {
      const arr = [42]
      const steps = bubbleSort(arr)
      validateSteps(steps)
      expect(steps[steps.length - 1].array[0]).toBe(42)
    })

    it('应该包含比较和交换步骤', () => {
      const arr = [3, 1, 2]
      const steps = bubbleSort(arr)
      const hasCompare = steps.some(s => Object.values(s.highlights || {}).includes('compare'))
      const hasSwap = steps.some(s => Object.values(s.highlights || {}).includes('swap'))
      expect(hasCompare).toBe(true)
      expect(hasSwap).toBe(true)
    })
  })

  describe('快速排序', () => {
    it('应该正确排序普通数组', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90]
      const steps = quickSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理重复元素', () => {
      const arr = [5, 3, 5, 1, 3, 5]
      const steps = quickSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理负数', () => {
      const arr = [-5, -2, -10, 0, 3]
      const steps = quickSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该包含pivot标记', () => {
      const arr = [3, 1, 2]
      const steps = quickSort(arr)
      const hasPivot = steps.some(s => Object.values(s.highlights || {}).includes('pivot'))
      expect(hasPivot).toBe(true)
    })
  })

  describe('插入排序', () => {
    it('应该正确排序', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90]
      const steps = insertionSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理已排序数组（最优情况）', () => {
      const arr = [1, 2, 3, 4, 5]
      const steps = insertionSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })
  })

  describe('希尔排序', () => {
    it('应该正确排序', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90]
      const steps = shellSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理大规模数组', () => {
      const arr = Array.from({ length: 20 }, (_, i) => Math.floor(Math.random() * 100))
      const steps = shellSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })
  })

  describe('选择排序', () => {
    it('应该正确排序', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90]
      const steps = selectionSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该包含current标记', () => {
      const arr = [3, 1, 2]
      const steps = selectionSort(arr)
      const hasCurrent = steps.some(s => Object.values(s.highlights || {}).includes('current'))
      expect(hasCurrent).toBe(true)
    })
  })

  describe('归并排序', () => {
    it('应该正确排序', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90]
      const steps = mergeSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理偶数长度数组', () => {
      const arr = [4, 3, 2, 1]
      const steps = mergeSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })

    it('应该处理奇数长度数组', () => {
      const arr = [5, 4, 3, 2, 1]
      const steps = mergeSort(arr)
      validateSteps(steps)
      expect(isSorted(steps)).toBe(true)
    })
  })

  describe('所有排序算法对比测试', () => {
    const testArr = [38, 27, 43, 3, 9, 82, 10]
    const expectedSorted = [3, 9, 10, 27, 38, 43, 82]

    it('所有算法应该产生相同的排序结果', () => {
      const algorithms = [
        bubbleSort,
        quickSort,
        insertionSort,
        shellSort,
        selectionSort,
        mergeSort
      ]

      algorithms.forEach(algo => {
        const steps = algo(testArr)
        const result = steps[steps.length - 1].array
        expect(result).toEqual(expectedSorted)
      })
    })

    it('所有算法不应该修改原数组', () => {
      const original = [...testArr]
      bubbleSort(testArr)
      quickSort(testArr)
      insertionSort(testArr)
      expect(testArr).toEqual(original)
    })
  })
})