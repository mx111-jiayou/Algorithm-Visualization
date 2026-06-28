// 算法执行器 - 根据算法ID调用对应算法生成步骤
import { bubbleSort, quickSort, insertionSort, shellSort, selectionSort, mergeSort } from './sorting'
import { dijkstra, bfs, dfs, adjacencyMatrix, adjacencyList } from './graph'
import { hanoi, chessboardCover, graphColoring, mazeSolve } from './recursion'
import { linearListSteps, stackQueueSteps, treeSteps } from './dataStructures'

export function executeAlgorithm(algoId, inputData) {
  const sortAlgos = {
    'bubble-sort': bubbleSort,
    'quick-sort': quickSort,
    'insertion-sort': insertionSort,
    'shell-sort': shellSort,
    'selection-sort': selectionSort,
    'merge-sort': mergeSort
  }

  const graphAlgos = {
    'dijkstra': dijkstra,
    'bfs': bfs,
    'dfs': dfs,
    'adjacency-matrix': adjacencyMatrix,
    'adjacency-list': adjacencyList
  }

  const linearListAlgos = [
    'array-list', 'singly-linked', 'singly-linked-head',
    'doubly-linked', 'doubly-linked-head', 'circular-singly', 'circular-doubly'
  ]

  const stackQueueAlgos = [
    'stack-array', 'stack-linked', 'queue-array', 'queue-linked',
    'circular-queue', 'bracket-match', 'expression'
  ]

  const treeAlgos = ['binary-tree', 'bst', 'huffman-tree']

  if (sortAlgos[algoId]) {
    return sortAlgos[algoId](inputData)
  }
  if (graphAlgos[algoId]) {
    return graphAlgos[algoId](inputData)
  }
  if (algoId === 'hanoi') return hanoi(inputData)
  if (algoId === 'chessboard') return chessboardCover(inputData)
  if (algoId === 'graph-coloring') return graphColoring(inputData)
  if (algoId === 'maze') return mazeSolve(inputData)
  if (linearListAlgos.includes(algoId)) return linearListSteps(algoId, inputData)
  if (stackQueueAlgos.includes(algoId)) return stackQueueSteps(algoId, inputData)
  if (treeAlgos.includes(algoId)) return treeSteps(algoId, inputData)

  return []
}

// 随机数据生成
export function generateRandomData(inputType, algoId) {
  switch (inputType) {
    case 'array':
      return Array.from({ length: 7 + Math.floor(Math.random() * 6) }, () => Math.floor(Math.random() * 99) + 1)
    case 'graph': {
      const n = 4 + Math.floor(Math.random() * 4)
      const edges = []
      // 生成树保证连通
      for (let i = 1; i < n; i++) {
        const j = Math.floor(Math.random() * i)
        edges.push([j, i, Math.floor(Math.random() * 20) + 1])
      }
      // 额外边
      const extra = Math.floor(Math.random() * n)
      for (let k = 0; k < extra; k++) {
        const u = Math.floor(Math.random() * n)
        const v = Math.floor(Math.random() * n)
        if (u !== v && !edges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))) {
          edges.push([u, v, Math.floor(Math.random() * 20) + 1])
        }
      }
      return { nodes: n, edges }
    }
    case 'number':
      if (algoId === 'hanoi') return 3 + Math.floor(Math.random() * 3)
      if (algoId === 'chessboard') return 2 + Math.floor(Math.random() * 2)
      return 3
    case 'string':
      if (algoId === 'bracket-match') {
        const brackets = ['()', '[]', '{}']
        let s = ''
        for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
          s += brackets[Math.floor(Math.random() * 3)]
        }
        return s
      }
      if (algoId === 'expression') {
        const ops = ['+', '-', '*']
        let expr = String(Math.floor(Math.random() * 9) + 1)
        for (let i = 0; i < 3; i++) {
          expr += ops[Math.floor(Math.random() * 3)] + (Math.floor(Math.random() * 9) + 1)
        }
        return expr
      }
      return ''
    case 'maze': {
      const size = 5 + Math.floor(Math.random() * 3) * 2 + 1
      const maze = Array.from({ length: size }, () => Array(size).fill(1))
      // 简单迷宫生成
      for (let i = 1; i < size - 1; i++)
        for (let j = 1; j < size - 1; j++)
          if (Math.random() > 0.3) maze[i][j] = 0
      maze[1][1] = 0; maze[size - 2][size - 2] = 0
      return maze
    }
    default:
      return null
  }
}
