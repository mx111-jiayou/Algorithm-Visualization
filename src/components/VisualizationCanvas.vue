<template>
  <div class="canvas-wrapper" ref="wrapperRef">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  algoId: String,
  step: Object,
  stepIndex: Number
})

const canvasRef = ref(null)
const wrapperRef = ref(null)
let ctx = null
let animId = null

const COLORS = {
  default: '#85BD73',
  compare: '#C9A96E',
  swap: '#C0564B',
  pivot: '#8A7968',
  current: '#1A1A1A',
  visited: '#A4894E',
  sorted: '#A4894E',
  queued: '#B8A88F',
  path: '#C0564B',
  relaxed: '#C9A96E',
  colored: '#8A7968'
}

const NODE_COLORS = {
  default: { fill: '#8A7968', stroke: '#6B5D4F', text: '#F8F6F3' },
  current: { fill: '#1A1A1A', stroke: '#C9A96E', text: '#FFFFFF' },
  visited: { fill: '#85BD73', stroke: '#6FA85E', text: '#FFFFFF' },
  queued: { fill: '#C9A96E', stroke: '#B8945A', text: '#1A1A1A' },
  colored: { fill: '#8A7968', stroke: '#6B5D4F', text: '#FFFFFF' }
}

function resizeCanvas() {
  if (!canvasRef.value || !wrapperRef.value) return
  const rect = wrapperRef.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvasRef.value.width = rect.width * dpr
  canvasRef.value.height = rect.height * dpr
  canvasRef.value.style.width = rect.width + 'px'
  canvasRef.value.style.height = rect.height + 'px'
  ctx = canvasRef.value.getContext('2d')
  ctx.scale(dpr, dpr)
  render()
}

function render() {
  if (!ctx || !canvasRef.value || !props.step) return
  const w = canvasRef.value.style.width ? parseInt(canvasRef.value.style.width) : 800
  const h = canvasRef.value.style.height ? parseInt(canvasRef.value.style.height) : 500
  ctx.clearRect(0, 0, w, h)

  if (props.step.type === 'graph' || props.algoId === 'bfs' || props.algoId === 'dfs' || props.algoId === 'dijkstra' ||
      props.algoId === 'adjacency-matrix' || props.algoId === 'adjacency-list') {
    renderGraph(ctx, w, h, props.step)
  } else if (props.step.type === 'hanoi' || props.algoId === 'hanoi') {
    renderHanoi(ctx, w, h, props.step)
  } else if (props.step.type === 'chessboard' || props.algoId === 'chessboard') {
    renderChessboard(ctx, w, h, props.step)
  } else if (props.step.type === 'coloring' || props.algoId === 'graph-coloring') {
    renderColoring(ctx, w, h, props.step)
  } else if (props.step.type === 'maze' || props.algoId === 'maze') {
    renderMaze(ctx, w, h, props.step)
  } else if (props.step.type === 'stack') {
    renderStack(ctx, w, h, props.step)
  } else if (props.step.type === 'queue' || props.step.type === 'circular-queue') {
    renderQueue(ctx, w, h, props.step)
  } else if (props.step.type === 'bracket') {
    renderBracket(ctx, w, h, props.step)
  } else if (props.step.type === 'expression') {
    renderExpression(ctx, w, h, props.step)
  } else if (props.step.type === 'linkedlist') {
    renderLinkedList(ctx, w, h, props.step)
  } else if (props.step.type === 'tree' || props.step.type === 'huffman') {
    renderTree(ctx, w, h, props.step)
  } else if (props.step.array !== undefined) {
    renderSortBars(ctx, w, h, props.step)
  } else {
    renderSortBars(ctx, w, h, props.step)
  }
}

// ========== 排序柱状图 ==========
function renderSortBars(ctx, w, h, step) {
  const arr = step.array
  if (!arr || arr.length === 0) return
  const n = arr.length
  const maxVal = Math.max(...arr, 1)
  const padding = 60
  const barAreaW = w - padding * 2
  const barAreaH = h - padding * 2 - 30
  const gap = Math.max(2, Math.min(8, barAreaW / n * 0.15))
  const barW = Math.max(10, (barAreaW - gap * (n - 1)) / n)

  arr.forEach((val, i) => {
    const barH = Math.max(4, (val / maxVal) * barAreaH)
    const x = padding + i * (barW + gap)
    const y = h - padding - barH
    const hl = step.highlights?.[i]

    ctx.fillStyle = hl ? COLORS[hl] || COLORS.default : COLORS.default
    ctx.beginPath()
    ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0])
    ctx.fill()

    // 值标签
    ctx.fillStyle = '#1A1A1A'
    ctx.font = `bold ${Math.min(14, barW * 0.4)}px Consolas, monospace`
    ctx.textAlign = 'center'
    ctx.fillText(val, x + barW / 2, y - 8)

    // 索引
    ctx.fillStyle = '#A89B8C'
    ctx.font = `${Math.min(11, barW * 0.3)}px Microsoft YaHei`
    ctx.fillText(i, x + barW / 2, h - padding + 18)
  })
}

// ========== 图渲染 ==========
function renderGraph(ctx, w, h, step) {
  const n = step.nodes
  const edges = step.edges
  const nodeStates = step.nodeStates || {}
  const edgeStates = step.edgeStates || {}
  const dist = step.dist

  // 节点位置 - 圆形布局
  const cx = w / 2, cy = h / 2
  const radius = Math.min(w, h) * 0.35
  const positions = []
  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2
    positions.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) })
  }

  // 画边
  edges.forEach(([u, v, weight], idx) => {
    const pu = positions[u], pv = positions[v]
    const es = edgeStates[idx]
    ctx.strokeStyle = es ? COLORS[es] || '#8A7968' : '#8A7968'
    ctx.lineWidth = es === 'path' ? 3 : es === 'relaxed' ? 2.5 : 1.5
    ctx.beginPath()
    ctx.moveTo(pu.x, pu.y)
    ctx.lineTo(pv.x, pv.y)
    ctx.stroke()

    // 权重标签
    const mx = (pu.x + pv.x) / 2, my = (pu.y + pv.y) / 2
    ctx.fillStyle = es ? '#1A1A1A' : '#A89B8C'
    ctx.font = 'bold 12px Consolas'
    ctx.textAlign = 'center'
    ctx.fillText(weight, mx, my - 6)
  })

  // 画节点
  for (let i = 0; i < n; i++) {
    const p = positions[i]
    const state = nodeStates[i] || 'default'
    const nc = NODE_COLORS[state] || NODE_COLORS.default

    ctx.beginPath()
    ctx.arc(p.x, p.y, 22, 0, Math.PI * 2)
    ctx.fillStyle = nc.fill
    ctx.fill()
    ctx.strokeStyle = nc.stroke
    ctx.lineWidth = 2.5
    ctx.stroke()

    // 节点标签
    ctx.fillStyle = nc.text
    ctx.font = 'bold 14px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String.fromCharCode(65 + i), p.x, p.y)

    // 距离标签
    if (dist) {
      const dVal = dist[i]
      const dText = dVal === Infinity ? '∞' : String(dVal)
      ctx.fillStyle = '#C9A96E'
      ctx.font = '11px Consolas'
      ctx.fillText('d=' + dText, p.x, p.y + 34)
    }
    ctx.textBaseline = 'alphabetic'
  }
}

// ========== 汉诺塔 ==========
function renderHanoi(ctx, w, h, step) {
  const towers = step.towers
  if (!towers) return
  const labels = ['A', 'B', 'C']
  const n = labels.reduce((s, l) => s + (towers[l]?.length || 0), 0)
  if (n === 0) return

  const topPad = 30
  const labelGap = 34
  const baseH = 8
  const pegW = 8
  const sectionW = w / 3

  const availH = Math.max(60, h - topPad - labelGap - baseH)
  const diskH = Math.max(12, Math.min(30, availH / n))
  const pegH = n * diskH + diskH * 0.6

  // 整组图形垂直居中
  const figureH = pegH + baseH + labelGap
  const figureTop = Math.max(topPad, (h - figureH) / 2)
  const baseY = figureTop + pegH

  const maxDiskW = Math.min(sectionW * 0.85, 240)
  const minDiskW = Math.min(maxDiskW * 0.35, 44)
  const diskColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#EF4444']

  labels.forEach((label, i) => {
    const cx = sectionW * i + sectionW / 2
    // 底座
    ctx.fillStyle = '#8A7968'
    ctx.fillRect(cx - maxDiskW / 2, baseY, maxDiskW, baseH)
    // 柱子
    ctx.fillStyle = '#A89B8C'
    ctx.fillRect(cx - pegW / 2, baseY - pegH, pegW, pegH)
    // 标签
    ctx.fillStyle = '#A89B8C'
    ctx.font = 'bold 14px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText(label, cx, baseY + 28)

    // 盘子
    const disks = towers[label] || []
    disks.forEach((disk, j) => {
      const diskW = minDiskW + (maxDiskW - minDiskW) * (disk / n)
      const dx = cx - diskW / 2
      const dy = baseY - (j + 1) * diskH
      const isMoving = step.move && step.move.disk === disk

      ctx.fillStyle = diskColors[(disk - 1) % diskColors.length]
      ctx.beginPath()
      ctx.roundRect(dx, dy, diskW, diskH - 2, 4)
      ctx.fill()

      if (isMoving) {
        ctx.strokeStyle = '#C9A96E'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.fillStyle = '#FFFFFF'
      ctx.font = `bold ${Math.min(13, diskH * 0.5)}px Consolas`
      ctx.textAlign = 'center'
      ctx.fillText(disk, cx, dy + diskH / 2 + 4)
    })
  })
}

// ========== 棋盘覆盖 ==========
function renderChessboard(ctx, w, h, step) {
  const board = step.board
  const size = step.size
  if (!board || !size) return
  const cellSize = Math.min((w - 40) / size, (h - 40) / size)
  const startX = (w - size * cellSize) / 2
  const startY = (h - size * cellSize) / 2
  const tileColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#EF4444', '#F97316']

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const val = board[i][j]
      const x = startX + j * cellSize
      const y = startY + i * cellSize

      if (val === -1) {
        ctx.fillStyle = '#A89B8C'
      } else if (val === 0) {
        ctx.fillStyle = '#E8E0D6'
      } else {
        ctx.fillStyle = tileColors[(val - 1) % tileColors.length]
      }
      ctx.fillRect(x, y, cellSize - 1, cellSize - 1)

      if (val > 0) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `${Math.min(12, cellSize * 0.4)}px Consolas`
        ctx.textAlign = 'center'
        ctx.fillText(val, x + cellSize / 2, y + cellSize / 2 + 4)
      }
    }
  }
}

// ========== 图着色 ==========
function renderColoring(ctx, w, h, step) {
  const n = step.nodes
  const edges = step.edges
  const colors = step.colors
  const nodeStates = step.nodeStates || {}
  const m = step.m
  const colorPalette = ['', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F97316']

  const cx = w / 2, cy = h / 2
  const radius = Math.min(w, h) * 0.35
  const positions = []
  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2
    positions.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) })
  }

  // 边
  edges.forEach(([u, v]) => {
    ctx.strokeStyle = '#8A7968'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(positions[u].x, positions[u].y)
    ctx.lineTo(positions[v].x, positions[v].y)
    ctx.stroke()
  })

  // 节点
  for (let i = 0; i < n; i++) {
    const p = positions[i]
    const c = colors[i]
    const state = nodeStates[i] || 'default'

    ctx.beginPath()
    ctx.arc(p.x, p.y, 24, 0, Math.PI * 2)
    ctx.fillStyle = c > 0 ? colorPalette[c] || '#334155' : '#334155'
    ctx.fill()

    if (state === 'current') {
      ctx.strokeStyle = '#C9A96E'
      ctx.lineWidth = 3
      ctx.stroke()
    } else {
      ctx.strokeStyle = '#A89B8C'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 14px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String.fromCharCode(65 + i), p.x, p.y)
    ctx.textBaseline = 'alphabetic'
  }
}

// ========== 迷宫 ==========
function renderMaze(ctx, w, h, step) {
  const maze = step.maze
  if (!maze) return
  const rows = maze.length, cols = maze[0].length
  const cellSize = Math.min((w - 40) / cols, (h - 40) / rows)
  const startX = (w - cols * cellSize) / 2
  const startY = (h - rows * cellSize) / 2

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = startX + j * cellSize
      const y = startY + i * cellSize
      const val = maze[i][j]

      if (val === 1) ctx.fillStyle = '#8A7968'
      else if (val === 2) ctx.fillStyle = '#C9A96E'
      else ctx.fillStyle = '#E8E0D6'

      ctx.fillRect(x, y, cellSize - 1, cellSize - 1)
    }
  }

  // 路径
  if (step.path) {
    ctx.fillStyle = '#85BD73'
    step.path.forEach(([r, c]) => {
      ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 1, cellSize - 1)
    })
  }

  // 当前位置
  if (step.current) {
    const [cr, cc] = step.current
    ctx.fillStyle = '#C9A96E'
    ctx.fillRect(startX + cc * cellSize, startY + cr * cellSize, cellSize - 1, cellSize - 1)
  }
}

// ========== 栈 ==========
function renderStack(ctx, w, h, step) {
  const stack = step.stack
  const n = stack.length
  const itemW = 80, itemH = 32, gap = 4
  const startX = w / 2 - itemW / 2
  const baseY = h - 60

  // 容器
  ctx.strokeStyle = '#8A7968'
  ctx.lineWidth = 2
  ctx.strokeRect(startX - 10, baseY - n * (itemH + gap) - 20, itemW + 20, n * (itemH + gap) + 30)

  stack.forEach((val, i) => {
    const y = baseY - (i + 1) * (itemH + gap)
    const hl = step.highlights?.[i]
    ctx.fillStyle = hl ? COLORS[hl] || '#8A7968' : '#8A7968'
    ctx.beginPath()
    ctx.roundRect(startX, y, itemW, itemH, 4)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 14px Consolas'
    ctx.textAlign = 'center'
    ctx.fillText(val, startX + itemW / 2, y + itemH / 2 + 5)
  })

  ctx.fillStyle = '#A89B8C'
  ctx.font = '12px Microsoft YaHei'
  ctx.textAlign = 'center'
  ctx.fillText('栈顶 (top)', w / 2, baseY - n * (itemH + gap) - 30)
}

// ========== 队列 ==========
function renderQueue(ctx, w, h, step) {
  const queue = step.queue || []
  const n = queue.length
  const itemW = 50, itemH = 40, gap = 6
  const startX = (w - n * (itemW + gap)) / 2
  const startY = h / 2 - itemH / 2

  queue.forEach((val, i) => {
    const x = startX + i * (itemW + gap)
    const hl = step.highlights?.[i]
    ctx.fillStyle = hl ? COLORS[hl] || '#8A7968' : '#8A7968'
    ctx.beginPath()
    ctx.roundRect(x, startY, itemW, itemH, 4)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 14px Consolas'
    ctx.textAlign = 'center'
    ctx.fillText(val, x + itemW / 2, startY + itemH / 2 + 5)
  })

  if (n > 0) {
    ctx.fillStyle = '#85BD73'
    ctx.font = '11px Microsoft YaHei'
    ctx.fillText('front', startX + itemW / 2, startY + itemH + 18)
    ctx.fillStyle = '#C0564B'
    ctx.fillText('rear', startX + (n - 1) * (itemW + gap) + itemW / 2, startY + itemH + 18)
  }

  if (step.type === 'circular-queue') {
    const cq = step.queue
    const size = step.size
    const cellW = 50, cellH = 40
    const sx = (w - size * (cellW + 4)) / 2
    const sy = startY - 80

    ctx.fillStyle = '#A89B8C'
    ctx.font = '11px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText('循环队列', w / 2, sy - 10)

    for (let i = 0; i < size; i++) {
      const x = sx + i * (cellW + 4)
      ctx.fillStyle = cq[i] !== null ? '#8A7968' : '#E8E0D6'
      ctx.strokeStyle = '#8A7968'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(x, sy, cellW, cellH, 4)
      ctx.fill()
      ctx.stroke()

      if (cq[i] !== null) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 13px Consolas'
        ctx.textAlign = 'center'
        ctx.fillText(cq[i], x + cellW / 2, sy + cellH / 2 + 5)
      }

      ctx.fillStyle = '#A89B8C'
      ctx.font = '10px Consolas'
      ctx.fillText(i, x + cellW / 2, sy + cellH + 14)
    }
  }
}

// ========== 括号匹配 ==========
function renderBracket(ctx, w, h, step) {
  const str = step.string
  const pos = step.pos
  const result = step.result

  ctx.font = 'bold 28px Consolas'
  const totalW = ctx.measureText(str).width
  const startX = (w - totalW) / 2
  const y = h / 2

  let x = startX
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    const charW = ctx.measureText(ch).width
    const hl = step.highlights?.[i]

    if (hl === 'current') {
      ctx.fillStyle = '#1A1A1A'
    } else if (hl === 'visited') {
      ctx.fillStyle = '#85BD73'
    } else if (hl === 'swap') {
      ctx.fillStyle = '#C0564B'
    } else {
      ctx.fillStyle = '#A89B8C'
    }

    ctx.font = 'bold 28px Consolas'
    ctx.textAlign = 'left'
    ctx.fillText(ch, x, y)
    x += charW
  }

  // 栈状态
  const stack = step.stack
  if (stack.length > 0) {
    ctx.fillStyle = '#A89B8C'
    ctx.font = '13px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText('栈: ' + stack.join(' '), w / 2, y + 50)
  }

  if (result === 'valid') {
    ctx.fillStyle = '#85BD73'
    ctx.font = 'bold 18px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText('匹配成功', w / 2, y + 90)
  } else if (result === 'invalid') {
    ctx.fillStyle = '#C0564B'
    ctx.font = 'bold 18px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText('匹配失败', w / 2, y + 90)
  }
}

// ========== 表达式计算 ==========
function renderExpression(ctx, w, h, step) {
  const expr = step.expr
  const opStack = step.opStack
  const numStack = step.numStack
  const postfix = step.postfix

  // 表达式
  ctx.fillStyle = '#1A1A1A'
  ctx.font = 'bold 22px Consolas'
  ctx.textAlign = 'center'
  ctx.fillText(expr, w / 2, 50)

  // 后缀表达式
  ctx.fillStyle = '#A89B8C'
  ctx.font = '14px Consolas'
  ctx.fillText('后缀: ' + postfix, w / 2, 80)

  // 操作数栈
  ctx.fillStyle = '#85BD73'
  ctx.font = '13px Microsoft YaHei'
  ctx.textAlign = 'left'
  ctx.fillText('操作数栈: [' + numStack.join(', ') + ']', 30, 130)

  // 运算符栈
  ctx.fillStyle = '#C9A96E'
  ctx.fillText('运算符栈: [' + opStack.join(', ') + ']', 30, 155)
}

// ========== 链表 ==========
function renderLinkedList(ctx, w, h, step) {
  const data = step.data
  const listType = step.listType
  const n = data.length
  const nodeW = 60, nodeH = 36, gap = 30
  const isCircular = listType.includes('circular')
  const isDoubly = listType.includes('doubly')
  const hasHead = listType.includes('head')

  const totalNodes = hasHead ? n + 1 : n
  const totalW = totalNodes * (nodeW + gap) - gap
  const startX = Math.max(20, (w - totalW) / 2)
  const startY = h / 2 - nodeH / 2

  let offset = 0
  if (hasHead) {
    // 头节点
    ctx.fillStyle = '#C9A96E'
    ctx.beginPath()
    ctx.roundRect(startX, startY, nodeW, nodeH, 4)
    ctx.fill()
    ctx.fillStyle = '#000'
    ctx.font = 'bold 12px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText('head', startX + nodeW / 2, startY + nodeH / 2 + 4)
    offset = 1

    // 箭头
    drawArrow(ctx, startX + nodeW, startY + nodeH / 2, startX + nodeW + gap, startY + nodeH / 2)
  }

  data.forEach((val, i) => {
    const x = startX + (i + offset) * (nodeW + gap)
    const hl = step.highlights?.[i]
    ctx.fillStyle = hl ? COLORS[hl] || '#8A7968' : '#8A7968'
    ctx.beginPath()
    ctx.roundRect(x, startY, nodeW, nodeH, 4)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 14px Consolas'
    ctx.textAlign = 'center'
    ctx.fillText(val, x + nodeW / 2, startY + nodeH / 2 + 5)

    if (i < n - 1) {
      drawArrow(ctx, x + nodeW, startY + nodeH / 2, x + nodeW + gap, startY + nodeH / 2)
    }

    if (isDoubly && i > 0) {
      drawArrow(ctx, x, startY + nodeH / 2 + 8, x - gap, startY + nodeH / 2 + 8, true)
    }
  })

  // 循环链表特殊箭头
  if (isCircular && n > 0) {
    const lastX = startX + (n - 1 + offset) * (nodeW + gap) + nodeW
    const firstX = startX
    ctx.strokeStyle = '#85BD73'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(startX + totalW / 2, startY - 30, totalW / 2, Math.PI, 0)
    ctx.stroke()
  }

  // 遍历结果显示
  if (step.traversal && step.traversal.length > 0) {
    ctx.fillStyle = '#A89B8C'
    ctx.font = '13px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText('遍历: ' + step.traversal.join(' → '), w / 2, h - 30)
  }
}

function drawArrow(ctx, x1, y1, x2, y2, reverse = false) {
  ctx.strokeStyle = '#A89B8C'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len, uy = dy / len
  const arrowLen = 8

  ctx.beginPath()
  if (reverse) {
    ctx.moveTo(x1, y1)
    ctx.lineTo(x1 + ux * arrowLen - uy * 4, y1 + uy * arrowLen + ux * 4)
    ctx.moveTo(x1, y1)
    ctx.lineTo(x1 + ux * arrowLen + uy * 4, y1 + uy * arrowLen - ux * 4)
  } else {
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - ux * arrowLen - uy * 4, y2 - uy * arrowLen + ux * 4)
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - ux * arrowLen + uy * 4, y2 - uy * arrowLen - ux * 4)
  }
  ctx.stroke()
}

// ========== 树 ==========
function renderTree(ctx, w, h, step) {
  const tree = step.tree
  if (!tree) return

  function countNodes(node) {
    if (!node) return 0
    return 1 + countNodes(node.left) + countNodes(node.right)
  }

  function calcDepth(node) {
    if (!node) return 0
    return 1 + Math.max(calcDepth(node.left), calcDepth(node.right))
  }

  const depth = calcDepth(tree)
  const levelH = Math.min(70, (h - 80) / depth)
  const nodeR = 20

  function drawNode(node, x, y, spread) {
    if (!node) return

    // 左子树
    if (node.left) {
      const lx = x - spread, ly = y + levelH
      ctx.strokeStyle = '#8A7968'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x, y + nodeR)
      ctx.lineTo(lx, ly - nodeR)
      ctx.stroke()
      drawNode(node.left, lx, ly, spread / 2)
    }

    // 右子树
    if (node.right) {
      const rx = x + spread, ry = y + levelH
      ctx.strokeStyle = '#8A7968'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x, y + nodeR)
      ctx.lineTo(rx, ry - nodeR)
      ctx.stroke()
      drawNode(node.right, rx, ry, spread / 2)
    }

    // 节点
    const isHL = step.highlights?.[node.val]
    ctx.beginPath()
    ctx.arc(x, y, nodeR, 0, Math.PI * 2)
    ctx.fillStyle = isHL ? COLORS[isHL] || '#8A7968' : '#8A7968'
    ctx.fill()
    ctx.strokeStyle = '#C9A96E'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 12px Consolas'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.val, x, y)
    ctx.textBaseline = 'alphabetic'
  }

  const spread = Math.min(w * 0.25, 150)
  drawNode(tree, w / 2, 50, spread)

  // 遍历结果
  if (step.traversal && step.traversal.length > 0) {
    ctx.fillStyle = '#A89B8C'
    ctx.font = '13px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.fillText('遍历: ' + step.traversal.join(' → '), w / 2, h - 30)
  }
}

// 监听步骤变化
watch(() => props.stepIndex, () => { nextTick(render) })
watch(() => props.step, () => { nextTick(render) }, { deep: true })

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.canvas-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
