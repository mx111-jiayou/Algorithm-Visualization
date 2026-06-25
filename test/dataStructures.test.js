import { describe, it, expect } from 'vitest'
import { linearListSteps, stackQueueSteps, treeSteps } from '../src/algorithms/dataStructures'

describe('数据结构算法测试', () => {
  // 验证步骤格式
  function validateSteps(steps) {
    expect(steps.length).toBeGreaterThan(0)
    steps.forEach(step => {
      expect(step).toHaveProperty('description')
      expect(step).toHaveProperty('codeLine')
    })
  }

  describe('线性表操作', () => {
    describe('顺序表 (数组)', () => {
      it('应该生成插入和删除步骤', () => {
        const steps = linearListSteps('array-list', [10, 20, 30, 40, 50])
        validateSteps(steps)

        // 应该包含插入和删除操作
        const hasInsert = steps.some(s => s.description.includes('插入'))
        const hasDelete = steps.some(s => s.description.includes('删除'))
        expect(hasInsert || hasDelete).toBe(true)
      })

      it('应该正确处理数组索引', () => {
        const steps = linearListSteps('array-list', [1, 2, 3])
        validateSteps(steps)
        expect(steps[0].array).toBeDefined()
      })
    })

    describe('链表', () => {
      const linkedListTypes = [
        'singly-linked',
        'singly-linked-head',
        'doubly-linked',
        'doubly-linked-head',
        'circular-singly',
        'circular-doubly'
      ]

      linkedListTypes.forEach(listType => {
        it(`${listType} 应该生成创建和操作步骤`, () => {
          const steps = linearListSteps(listType, [10, 20, 30, 40])
          validateSteps(steps)
          expect(steps[0].type).toBe('linkedlist')
        })
      })

      it('应该包含遍历操作', () => {
        const steps = linearListSteps('singly-linked', [1, 2, 3, 4, 5])
        const hasTraversal = steps.some(s => s.traversal && s.traversal.length > 0)
        expect(hasTraversal).toBe(true)
      })
    })
  })

  describe('栈和队列操作', () => {
    describe('栈', () => {
      it('应该生成push和pop步骤', () => {
        const steps = stackQueueSteps('stack-array', [10, 20, 30])
        validateSteps(steps)

        const hasPush = steps.some(s => s.description.includes('Push'))
        const hasPop = steps.some(s => s.description.includes('Pop'))
        expect(hasPush).toBe(true)
        expect(hasPop).toBe(true)
      })

      it('栈状态应该正确', () => {
        const steps = stackQueueSteps('stack-array', [5, 10, 15])
        const emptyStep = steps.find(s => s.stack && s.stack.length === 0)
        expect(emptyStep).toBeDefined()
      })

      it('链栈应该正常工作', () => {
        const steps = stackQueueSteps('stack-linked', [1, 2, 3])
        validateSteps(steps)
        expect(steps[0].type).toBe('stack')
      })
    })

    describe('队列', () => {
      it('应该生成enqueue和dequeue步骤', () => {
        const steps = stackQueueSteps('queue-array', [10, 20, 30])
        validateSteps(steps)

        const hasEnqueue = steps.some(s => s.description.includes('Enqueue'))
        const hasDequeue = steps.some(s => s.description.includes('Dequeue'))
        expect(hasEnqueue).toBe(true)
        expect(hasDequeue).toBe(true)
      })

      it('应该正确标记front和rear', () => {
        const steps = stackQueueSteps('queue-array', [5, 10])
        const queueStep = steps.find(s => s.front !== undefined)
        expect(queueStep).toBeDefined()
      })
    })

    describe('循环队列', () => {
      it('应该正确处理循环利用', () => {
        const steps = stackQueueSteps('circular-queue', [10, 20, 30, 40])
        validateSteps(steps)

        const hasCircular = steps.some(s => s.description.includes('循环'))
        expect(hasCircular).toBe(true)
      })

      it('应该显示数组索引', () => {
        const steps = stackQueueSteps('circular-queue', [1, 2, 3])
        validateSteps(steps)
        expect(steps[0].type).toBe('circular-queue')
      })
    })

    describe('括号匹配', () => {
      it('应该正确匹配括号', () => {
        const steps = stackQueueSteps('bracket-match', '{[()]}')
        validateSteps(steps)

        const hasMatch = steps.some(s => s.result === 'valid')
        expect(hasMatch).toBe(true)
      })

      it('应该检测不匹配', () => {
        const steps = stackQueueSteps('bracket-match', '{[(])}')
        validateSteps(steps)

        const hasMismatch = steps.some(s => s.result === 'invalid' || s.result === 'mismatch')
        expect(hasMismatch).toBe(true)
      })

      it('应该处理空字符串', () => {
        const steps = stackQueueSteps('bracket-match', '')
        validateSteps(steps)
      })
    })

    describe('表达式计算', () => {
      it('应该正确计算表达式', () => {
        const steps = stackQueueSteps('expression', '3+5*2-1')
        validateSteps(steps)

        // 最终结果应该是12
        const finalStep = steps[steps.length - 1]
        expect(finalStep.description).toContain('12')
      })

      it('应该生成后缀表达式', () => {
        const steps = stackQueueSteps('expression', '3+5')
        validateSteps(steps)

        const hasPostfix = steps.some(s => s.postfix)
        expect(hasPostfix).toBe(true)
      })
    })
  })

  describe('树结构操作', () => {
    describe('二叉树', () => {
      it('应该生成遍历步骤', () => {
        const steps = treeSteps('binary-tree', [1, 2, 3, 4, 5, 6, 7])
        validateSteps(steps)

        const hasTraversal = steps.some(s => s.traversal && s.traversal.length > 0)
        expect(hasTraversal).toBe(true)
      })

      it('应该包含前序遍历', () => {
        const steps = treeSteps('binary-tree', [1, 2, 3])
        const preorderStep = steps.find(s => s.description.includes('前序'))
        expect(preorderStep).toBeDefined()
      })
    })

    describe('二叉排序树 (BST)', () => {
      it('应该正确构建BST', () => {
        const steps = treeSteps('bst', [50, 30, 70, 20, 40])
        validateSteps(steps)

        const hasInsert = steps.some(s => s.description.includes('插入'))
        expect(hasInsert).toBe(true)
      })

      it('应该包含查找操作', () => {
        const steps = treeSteps('bst', [50, 30, 70, 20, 40, 60, 80])
        validateSteps(steps)

        const hasSearch = steps.some(s => s.description.includes('查找'))
        expect(hasSearch).toBe(true)
      })

      it('应该演示中序遍历', () => {
        const steps = treeSteps('bst', [50, 30, 70])
        const inorderStep = steps.find(s => s.description.includes('中序'))
        expect(inorderStep).toBeDefined()
      })
    })

    describe('哈夫曼树', () => {
      it('应该正确构建哈夫曼树', () => {
        const steps = treeSteps('huffman-tree', [5, 29, 7, 8, 14, 23, 3, 11])
        validateSteps(steps)

        const hasMerge = steps.some(s => s.description.includes('合并'))
        expect(hasMerge).toBe(true)
      })

      it('应该显示权重合并过程', () => {
        const steps = treeSteps('huffman-tree', [3, 5, 7])
        validateSteps(steps)

        const weightStep = steps.find(s => s.description.includes('权值'))
        expect(weightStep).toBeDefined()
      })
    })
  })

  describe('复杂度测试', () => {
    it('大数组应该生成合理数量的步骤', () => {
      const largeArray = Array.from({ length: 20 }, (_, i) => i + 1)
      const steps = linearListSteps('array-list', largeArray)
      validateSteps(steps)
      expect(steps.length).toBeLessThan(100) // 步骤数不应过多
    })

    it('长链表应该生成合理数量的步骤', () => {
      const longList = Array.from({ length: 15 }, (_, i) => i * 10)
      const steps = linearListSteps('singly-linked', longList)
      validateSteps(steps)
      expect(steps.length).toBeGreaterThan(10)
    })
  })
})