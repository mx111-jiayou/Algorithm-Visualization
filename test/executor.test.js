import { describe, it, expect } from 'vitest'
import { executeAlgorithm, generateRandomData } from '../src/algorithms/executor'

describe('算法执行器测试', () => {
  describe('executeAlgorithm - 算法分发', () => {
    it('应该分发到排序算法', () => {
      const steps = executeAlgorithm('bubble-sort', [3, 1, 2])
      expect(steps.length).toBeGreaterThan(0)
      const last = steps[steps.length - 1].array
      expect(last).toEqual([1, 2, 3])
    })

    it('应该分发所有6种排序算法', () => {
      const sortIds = ['bubble-sort', 'quick-sort', 'insertion-sort', 'shell-sort', 'selection-sort', 'merge-sort']
      sortIds.forEach(id => {
        const steps = executeAlgorithm(id, [5, 2, 8, 1])
        expect(steps[steps.length - 1].array).toEqual([1, 2, 5, 8])
      })
    })

    it('应该分发到图算法', () => {
      const graph = { nodes: 3, edges: [[0, 1, 1], [1, 2, 1]] }
      expect(executeAlgorithm('dijkstra', graph)[0].type).toBe('graph')
      expect(executeAlgorithm('bfs', graph)[0].type).toBe('graph')
      expect(executeAlgorithm('dfs', graph)[0].type).toBe('graph')
    })

    it('应该分发到递归回溯算法', () => {
      expect(executeAlgorithm('hanoi', 3)[0].type).toBe('hanoi')
      expect(executeAlgorithm('chessboard', 2)[0].type).toBe('chessboard')
      expect(executeAlgorithm('graph-coloring', { nodes: 3, edges: [[0, 1, 1]], colors: 3 })[0].type).toBe('coloring')
      expect(executeAlgorithm('maze', [[1, 1, 1], [1, 0, 1], [1, 1, 1]])[0].type).toBe('maze')
    })

    it('应该分发到线性表算法', () => {
      const steps = executeAlgorithm('array-list', [1, 2, 3])
      expect(steps.length).toBeGreaterThan(0)
      expect(executeAlgorithm('singly-linked', [1, 2, 3])[0].type).toBe('linkedlist')
    })

    it('应该分发到栈和队列算法', () => {
      expect(executeAlgorithm('stack-array', [1, 2])[0].type).toBe('stack')
      expect(executeAlgorithm('queue-array', [1, 2])[0].type).toBe('queue')
      expect(executeAlgorithm('circular-queue', [1, 2])[0].type).toBe('circular-queue')
      expect(executeAlgorithm('bracket-match', '()')[0].type).toBe('bracket')
      expect(executeAlgorithm('expression', '1+2')[0].type).toBe('expression')
    })

    it('应该分发到树算法', () => {
      expect(executeAlgorithm('binary-tree', [1, 2, 3])[0].type).toBe('tree')
      expect(executeAlgorithm('bst', [50, 30, 70])[0].type).toBe('tree')
      expect(executeAlgorithm('huffman-tree', [3, 5, 7])[0].type).toBe('huffman')
    })

    it('未知算法ID应该返回空数组', () => {
      expect(executeAlgorithm('not-an-algorithm', [1, 2, 3])).toEqual([])
    })
  })

  describe('generateRandomData - 随机数据生成', () => {
    it('array: 应该生成合理长度的数字数组', () => {
      for (let i = 0; i < 20; i++) {
        const data = generateRandomData('array')
        expect(Array.isArray(data)).toBe(true)
        expect(data.length).toBeGreaterThanOrEqual(7)
        expect(data.length).toBeLessThanOrEqual(12)
        data.forEach(v => {
          expect(Number.isInteger(v)).toBe(true)
          expect(v).toBeGreaterThanOrEqual(1)
          expect(v).toBeLessThanOrEqual(99)
        })
      }
    })

    it('graph: 应该生成连通图', () => {
      for (let i = 0; i < 20; i++) {
        const data = generateRandomData('graph')
        expect(data.nodes).toBeGreaterThanOrEqual(4)
        expect(data.nodes).toBeLessThanOrEqual(7)
        // 生成树保证连通，至少 n-1 条边
        expect(data.edges.length).toBeGreaterThanOrEqual(data.nodes - 1)
        data.edges.forEach(([u, v, w]) => {
          expect(u).not.toBe(v)
          expect(w).toBeGreaterThanOrEqual(1)
        })
      }
    })

    it('number: 应该按算法返回对应范围', () => {
      for (let i = 0; i < 20; i++) {
        const hanoiN = generateRandomData('number', 'hanoi')
        expect(hanoiN).toBeGreaterThanOrEqual(3)
        expect(hanoiN).toBeLessThanOrEqual(5)
        const chessN = generateRandomData('number', 'chessboard')
        expect(chessN).toBeGreaterThanOrEqual(2)
        expect(chessN).toBeLessThanOrEqual(3)
      }
      expect(generateRandomData('number', 'other')).toBe(3)
    })

    it('string: 括号匹配应该只含括号字符', () => {
      for (let i = 0; i < 20; i++) {
        const data = generateRandomData('string', 'bracket-match')
        expect(/^[()[\]{}]+$/.test(data)).toBe(true)
      }
    })

    it('string: 表达式应该包含数字和运算符', () => {
      for (let i = 0; i < 20; i++) {
        const data = generateRandomData('string', 'expression')
        expect(/\d/.test(data)).toBe(true)
        expect(/[+\-*]/.test(data)).toBe(true)
      }
    })

    it('maze: 应该生成合法的二维迷宫', () => {
      for (let i = 0; i < 10; i++) {
        const maze = generateRandomData('maze')
        expect(Array.isArray(maze)).toBe(true)
        expect(maze.length % 2).toBe(1) // 奇数尺寸
        maze.forEach(row => {
          expect(row.length).toBe(maze.length)
          row.forEach(v => expect([0, 1]).toContain(v))
        })
        // 入口和出口可通行
        expect(maze[1][1]).toBe(0)
        expect(maze[maze.length - 2][maze.length - 2]).toBe(0)
      }
    })

    it('未知类型应该返回 null', () => {
      expect(generateRandomData('unknown')).toBeNull()
    })
  })

  describe('执行器与随机数据集成测试', () => {
    it('随机数组应该能被排序算法正确处理', () => {
      const data = generateRandomData('array')
      const steps = executeAlgorithm('quick-sort', data)
      const result = steps[steps.length - 1].array
      const expected = [...data].sort((a, b) => a - b)
      expect(result).toEqual(expected)
    })

    it('随机图应该能被图算法处理而不报错', () => {
      const data = generateRandomData('graph')
      expect(() => executeAlgorithm('bfs', data)).not.toThrow()
      expect(() => executeAlgorithm('dfs', data)).not.toThrow()
      expect(() => executeAlgorithm('dijkstra', data)).not.toThrow()
    })
  })
})
