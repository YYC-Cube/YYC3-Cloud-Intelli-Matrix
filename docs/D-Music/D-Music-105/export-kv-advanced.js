// export-kv-advanced.js
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Supabase 项目信息
const SUPABASE_URL = "https://phgrinrlnxzjyxxhsqry.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ3JpbnJsbnh6anl4eGhzcXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzgzNDEsImV4cCI6MjA4NTI1NDM0MX0.bNn7XeoXmFD0dGIXIkh_YzQw-i-IqWW4x5gvl8nMcDA"

// 初始化客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * 导出 KV 数据
 * @param {Object} options - 导出选项
 * @param {string} [options.userId] - 指定用户 ID
 * @param {string} [options.prefix] - 指定前缀
 */
async function exportKV({ userId, prefix } = {}) {
  let query = supabase.from('kv_store_f626b673').select('key, value')

  if (userId) {
    query = query.like('key', `user:${userId}:%`)
  } else if (prefix) {
    query = query.like('key', `${prefix}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("❌ 导出失败:", error)
    return
  }

  const filename = userId
    ? `kv_export_user_${userId}.json`
    : prefix
    ? `kv_export_prefix_${prefix}.json`
    : `kv_export_all.json`

  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`✅ 导出完成，共 ${data.length} 行，已保存到 ${filename}`)
}

// 示例调用
// 1. 导出全部
// exportKV()

// 2. 导出某个用户的数据
// exportKV({ userId: "abc123" })

// 3. 导出某个前缀的数据
// exportKV({ prefix: "song:" })
