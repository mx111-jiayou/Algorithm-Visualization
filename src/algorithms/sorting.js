// 排序算法 - 生成步骤序列
// 每个步骤格式: { array, highlights, description, codeLine }
// highlights: { [index]: 'compare'|'swap'|'pivot'|'sorted'|'current' }

export function bubbleSort(arr) {
  const a = [...arr]
  const steps = []
  const n = a.length
  const sorted = new Set()

  steps.push({ array: [...a], highlights: {}, description: `初始数组: [${a.join(', ')}]`, codeLine: 0 })

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - 1 - i; j++) {
      const hl = {}
      sorted.forEach(s => hl[s] = 'sorted')
      hl[j] = 'compare'
      hl[j + 1] = 'compare'
      steps.push({ array: [...a], highlights: hl, description: `比较 a[${j}]=${a[j]} 和 a[${j+1}]=${a[j+1]}`, codeLine: 2 })

      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        const hl2 = {}
        sorted.forEach(s => hl2[s] = 'sorted')
        hl2[j] = 'swap'
        hl2[j + 1] = 'swap'
        steps.push({ array: [...a], highlights: hl2, description: `交换 ${a[j+1]} 和 ${a[j]}`, codeLine: 3 })
        swapped = true
      }
    }
    sorted.add(n - 1 - i)
    if (!swapped) {
      for (let k = 0; k < n; k++) sorted.add(k)
      steps.push({ array: [...a], highlights: Object.fromEntries([...sorted].map(s => [s, 'sorted'])), description: '未发生交换，排序提前结束', codeLine: 5 })
      break
    }
  }
  sorted.add(0)
  steps.push({ array: [...a], highlights: Object.fromEntries([...sorted].map(s => [s, 'sorted'])), description: `排序完成: [${a.join(', ')}]`, codeLine: 5 })
  return steps
}

export function quickSort(arr) {
  const a = [...arr]
  const steps = []
  const sorted = new Set()

  steps.push({ array: [...a], highlights: {}, description: `初始数组: [${a.join(', ')}]`, codeLine: 0 })

  function partition(low, high) {
    const pivot = a[low]
    const hl = {}
    sorted.forEach(s => hl[s] = 'sorted')
    hl[low] = 'pivot'
    steps.push({ array: [...a], highlights: hl, description: `选择基准 pivot=a[${low}]=${pivot}`, codeLine: 1 })

    let i = low, j = high
    while (i < j) {
      while (i < j && a[j] >= pivot) j--
      if (i < j) {
        a[i] = a[j]
        const hl2 = {}
        sorted.forEach(s => hl2[s] = 'sorted')
        hl2[i] = 'swap'
        hl2[j] = 'swap'
        hl2[low] = 'pivot'
        steps.push({ array: [...a], highlights: hl2, description: `右侧 a[${j}]=${a[i]} < pivot, 移到左端`, codeLine: 4 })
        i++
      }
      while (i < j && a[i] <= pivot) i++
      if (i < j) {
        a[j] = a[i]
        const hl2 = {}
        sorted.forEach(s => hl2[s] = 'sorted')
        hl2[i] = 'swap'
        hl2[j] = 'swap'
        hl2[low] = 'pivot'
        steps.push({ array: [...a], highlights: hl2, description: `左侧 a[${i}]=${a[j]} > pivot, 移到右端`, codeLine: 6 })
        j--
      }
    }
    a[i] = pivot
    sorted.add(i)
    const hl2 = {}
    sorted.forEach(s => hl2[s] = 'sorted')
    hl2[i] = 'current'
    steps.push({ array: [...a], highlights: hl2, description: `基准 ${pivot} 归位到 a[${i}]`, codeLine: 8 })
    return i
  }

  function qs(low, high) {
    if (low < high) {
      const p = partition(low, high)
      qs(low, p - 1)
      qs(p + 1, high)
    } else if (low === high) {
      sorted.add(low)
    }
  }

  if (a.length > 0) qs(0, a.length - 1)
  steps.push({ array: [...a], highlights: Object.fromEntries([...Array(a.length).keys()].map(i => [i, 'sorted'])), description: `排序完成: [${a.join(', ')}]`, codeLine: 10 })
  return steps
}

export function insertionSort(arr) {
  const a = [...arr]
  const steps = []
  const n = a.length

  steps.push({ array: [...a], highlights: { 0: 'sorted' }, description: `初始: a[0]=${a[0]} 视为已排序`, codeLine: 0 })

  for (let i = 1; i < n; i++) {
    const key = a[i]
    const hl = {}
    for (let k = 0; k < i; k++) hl[k] = 'sorted'
    hl[i] = 'current'
    steps.push({ array: [...a], highlights: hl, description: `取出 a[${i}]=${key}，寻找插入位置`, codeLine: 1 })

    let j = i - 1
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j]
      const hl2 = {}
      for (let k = 0; k < i; k++) hl2[k] = 'sorted'
      hl2[j] = 'compare'
      hl2[j + 1] = 'swap'
      steps.push({ array: [...a], highlights: hl2, description: `a[${j}]=${a[j]} > ${key}，右移`, codeLine: 3 })
      j--
    }
    a[j + 1] = key
    const hl2 = {}
    for (let k = 0; k <= i; k++) hl2[k] = 'sorted'
    steps.push({ array: [...a], highlights: hl2, description: `将 ${key} 插入到 a[${j+1}]`, codeLine: 5 })
  }

  steps.push({ array: [...a], highlights: Object.fromEntries([...Array(n).keys()].map(i => [i, 'sorted'])), description: `排序完成: [${a.join(', ')}]`, codeLine: 6 })
  return steps
}

export function shellSort(arr) {
  const a = [...arr]
  const steps = []
  const n = a.length

  steps.push({ array: [...a], highlights: {}, description: `初始数组: [${a.join(', ')}]`, codeLine: 0 })

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({ array: [...a], highlights: {}, description: `增量 gap = ${gap}`, codeLine: 1 })
    for (let i = gap; i < n; i++) {
      const temp = a[i]
      const hl = {}
      hl[i] = 'current'
      hl[i - gap] = 'compare'
      steps.push({ array: [...a], highlights: hl, description: `比较 a[${i}]=${temp} 和 a[${i-gap}]=${a[i-gap]}`, codeLine: 2 })

      let j = i
      while (j >= gap && a[j - gap] > temp) {
        a[j] = a[j - gap]
        const hl2 = {}
        hl2[j] = 'swap'
        hl2[j - gap] = 'swap'
        steps.push({ array: [...a], highlights: hl2, description: `a[${j-gap}]=${a[j]} > ${temp}，右移`, codeLine: 4 })
        j -= gap
      }
      a[j] = temp
      steps.push({ array: [...a], highlights: { [j]: 'current' }, description: `将 ${temp} 插入到 a[${j}]`, codeLine: 5 })
    }
  }

  steps.push({ array: [...a], highlights: Object.fromEntries([...Array(n).keys()].map(i => [i, 'sorted'])), description: `排序完成: [${a.join(', ')}]`, codeLine: 6 })
  return steps
}

export function selectionSort(arr) {
  const a = [...arr]
  const steps = []
  const n = a.length
  const sorted = new Set()

  steps.push({ array: [...a], highlights: {}, description: `初始数组: [${a.join(', ')}]`, codeLine: 0 })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    const hl0 = {}
    sorted.forEach(s => hl0[s] = 'sorted')
    hl0[i] = 'current'
    steps.push({ array: [...a], highlights: hl0, description: `第 ${i+1} 轮: 从 a[${i}] 开始找最小值`, codeLine: 1 })

    for (let j = i + 1; j < n; j++) {
      const hl = {}
      sorted.forEach(s => hl[s] = 'sorted')
      hl[minIdx] = 'pivot'
      hl[j] = 'compare'
      steps.push({ array: [...a], highlights: hl, description: `比较 a[${j}]=${a[j]} 和当前最小 a[${minIdx}]=${a[minIdx]}`, codeLine: 3 })
      if (a[j] < a[minIdx]) minIdx = j
    }

    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      const hl = {}
      sorted.forEach(s => hl[s] = 'sorted')
      hl[i] = 'swap'
      hl[minIdx] = 'swap'
      steps.push({ array: [...a], highlights: hl, description: `交换 a[${i}] 和 a[${minIdx}]`, codeLine: 5 })
    }
    sorted.add(i)
  }
  sorted.add(n - 1)
  steps.push({ array: [...a], highlights: Object.fromEntries([...sorted].map(s => [s, 'sorted'])), description: `排序完成: [${a.join(', ')}]`, codeLine: 6 })
  return steps
}

export function mergeSort(arr) {
  const a = [...arr]
  const steps = []
  const n = a.length

  steps.push({ array: [...a], highlights: {}, description: `初始数组: [${a.join(', ')}]`, codeLine: 0 })

  function merge(l, m, r) {
    const left = a.slice(l, m + 1)
    const right = a.slice(m + 1, r + 1)
    let i = 0, j = 0, k = l

    const hl = {}
    for (let x = l; x <= r; x++) hl[x] = 'compare'
    steps.push({ array: [...a], highlights: hl, description: `合并 [${left.join(',')}] 和 [${right.join(',')}]`, codeLine: 1 })

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        a[k] = left[i]; i++
      } else {
        a[k] = right[j]; j++
      }
      steps.push({ array: [...a], highlights: { [k]: 'swap' }, description: `放入 ${a[k]}`, codeLine: 4 })
      k++
    }
    while (i < left.length) { a[k] = left[i]; steps.push({ array: [...a], highlights: { [k]: 'current' }, description: `放入左侧剩余 ${a[k]}`, codeLine: 5 }); i++; k++ }
    while (j < right.length) { a[k] = right[j]; steps.push({ array: [...a], highlights: { [k]: 'current' }, description: `放入右侧剩余 ${a[k]}`, codeLine: 6 }); j++; k++ }
  }

  function ms(l, r) {
    if (l < r) {
      const m = Math.floor((l + r) / 2)
      steps.push({ array: [...a], highlights: { [l]: 'compare', [r]: 'compare' }, description: `分割: [${l}..${m}] 和 [${m+1}..${r}]`, codeLine: 8 })
      ms(l, m)
      ms(m + 1, r)
      merge(l, m, r)
    }
  }

  if (n > 0) ms(0, n - 1)
  steps.push({ array: [...a], highlights: Object.fromEntries([...Array(n).keys()].map(i => [i, 'sorted'])), description: `排序完成: [${a.join(', ')}]`, codeLine: 12 })
  return steps
}
