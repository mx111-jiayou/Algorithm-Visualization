// 算法注册表 - 所有算法的元数据与分类
export const algorithmRegistry = {
  // ========== 线性表 ==========
  'array-list': {
    id: 'array-list', name: '顺序表-数组', category: 'linear-list',
    difficulty: '简单', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: '用一段连续的存储单元依次存储线性表的数据元素',
    inputType: 'array', defaultData: [48, 12, 72, 35, 90, 6, 63, 21],
    code: `bool insert(SqList* L, int i, int x) {
  if (i < 0 || i > L->length || L->length == L->capacity) return false;
  for (int j = L->length - 1; j >= i; j--)
    L->data[j + 1] = L->data[j];
  L->data[i] = x;
  L->length++;
  return true;
}

bool erase(SqList* L, int i) {
  if (i < 0 || i >= L->length) return false;
  for (int j = i; j < L->length - 1; j++)
    L->data[j] = L->data[j + 1];
  L->length--;
  return true;
}`
  },
  'singly-linked': {
    id: 'singly-linked', name: '单链表-不带头节点', category: 'linear-list',
    difficulty: '简单', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: '每个节点包含数据域和指针域，通过指针链接',
    inputType: 'array', defaultData: [10, 20, 30, 40, 50],
    code: `// 单链表-不带头节点
typedef struct LNode {
    int data;
    struct LNode *next;
} LNode, *LinkList;

LinkList CreateList(int a[], int n) {
    LinkList head = NULL, tail = NULL;
    for (int i = 0; i < n; i++) {
        LNode *s = (LNode*)malloc(sizeof(LNode));
        s->data = a[i];
        s->next = NULL;
        if (!head) head = s;
        else tail->next = s;
        tail = s;
    }
    return head;
}`
  },
  'singly-linked-head': {
    id: 'singly-linked-head', name: '单链表-带头节点', category: 'linear-list',
    difficulty: '简单', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: '带头节点的单链表，头节点不存储数据',
    inputType: 'array', defaultData: [10, 20, 30, 40, 50],
    code: `// 单链表-带头节点
typedef struct LNode {
    int data;
    struct LNode *next;
} LNode, *LinkList;

LinkList CreateList_Head(int a[], int n) {
    LinkList head = (LNode*)malloc(sizeof(LNode));
    head->next = NULL;
    LNode *tail = head;
    for (int i = 0; i < n; i++) {
        LNode *s = (LNode*)malloc(sizeof(LNode));
        s->data = a[i];
        s->next = NULL;
        tail->next = s;
        tail = s;
    }
    return head;
}`
  },
  'doubly-linked': {
    id: 'doubly-linked', name: '双链表-不带头节点', category: 'linear-list',
    difficulty: '中等', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: '每个节点有前驱和后继两个指针',
    inputType: 'array', defaultData: [10, 20, 30, 40, 50],
    code: `// 双链表-不带头节点
typedef struct DNode {
    int data;
    struct DNode *prior, *next;
} DNode, *DLinkList;`
  },
  'doubly-linked-head': {
    id: 'doubly-linked-head', name: '双链表-带头节点', category: 'linear-list',
    difficulty: '中等', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: '带头节点的双链表',
    inputType: 'array', defaultData: [10, 20, 30, 40, 50],
    code: `// 双链表-带头节点
typedef struct DNode {
    int data;
    struct DNode *prior, *next;
} DNode, *DLinkList;`
  },
  'circular-singly': {
    id: 'circular-singly', name: '循环单链表', category: 'linear-list',
    difficulty: '中等', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: '尾节点的指针指向头节点形成环',
    inputType: 'array', defaultData: [10, 20, 30, 40],
    code: `// 循环单链表
// 尾节点next指向头节点
typedef struct LNode {
    int data;
    struct LNode *next;
} LNode, *CLinkList;`
  },
  'circular-doubly': {
    id: 'circular-doubly', name: '循环双链表', category: 'linear-list',
    difficulty: '中等', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
    description: '双链表首尾相连形成环',
    inputType: 'array', defaultData: [10, 20, 30, 40],
    code: `// 循环双链表
// 头节点prior指向尾节点，尾节点next指向头节点
typedef struct DNode {
    int data;
    struct DNode *prior, *next;
} DNode, *CDLinkList;`
  },

  // ========== 栈和队列 ==========
  'stack-array': {
    id: 'stack-array', name: '栈-顺序表', category: 'stack-queue',
    difficulty: '简单', timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
    description: '后进先出(LIFO)的线性表，用数组实现',
    inputType: 'array', defaultData: [10, 20, 30, 40],
    code: `// 栈-顺序表
#define MAXSIZE 100
typedef struct {
    int data[MAXSIZE];
    int top;
} SqStack;

void Push(SqStack *S, int e) {
    S->data[++S->top] = e;
}

int Pop(SqStack *S) {
    return S->data[S->top--];
}`
  },
  'stack-linked': {
    id: 'stack-linked', name: '栈-链表', category: 'stack-queue',
    difficulty: '简单', timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
    description: '用链表实现的栈，无需预分配空间',
    inputType: 'array', defaultData: [10, 20, 30, 40],
    code: `// 栈-链表
typedef struct SNode {
    int data;
    struct SNode *next;
} SNode, *LinkStack;`
  },
  'queue-array': {
    id: 'queue-array', name: '队列-顺序表', category: 'stack-queue',
    difficulty: '简单', timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
    description: '先进先出(FIFO)的线性表，用数组实现',
    inputType: 'array', defaultData: [10, 20, 30, 40],
    code: `// 队列-顺序表
typedef struct {
    int data[MAXSIZE];
    int front, rear;
} SqQueue;`
  },
  'queue-linked': {
    id: 'queue-linked', name: '队列-链表', category: 'stack-queue',
    difficulty: '简单', timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
    description: '用链表实现的队列',
    inputType: 'array', defaultData: [10, 20, 30, 40],
    code: `// 队列-链表
typedef struct QNode {
    int data;
    struct QNode *next;
} QNode;
typedef struct { QNode *front, *rear; } LinkQueue;`
  },
  'circular-queue': {
    id: 'circular-queue', name: '循环队列', category: 'stack-queue',
    difficulty: '中等', timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
    description: '将顺序队列首尾相连形成的循环队列',
    inputType: 'array', defaultData: [10, 20, 30, 40],
    code: `// 循环队列
typedef struct {
    int data[MAXSIZE];
    int front, rear;
} CircularQueue;
// 队满: (rear+1)%MAXSIZE == front
// 队空: front == rear`
  },
  'bracket-match': {
    id: 'bracket-match', name: '括号匹配', category: 'stack-queue',
    difficulty: '简单', timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
    description: '利用栈判断括号是否匹配',
    inputType: 'string', defaultData: '{[()]}',
    code: `// 括号匹配
bool BracketMatch(char str[]) {
    SqStack S; InitStack(&S);
    for (int i = 0; str[i]; i++) {
        if (str[i]=='(' || str[i]=='[' || str[i]=='{')
            Push(&S, str[i]);
        else {
            char top; Pop(&S, &top);
            if ((str[i]==')' && top!='(') ||
                (str[i]==']' && top!='[') ||
                (str[i]=='}' && top!='{'))
                return false;
        }
    }
    return IsEmpty(&S);
}`
  },
  'expression': {
    id: 'expression', name: '表达式计算', category: 'stack-queue',
    difficulty: '中等', timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
    description: '中缀表达式转后缀并求值',
    inputType: 'string', defaultData: '3+5*2-1',
    code: `// 中缀表达式求值
int Evaluate(char expr[]) {
    // 使用操作数栈和运算符栈
    // 1. 遇到数字压入操作数栈
    // 2. 遇到运算符与栈顶比较优先级
    // 3. 栈顶优先级高则弹出计算
}`
  },

  // ========== 树结构 ==========
  'binary-tree': {
    id: 'binary-tree', name: '二叉树-链式存储', category: 'tree',
    difficulty: '简单', timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
    description: '每个节点最多有两个子树的树结构',
    inputType: 'array', defaultData: [1, 2, 3, 4, 5, 6, 7],
    code: `// 二叉树-链式存储
typedef struct BiTNode {
    int data;
    struct BiTNode *lchild, *rchild;
} BiTNode, *BiTree;

void PreOrder(BiTree T) {
    if (T) {
        visit(T);
        PreOrder(T->lchild);
        PreOrder(T->rchild);
    }
}`
  },
  'bst': {
    id: 'bst', name: '二叉排序树', category: 'tree',
    difficulty: '中等', timeComplexity: 'O(log n)', spaceComplexity: 'O(n)',
    description: '左子树<根<右子树的二叉树',
    inputType: 'array', defaultData: [50, 30, 70, 20, 40, 60, 80],
    code: `// 二叉排序树
BiTree BST_Insert(BiTree T, int key) {
    if (!T) {
        T = (BiTree)malloc(sizeof(BiTNode));
        T->data = key; T->lchild = T->rchild = NULL;
    } else if (key < T->data)
        T->lchild = BST_Insert(T->lchild, key);
    else
        T->rchild = BST_Insert(T->rchild, key);
    return T;
}`
  },
  'huffman-tree': {
    id: 'huffman-tree', name: '哈夫曼树构造', category: 'tree',
    difficulty: '中等', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)',
    description: '带权路径长度最短的二叉树',
    inputType: 'array', defaultData: [5, 29, 7, 8, 14, 23, 3, 11],
    code: `// 哈夫曼树构造
void CreateHuffmanTree(HuffmanTree &HT, int *w, int n) {
    // 1. 初始化2n-1个节点
    // 2. 从集合中选两个权值最小的节点
    // 3. 合并为新节点，权值为二者之和
    // 4. 重复直到只剩一棵树
}`
  },

  // ========== 图结构 ==========
  'adjacency-matrix': {
    id: 'adjacency-matrix', name: '邻接矩阵', category: 'graph',
    difficulty: '简单', timeComplexity: 'O(n²)', spaceComplexity: 'O(n²)',
    description: '用二维数组表示图中顶点间的关系',
    inputType: 'graph', defaultData: { nodes: 5, edges: [[0,1,10],[0,3,30],[0,4,100],[1,2,50],[2,4,10],[3,2,20],[3,4,60]] },
    code: `// 邻接矩阵
typedef struct {
    int vex[MAXVEX];
    int arc[MAXVEX][MAXVEX];
    int vexnum, arcnum;
} MGraph;`
  },
  'adjacency-list': {
    id: 'adjacency-list', name: '邻接链表', category: 'graph',
    difficulty: '简单', timeComplexity: 'O(n+e)', spaceComplexity: 'O(n+e)',
    description: '用链表数组表示图中每个顶点的邻接关系',
    inputType: 'graph', defaultData: { nodes: 5, edges: [[0,1,10],[0,3,30],[0,4,100],[1,2,50],[2,4,10],[3,2,20],[3,4,60]] },
    code: `// 邻接链表
typedef struct ArcNode {
    int adjvex;
    int weight;
    struct ArcNode *nextarc;
} ArcNode;
typedef struct {
    int data;
    ArcNode *firstarc;
} VNode, AdjList[MAXVEX];`
  },
  'bfs': {
    id: 'bfs', name: 'BFS 广度优先搜索', category: 'graph',
    difficulty: '中等', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)',
    description: '按层次遍历图的节点，使用队列实现',
    inputType: 'graph', defaultData: { nodes: 6, edges: [[0,1,1],[0,2,1],[1,3,1],[1,4,1],[2,5,1],[4,5,1]] },
    code: `// BFS 广度优先搜索
void BFS(Graph G, int v) {
    visit(v); visited[v] = true;
    Queue Q; InitQueue(Q); EnQueue(Q, v);
    while (!IsEmpty(Q)) {
        DeQueue(Q, v);
        for (w = FirstNeighbor(G,v); w>=0; w=NextNeighbor(G,v,w))
            if (!visited[w]) {
                visit(w); visited[w] = true;
                EnQueue(Q, w);
            }
    }
}`
  },
  'dfs': {
    id: 'dfs', name: 'DFS 深度优先搜索', category: 'graph',
    difficulty: '中等', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)',
    description: '沿一条路径深入到底再回溯，使用递归/栈实现',
    inputType: 'graph', defaultData: { nodes: 6, edges: [[0,1,1],[0,2,1],[1,3,1],[1,4,1],[2,5,1],[4,5,1]] },
    code: `// DFS 深度优先搜索
void DFS(Graph G, int v) {
    visit(v); visited[v] = true;
    for (w = FirstNeighbor(G,v); w>=0; w=NextNeighbor(G,v,w))
        if (!visited[w])
            DFS(G, w);
}`
  },
  'dijkstra': {
    id: 'dijkstra', name: 'Dijkstra 最短路径', category: 'graph',
    difficulty: '中等+', timeComplexity: 'O((V+E)logV)', spaceComplexity: 'O(V)',
    description: '贪心算法，每次选最近未访问节点松弛邻边',
    inputType: 'graph', defaultData: { nodes: 5, edges: [[0,1,10],[0,3,30],[0,4,100],[1,2,50],[2,4,10],[3,2,20],[3,4,60]] },
    code: `// Dijkstra 最短路径
void Dijkstra(MGraph G, int v0, int dist[], int path[]) {
    int visited[MAXVEX];
    for (int i = 0; i < G.vexnum; i++) {
        dist[i] = G.arc[v0][i];
        visited[i] = 0;
        if (G.arc[v0][i] < INF) path[i] = v0;
        else path[i] = -1;
    }
    visited[v0] = 1; dist[v0] = 0;
    for (int i = 1; i < G.vexnum; i++) {
        int min = INF, u;
        for (int j = 0; j < G.vexnum; j++)
            if (!visited[j] && dist[j] < min)
                { min = dist[j]; u = j; }
        visited[u] = 1;
        for (int j = 0; j < G.vexnum; j++)
            if (!visited[j] && dist[u]+G.arc[u][j] < dist[j]) {
                dist[j] = dist[u] + G.arc[u][j];
                path[j] = u;
            }
    }
}`,
    testCases: [
      { name: '5节点图', data: { nodes: 5, edges: [[0,1,10],[0,3,30],[0,4,100],[1,2,50],[2,4,10],[3,2,20],[3,4,60]] } },
      { name: '6节点图', data: { nodes: 6, edges: [[0,1,4],[0,2,1],[1,3,1],[2,1,2],[2,3,5],[3,4,3],[4,5,2],[3,5,6]] } },
      { name: '4节点图', data: { nodes: 4, edges: [[0,1,2],[0,2,5],[1,2,1],[1,3,6],[2,3,3]] } }
    ]
  },

  // ========== 排序 ==========
  'bubble-sort': {
    id: 'bubble-sort', name: '冒泡排序', category: 'sort',
    difficulty: '简单', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)',
    description: '相邻元素两两比较，每轮将最大元素"冒泡"到末尾',
    inputType: 'array', defaultData: [64, 34, 25, 12, 22, 11, 90],
    code: `// 冒泡排序
void BubbleSort(int a[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-1-i; j++)
            if (a[j] > a[j+1]) {
                int temp = a[j];
                a[j] = a[j+1];
                a[j+1] = temp;
            }
}`,
    testCases: [
      { name: '随机7个', data: [64, 34, 25, 12, 22, 11, 90] },
      { name: '已排序', data: [1, 2, 3, 4, 5] },
      { name: '逆序', data: [5, 4, 3, 2, 1] }
    ]
  },
  'quick-sort': {
    id: 'quick-sort', name: '快速排序', category: 'sort',
    difficulty: '中等', timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)',
    description: '分治法：选基准分区，递归排序左右子数组',
    inputType: 'array', defaultData: [38, 27, 43, 3, 9, 82, 10],
    code: `// 快速排序
int Partition(int a[], int low, int high) {
    int pivot = a[low];
    while (low < high) {
        while (low < high && a[high] >= pivot) high--;
        a[low] = a[high];
        while (low < high && a[low] <= pivot) low++;
        a[high] = a[low];
    }
    a[low] = pivot;
    return low;
}

void QuickSort(int a[], int low, int high) {
    if (low < high) {
        int p = Partition(a, low, high);
        QuickSort(a, low, p-1);
        QuickSort(a, p+1, high);
    }
}`,
    testCases: [
      { name: '随机7个', data: [38, 27, 43, 3, 9, 82, 10] },
      { name: '已排序', data: [1, 2, 3, 4, 5] },
      { name: '逆序', data: [5, 4, 3, 2, 1] }
    ]
  },
  'insertion-sort': {
    id: 'insertion-sort', name: '直接插入排序', category: 'sort',
    difficulty: '简单', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)',
    description: '将待排元素插入到已排序序列的正确位置',
    inputType: 'array', defaultData: [12, 11, 13, 5, 6],
    code: `// 直接插入排序
void InsertSort(int a[], int n) {
    for (int i = 1; i < n; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j+1] = a[j];
            j--;
        }
        a[j+1] = key;
    }
}`
  },
  'shell-sort': {
    id: 'shell-sort', name: '希尔排序', category: 'sort',
    difficulty: '中等', timeComplexity: 'O(n^1.3)', spaceComplexity: 'O(1)',
    description: '分组插入排序，逐步缩小增量',
    inputType: 'array', defaultData: [12, 34, 54, 2, 3, 9, 7, 25],
    code: `// 希尔排序
void ShellSort(int a[], int n) {
    for (int gap = n/2; gap > 0; gap /= 2)
        for (int i = gap; i < n; i++) {
            int temp = a[i], j;
            for (j = i; j >= gap && a[j-gap] > temp; j -= gap)
                a[j] = a[j-gap];
            a[j] = temp;
        }
}`
  },
  'selection-sort': {
    id: 'selection-sort', name: '简单选择排序', category: 'sort',
    difficulty: '简单', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)',
    description: '每轮选出最小元素放到已排序序列末尾',
    inputType: 'array', defaultData: [64, 25, 12, 22, 11],
    code: `// 简单选择排序
void SelectSort(int a[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min = i;
        for (int j = i+1; j < n; j++)
            if (a[j] < a[min]) min = j;
        if (min != i) { int t = a[i]; a[i] = a[min]; a[min] = t; }
    }
}`
  },
  'merge-sort': {
    id: 'merge-sort', name: '归并排序', category: 'sort',
    difficulty: '中等', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)',
    description: '分治法：递归拆分再合并有序子数组',
    inputType: 'array', defaultData: [38, 27, 43, 3, 9, 82, 10],
    code: `// 归并排序
void Merge(int a[], int l, int m, int r) {
    int i=l, j=m+1, k=0, tmp[r-l+1];
    while (i<=m && j<=r)
        tmp[k++] = a[i]<=a[j] ? a[i++] : a[j++];
    while (i<=m) tmp[k++] = a[i++];
    while (j<=r) tmp[k++] = a[j++];
    for (i=l,k=0; i<=r; i++,k++) a[i]=tmp[k];
}
void MergeSort(int a[], int l, int r) {
    if (l < r) {
        int m = (l+r)/2;
        MergeSort(a, l, m);
        MergeSort(a, m+1, r);
        Merge(a, l, m, r);
    }
}`
  },

  // ========== 递归与回溯 ==========
  'hanoi': {
    id: 'hanoi', name: '汉诺塔', category: 'recursion',
    difficulty: '中等', timeComplexity: 'O(2^n)', spaceComplexity: 'O(n)',
    description: '将n个圆盘从源柱移到目标柱，大盘不能放在小盘上',
    inputType: 'number', defaultData: 3,
    code: `// 汉诺塔
void Hanoi(int n, char A, char B, char C) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\\n", A, C);
        return;
    }
    Hanoi(n-1, A, C, B);
    printf("Move disk %d from %c to %c\\n", n, A, C);
    Hanoi(n-1, B, A, C);
}`,
    testCases: [
      { name: '3个盘', data: 3 },
      { name: '5个盘', data: 5 },
      { name: '1个盘', data: 1 }
    ]
  },
  'chessboard': {
    id: 'chessboard', name: '棋盘覆盖', category: 'recursion',
    difficulty: '中等', timeComplexity: 'O(4^k)', spaceComplexity: 'O(4^k)',
    description: '用L型骨牌覆盖缺一格的2^k×2^k棋盘',
    inputType: 'number', defaultData: 3,
    code: `// 棋盘覆盖
int tile = 0;
void ChessBoard(int tr, int tc, int dr, int dc, int size) {
    if (size == 1) return;
    int t = ++tile, s = size / 2;
    // 左上角
    if (dr < tr+s && dc < tc+s)
        ChessBoard(tr, tc, dr, dc, s);
    else { board[tr+s-1][tc+s-1] = t; ChessBoard(tr, tc, tr+s-1, tc+s-1, s); }
    // 右上角
    if (dr < tr+s && dc >= tc+s)
        ChessBoard(tr, tc+s, dr, dc, s);
    else { board[tr+s-1][tc+s] = t; ChessBoard(tr, tc+s, tr+s-1, tc+s, s); }
    // 左下角
    if (dr >= tr+s && dc < tc+s)
        ChessBoard(tr+s, tc, dr, dc, s);
    else { board[tr+s][tc+s-1] = t; ChessBoard(tr+s, tc, tr+s, tc+s-1, s); }
    // 右下角
    if (dr >= tr+s && dc >= tc+s)
        ChessBoard(tr+s, tc+s, dr, dc, s);
    else { board[tr+s][tc+s] = t; ChessBoard(tr+s, tc+s, tr+s, tc+s, s); }
}`
  },
  'graph-coloring': {
    id: 'graph-coloring', name: '图着色', category: 'recursion',
    difficulty: '中等', timeComplexity: 'O(m^V)', spaceComplexity: 'O(V)',
    description: '用m种颜色给图的顶点着色，使相邻顶点颜色不同',
    inputType: 'graph', defaultData: { nodes: 4, edges: [[0,1,1],[0,2,1],[0,3,1],[1,2,1],[2,3,1]], colors: 3 },
    code: `// 图着色 (m着色问题)
bool isSafe(int v, int color[], int c, bool graph[V][V]) {
    for (int i = 0; i < V; i++)
        if (graph[v][i] && color[i] == c) return false;
    return true;
}
bool GraphColoring(bool graph[V][V], int m, int color[], int v) {
    if (v == V) return true;
    for (int c = 1; c <= m; c++) {
        if (isSafe(v, color, c, graph)) {
            color[v] = c;
            if (GraphColoring(graph, m, color, v+1))
                return true;
            color[v] = 0;
        }
    }
    return false;
}`
  },
  'maze': {
    id: 'maze', name: '迷宫求解', category: 'recursion',
    difficulty: '中等', timeComplexity: 'O(2^(mn))', spaceComplexity: 'O(mn)',
    description: '在迷宫中找到从入口到出口的路径',
    inputType: 'maze', defaultData: [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]],
    code: `// 迷宫求解
bool MazePath(int maze[M][N], int x, int y, int ex, int ey) {
    if (x==ex && y==ey) return true;
    if (maze[x][y] == 0) {
        maze[x][y] = 2; // 标记已访问
        if (MazePath(maze,x+1,y,ex,ey) || MazePath(maze,x,y+1,ex,ey) ||
            MazePath(maze,x-1,y,ex,ey) || MazePath(maze,x,y-1,ex,ey))
            return true;
        maze[x][y] = 0; // 回溯
    }
    return false;
}`
  }
}

// 分类定义
export const categories = [
  { id: 'linear-list', name: '线性表', icon: '≡' },
  { id: 'stack-queue', name: '栈和队列', icon: '⊞' },
  { id: 'tree', name: '树结构', icon: '♧' },
  { id: 'graph', name: '图结构', icon: '◇' },
  { id: 'sort', name: '排序', icon: '↕' },
  { id: 'recursion', name: '递归与回溯', icon: '↻' }
]

// 获取某分类下所有算法
export function getAlgorithmsByCategory(categoryId) {
  return Object.values(algorithmRegistry).filter(a => a.category === categoryId)
}

// 获取算法信息
export function getAlgorithm(id) {
  return algorithmRegistry[id] || null
}
