// 输入校验工具 - 对各类算法输入进行范围检查与错误提示

// 各输入类型的约束配置
export const inputConstraints = {
  array: {
    minSize: 2,
    maxSize: 20,
    minValue: -999,
    maxValue: 999
  },
  graph: {
    minNodes: 2,
    maxNodes: 15,
    minWeight: 0,
    maxWeight: 999
  },
  hanoi: {
    minValue: 1,
    maxValue: 7
  },
  kmp: {
    minValue: 1,
    maxValue: 4
  },
  bracket: {
    minSize: 1,
    maxSize: 50,
    allowedChars: new Set(['{', '}', '[', ']', '(', ')'])
  },
  expression: {
    minSize: 1,
    maxSize: 30,
    allowedChars: new Set('0123456789+-*/() '.split(''))
  }
}

// 校验结果统一格式
function ok(data) {
  return { valid: true, data, error: null }
}

function fail(error) {
  return { valid: false, data: null, error }
}

// ========== 数组校验 ==========
export function validateArray(input, algoId) {
  if (!input || !input.trim()) {
    return fail('输入不能为空，请输入逗号分隔的数字')
  }

  const parts = input.split(',').map(s => s.trim())
  const arr = []
  const c = inputConstraints.array

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]
    if (p === '') {
      return fail(`第 ${i + 1} 个元素为空，请检查逗号是否多余`)
    }
    const num = Number(p)
    if (isNaN(num) || !/^-?\d+$/.test(p)) {
      return fail(`第 ${i + 1} 个元素 "${p}" 不是合法整数`)
    }
    if (num < c.minValue || num > c.maxValue) {
      return fail(`第 ${i + 1} 个元素 ${num} 超出范围 [${c.minValue}, ${c.maxValue}]`)
    }
    arr.push(num)
  }

  if (arr.length < c.minSize) {
    return fail(`至少需要 ${c.minSize} 个元素，当前仅 ${arr.length} 个`)
  }
  if (arr.length > c.maxSize) {
    return fail(`最多支持 ${c.maxSize} 个元素，当前 ${arr.length} 个`)
  }

  return ok(arr)
}

// ========== 图输入校验 ==========
export function validateGraph(nodesInput, edgesInput, sourceInput) {
  const c = inputConstraints.graph

  // 节点数校验
  const n = Number(nodesInput)
  if (!Number.isInteger(n) || isNaN(n)) {
    return fail('节点数必须是整数')
  }
  if (n < c.minNodes || n > c.maxNodes) {
    return fail(`节点数应在 ${c.minNodes}-${c.maxNodes} 之间，当前 ${n}`)
  }

  // 源点校验
  if (sourceInput !== undefined && sourceInput !== null) {
    const s = Number(sourceInput)
    if (!Number.isInteger(s) || isNaN(s)) {
      return fail('源点必须是整数')
    }
    if (s < 0 || s >= n) {
      return fail(`源点编号应在 0-${n - 1} 之间，当前 ${s}`)
    }
  }

  // 边校验
  if (!edgesInput || !edgesInput.trim()) {
    return fail('边列表不能为空，请按 "起点,终点,权重" 每行一条')
  }

  const lines = edgesInput.trim().split('\n')
  const edges = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const parts = line.split(',').map(s => s.trim())
    if (parts.length < 3) {
      return fail(`第 ${i + 1} 行格式错误，应为 "起点,终点,权重"`)
    }

    const [u, v, w] = parts.map(Number)
    if (isNaN(u) || isNaN(v) || isNaN(w)) {
      return fail(`第 ${i + 1} 行包含非数字，请检查 "${line}"`)
    }
    if (!Number.isInteger(u) || !Number.isInteger(v)) {
      return fail(`第 ${i + 1} 行：起点和终点必须是整数`)
    }
    if (u < 0 || u >= n || v < 0 || v >= n) {
      return fail(`第 ${i + 1} 行：顶点编号应在 0-${n - 1} 之间，当前 (${u}, ${v})`)
    }
    if (u === v) {
      return fail(`第 ${i + 1} 行：不支持自环 (${u}, ${v})`)
    }
    if (w < c.minWeight || w > c.maxWeight) {
      return fail(`第 ${i + 1} 行：权重 ${w} 超出范围 [${c.minWeight}, ${c.maxWeight}]`)
    }

    edges.push([u, v, w])
  }

  if (edges.length === 0) {
    return fail('至少需要一条边')
  }

  return ok({ nodes: n, edges })
}

// ========== 数字校验 ==========
export function validateNumber(input, algoId) {
  const n = Number(input)

  if (isNaN(n) || !Number.isInteger(n)) {
    return fail('请输入整数')
  }

  let c
  if (algoId === 'hanoi') {
    c = inputConstraints.hanoi
  } else {
    c = inputConstraints.kmp
  }

  if (n < c.minValue) {
    return fail(`最小值为 ${c.minValue}，当前 ${n}`)
  }
  if (n > c.maxValue) {
    return fail(`最大值为 ${c.maxValue}（防止浏览器卡顿），当前 ${n}`)
  }

  return ok(n)
}

// ========== 字符串校验 ==========
export function validateString(input, algoId) {
  if (!input || !input.trim()) {
    return fail('输入不能为空')
  }

  const s = input.trim()

  if (algoId === 'bracket-match') {
    const c = inputConstraints.bracket
    if (s.length < c.minSize) {
      return fail(`至少需要 ${c.minSize} 个字符`)
    }
    if (s.length > c.maxSize) {
      return fail(`最多支持 ${c.maxSize} 个字符`)
    }
    for (const ch of s) {
      if (!c.allowedChars.has(ch)) {
        return fail(`包含非法字符 "${ch}"，仅支持 { } [ ] ( )`)
      }
    }
  } else if (algoId === 'expression-eval') {
    const c = inputConstraints.expression
    if (s.length < c.minSize) {
      return fail(`表达式至少 ${c.minSize} 个字符`)
    }
    if (s.length > c.maxSize) {
      return fail(`表达式过长，最多 ${c.maxSize} 个字符`)
    }
    for (const ch of s) {
      if (!c.allowedChars.has(ch)) {
        return fail(`包含非法字符 "${ch}"，仅支持数字和 + - * / ( )`)
      }
    }
    // 括号配对检查
    let balance = 0
    for (const ch of s) {
      if (ch === '(') balance++
      else if (ch === ')') balance--
      if (balance < 0) {
        return fail('括号不匹配：右括号多余')
      }
    }
    if (balance !== 0) {
      return fail('括号不匹配：左括号多余')
    }
  }

  return ok(s)
}
