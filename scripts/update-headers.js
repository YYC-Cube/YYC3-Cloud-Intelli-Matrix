/**
 * @file: update-headers.js
 * @description: 批量更新已有标头脚本 · 将自定义格式转换为 YYC³ 标准格式
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-09
 * @updated: 2026-04-09
 * @status: active
 * @tags: [script],[automation],[header]
 *
 * @brief: 批量更新已有标头为 YYC³ 标准格式
 *
 * @details:
 * - 检测已有标头格式
 * - 提取现有信息（文件名、描述等）
 * - 转换为标准 JSDoc 格式
 * - 补充缺失的必填字段
 * - 支持批量处理目录
 *
 * @dependencies: Node.js fs, path
 * @exports: updateHeader, updateDirectory
 * @notes: 专门处理已有标头但格式不正确的文件
 */

const fs = require('fs');
const path = require('path');

const AUTHOR_NAME = 'YanYuCloudCube Team';
const TODAY = new Date().toISOString().split('T')[0];
const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'];

const REQUIRED_FIELDS = ['@file', '@description', '@author', '@version', '@created', '@updated', '@status', '@tags'];

/**
 * 从已有标头中提取信息
 * @param {string} content - 文件内容
 * @returns {Object} 提取的信息
 */
function extractHeaderInfo(content) {
  const lines = content.split('\n');
  const info = {
    hasHeader: false,
    description: '',
    fileName: '',
    existingFields: {}
  };

  if (!lines[0].includes('/**')) {
    return info;
  }

  info.hasHeader = true;

  for (let i = 0; i < Math.min(50, lines.length); i++) {
    const line = lines[i];
    
    if (line.includes('*/')) break;

    if (line.includes('.ts') || line.includes('.tsx') || line.includes('.js') || line.includes('.jsx')) {
      const match = line.match(/\*?\s*(\S+\.(ts|tsx|js|jsx))/);
      if (match) info.fileName = match[1];
    }

    if (line.includes('===') || line.includes('---')) {
      const prevLine = lines[i - 1];
      if (prevLine) {
        const desc = prevLine.replace(/^\s*\*\s*/, '').trim();
        if (desc && !desc.includes('===')) {
          info.description = desc;
        }
      }
    }

    if (line.includes('功能') || line.includes('Function')) {
      const nextLine = lines[i + 1];
      if (nextLine && !nextLine.includes('===')) {
        const desc = nextLine.replace(/^\s*\*\s*/, '').trim();
        if (desc && !info.description) {
          info.description = desc;
        }
      }
    }

    REQUIRED_FIELDS.forEach(field => {
      const regex = new RegExp(`${field}:?\\s*(.+)`);
      const match = line.match(regex);
      if (match) {
        info.existingFields[field] = match[1].trim();
      }
    });
  }

  return info;
}

/**
 * 生成标准标头
 * @param {string} filePath - 文件路径
 * @param {Object} info - 提取的信息
 * @returns {string} 标准标头
 */
function generateStandardHeader(filePath, info) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);
  
  let description = info.existingFields['@description'] || info.description || `${fileName} - YYC³ 功能模块`;
  
  const version = info.existingFields['@version'] || 'v1.0.0';
  const created = info.existingFields['@created'] || TODAY;
  const updated = TODAY;
  const status = info.existingFields['@status'] || 'active';
  
  let tags = info.existingFields['@tags'];
  if (!tags) {
    if (ext === '.ts' || ext === '.tsx') {
      if (filePath.includes('/hooks/')) tags = '[hook]';
      else if (filePath.includes('/lib/')) tags = '[lib]';
      else if (filePath.includes('/components/')) tags = '[component]';
      else tags = '[module]';
    } else if (ext === '.js' || ext === '.jsx') {
      tags = '[script]';
    } else if (ext === '.css' || ext === '.scss') {
      tags = '[style]';
    } else {
      tags = '[file]';
    }
  }

  let header = `/**\n`;
  header += ` * @file: ${fileName}\n`;
  header += ` * @description: ${description}\n`;
  header += ` * @author: ${AUTHOR_NAME}\n`;
  header += ` * @version: ${version}\n`;
  header += ` * @created: ${created}\n`;
  header += ` * @updated: ${updated}\n`;
  header += ` * @status: ${status}\n`;
  header += ` * @tags: ${tags}\n`;
  header += ` */\n\n`;

  return header;
}

/**
 * 更新单个文件的标头
 * @param {string} filePath - 文件路径
 * @returns {boolean} 是否成功
 */
function updateHeader(filePath) {
  const ext = path.extname(filePath);
  
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const info = extractHeaderInfo(content);

  if (!info.hasHeader) {
    console.log(`⚠️  文件没有标头，跳过: ${filePath}`);
    return false;
  }

  const hasAllRequiredFields = REQUIRED_FIELDS.every(field => info.existingFields[field]);
  if (hasAllRequiredFields) {
    console.log(`✅ 文件已符合规范，跳过: ${filePath}`);
    return false;
  }

  const lines = content.split('\n');
  let headerEndIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('*/')) {
      headerEndIndex = i;
      break;
    }
  }

  if (headerEndIndex === -1) {
    console.log(`⚠️  无法找到标头结束位置: ${filePath}`);
    return false;
  }

  const newHeader = generateStandardHeader(filePath, info);
  
  let newContent = newHeader;
  
  let startIndex = headerEndIndex + 1;
  while (startIndex < lines.length && lines[startIndex].trim() === '') {
    startIndex++;
  }
  
  newContent += lines.slice(startIndex).join('\n');

  fs.writeFileSync(filePath, newContent);
  console.log(`✅ 已更新标头: ${filePath}`);
  return true;
}

/**
 * 批量更新目录
 * @param {string} dir - 目录路径
 * @returns {Object} 处理结果
 */
function updateDirectory(dir) {
  const files = getAllFiles(dir);
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  files.forEach(file => {
    try {
      const success = updateHeader(file);
      if (success) {
        successCount++;
      } else {
        skipCount++;
      }
    } catch (error) {
      console.error(`❌ 处理文件失败: ${file}`, error.message);
      errorCount++;
    }
  });

  return {
    total: files.length,
    success: successCount,
    skip: skipCount,
    error: errorCount
  };
}

/**
 * 递归获取目录下所有文件
 * @param {string} dir - 目录路径
 * @returns {Array} 文件列表
 */
function getAllFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'build') {
        return;
      }
      files.push(...getAllFiles(itemPath));
    } else {
      files.push(itemPath);
    }
  });

  return files;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  const targetPath = args.find(arg => !arg.startsWith('--')) || './src';

  console.log('🔧 YYC³ 标头批量更新工具\n');

  const stat = fs.statSync(targetPath);
  
  if (stat.isDirectory()) {
    const result = updateDirectory(targetPath);
    
    console.log(`\n📊 处理结果:`);
    console.log(`   总文件数: ${result.total}`);
    console.log(`   ✅ 成功: ${result.success}`);
    console.log(`   ⏭️  跳过: ${result.skip}`);
    console.log(`   ❌ 失败: ${result.error}`);
  } else {
    updateHeader(targetPath);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ 发生错误:', error.message);
    process.exit(1);
  }
}

module.exports = {
  updateHeader,
  updateDirectory,
  extractHeaderInfo,
  generateStandardHeader
};
