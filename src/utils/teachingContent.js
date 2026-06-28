// 算法讲解内容库 - 为各算法的关键步骤（按 codeLine）提供讲解文字
// 结构：{ [algoId]: [{ codeLine, title, content, keyPoint }] }

export const teachingContent = {
  // ========== 冒泡排序 ==========
  'bubble-sort': [
    {
      codeLine: 0,
      title: '初始状态',
      content: '冒泡排序的核心思想是“相邻元素两两比较，每轮把最大元素冒泡到末尾”。n 个元素需要进行 n-1 轮比较。',
      keyPoint: '时间复杂度 O(n²)，空间复杂度 O(1)，是稳定的排序。'
    },
    {
      codeLine: 2,
      title: '比较相邻元素',
      content: '比较 a[j] 和 a[j+1]：如果前一个大于后一个，说明顺序错误，需要交换。这一步是冒泡排序的核心判断。',
      keyPoint: '每次比较都让较大的元素“往上浮”，较小的元素“往下沉”。'
    },
    {
      codeLine: 3,
      title: '交换元素',
      content: '执行交换：使用临时变量 temp 暂存 a[j]，再覆盖。交换后较大的元素向右移动一位。',
      keyPoint: '交换操作是 O(1)，但总交换次数最坏为 O(n²)，这是冒泡排序慢的根源。'
    },
    {
      codeLine: 5,
      title: '排序完成',
      content: '当某一轮没有发生任何交换，说明数组已经有序，可以提前结束。这是冒泡排序的优化点。',
      keyPoint: '最优情况（已有序）时间复杂度可降至 O(n)。'
    }
  ],

  // ========== 快速排序 ==========
  'quick-sort': [
    {
      codeLine: 0,
      title: '初始状态',
      content: '快速排序基于分治思想：选一个基准 pivot，把数组分成“比 pivot 小”和“比 pivot 大”两部分，再递归处理左右子数组。',
      keyPoint: '平均时间复杂度 O(n log n)，最坏 O(n²)（数组已有序时），空间复杂度 O(log n)（递归栈）。'
    },
    {
      codeLine: 1,
      title: '选择基准',
      content: '通常选第一个元素 a[low] 作为基准 pivot。基准的选择影响效率：选最坏值会导致划分极度不均。',
      keyPoint: '优化策略：三数取中法、随机选取法，可避免最坏情况。'
    },
    {
      codeLine: 4,
      title: '分区操作',
      content: '使用双指针 i、j 从两端向中间扫描：j 从右找比 pivot 小的，i 从左找比 pivot 大的，然后交换。',
      keyPoint: '分区是快排的核心，单次分区时间为 O(n)，决定了整体性能。'
    },
    {
      codeLine: 6,
      title: '递归处理',
      content: '分区完成后，pivot 位于最终正确位置。递归对 pivot 左右两侧的子数组执行同样的操作。',
      keyPoint: '递归深度 log n，每层 O(n) 工作，合计 O(n log n)。'
    }
  ],

  // ========== 直接插入排序 ==========
  'insertion-sort': [
    {
      codeLine: 0,
      title: '初始状态',
      content: '插入排序类似整理扑克牌：把每个新元素插入到已排序部分的正确位置。第 0 个元素视为已排序。',
      keyPoint: '时间复杂度 O(n²)，但小数据量或近乎有序时效率很高，是混合排序的常用组件。'
    },
    {
      codeLine: 3,
      title: '向后移动元素',
      content: '从已排序部分的末尾开始，把比 key 大的元素依次后移，腾出插入位置。',
      keyPoint: '移动而非交换，减少了赋值次数，比冒泡排序更高效。'
    },
    {
      codeLine: 5,
      title: '插入到正确位置',
      content: '找到第一个不大于 key 的元素，在其后插入 key。至此第 i 轮完成，前 i+1 个元素有序。',
      keyPoint: '稳定排序，最优情况（已有序）只需 O(n) 次比较。'
    }
  ],

  // ========== 选择排序 ==========
  'selection-sort': [
    {
      codeLine: 0,
      title: '初始状态',
      content: '选择排序每轮在未排序部分找到最小元素，放到已排序部分的末尾。',
      keyPoint: '时间复杂度 O(n²)，比较次数固定，交换次数最多 O(n)，比冒泡少。'
    },
    {
      codeLine: 2,
      title: '查找最小值',
      content: '在 [i, n) 范围内扫描，记录最小元素的下标 min。这是选择排序最耗时的部分。',
      keyPoint: '无论数组是否有序，都需要 n-i 次比较，无法提前终止。'
    },
    {
      codeLine: 3,
      title: '交换到正确位置',
      content: '把找到的最小元素 a[min] 与 a[i] 交换，放到已排序部分末尾。每轮只交换一次。',
      keyPoint: '交换次数最少（O(n)），但比较次数固定 O(n²)，且不稳定。'
    }
  ],

  // ========== 归并排序 ==========
  'merge-sort': [
    {
      codeLine: 0,
      title: '分治开始',
      content: '归并排序分两步：递归拆分数组为两半，再把两个有序子数组合并。',
      keyPoint: '时间复杂度 O(n log n)，稳定排序，但需要 O(n) 额外空间。'
    },
    {
      codeLine: 3,
      title: '递归拆分',
      content: '计算中点 m=(l+r)/2，递归对左半 [l,m] 和右半 [m+1,r] 排序。拆分到单元素时停止。',
      keyPoint: '递归深度 log n，是归并排序高效的关键。'
    },
    {
      codeLine: 4,
      title: '合并有序子数组',
      content: '使用双指针 i、j 比较两子数组头部，较小者放入临时数组 tmp。这是归并排序的核心操作。',
      keyPoint: '合并时间为 O(n)，是稳定排序的保证。'
    },
    {
      codeLine: 6,
      title: '拷贝回原数组',
      content: '把临时数组 tmp 中的有序结果拷贝回原数组 a。至此 [l,r] 区间完全有序。',
      keyPoint: '需要 O(n) 额外空间存放临时数组，这是归并排序的主要缺点。'
    }
  ],

  // ========== 希尔排序 ==========
  'shell-sort': [
    {
      codeLine: 0,
      title: '初始状态',
      content: '希尔排序是插入排序的改进：按增量 gap 分组，对每组做插入排序，逐步缩小 gap 直至 1。',
      keyPoint: '时间复杂度约 O(n^1.3)，比 O(n²) 快很多，是不稳定排序。'
    },
    {
      codeLine: 1,
      title: '分组插入',
      content: '当前增量 gap：相距 gap 的元素属于同一组。对每组进行插入排序，使数组“大致有序”。',
      keyPoint: 'gap 较大时移动次数少，能快速消除大量逆序对。'
    },
    {
      codeLine: 4,
      title: '缩小增量',
      content: 'gap /= 2，分组变细，继续插入排序。最后一轮 gap=1 即标准插入排序，但此时数组已近乎有序。',
      keyPoint: '最后一轮插入排序在近乎有序数组上接近 O(n)，这是希尔排序高效的本质。'
    }
  ],

  // ========== 汉诺塔 ==========
  'hanoi': [
    {
      codeLine: 0,
      title: '问题定义',
      content: '汉诺塔：将 n 个盘子从 A 移到 C，大盘不能压小盘。可借助 B 作为中转。',
      keyPoint: '递归解法，移动次数 2^n - 1，时间复杂度 O(2^n)。'
    },
    {
      codeLine: 3,
      title: '基本情况',
      content: 'n=1 时直接把盘子从 A 移到 C，这是递归的出口。',
      keyPoint: '递归必须有终止条件，否则会无限递归导致栈溢出。'
    },
    {
      codeLine: 5,
      title: '递归分解',
      content: '把 n 个盘子的问题分解为三步：① 把上面 n-1 个盘子从 A 借助 C 移到 B；② 把第 n 个盘子从 A 移到 C；③ 把 B 上的 n-1 个盘子借助 A 移到 C。',
      keyPoint: '这是分治思想：把大问题分解为同结构的子问题。'
    },
    {
      codeLine: 7,
      title: '完成',
      content: '所有盘子移到 C，递归完成。总移动次数 = 2^n - 1。',
      keyPoint: 'n=3 时需 7 步，n=10 时需 1023 步，n=64 则需约 5849 亿年！'
    }
  ],

  // ========== Dijkstra ==========
  'dijkstra': [
    {
      codeLine: 0,
      title: '初始化',
      content: 'Dijkstra 算法求单源最短路径。初始化：源点 v0 到自身距离 0，到其他顶点距离 ∞。',
      keyPoint: '适用于非负权图，时间复杂度 O((V+E)logV)（使用优先队列）。'
    },
    {
      codeLine: 4,
      title: '选择最近顶点',
      content: '在未访问顶点中选距离最小的 u。这是贪心策略：每次扩展最近的顶点。',
      keyPoint: '贪心选择是 Dijkstra 的核心，保证一旦确定最短路径就不会再被更新。'
    },
    {
      codeLine: 5,
      title: '松弛操作',
      content: '对 u 的每条邻边 (u, j)：若 dist[u] + w(u,j) < dist[j]，则更新 dist[j]。这叫“松弛”。',
      keyPoint: '松弛是图算法的基础操作，最短路径问题本质就是反复松弛。'
    },
    {
      codeLine: 7,
      title: '算法完成',
      content: '所有顶点都已访问，dist 数组即为源点到各顶点的最短距离。',
      keyPoint: 'Dijkstra 不能处理负权边，需要 Bellman-Ford 算法。'
    }
  ],

  // ========== BFS ==========
  'bfs': [
    {
      codeLine: 0,
      title: '广度优先搜索',
      content: 'BFS 从起点 v 出发，按层次遍历：先访问 v 的所有邻居，再访问邻居的邻居。',
      keyPoint: '使用队列实现，时间复杂度 O(V+E)，可求无权图最短路径。'
    },
    {
      codeLine: 2,
      title: '入队与访问',
      content: '访问 v 后入队。队列保证“先发现的先处理”，形成层次遍历。',
      keyPoint: '队列的 FIFO 特性是 BFS 层次遍历的关键。'
    },
    {
      codeLine: 4,
      title: '扩展邻居',
      content: '出队顶点 v，遍历其所有未访问邻居：访问并入队。如此循环直到队列空。',
      keyPoint: 'visited 数组防止重复访问，避免死循环。'
    }
  ],

  // ========== DFS ==========
  'dfs': [
    {
      codeLine: 0,
      title: '深度优先搜索',
      content: 'DFS 从起点 v 出发，沿一条路径走到底（无未访问邻居时）再回溯。',
      keyPoint: '使用递归（或栈）实现，时间复杂度 O(V+E)。'
    },
    {
      codeLine: 2,
      title: '递归深入',
      content: '访问 v 后，对其每个未访问邻居 w 递归调用 DFS。一条路走到底。',
      keyPoint: '递归栈天然记录了回溯路径，无需显式管理。'
    }
  ],

  // ========== 二叉排序树 ==========
  'bst': [
    {
      codeLine: 0,
      title: '二叉排序树',
      content: 'BST 性质：左子树所有节点 < 根 < 右子树所有节点。中序遍历得到有序序列。',
      keyPoint: '查找/插入/删除平均 O(log n)，最坏 O(n)（退化为链表时）。'
    },
    {
      codeLine: 3,
      title: '递归插入',
      content: '若 key < 当前节点值，递归插入左子树；否则递归插入右子树。直到遇到空位置创建新节点。',
      keyPoint: '插入位置由 BST 性质唯一决定，保持中序有序。'
    }
  ]
}

// 获取指定算法在指定 codeLine 的讲解内容
// 支持模糊匹配：找到 codeLine 最接近且不大于目标的讲解点
export function getExplanation(algoId, codeLine) {
  const points = teachingContent[algoId]
  if (!points || points.length === 0) return null

  // 精确匹配优先
  const exact = points.find(p => p.codeLine === codeLine)
  if (exact) return exact

  // 模糊匹配：找 codeLine 最接近的
  let best = null
  let minDiff = Infinity
  for (const p of points) {
    const diff = Math.abs(p.codeLine - codeLine)
    if (diff < minDiff) {
      minDiff = diff
      best = p
    }
  }
  // 只在差距较小时返回（避免误匹配）
  return minDiff <= 2 ? best : null
}

// 判断该算法是否支持讲解模式
export function hasTeachingContent(algoId) {
  return !!(teachingContent[algoId] && teachingContent[algoId].length > 0)
}
