// 递归与回溯算法

// 汉诺塔
export function hanoi(numDisks) {
  const n = Math.min(Math.max(numDisks, 1), 7)
  const steps = []
  // towers: { A: [...], B: [...], C: [...] }
  const towers = { A: [], B: [], C: [] }
  for (let i = n; i >= 1; i--) towers.A.push(i)

  steps.push({
    type: 'hanoi',
    towers: { A: [...towers.A], B: [...towers.B], C: [...towers.C] },
    move: null,
    description: `初始状态: ${n}个盘在A柱`,
    codeLine: 0
  })

  function move(n, from, to, aux) {
    if (n === 1) {
      const disk = towers[from].pop()
      towers[to].push(disk)
      steps.push({
        type: 'hanoi',
        towers: { A: [...towers.A], B: [...towers.B], C: [...towers.C] },
        move: { disk, from, to },
        description: `移动盘${disk}: ${from} → ${to}`,
        codeLine: 3
      })
      return
    }
    move(n - 1, from, aux, to)
    const disk = towers[from].pop()
    towers[to].push(disk)
    steps.push({
      type: 'hanoi',
      towers: { A: [...towers.A], B: [...towers.B], C: [...towers.C] },
      move: { disk, from, to },
      description: `移动盘${disk}: ${from} → ${to}`,
      codeLine: 5
    })
    move(n - 1, aux, to, from)
  }

  move(n, 'A', 'C', 'B')
  steps.push({
    type: 'hanoi',
    towers: { A: [...towers.A], B: [...towers.B], C: [...towers.C] },
    move: null,
    description: `完成! 共${steps.length - 1}步 (2^${n}-1=${Math.pow(2,n)-1})`,
    codeLine: 7
  })
  return steps
}

// 棋盘覆盖
export function chessboardCover(k) {
  const size = Math.pow(2, Math.min(Math.max(k, 1), 4))
  const board = Array.from({ length: size }, () => Array(size).fill(0))
  const steps = []
  let tile = 0

  // 特殊格在(0,0)
  board[0][0] = -1
  steps.push({
    type: 'chessboard',
    board: board.map(r => [...r]),
    size,
    description: `初始化 ${size}x${size} 棋盘, 特殊格在(0,0)`,
    codeLine: 0
  })

  function cover(tr, tc, dr, dc, sz) {
    if (sz === 1) return
    const t = ++tile
    const s = sz / 2

    // 左上
    if (dr < tr + s && dc < tc + s) {
      cover(tr, tc, dr, dc, s)
    } else {
      board[tr + s - 1][tc + s - 1] = t
      steps.push({
        type: 'chessboard',
        board: board.map(r => [...r]),
        size,
        description: `L型骨牌#${t} 覆盖左上角(${tr+s-1},${tc+s-1})`,
        codeLine: 3
      })
      cover(tr, tc, tr + s - 1, tc + s - 1, s)
    }

    // 右上
    if (dr < tr + s && dc >= tc + s) {
      cover(tr, tc + s, dr, dc, s)
    } else {
      board[tr + s - 1][tc + s] = t
      steps.push({
        type: 'chessboard',
        board: board.map(r => [...r]),
        size,
        description: `L型骨牌#${t} 覆盖右上角(${tr+s-1},${tc+s})`,
        codeLine: 5
      })
      cover(tr, tc + s, tr + s - 1, tc + s, s)
    }

    // 左下
    if (dr >= tr + s && dc < tc + s) {
      cover(tr + s, tc, dr, dc, s)
    } else {
      board[tr + s][tc + s - 1] = t
      steps.push({
        type: 'chessboard',
        board: board.map(r => [...r]),
        size,
        description: `L型骨牌#${t} 覆盖左下角(${tr+s},${tc+s-1})`,
        codeLine: 7
      })
      cover(tr + s, tc, tr + s, tc + s - 1, s)
    }

    // 右下
    if (dr >= tr + s && dc >= tc + s) {
      cover(tr + s, tc + s, dr, dc, s)
    } else {
      board[tr + s][tc + s] = t
      steps.push({
        type: 'chessboard',
        board: board.map(r => [...r]),
        size,
        description: `L型骨牌#${t} 覆盖右下角(${tr+s},${tc+s})`,
        codeLine: 9
      })
      cover(tr + s, tc + s, tr + s, tc + s, s)
    }
  }

  cover(0, 0, 0, 0, size)
  steps.push({
    type: 'chessboard',
    board: board.map(r => [...r]),
    size,
    description: `棋盘覆盖完成, 共用${tile}个L型骨牌`,
    codeLine: 11
  })
  return steps
}

// 图着色
export function graphColoring(graphData) {
  const { nodes, edges } = graphData
  const m = graphData.colors || 3
  const n = nodes
  const adj = Array.from({ length: n }, () => [])
  edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u) })

  const color = Array(n).fill(0)
  const steps = []
  const colorNames = ['', '红', '蓝', '绿', '黄', '紫', '橙']

  steps.push({
    type: 'coloring',
    nodes: n, edges: [...edges],
    colors: [...color], m,
    nodeStates: Object.fromEntries([...Array(n).keys()].map(i => [i, 'default'])),
    description: `开始图着色, ${m}种颜色`,
    codeLine: 0
  })

  function isSafe(v, c) {
    for (const u of adj[v]) {
      if (color[u] === c) return false
    }
    return true
  }

  function solve(v) {
    if (v === n) return true
    for (let c = 1; c <= m; c++) {
      const ns = {}
      for (let j = 0; j < n; j++) ns[j] = color[j] > 0 ? 'colored' : 'default'
      ns[v] = 'current'
      steps.push({
        type: 'coloring',
        nodes: n, edges: [...edges],
        colors: [...color], m,
        nodeStates: ns,
        description: `尝试给节点${String.fromCharCode(65+v)}着${colorNames[c]}色`,
        codeLine: 2
      })

      if (isSafe(v, c)) {
        color[v] = c
        const ns2 = {}
        for (let j = 0; j < n; j++) ns2[j] = color[j] > 0 ? 'colored' : 'default'
        ns2[v] = 'current'
        steps.push({
          type: 'coloring',
          nodes: n, edges: [...edges],
          colors: [...color], m,
          nodeStates: ns2,
          description: `节点${String.fromCharCode(65+v)}着${colorNames[c]}色成功`,
          codeLine: 3
        })

        if (solve(v + 1)) return true
        color[v] = 0
        steps.push({
          type: 'coloring',
          nodes: n, edges: [...edges],
          colors: [...color], m,
          nodeStates: Object.fromEntries([...Array(n).keys()].map(j => [j, color[j] > 0 ? 'colored' : 'default'])),
          description: `回溯: 取消节点${String.fromCharCode(65+v)}的颜色`,
          codeLine: 5
        })
      }
    }
    return false
  }

  const found = solve(0)
  const ns = {}
  for (let j = 0; j < n; j++) ns[j] = 'colored'
  steps.push({
    type: 'coloring',
    nodes: n, edges: [...edges],
    colors: [...color], m,
    nodeStates: ns,
    description: found ? `着色成功! ${color.map((c,i) => String.fromCharCode(65+i)+':'+colorNames[c]).join(' ')}` : '无法用${m}种颜色完成着色',
    codeLine: 7
  })
  return steps
}

// 迷宫求解
export function mazeSolve(mazeData) {
  const maze = mazeData.map(r => [...r])
  const rows = maze.length
  const cols = maze[0].length
  const steps = []

  // 找入口和出口 (边界上的0)
  let start = null, end = null
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (maze[i][j] === 0) {
        if (!start) start = [i, j]
        end = [i, j]
      }
    }
  }
  if (!start) start = [1, 1]
  if (!end) end = [rows - 2, cols - 2]

  steps.push({
    type: 'maze',
    maze: maze.map(r => [...r]),
    path: [],
    current: start,
    description: `迷宫 ${rows}x${cols}, 入口(${start[0]},${start[1]}), 出口(${end[0]},${end[1]})`,
    codeLine: 0
  })

  const path = []
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]]

  function dfs(x, y) {
    if (x === end[0] && y === end[1]) {
      path.push([x, y])
      maze[x][y] = 2
      steps.push({
        type: 'maze',
        maze: maze.map(r => [...r]),
        path: [...path],
        current: [x, y],
        description: `到达出口!`,
        codeLine: 1
      })
      return true
    }

    maze[x][y] = 2
    path.push([x, y])
    steps.push({
      type: 'maze',
      maze: maze.map(r => [...r]),
      path: [...path],
      current: [x, y],
      description: `探索(${x},${y})`,
      codeLine: 2
    })

    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy
      if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && maze[nx][ny] === 0) {
        if (dfs(nx, ny)) return true
      }
    }

    path.pop()
    maze[x][y] = 0
    steps.push({
      type: 'maze',
      maze: maze.map(r => [...r]),
      path: [...path],
      current: [x, y],
      description: `回溯(${x},${y})`,
      codeLine: 4
    })
    return false
  }

  dfs(start[0], start[1])
  steps.push({
    type: 'maze',
    maze: maze.map(r => [...r]),
    path: [...path],
    current: end,
    description: `迷宫求解完成, 路径长度${path.length}`,
    codeLine: 6
  })
  return steps
}
