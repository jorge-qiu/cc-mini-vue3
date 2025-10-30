**scheduler** 可以让日常开发中使用
1. 手动控制更新时机
```js
const searchQuery = ref('')

  // 不用 scheduler - 立即搜索
  watch(searchQuery, (newVal) => {
      performSearch(newVal) // 每次输入都搜索
  })

  // 使用 scheduler - 控制何时搜索
  watch(searchQuery, (newVal) => {
      performSearch(newVal)
  }, {
      scheduler: (runner) => {
          // 可以决定：延迟搜索、批量搜索、条件搜索等
          debounce(runner, 500)
      }
  })s
```

2. 在更新前执行特定操作
```js
🔍 数据验证

  effect(() => {
      validateForm(formData)
  }, {
      scheduler: (runner) => {
          // 更新前：检查数据完整性、格式等
          if (isDataValid(formData)) {
              runner()
          }
      }
  })

  🚀 请求取消和管理

  effect(() => {
      fetchData(params)
  }, {
      scheduler: (runner) => {
          // 更新前：取消之前的请求
          cancelPreviousRequest()
          runner()
      }
  })

  💾 缓存策略

  effect(() => {
      loadData(userId)
  }, {
      scheduler: (runner) => {
          // 更新前：检查缓存、频率限制等
          if (shouldUseCache(userId)) {
              return // 使用缓存，不执行 effect
          }
          runner()
      }
  })

  ⚡ 性能优化

  effect(() => {
      updateExpensiveComponent(data)
  }, {
      scheduler: (runner) => {
          // 更新前：批量处理、优先级调度
          batchUpdate(runner)
      }
  })
```