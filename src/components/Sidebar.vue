<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>算法可视化</h1>
    </div>
    <div class="algorithm-list">
      <div v-for="category in categories" :key="category.name" class="category">
        <div class="category-title" @click="toggleCategory(category.name)">
          <span class="icon">{{ category.icon }}</span>
          <span>{{ category.label }}</span>
          <span class="arrow">{{ expandedCategories.includes(category.name) ? '▼' : '▶' }}</span>
        </div>
        <ul v-show="expandedCategories.includes(category.name)" class="sub-list">
          <li 
            v-for="algo in category.algorithms" 
            :key="algo.id"
            class="algo-item"
            :class="{ active: selectedAlgorithm?.id === algo.id }"
            @click="selectAlgorithm(algo)"
          >
            <span class="difficulty" :class="algo.difficulty">{{ algo.difficulty }}</span>
            <span>{{ algo.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['select-algorithm'])

const expandedCategories = ref(['linear-list'])
const selectedAlgorithm = ref(null)

const categories = [
  {
    name: 'linear-list',
    label: '线性表',
    icon: '📋',
    algorithms: [
      { id: 'array-list', name: '顺序表-数组', difficulty: '低' },
      { id: 'singly-linked', name: '单链表-不带头节点', difficulty: '低' },
      { id: 'singly-linked-head', name: '单链表-带头节点', difficulty: '低' },
      { id: 'doubly-linked', name: '双链表-不带头节点', difficulty: '中' },
      { id: 'doubly-linked-head', name: '双链表-带头节点', difficulty: '中' },
      { id: 'circular-singly', name: '循环单链表', difficulty: '中' },
      { id: 'circular-doubly', name: '循环双链表', difficulty: '中' }
    ]
  },
  {
    name: 'stack-queue',
    label: '栈和队列',
    icon: '📚',
    algorithms: [
      { id: 'stack-array', name: '栈-顺序表', difficulty: '低' },
      { id: 'stack-linked', name: '栈-链表', difficulty: '低' },
      { id: 'queue-array', name: '队列-顺序表', difficulty: '低' },
      { id: 'queue-linked', name: '队列-链表', difficulty: '低' },
      { id: 'circular-queue', name: '队列-循环队列', difficulty: '中' },
      { id: 'bracket-match', name: '栈-括号匹配', difficulty: '中' },
      { id: 'expression', name: '栈-表达式计算', difficulty: '中' }
    ]
  },
  {
    name: 'tree-recursion',
    label: '树结构与递归',
    icon: '🌳',
    algorithms: [
      { id: 'static-linked', name: '静态链表', difficulty: '中' },
      { id: 'huffman-tree', name: '哈夫曼树构造', difficulty: '中' },
      { id: 'hanoi', name: '汉诺塔', difficulty: '中' },
      { id: 'chessboard', name: '棋盘覆盖', difficulty: '高' }
    ]
  },
  {
    name: 'backtracking',
    label: '回溯算法',
    icon: '🔄',
    algorithms: [
      { id: 'graph-coloring', name: '图着色', difficulty: '高' },
      { id: 'maze', name: '迷宫求解', difficulty: '高' }
    ]
  }
]

const toggleCategory = (name) => {
  const index = expandedCategories.value.indexOf(name)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(name)
  }
}

const selectAlgorithm = (algo) => {
  selectedAlgorithm.value = algo
  emit('select-algorithm', algo)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--bg-card);
  border-right: 1px solid var(--bg-panel);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--bg-panel);
}

.sidebar-header h1 {
  font-size: 20px;
  color: var(--primary);
  font-weight: 600;
}

.algorithm-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.category {
  margin-bottom: 5px;
}

.category-title {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.category-title:hover {
  background: var(--bg-panel);
}

.category-title .icon {
  margin-right: 10px;
  font-size: 16px;
}

.category-title .arrow {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-secondary);
}

.sub-list {
  list-style: none;
  padding-left: 15px;
}

.algo-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 13px;
  margin-bottom: 2px;
}

.algo-item:hover {
  background: var(--bg-panel);
}

.algo-item.active {
  background: var(--primary);
  color: #fff;
}

.difficulty {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  margin-right: 10px;
  font-weight: 500;
}

.difficulty.低 {
  background: var(--success);
  color: #fff;
}

.difficulty.中 {
  background: var(--warning);
  color: #333;
}

.difficulty.高 {
  background: var(--danger);
  color: #fff;
}
</style>