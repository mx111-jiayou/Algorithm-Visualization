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
