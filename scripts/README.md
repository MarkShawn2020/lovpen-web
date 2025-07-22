# Waitlist Log Extractor

从应用日志中提取waitlist数据并导入到Supabase数据库的脚本。

## 功能特性

- **多文件处理**: 支持处理单个或多个日志文件，支持通配符模式
- **智能解析**: 从各种格式的日志文件中提取waitlist条目
- **格式兼容**: 支持多种日志格式和字段匹配模式
- **去重处理**: 自动去重处理（基于邮箱地址）
- **重复检查**: 检查数据库中已存在的记录，避免重复导入
- **批量导入**: 高效批量导入到Supabase数据库
- **详细报告**: 提供详细的统计和错误报告
- **灵活输出**: 支持verbose、quiet等多种输出模式
- **性能优化**: 支持跳过重复检查、强制导入等性能选项
- **安全测试**: Dry-run模式用于安全测试
- **命令行友好**: 完整的argparse支持，提供帮助和版本信息

## 安装依赖

```bash
cd scripts
pip install -r requirements.txt
```

## 环境配置

确保在项目根目录的 `.env` 文件中设置以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 使用方法

### 基本用法

```bash
python extract_waitlist_from_logs.py [选项] <日志文件路径...>
```

### 命令行选项

| 选项 | 描述 |
|------|------|
| `--dry-run` | 仅提取和分析数据，不导入数据库 |
| `--output, -o FILE` | 保存提取的数据到JSON文件（默认: extracted_waitlist.json） |
| `--batch` | 批处理模式：处理多个日志文件 |
| `--verbose, -v` | 显示详细输出信息 |
| `--quiet, -q` | 静默模式：减少输出信息 |
| `--encoding` | 日志文件编码（默认: utf-8） |
| `--skip-duplicates` | 跳过重复邮箱检查（加速处理） |
| `--force` | 强制导入，即使存在重复邮箱 |
| `--version` | 显示版本信息 |
| `--help, -h` | 显示帮助信息 |

### 示例

```bash
# 基本用法：处理单个日志文件
python extract_waitlist_from_logs.py app.log

# 测试模式（不导入数据库）
python extract_waitlist_from_logs.py /var/log/app.log --dry-run

# 保存到指定文件
python extract_waitlist_from_logs.py app.log --output results.json

# 详细模式
python extract_waitlist_from_logs.py app.log --verbose

# 静默模式
python extract_waitlist_from_logs.py app.log --quiet

# 处理多个文件
python extract_waitlist_from_logs.py log1.txt log2.txt log3.txt --batch

# 使用通配符处理多个文件
python extract_waitlist_from_logs.py logs/*.log --batch --output results/

# 强制导入模式（跳过重复检查）
python extract_waitlist_from_logs.py app.log --force

# 完整示例：处理多个文件，详细输出，保存结果
python extract_waitlist_from_logs.py ~/.pm2/logs/*.log --batch --verbose --output extracted_data.json

# 快速处理模式（跳过重复检查）
python extract_waitlist_from_logs.py large_log.txt --skip-duplicates --quiet
```

### 高级用法

#### 批处理多个文件
```bash
# 处理目录下所有日志文件
python extract_waitlist_from_logs.py /var/log/app/*.log --batch

# 处理不同格式的日志文件
python extract_waitlist_from_logs.py app-2024*.log error.log access.log --batch
```

#### 输出控制
```bash
# 静默模式，只在有错误时输出
python extract_waitlist_from_logs.py app.log --quiet

# 详细模式，显示每个处理步骤
python extract_waitlist_from_logs.py app.log --verbose

# 保存到时间戳文件
python extract_waitlist_from_logs.py app.log --output results/
```

#### 性能优化
```bash
# 跳过数据库重复检查（适用于确定没有重复的情况）
python extract_waitlist_from_logs.py app.log --skip-duplicates

# 强制导入所有数据（包括重复的）
python extract_waitlist_from_logs.py app.log --force
```

## 支持的日志格式

脚本支持以下日志格式中的waitlist条目：

1. **"Saving waitlist entry:" 格式**
   ```
   Saving waitlist entry: { email: 'user@example.com', name: 'John Doe', source: 'hero' }
   ```

2. **"waitlist submission:" 格式**
   ```
   waitlist submission: { email: 'user@example.com', name: 'John Doe', source: 'pricing' }
   ```

3. **JSON格式**
   ```
   { "email": "user@example.com", "name": "John Doe", "source": "about" }
   ```

## 输出信息

脚本会输出以下信息：

### 提取过程
- 找到的条目数量
- 成功提取的条目详情
- 缺少必需字段的条目

### 统计信息
- 总条目数
- 去重后的唯一条目数
- 时间范围（最早和最新的记录）
- 来源分布统计

### 导入结果
- 跳过的已存在邮箱数量
- 成功导入的条目数
- 导入失败的条目数

## 数据字段映射

| 日志字段 | 数据库字段 | 必需 | 说明 |
|---------|----------|------|------|
| email | email | ✓ | 邮箱地址 |
| name | name | ✓ | 用户姓名 |
| source | source | ✓ | 来源标识 |
| company | company |  | 公司信息 |
| useCase/use_case | use_case |  | 使用场景 |
| timestamp/created_at | created_at |  | 创建时间 |

## 错误处理

- **文件不存在**: 检查日志文件路径是否正确
- **环境变量未设置**: 确保Supabase配置正确
- **网络连接问题**: 检查Supabase连接
- **重复邮箱**: 自动跳过已存在的记录
- **格式解析错误**: 跳过无法解析的条目并继续处理

## 注意事项

1. 使用 `--dry-run` 选项先测试脚本，确认能正确提取数据
2. 大型日志文件可能需要较长处理时间
3. 脚本会自动跳过已存在的邮箱，避免重复导入
4. 建议定期备份数据库
5. Service Role Key 具有完全数据库访问权限，请妥善保管

## 故障排除

### 常见问题

**Q: 脚本报告找不到任何条目**
A: 检查日志格式是否匹配支持的模式，可以使用 `--dry-run --output` 查看提取结果

**Q: 导入失败**
A: 检查环境变量配置和网络连接，确认Supabase服务可用

**Q: 部分条目导入失败**
A: 脚本会逐个重试失败的条目并显示详细错误信息

**Q: 时间格式解析错误**
A: 脚本会使用当前时间作为fallback，不会中断处理流程
