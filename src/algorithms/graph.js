// 图算法 - 生成步骤序列
// 步骤格式: { type, nodes, edges, highlights, description, codeLine }
// highlights: { nodeId: 'current'|'visited'|'queued', edgeIdx: 'relaxed'|'path' }

export function dijkstra(graphData) {
  const { nodes, edges } = graphData
  const n = nodes
  const INF = Infinity

  // 构建邻接矩阵
  const adj = Array.from({ length: n }, () => Array(n).fill(INF))
  edges.forEach(([u, v, w]) => { adj[u][v] = w; adj[v][u] = w })

  const dist = Array(n).fill(INF)
  const visited = Array(n).fill(false)
  const prev = Array(n).fill(-1)
  const steps = []
  const src = 0

  dist[src] = 0
  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: Object.fromEntries([[0, 'current']]),
    edgeStates: {},
    dist: [...dist], visited: [...visited],
    description: `初始化: 源点 ${String.fromCharCode(65+src)}(0), dist=[${dist.map(d => d===INF?'∞':d).join(', ')}]`,
    codeLine: 0
  })

  for (let i = 0; i < n; i++) {
    // 找最小距离未访问节点
    let u = -1, minDist = INF
    for (let j = 0; j < n; j++) {
      if (!visited[j] && dist[j] < minDist) {
        minDist = dist[j]; u = j
      }
    }
    if (u === -1) break

    visited[u] = true
    const ns = {}
    for (let j = 0; j < n; j++) ns[j] = visited[j] ? 'visited' : 'default'
    ns[u] = 'current'
    steps.push({
      type: 'graph', nodes: n, edges: [...edges],
      nodeStates: { ...ns }, edgeStates: {},
      dist: [...dist], visited: [...visited],
      description: `选择节点 ${String.fromCharCode(65+u)}, dist=${dist[u]}`,
      codeLine: 2
    })

    // 松弛邻边
    for (let v = 0; v < n; v++) {
      if (adj[u][v] < INF && !visited[v]) {
        const newDist = dist[u] + adj[u][v]
        const edgeIdx = edges.findIndex(([a, b]) => (a===u&&b===v)||(a===v&&b===u))
        if (newDist < dist[v]) {
          dist[v] = newDist
          prev[v] = u
          const ns2 = {}
          for (let j = 0; j < n; j++) ns2[j] = visited[j] ? 'visited' : 'default'
          ns2[u] = 'current'; ns2[v] = 'queued'
          const es2 = {}
          if (edgeIdx >= 0) es2[edgeIdx] = 'relaxed'
          steps.push({
            type: 'graph', nodes: n, edges: [...edges],
            nodeStates: { ...ns2 }, edgeStates: { ...es2 },
            dist: [...dist], visited: [...visited],
            description: `松弛: ${String.fromCharCode(65+u)}→${String.fromCharCode(65+v)}, dist[${String.fromCharCode(65+v)}]=${dist[v]}`,
            codeLine: 4
          })
        }
      }
    }
  }

  // 高亮最短路径
  const pathEdges = new Set()
  for (let v = 0; v < n; v++) {
    if (prev[v] >= 0) {
      const idx = edges.findIndex(([a, b]) => (a===prev[v]&&b===v)||(a===v&&b===prev[v]))
      if (idx >= 0) pathEdges.add(idx)
    }
  }
  const ns = {}
  for (let j = 0; j < n; j++) ns[j] = 'visited'
  const es = {}
  pathEdges.forEach(idx => es[idx] = 'path')
  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: ns, edgeStates: es,
    dist: [...dist], visited: [...visited],
    description: `Dijkstra完成, 最短距离: [${dist.map(d => d===INF?'∞':d).join(', ')}]`,
    codeLine: 6
  })

  return steps
}

export function bfs(graphData) {
  const { nodes, edges } = graphData
  const n = nodes
  const adj = Array.from({ length: n }, () => [])
  edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u) })

  const visited = Array(n).fill(false)
  const steps = []
  const queue = [0]
  visited[0] = true
  const order = []

  const ns0 = {}; ns0[0] = 'current'
  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: ns0, edgeStates: {},
    description: `BFS开始: 访问源点 ${String.fromCharCode(65+0)}`,
    codeLine: 0
  })

  while (queue.length > 0) {
    const u = queue.shift()
    order.push(u)

    const ns = {}
    for (let j = 0; j < n; j++) ns[j] = visited[j] ? 'visited' : 'default'
    ns[u] = 'current'
    steps.push({
      type: 'graph', nodes: n, edges: [...edges],
      nodeStates: { ...ns }, edgeStates: {},
      description: `出队并访问 ${String.fromCharCode(65+u)}`,
      codeLine: 2
    })

    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true
        queue.push(v)
        const ns2 = {}
        for (let j = 0; j < n; j++) ns2[j] = visited[j] ? 'visited' : 'default'
        ns2[u] = 'current'; ns2[v] = 'queued'
        const edgeIdx = edges.findIndex(([a, b]) => (a===u&&b===v)||(a===v&&b===u))
        const es2 = edgeIdx >= 0 ? { [edgeIdx]: 'relaxed' } : {}
        steps.push({
          type: 'graph', nodes: n, edges: [...edges],
          nodeStates: { ...ns2 }, edgeStates: es2,
          description: `发现 ${String.fromCharCode(65+v)}, 入队`,
          codeLine: 3
        })
      }
    }
  }

  const ns = {}
  for (let j = 0; j < n; j++) ns[j] = 'visited'
  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: ns, edgeStates: {},
    description: `BFS完成, 遍历顺序: ${order.map(i => String.fromCharCode(65+i)).join('→')}`,
    codeLine: 5
  })

  return steps
}

// 邻接矩阵构建过程可视化
export function adjacencyMatrix(graphData) {
  const { nodes, edges } = graphData
  const n = nodes
  const INF = Infinity
  // 初始化矩阵
  const matrix = Array.from({ length: n }, () => Array(n).fill(INF))
  const steps = []

  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: {}, edgeStates: {},
    matrix: matrix.map(row => row.map(v => v === INF ? null : v)),
    description: `初始化 ${n}×${n} 邻接矩阵，全部填 ∞（表示不相连）`,
    codeLine: 0
  })

  // 对角线置0
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 0
  }
  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: {}, edgeStates: {},
    matrix: matrix.map(row => row.map(v => v === INF ? null : v)),
    matrixHighlight: { row: -1, col: -1, diag: true },
    description: `主对角线 matrix[i][i] = 0（顶点到自身距离为0）`,
    codeLine: 0
  })

  // 逐条边填充矩阵
  edges.forEach(([u, v, w], idx) => {
    const ns = { [u]: 'current', [v]: 'current' }
    const es = { [idx]: 'relaxed' }
    steps.push({
      type: 'graph', nodes: n, edges: [...edges],
      nodeStates: ns, edgeStates: es,
      matrix: matrix.map(row => row.map(v => v === INF ? null : v)),
      matrixHighlight: { row: u, col: v },
      description: `处理边 ${String.fromCharCode(65+u)}→${String.fromCharCode(65+v)} (权值${w})`,
      codeLine: 1
    })

    matrix[u][v] = w
    matrix[v][u] = w  // 无向图对称
    steps.push({
      type: 'graph', nodes: n, edges: [...edges],
      nodeStates: ns, edgeStates: es,
      matrix: matrix.map(row => row.map(v => v === INF ? null : v)),
      matrixHighlight: { row: u, col: v, symmetric: { row: v, col: u } },
      description: `matrix[${String.fromCharCode(65+u)}][${String.fromCharCode(65+v)}] = ${w}，matrix[${String.fromCharCode(65+v)}][${String.fromCharCode(65+u)}] = ${w}（无向图对称）`,
      codeLine: 2
    })
  })

  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: {}, edgeStates: {},
    matrix: matrix.map(row => row.map(v => v === INF ? null : v)),
    description: `邻接矩阵构建完成。空间复杂度 O(n²=${n*n})，适合稠密图`,
    codeLine: 3
  })

  return steps
}

// 邻接链表构建过程可视化
export function adjacencyList(graphData) {
  const { nodes, edges } = graphData
  const n = nodes
  // 每个顶点对应一个链表
  const adjList = Array.from({ length: n }, () => [])
  const steps = []

  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: {}, edgeStates: {},
    adjList: adjList.map(list => [...list]),
    description: `初始化 ${n} 个顶点的邻接链表头节点（均为空链表）`,
    codeLine: 0
  })

  // 逐条边构建链表
  edges.forEach(([u, v, w], idx) => {
    const ns = { [u]: 'current', [v]: 'current' }
    const es = { [idx]: 'relaxed' }

    steps.push({
      type: 'graph', nodes: n, edges: [...edges],
      nodeStates: ns, edgeStates: es,
      adjList: adjList.map(list => [...list]),
      adjListHighlight: { vertex: u, newNode: v },
      description: `处理边 ${String.fromCharCode(65+u)}→${String.fromCharCode(65+v)} (权值${w})`,
      codeLine: 1
    })

    // 头插法：插入到 u 的链表头部
    adjList[u].unshift({ vex: v, weight: w })
    adjList[v].unshift({ vex: u, weight: w })  // 无向图

    steps.push({
      type: 'graph', nodes: n, edges: [...edges],
      nodeStates: ns, edgeStates: es,
      adjList: adjList.map(list => [...list]),
      adjListHighlight: { vertex: u, newNode: v, symmetric: true },
      description: `在 ${String.fromCharCode(65+u)} 的链表头部插入节点 ${String.fromCharCode(65+v)}；同时在 ${String.fromCharCode(65+v)} 的链表头部插入节点 ${String.fromCharCode(65+u)}（无向图对称）`,
      codeLine: 2
    })
  })

  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: {}, edgeStates: {},
    adjList: adjList.map(list => [...list]),
    description: `邻接链表构建完成。空间复杂度 O(n+e=${n+edges.length})，适合稀疏图`,
    codeLine: 3
  })

  return steps
}

export function dfs(graphData) {
  const { nodes, edges } = graphData
  const n = nodes
  const adj = Array.from({ length: n }, () => [])
  edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u) })

  const visited = Array(n).fill(false)
  const steps = []
  const order = []

  function dfsVisit(u) {
    visited[u] = true
    order.push(u)
    const ns = {}
    for (let j = 0; j < n; j++) ns[j] = visited[j] ? 'visited' : 'default'
    ns[u] = 'current'
    steps.push({
      type: 'graph', nodes: n, edges: [...edges],
      nodeStates: { ...ns }, edgeStates: {},
      description: `访问 ${String.fromCharCode(65+u)}`,
      codeLine: 1
    })

    for (const v of adj[u]) {
      if (!visited[v]) {
        const edgeIdx = edges.findIndex(([a, b]) => (a===u&&b===v)||(a===v&&b===u))
        const es = edgeIdx >= 0 ? { [edgeIdx]: 'relaxed' } : {}
        const ns2 = {}
        for (let j = 0; j < n; j++) ns2[j] = visited[j] ? 'visited' : 'default'
        ns2[u] = 'current'; ns2[v] = 'queued'
        steps.push({
          type: 'graph', nodes: n, edges: [...edges],
          nodeStates: { ...ns2 }, edgeStates: es,
          description: `探索边 ${String.fromCharCode(65+u)}→${String.fromCharCode(65+v)}`,
          codeLine: 2
        })
        dfsVisit(v)
      }
    }
  }

  dfsVisit(0)
  const ns = {}
  for (let j = 0; j < n; j++) ns[j] = 'visited'
  steps.push({
    type: 'graph', nodes: n, edges: [...edges],
    nodeStates: ns, edgeStates: {},
    description: `DFS完成, 遍历顺序: ${order.map(i => String.fromCharCode(65+i)).join('→')}`,
    codeLine: 4
  })

  return steps
}
