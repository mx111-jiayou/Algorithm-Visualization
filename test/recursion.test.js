import { describe, it, expect } from 'vitest'
import { hanoi, chessboardCover, graphColoring, mazeSolve } from '../src/algorithms/recursion'

describe('递归与回溯算法测试', () => {
  // 验证步骤格式
  function validateSteps(steps) {
    expect(steps.length).toBeGreaterThan(0)
    steps.forEach(step => {
      expect(step).toHaveProperty('type')
      expect(step).toHaveProperty('description')
      expect(step).toHaveProperty('codeLine')
    })
  }

  describe('汉诺塔', () => {
    it('应该生成正确类型的步骤', () => {
      const steps = hanoi(3)
      validateSteps(steps)
      steps.forEach(s => expect(s.type).toBe('hanoi'))
    })

    it('n个盘应该产生 2^n-1 次移动', () => {
      for (const n of [1, 2, 3, 4]) {
        const steps = hanoi(n)
        const moveSteps = steps.filter(s => s.move !== null)
        expect(moveSteps.length).toBe(Math.pow(2, n) - 1)
      }
    })

    it('最终所有盘应该移动到C柱', () => {
      const n = 4
      const steps = hanoi(n)
      const last = steps[steps.length - 1]
      expect(last.towers.A.length).toBe(0)
      expect(last.towers.B.length).toBe(0)
      expect(last.towers.C.length).toBe(n)
    })

    it('C柱上的盘应该从大到小排列', () => {
      const last = hanoi(5)[hanoi(5).length - 1]
      const c = last.towers.C
      for (let i = 0; i < c.length - 1; i++) {
        expect(c[i]).toBeGreaterThan(c[i + 1])
      }
    })

    it('应该把盘数限制在 1~7', () => {
      expect(hanoi(0).filter(s => s.move).length).toBe(Math.pow(2, 1) - 1)
      expect(hanoi(100).filter(s => s.move).length).toBe(Math.pow(2, 7) - 1)
    })

    it('初始状态所有盘应该在A柱', () => {
      const steps = hanoi(3)
      expect(steps[0].towers.A.length).toBe(3)
      expect(steps[0].towers.C.length).toBe(0)
    })
  })

  describe('棋盘覆盖', () => {
    it('应该生成正确类型的步骤', () => {
      const steps = chessboardCover(2)
      validateSteps(steps)
      steps.forEach(s => expect(s.type).toBe('chessboard'))
    })

    it('棋盘尺寸应该是 2^k', () => {
      const steps = chessboardCover(2)
      expect(steps[0].size).toBe(4)
      expect(chessboardCover(3)[0].size).toBe(8)
    })

    it('应该用 (size^2-1)/3 个L型骨牌完成覆盖', () => {
      const steps = chessboardCover(2) // 4x4
      const last = steps[steps.length - 1]
      expect(last.description).toContain('完成')
      // 4x4: (16-1)/3 = 5
      expect(last.description).toContain('5')
    })

    it('特殊格应该标记为 -1', () => {
      const steps = chessboardCover(2)
      expect(steps[0].board[0][0]).toBe(-1)
    })

    it('完成后除特殊格外应该全部被覆盖', () => {
      const steps = chessboardCover(2)
      const board = steps[steps.length - 1].board
      let uncovered = 0
      board.forEach(row => row.forEach(v => { if (v === 0) uncovered++ }))
      expect(uncovered).toBe(0)
    })

    it('应该把k限制在 1~4', () => {
      expect(chessboardCover(0)[0].size).toBe(2)
      expect(chessboardCover(10)[0].size).toBe(16)
    })
  })

  describe('图着色', () => {
    const colorableGraph = {
      nodes: 4,
      edges: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [1, 2, 1], [2, 3, 1]],
      colors: 3
    }

    it('应该生成正确类型的步骤', () => {
      const steps = graphColoring(colorableGraph)
      validateSteps(steps)
      steps.forEach(s => expect(s.type).toBe('coloring'))
    })

    it('可着色图应该着色成功', () => {
      const steps = graphColoring(colorableGraph)
      const last = steps[steps.length - 1]
      expect(last.description).toContain('成功')
    })

    it('相邻节点颜色应该不同', () => {
      const steps = graphColoring(colorableGraph)
      const colors = steps[steps.length - 1].colors
      colorableGraph.edges.forEach(([u, v]) => {
        expect(colors[u]).not.toBe(colors[v])
      })
    })

    it('应该包含尝试和回溯过程', () => {
      const steps = graphColoring(colorableGraph)
      const hasTry = steps.some(s => s.description.includes('尝试'))
      expect(hasTry).toBe(true)
    })

    it('默认使用3种颜色', () => {
      const steps = graphColoring({ nodes: 3, edges: [[0, 1, 1], [1, 2, 1]] })
      expect(steps[0].m).toBe(3)
    })

    it('应该包含节点状态信息', () => {
      const steps = graphColoring(colorableGraph)
      expect(steps[0].nodeStates).toBeDefined()
    })
  })

  describe('迷宫求解', () => {
    const maze = [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ]

    it('应该生成正确类型的步骤', () => {
      const steps = mazeSolve(maze)
      validateSteps(steps)
      steps.forEach(s => expect(s.type).toBe('maze'))
    })

    it('应该找到通路', () => {
      const steps = mazeSolve(maze)
      const last = steps[steps.length - 1]
      expect(last.path.length).toBeGreaterThan(0)
      expect(last.description).toContain('完成')
    })

    it('应该包含探索和回溯过程', () => {
      const steps = mazeSolve(maze)
      const hasExplore = steps.some(s => s.description.includes('探索'))
      expect(hasExplore).toBe(true)
    })

    it('不应该修改原始迷宫数组', () => {
      const original = maze.map(r => [...r])
      mazeSolve(maze)
      expect(maze).toEqual(original)
    })

    it('应该处理无解迷宫而不报错', () => {
      const blockedMaze = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
      ]
      expect(() => mazeSolve(blockedMaze)).not.toThrow()
    })
  })
})
