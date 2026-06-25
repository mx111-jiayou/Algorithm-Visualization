// 线性表、栈队列、树结构算法步骤生成

// 线性表操作
export function linearListSteps(id, data) {
  const arr = data || [10, 20, 30, 40, 50]
  const steps = []

  switch (id) {
    case 'array-list': {
      const len0 = arr.length
      const capacity = len0 + 3
      const i = Math.min(4, len0)   // 插入/删除位置
      const x = 50                  // 插入值
      const w = [...arr]            // 工作数组
      let length = len0

      // #1 初始化
      steps.push({ type: 'array', array: w.slice(0, length), highlights: {}, title: '初始化', description: `顺序表-数组: length=${length}, capacity=${capacity}`, codeLine: 0 })
      // #2 检查位置
      steps.push({ type: 'array', array: w.slice(0, length), highlights: { [i]: 'current' }, title: '检查位置', description: `准备在 i=${i} 插入 ${x}, 检查位置和容量`, codeLine: 1 })
      // #3..#6 后移 (从后往前为插入腾空位)
      for (let j = length - 1; j >= i; j--) {
        w[j + 1] = w[j]
        steps.push({ type: 'array', array: w.slice(0, length + 1), highlights: { [j + 1]: 'swap' }, title: '后移', description: `data[${j + 1}] = data[${j}], 为插入腾出空位`, codeLine: 3 })
      }
      // #7 写入
      w[i] = x
      length++
      steps.push({ type: 'array', array: w.slice(0, length), highlights: { [i]: 'visited' }, title: '写入', description: `data[${i}] = ${x}, length 增为 ${length}`, codeLine: 4 })

      // #8 删除定位
      steps.push({ type: 'array', array: w.slice(0, length), highlights: { [i]: 'current' }, title: '删除定位', description: `准备删除 data[${i}]=${w[i]}, 检查位置`, codeLine: 10 })
      // #9.. 前移 (覆盖删除位置)
      for (let j = i; j < length - 1; j++) {
        w[j] = w[j + 1]
        steps.push({ type: 'array', array: w.slice(0, length), highlights: { [j]: 'swap' }, title: '前移', description: `data[${j}] = data[${j + 1}], ${j === i ? '覆盖删除位置' : '元素前移'}`, codeLine: 12 })
      }
      // 长度更新
      length--
      steps.push({ type: 'array', array: w.slice(0, length), highlights: {}, title: '长度更新', description: `length 减为 ${length}`, codeLine: 13 })
      // 完成
      steps.push({ type: 'array', array: w.slice(0, length), highlights: {}, title: '完成', description: '插入与删除操作完成', codeLine: 14 })
      break
    }
    case 'singly-linked':
    case 'singly-linked-head':
    case 'doubly-linked':
    case 'doubly-linked-head':
    case 'circular-singly':
    case 'circular-doubly': {
      // 初始数组
      const initArr = data || [10, 20, 30, 40, 50]
      const listType = id

      // 步骤1：空链表
      steps.push({ type: 'linkedlist', data: [], listType, highlights: {}, description: '空链表', codeLine: 0 })

      // 步骤2-6：逐步创建链表
      const currentList = []
      for (let i = 0; i < initArr.length; i++) {
        currentList.push(initArr[i])
        const hl = { [i]: 'current' }
        steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: hl, description: `创建节点 ${i}，数据域=${initArr[i]}`, codeLine: 1 })
      }

      // 步骤7：链表创建完成
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: {}, description: '链表创建完成', codeLine: 2 })

      // 步骤8-12：在第2个节点后插入新节点（逐步演示）
      const insertPos = 2
      const insertVal = 25

      // 查找插入位置
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: { [insertPos]: 'current' }, description: `准备插入：定位到第${insertPos}个节点（数据=${currentList[insertPos]}）`, codeLine: 3 })

      // 创建新节点
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: { [insertPos]: 'current' }, description: `创建新节点，数据域=${insertVal}`, codeLine: 4 })

      // 修改指针（插入过程）
      currentList.splice(insertPos + 1, 0, insertVal)
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: { [insertPos + 1]: 'visited', [insertPos]: 'current' }, description: `插入完成：新节点${insertVal}已插入到第${insertPos}节点后`, codeLine: 5 })

      // 步骤13：插入后状态
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: {}, description: `链表当前状态: ${currentList.join('→')}`, codeLine: 6 })

      // 步骤14-18：删除第3个节点（逐步演示）
      const deletePos = 3

      // 查找删除位置
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: { [deletePos]: 'swap' }, description: `准备删除：定位到第${deletePos}个节点（数据=${currentList[deletePos]}）`, codeLine: 7 })

      // 定位前驱节点
      if (deletePos > 0) {
        steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: { [deletePos - 1]: 'current', [deletePos]: 'swap' }, description: `定位前驱节点（第${deletePos - 1}个节点，数据=${currentList[deletePos - 1]}）`, codeLine: 8 })
      }

      // 修改指针（删除过程）
      const deletedVal = currentList[deletePos]
      currentList.splice(deletePos, 1)
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: { [deletePos - 1 >= 0 ? deletePos - 1 : 0]: 'visited' }, description: `删除完成：节点${deletedVal}已删除，前驱指针后移`, codeLine: 9 })

      // 步骤19：删除后状态
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: {}, description: `链表当前状态: ${currentList.join('→')}`, codeLine: 10 })

      // 步骤20-24：遍历链表
      const traversal = []
      for (let i = 0; i < currentList.length; i++) {
        traversal.push(currentList[i])
        steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: { [i]: 'visited' }, traversal: [...traversal], description: `遍历：访问第${i}个节点，数据=${currentList[i]}，累计: ${traversal.join('→')}`, codeLine: 11 })
      }

      // 最终步骤
      steps.push({ type: 'linkedlist', data: [...currentList], listType, highlights: {}, traversal: [...traversal], description: `链表演示完成，遍历结果: ${traversal.join('→')}`, codeLine: 12 })
      break
    }
  }
  return steps
}

// 栈队列操作
export function stackQueueSteps(id, data) {
  const arr = data || [10, 20, 30, 40]
  const steps = []

  switch (id) {
    case 'stack-array':
    case 'stack-linked': {
      const stack = []
      steps.push({ type: 'stack', stack: [], highlights: {}, description: '空栈', codeLine: 0 })
      arr.forEach((val, i) => {
        stack.push(val)
        steps.push({ type: 'stack', stack: [...stack], highlights: { [stack.length - 1]: 'current' }, description: `Push ${val}`, codeLine: 1 })
      })
      while (stack.length > 0) {
        const val = stack.pop()
        steps.push({ type: 'stack', stack: [...stack], highlights: { [stack.length]: 'swap' }, description: `Pop ${val}`, codeLine: 2 })
      }
      break
    }
    case 'queue-array':
    case 'queue-linked': {
      const queue = []
      steps.push({ type: 'queue', queue: [], front: -1, highlights: {}, description: '空队列', codeLine: 0 })
      arr.forEach((val) => {
        queue.push(val)
        steps.push({ type: 'queue', queue: [...queue], front: 0, highlights: { [queue.length - 1]: 'current' }, description: `Enqueue ${val}`, codeLine: 1 })
      })
      while (queue.length > 0) {
        const val = queue.shift()
        steps.push({ type: 'queue', queue: [...queue], front: 0, highlights: { 0: 'swap' }, description: `Dequeue ${val}`, codeLine: 2 })
      }
      break
    }
    case 'circular-queue': {
      const size = 6
      const cq = Array(size).fill(null)
      let front = 0, rear = 0, count = 0
      steps.push({ type: 'circular-queue', queue: [...cq], front, rear, size, highlights: {}, description: '空循环队列', codeLine: 0 })
      arr.forEach((val) => {
        cq[rear] = val
        rear = (rear + 1) % size; count++
        steps.push({ type: 'circular-queue', queue: [...cq], front, rear, size, highlights: { [(rear - 1 + size) % size]: 'current' }, description: `Enqueue ${val}, rear=${rear}`, codeLine: 1 })
      })
      // Dequeue 2
      for (let i = 0; i < 2; i++) {
        const val = cq[front]
        cq[front] = null
        front = (front + 1) % size; count--
        steps.push({ type: 'circular-queue', queue: [...cq], front, rear, size, highlights: { [(front - 1 + size) % size]: 'swap' }, description: `Dequeue ${val}, front=${front}`, codeLine: 2 })
      }
      // 再入队
      cq[rear] = 50; rear = (rear + 1) % size; count++
      steps.push({ type: 'circular-queue', queue: [...cq], front, rear, size, highlights: { [(rear - 1 + size) % size]: 'current' }, description: `Enqueue 50, rear=${rear} (循环利用空间)`, codeLine: 3 })
      break
    }
    case 'bracket-match': {
      const str = typeof data === 'string' ? data : '{[()]}'
      const stack = []
      const pairs = { ')': '(', ']': '[', '}': '{' }
      steps.push({ type: 'bracket', string: str, stack: [], pos: -1, result: null, highlights: {}, description: `括号匹配: ${str}`, codeLine: 0 })
      let valid = true
      for (let i = 0; i < str.length; i++) {
        const ch = str[i]
        if ('([{'.includes(ch)) {
          stack.push(ch)
          steps.push({ type: 'bracket', string: str, stack: [...stack], pos: i, result: null, highlights: { [i]: 'current' }, description: `左括号 '${ch}' 入栈`, codeLine: 1 })
        } else if (')]}'.includes(ch)) {
          const top = stack.pop()
          const match = top === pairs[ch]
          steps.push({ type: 'bracket', string: str, stack: [...stack], pos: i, result: match ? 'match' : 'mismatch', highlights: { [i]: match ? 'visited' : 'swap' }, description: match ? `'${ch}' 与 '${top}' 匹配` : `'${ch}' 与 '${top}' 不匹配!`, codeLine: 2 })
          if (!match) { valid = false; break }
        }
      }
      if (valid && stack.length === 0) {
        steps.push({ type: 'bracket', string: str, stack: [], pos: -1, result: 'valid', highlights: {}, description: '括号匹配成功!', codeLine: 3 })
      } else {
        steps.push({ type: 'bracket', string: str, stack: [...stack], pos: -1, result: 'invalid', highlights: {}, description: '括号不匹配!', codeLine: 3 })
      }
      break
    }
    case 'expression': {
      const expr = typeof data === 'string' ? data : '3+5*2-1'
      const opStack = []
      const numStack = []
      const postfix = []
      const prec = { '+': 1, '-': 1, '*': 2, '/': 2 }
      steps.push({ type: 'expression', expr, opStack: [...opStack], numStack: [...numStack], postfix: '', highlights: {}, description: `表达式: ${expr}`, codeLine: 0 })
      for (let i = 0; i < expr.length; i++) {
        const ch = expr[i]
        if (/\d/.test(ch)) {
          postfix.push(ch)
          numStack.push(parseInt(ch))
          steps.push({ type: 'expression', expr, opStack: [...opStack], numStack: [...numStack], postfix: postfix.join(''), highlights: { [i]: 'current' }, description: `数字 ${ch} 直接输出`, codeLine: 1 })
        } else if ('+-*/'.includes(ch)) {
          while (opStack.length && prec[opStack[opStack.length - 1]] >= prec[ch]) {
            const op = opStack.pop()
            postfix.push(op)
            const b = numStack.pop(), a = numStack.pop()
            const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b
            numStack.push(result)
            steps.push({ type: 'expression', expr, opStack: [...opStack], numStack: [...numStack], postfix: postfix.join(''), highlights: { [i]: 'swap' }, description: `弹出 '${op}' 计算 ${a}${op}${b}=${result}`, codeLine: 2 })
          }
          opStack.push(ch)
          steps.push({ type: 'expression', expr, opStack: [...opStack], numStack: [...numStack], postfix: postfix.join(''), highlights: { [i]: 'current' }, description: `运算符 '${ch}' 入栈`, codeLine: 2 })
        }
      }
      while (opStack.length) {
        const op = opStack.pop()
        postfix.push(op)
        const b = numStack.pop(), a = numStack.pop()
        const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b
        numStack.push(result)
        steps.push({ type: 'expression', expr, opStack: [...opStack], numStack: [...numStack], postfix: postfix.join(''), highlights: {}, description: `弹出 '${op}' 计算 ${a}${op}${b}=${result}`, codeLine: 3 })
      }
      steps.push({ type: 'expression', expr, opStack: [], numStack: [...numStack], postfix: postfix.join(''), highlights: {}, description: `结果: ${numStack[0]} (后缀: ${postfix.join('')})`, codeLine: 4 })
      break
    }
  }
  return steps
}

// 树结构操作
export function treeSteps(id, data) {
  const arr = data || [1, 2, 3, 4, 5, 6, 7]
  const steps = []

  function buildTree(arr, i = 0) {
    if (i >= arr.length) return null
    return { val: arr[i], left: buildTree(arr, 2 * i + 1), right: buildTree(arr, 2 * i + 2) }
  }

  switch (id) {
    case 'binary-tree': {
      const tree = buildTree(arr)
      steps.push({ type: 'tree', tree, traversal: [], highlights: {}, description: '二叉树结构', codeLine: 0 })
      // 前序遍历
      const preOrder = []
      function preTraversal(node) {
        if (!node) return
        preOrder.push(node.val)
        steps.push({ type: 'tree', tree, traversal: [...preOrder], highlights: { [node.val]: 'current' }, description: `前序遍历: 访问 ${node.val}`, codeLine: 1 })
        preTraversal(node.left)
        preTraversal(node.right)
      }
      preTraversal(tree)
      steps.push({ type: 'tree', tree, traversal: [...preOrder], highlights: {}, description: `前序遍历完成: ${preOrder.join('→')}`, codeLine: 3 })
      break
    }
    case 'bst': {
      const bstArr = data || [50, 30, 70, 20, 40, 60, 80]
      let bstRoot = null

      // 步骤1：空BST
      steps.push({ type: 'tree', tree: null, traversal: [], highlights: {}, description: '空BST，准备插入节点', codeLine: 0 })

      // 步骤2-8：插入过程（逐步插入，每次插入都显示比较路径）
      for (const val of bstArr) {
        // 显示插入前的比较路径
        const path = bstFindPath(bstRoot, val)
        if (path.length > 0) {
          // 高亮比较路径上的节点
          const pathHighlights = {}
          path.forEach((pVal, idx) => {
            pathHighlights[pVal] = idx === path.length - 1 ? 'current' : 'compare'
          })
          steps.push({ type: 'tree', tree: bstRoot, traversal: [], highlights: pathHighlights, description: `插入 ${val}：比较路径 ${path.join('→')}`, codeLine: 1 })
        }

        // 执行插入
        bstRoot = bstInsert(bstRoot, val)
        steps.push({ type: 'tree', tree: bstRoot, traversal: [], highlights: { [val]: 'visited' }, description: `插入 ${val} 完成`, codeLine: 2 })
      }

      // 步骤9：BST构建完成
      steps.push({ type: 'tree', tree: bstRoot, traversal: [], highlights: {}, description: 'BST构建完成', codeLine: 3 })

      // 步骤10-15：查找操作演示
      const searchVal = 40
      const searchPath = bstFindPath(bstRoot, searchVal)
      for (let i = 0; i < searchPath.length; i++) {
        const currentVal = searchPath[i]
        const hl = { [currentVal]: 'current' }
        const desc = i === searchPath.length - 1
          ? `查找 ${searchVal}：找到目标节点！`
          : `查找 ${searchVal}：当前节点 ${currentVal}，${searchVal < currentVal ? '向左' : '向右'}查找`
        steps.push({ type: 'tree', tree: bstRoot, traversal: [], highlights: hl, description: desc, codeLine: 4 })
      }

      // 步骤16：查找完成
      steps.push({ type: 'tree', tree: bstRoot, traversal: [], highlights: {}, description: `查找 ${searchVal} 成功`, codeLine: 5 })

      // 步骤17-22：查找不存在的值
      const failSearchVal = 25
      const failPath = bstFindPath(bstRoot, failSearchVal)
      for (let i = 0; i < failPath.length; i++) {
        const currentVal = failPath[i]
        const hl = { [currentVal]: 'current' }
        const desc = i === failPath.length - 1
          ? `查找 ${failSearchVal}：当前节点 ${currentVal}，目标不存在`
          : `查找 ${failSearchVal}：当前节点 ${currentVal}，${failSearchVal < currentVal ? '向左' : '向右'}查找`
        steps.push({ type: 'tree', tree: bstRoot, traversal: [], highlights: hl, description: desc, codeLine: 6 })
      }

      // 步骤23：查找失败
      steps.push({ type: 'tree', tree: bstRoot, traversal: [], highlights: {}, description: `查找 ${failSearchVal} 失败，节点不存在`, codeLine: 7 })

      // 步骤24-30：中序遍历（有序输出）
      const inOrder = []
      function inOrderTraversal(node) {
        if (!node) return
        inOrderTraversal(node.left)
        inOrder.push(node.val)
        steps.push({ type: 'tree', tree: bstRoot, traversal: [...inOrder], highlights: { [node.val]: 'visited' }, description: `中序遍历：访问 ${node.val}，有序序列: ${inOrder.join('→')}`, codeLine: 8 })
        inOrderTraversal(node.right)
      }
      inOrderTraversal(bstRoot)

      // 最终步骤
      steps.push({ type: 'tree', tree: bstRoot, traversal: [...inOrder], highlights: {}, description: `BST演示完成，有序序列: ${inOrder.join('→')}`, codeLine: 9 })
      break
    }
    case 'huffman-tree': {
      const weights = data || [5, 29, 7, 8, 14, 23, 3, 11]
      const nodes = weights.map(w => ({ val: w, weight: w, left: null, right: null }))
      steps.push({ type: 'huffman', nodes: nodes.map(n => ({ ...n })), tree: null, highlights: {}, description: `权值: [${weights.join(', ')}]`, codeLine: 0 })
      while (nodes.length > 1) {
        nodes.sort((a, b) => a.weight - b.weight)
        const left = nodes.shift()
        const right = nodes.shift()
        const parent = { val: left.weight + right.weight, weight: left.weight + right.weight, left, right }
        nodes.push(parent)
        steps.push({ type: 'huffman', nodes: nodes.map(n => ({ ...n })), tree: parent, highlights: { [parent.weight]: 'current' }, description: `合并 ${left.weight}+${right.weight}=${parent.weight}`, codeLine: 2 })
      }
      steps.push({ type: 'huffman', nodes: [], tree: nodes[0], highlights: {}, description: '哈夫曼树构建完成', codeLine: 4 })
      break
    }
  }
  return steps
}

function bstInsert(root, val) {
  if (!root) return { val, left: null, right: null }
  if (val < root.val) root.left = bstInsert(root.left, val)
  else root.right = bstInsert(root.right, val)
  return root
}

// 查找BST中的值，返回访问路径
function bstFindPath(root, val) {
  const path = []
  let current = root
  while (current) {
    path.push(current.val)
    if (val === current.val) break
    current = val < current.val ? current.left : current.right
  }
  return path
}
