// export-kv-cli.js
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Supabase 项目信息
const SUPABASE_URL = "https://phgrinrlnxzjyxxhsqry.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // 建议用 service_role_key

// 初始化客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 解析命令行参数
const args = process.argv.slice(2)
let userId = null
let prefix = null

args.forEach((arg, i) => {
  if (arg === "--user" && args[i+1]) {
    userId = args[i+1]
  }
  if (arg === "--prefix" && args[i+1]) {
    prefix = args[i+1]
  }
})

async function exportKV() {
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

exportKV()
