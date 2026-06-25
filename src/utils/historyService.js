// 历史记录服务
// 存储和管理用户算法测试历史，支持导出为Markdown文档

class HistoryService {
  constructor() {
    this.storageKey = 'algo_visualization_history'
    this.maxRecords = 100 // 最大保存记录数
    this.history = this.loadHistory()
  }

  // 从localStorage加载历史记录
  loadHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.warn('Failed to load history:', e)
    }
    return []
  }

  // 保存历史记录到localStorage
  saveHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history))
    } catch (e) {
      console.warn('Failed to save history:', e)
      // 如果存储满了，清理旧记录
      if (e.name === 'QuotaExceededError') {
        this.history = this.history.slice(-50)
        localStorage.setItem(this.storageKey, JSON.stringify(this.history))
      }
    }
  }

  // 添加一条历史记录
  addRecord(record) {
    const historyRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      algorithm: record.algorithm,
      algorithmName: record.algorithmName,
      category: record.category,
      inputData: record.inputData,
      inputType: record.inputType,
      steps: record.steps,
      totalSteps: record.totalSteps,
      timeComplexity: record.timeComplexity,
      spaceComplexity: record.spaceComplexity,
      duration: record.duration || 0,
      description: record.description || ''
    }

    this.history.unshift(historyRecord)

    // 保持最大记录数限制
    if (this.history.length > this.maxRecords) {
      this.history = this.history.slice(0, this.maxRecords)
    }

    this.saveHistory()
    return historyRecord
  }

  // 获取所有历史记录
  getAllRecords() {
    return this.history
  }

  // 获取指定算法的历史记录
  getRecordsByAlgorithm(algorithmId) {
    return this.history.filter(r => r.algorithm === algorithmId)
  }

  // 获取指定分类的历史记录
  getRecordsByCategory(category) {
    return this.history.filter(r => r.category === category)
  }

  // 获取最近的N条记录
  getRecentRecords(n = 10) {
    return this.history.slice(0, n)
  }

  // 删除指定记录
  deleteRecord(id) {
    this.history = this.history.filter(r => r.id !== id)
    this.saveHistory()
  }

  // 清空所有历史记录
  clearHistory() {
    this.history = []
    this.saveHistory()
  }

  // 导出为Markdown文档
  exportToMarkdown(options = {}) {
    const {
      title = '算法可视化测试历史报告',
      includeSteps = true,
      maxSteps = 20, // 每条记录最多显示多少步
      filterByAlgorithm = null,
      filterByCategory = null,
      recentCount = null
    } = options

    let records = this.history

    // 应用过滤器
    if (filterByAlgorithm) {
      records = this.getRecordsByAlgorithm(filterByAlgorithm)
    } else if (filterByCategory) {
      records = this.getRecordsByCategory(filterByCategory)
    } else if (recentCount) {
      records = this.getRecentRecords(recentCount)
    }

    if (records.length === 0) {
      return '# 无测试历史记录\n\n暂无任何算法测试历史数据。'
    }

    // 构建Markdown文档
    const md = []

    // 标题
    md.push(`# ${title}`)
    md.push('')
    md.push(`**生成时间**: ${new Date().toLocaleString('zh-CN')}`)
    md.push(`**记录总数**: ${records.length} 条`)
    md.push('')

    // 目录
    md.push('## 目录')
    md.push('')
    records.forEach((record, index) => {
      md.push(`${index + 1}. [${record.algorithmName} (${new Date(record.timestamp).toLocaleDateString('zh-CN')})](#record-${record.id})`)
    })
    md.push('')

    // 统计信息
    md.push('## 统计信息')
    md.push('')
    const stats = this.generateStats(records)
    md.push(`- **测试算法总数**: ${stats.totalAlgorithms} 种`)
    md.push(`- **测试次数**: ${stats.totalRuns} 次`)
    md.push(`- **平均执行时长**: ${stats.avgDuration}ms`)
    md.push(`- **最常测试算法**: ${stats.mostFrequent || '无'}`)
    md.push('')

    // 详细记录
    md.push('## 详细记录')
    md.push('')

    records.forEach((record, index) => {
      md.push(`### ${index + 1}. ${record.algorithmName} <a id="record-${record.id}"></a>`)
      md.push('')
      md.push(`**执行时间**: ${new Date(record.timestamp).toLocaleString('zh-CN')}`)
      md.push(`**算法分类**: ${this.getCategoryName(record.category)}`)
      md.push(`**复杂度**: 时间 ${record.timeComplexity} | 空间 ${record.spaceComplexity}`)
      md.push(`**总步骤数**: ${record.totalSteps} 步`)
      md.push(`**执行时长**: ${record.duration}ms`)
      md.push('')

      // 输入数据
      md.push('#### 输入数据')
      md.push('')
      md.push('```')
      if (record.inputType === 'array') {
        md.push(`数组: [${record.inputData.join(', ')}]`)
      } else if (record.inputType === 'graph') {
        md.push(`节点数: ${record.inputData.nodes}`)
        md.push(`边集:`)
        record.inputData.edges.forEach(edge => {
          md.push(`  ${edge[0]} -> ${edge[1]} (权重: ${edge[2]})`)
        })
      } else if (record.inputType === 'number') {
        md.push(`数值: ${record.inputData}`)
      } else if (record.inputType === 'string') {
        md.push(`字符串: "${record.inputData}"`)
      } else if (record.inputType === 'maze') {
        md.push(`迷宫数据`)
      }
      md.push('```')
      md.push('')

      // 步骤详情（可选）
      if (includeSteps && record.steps && record.steps.length > 0) {
        md.push('#### 执行步骤')
        md.push('')
        const displaySteps = record.steps.slice(0, maxSteps)
        displaySteps.forEach((step, stepIndex) => {
          md.push(`**步骤 ${stepIndex + 1}**: ${step.description || '无描述'}`)
          if (step.array) {
            md.push(`  - 数组状态: [${step.array.join(', ')}]`)
          }
          if (step.highlights && Object.keys(step.highlights).length > 0) {
            const highlights = Object.entries(step.highlights)
              .map(([key, value]) => `索引${key}: ${value}`)
              .join(', ')
            md.push(`  - 高亮标记: ${highlights}`)
          }
        })

        if (record.steps.length > maxSteps) {
          md.push('')
          md.push(`*...还有 ${record.steps.length - maxSteps} 步未显示*`)
        }
        md.push('')
      }

      md.push('---')
      md.push('')
    })

    // 总结
    md.push('## 总结')
    md.push('')
    md.push('本报告由算法过程可视化系统自动生成，记录了用户的算法测试历史。')
    md.push('')
    md.push(`**报告生成日期**: ${new Date().toLocaleDateString('zh-CN')}`)
    md.push(`**系统版本**: 1.0.0`)

    return md.join('\n')
  }

  // 生成统计信息
  generateStats(records) {
    const algorithmCounts = {}
    let totalDuration = 0

    records.forEach(record => {
      algorithmCounts[record.algorithm] = (algorithmCounts[record.algorithm] || 0) + 1
      totalDuration += record.duration || 0
    })

    const sortedAlgorithms = Object.entries(algorithmCounts)
      .sort((a, b) => b[1] - a[1])

    return {
      totalAlgorithms: Object.keys(algorithmCounts).length,
      totalRuns: records.length,
      avgDuration: Math.round(totalDuration / records.length) || 0,
      mostFrequent: sortedAlgorithms[0] ? `${sortedAlgorithms[0][0]} (${sortedAlgorithms[0][1]}次)` : null
    }
  }

  // 获取分类名称
  getCategoryName(category) {
    const categoryNames = {
      'linear': '线性表',
      'stack-queue': '栈和队列',
      'tree': '树结构',
      'graph': '图结构',
      'sort': '排序算法',
      'recursion': '递归与回溯'
    }
    return categoryNames[category] || category
  }

  // 导出并下载Markdown文件
  downloadMarkdown(options = {}) {
    const markdownContent = this.exportToMarkdown(options)
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `算法测试历史_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
    return markdownContent
  }

  // 导出JSON格式（用于备份）
  exportJSON() {
    return JSON.stringify(this.history, null, 2)
  }

  // 导入JSON格式（用于恢复）
  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      if (Array.isArray(data)) {
        this.history = data
        this.saveHistory()
        return true
      }
    } catch (e) {
      console.warn('Failed to import history:', e)
    }
    return false
  }
}

// 导出单例实例
export const historyService = new HistoryService()

// 导出类以便需要时创建新实例
export default HistoryService