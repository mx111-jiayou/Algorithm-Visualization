import { describe, it, expect } from 'vitest'
import { dijkstra, bfs, dfs } from '../src/algorithms/graph'

describe('图算法测试', () => {
  // 验证步骤格式
  function validateGraphSteps(steps) {
    expect(steps.length).toBeGreaterThan(0)
    steps.forEach(step => {
      expect(step).toHaveProperty('description')
      expect(step).toHaveProperty('codeLine')
    })
  }

  // 标准测试图数据
  const testGraph = {
    nodes: 5,
    edges: [
      [0, 1, 10],
      [0, 2, 5],
      [1, 2, 2],
      [1, 3, 1],
      [2, 1, 3],
      [2, 3, 9],
      [2, 4, 2],
      [3, 4, 4]
    ]
  }

  describe('Dijkstra最短路径', () => {
    it('应该正确计算最短路径', () => {
      const steps = dijkstra(testGraph)
      validateGraphSteps(steps)

      // 检查是否包含visited标记
      const hasVisited = steps.some(s => Object.values(s.nodeStates || {}).includes('visited'))
      expect(hasVisited).toBe(true)
    })

    it('应该处理单节点图', () => {
      const singleNode = { nodes: 1, edges: [] }
      const steps = dijkstra(singleNode)
      validateGraphSteps(steps)
    })

    it('应该处理线性图', () => {
      const linearGraph = {
        nodes: 4,
        edges: [
          [0, 1, 1],
          [1, 2, 2],
          [2, 3, 3]
        ]
      }
      const steps = dijkstra(linearGraph)
      validateGraphSteps(steps)
    })

    it('应该处理不连通图', () => {
      const disconnectedGraph = {
        nodes: 4,
        edges: [
          [0, 1, 5],
          [2, 3, 3]
        ]
      }
      const steps = dijkstra(disconnectedGraph)
      validateGraphSteps(steps)
    })

    it('应该包含距离信息', () => {
      const steps = dijkstra(testGraph)
      const distanceStep = steps.find(s => s.distances)
      expect(distanceStep).toBeDefined()
    })
  })

  describe('广度优先搜索 (BFS)', () => {
    it('应该正确遍历图', () => {
      const steps = bfs(testGraph)
      validateGraphSteps(steps)

      // BFS应该按层级访问
      const hasVisited = steps.some(s => Object.values(s.nodeHighlights || {}).includes('visited'))
      expect(hasVisited).toBe(true)
    })

    it('应该处理环形图', () => {
      const cycleGraph = {
        nodes: 3,
        edges: [
          [0, 1, 1],
          [1, 2, 1],
          [2, 0, 1]
        ]
      }
      const steps = bfs(cycleGraph)
      validateGraphSteps(steps)
    })

    it('应该处理树形结构', () => {
      const treeGraph = {
        nodes: 5,
        edges: [
          [0, 1, 1],
          [0, 2, 1],
          [1, 3, 1],
          [1, 4, 1]
        ]
      }
      const steps = bfs(treeGraph)
      validateGraphSteps(steps)
    })

    it('应该包含队列信息', () => {
      const steps = bfs(testGraph)
      const queueStep = steps.find(s => s.queue)
      expect(queueStep).toBeDefined()
    })
  })

  describe('深度优先搜索 (DFS)', () => {
    it('应该正确遍历图', () => {
      const steps = dfs(testGraph)
      validateGraphSteps(steps)

      const hasVisited = steps.some(s => Object.values(s.nodeHighlights || {}).includes('visited'))
      expect(hasVisited).toBe(true)
    })

    it('应该处理环形图', () => {
      const cycleGraph = {
        nodes: 3,
        edges: [
          [0, 1, 1],
          [1, 2, 1],
          [2, 0, 1]
        ]
      }
      const steps = dfs(cycleGraph)
      validateGraphSteps(steps)
    })

    it('应该处理路径图', () => {
      const pathGraph = {
        nodes: 5,
        edges: [
          [0, 1, 1],
          [1, 2, 1],
          [2, 3, 1],
          [3, 4, 1]
        ]
      }
      const steps = dfs(pathGraph)
      validateGraphSteps(steps)
    })

    it('应该包含栈或递归信息', () => {
      const steps = dfs(testGraph)
      const stackStep = steps.find(s => s.stack || s.description.includes('递归'))
      expect(stackStep).toBeDefined()
    })
  })

  describe('图算法对比测试', () => {
    it('所有算法应该访问所有可达节点', () => {
      const connectedGraph = {
        nodes: 4,
        edges: [
          [0, 1, 1],
          [1, 2, 1],
          [2, 3, 1]
        ]
      }

      const dijkstraSteps = dijkstra(connectedGraph)
      const bfsSteps = bfs(connectedGraph)
      const dfsSteps = dfs(connectedGraph)

      // 所有算法都应该有步骤
      expect(dijkstraSteps.length).toBeGreaterThan(0)
      expect(bfsSteps.length).toBeGreaterThan(0)
      expect(dfsSteps.length).toBeGreaterThan(0)
    })

    it('算法应该处理空边集', () => {
      const emptyGraph = { nodes: 3, edges: [] }
      
      expect(() => dijkstra(emptyGraph)).not.toThrow()
      expect(() => bfs(emptyGraph)).not.toThrow()
      expect(() => dfs(emptyGraph)).not.toThrow()
    })
  })

  describe('边界情况测试', () => {
    it('应该处理权重为0的边', () => {
      const zeroWeightGraph = {
        nodes: 3,
        edges: [
          [0, 1, 0],
          [1, 2, 5]
        ]
      }
      const steps = dijkstra(zeroWeightGraph)
      validateGraphSteps(steps)
    })

    it('应该处理大权重', () => {
      const largeWeightGraph = {
        nodes: 3,
        edges: [
          [0, 1, 1000],
          [1, 2, 2000]
        ]
      }
      const steps = dijkstra(largeWeightGraph)
      validateGraphSteps(steps)
    })
  })
})