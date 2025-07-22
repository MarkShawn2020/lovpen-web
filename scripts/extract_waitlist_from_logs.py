#!/usr/bin/env python3
"""
从应用日志中提取waitlist数据并导入到Supabase数据库的脚本
"""
import re
import json
import sys
import os
import argparse
import subprocess
from typing import List, Dict, Optional
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

def get_supabase_config():
    """获取Supabase配置信息"""
    config = {}
    
    # 优先从环境变量获取
    config['url'] = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    config['service_role_key'] = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    # 如果环境变量不存在，尝试从supabase CLI获取
    if not config['url'] or not config['service_role_key']:
        try:
            # 获取项目URL
            if not config['url']:
                result = subprocess.run(
                    ['supabase', 'status', '--output', 'json'],
                    capture_output=True,
                    text=True,
                    check=True
                )
                status_data = json.loads(result.stdout)
                
                # 尝试从不同字段获取URL
                if 'API URL' in status_data:
                    config['url'] = status_data['API URL']
                elif 'api_url' in status_data:
                    config['url'] = status_data['api_url']
                elif isinstance(status_data, dict):
                    # 搜索包含URL的字段
                    for key, value in status_data.items():
                        if isinstance(value, str) and 'supabase' in value and ('http' in value):
                            config['url'] = value
                            break
            
            # 获取service role key
            if not config['service_role_key']:
                # 尝试从secrets获取
                try:
                    result = subprocess.run(
                        ['supabase', 'secrets', 'list', '--output', 'json'],
                        capture_output=True,
                        text=True,
                        check=True
                    )
                    secrets = json.loads(result.stdout)
                    if isinstance(secrets, list):
                        for secret in secrets:
                            if secret.get('name') == 'service_role_key':
                                config['service_role_key'] = secret.get('value')
                                break
                except:
                    pass
                
                # 如果还是没有，尝试从项目设置获取
                if not config['service_role_key']:
                    # 读取本地配置文件
                    config_files = [
                        '.env.local',
                        '.env',
                        'supabase/.env',
                        os.path.expanduser('~/.supabase/config.toml')
                    ]
                    
                    for config_file in config_files:
                        if os.path.exists(config_file):
                            try:
                                with open(config_file, 'r') as f:
                                    content = f.read()
                                    
                                # 查找service role key
                                patterns = [
                                    r'SUPABASE_SERVICE_ROLE_KEY\s*=\s*["\']?([^"\'\s]+)["\']?',
                                    r'service_role_key\s*=\s*["\']?([^"\'\s]+)["\']?',
                                    r'SERVICE_ROLE_KEY\s*=\s*["\']?([^"\'\s]+)["\']?'
                                ]
                                
                                for pattern in patterns:
                                    match = re.search(pattern, content)
                                    if match:
                                        config['service_role_key'] = match.group(1)
                                        break
                                
                                if config['service_role_key']:
                                    break
                            except:
                                continue
                
        except subprocess.CalledProcessError:
            pass
        except json.JSONDecodeError:
            pass
        except Exception:
            pass
    
    return config

class WaitlistExtractor:
    def __init__(self, verbose=False, quiet=False):
        """初始化Supabase客户端"""
        self.verbose = verbose
        self.quiet = quiet
        
        # 获取Supabase配置
        config = get_supabase_config()
        self.supabase_url = config.get('url')
        self.supabase_key = config.get('service_role_key')
        
        if not self.supabase_url:
            raise ValueError(
                "无法获取Supabase URL。请确保:\n"
                "1. 设置 NEXT_PUBLIC_SUPABASE_URL 环境变量，或\n"
                "2. 在项目目录中运行 'supabase link'"
            )
        
        if not self.supabase_key:
            raise ValueError(
                "无法获取Supabase Service Role Key。请确保:\n"
                "1. 设置 SUPABASE_SERVICE_ROLE_KEY 环境变量，或\n"
                "2. 在 .env 文件中配置相关密钥"
            )
        
        self._log_verbose(f"使用Supabase URL: {self.supabase_url}")
        self._log_verbose(f"Service Role Key: {'*' * 20}...{self.supabase_key[-4:] if len(self.supabase_key) > 4 else '****'}")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
    
    def _log_info(self, message, force=False):
        """输出信息日志"""
        if not self.quiet or force:
            print(message)
    
    def _log_verbose(self, message):
        """输出详细日志"""
        if self.verbose:
            print(f"[VERBOSE] {message}")
        
    def extract_waitlist_entries(self, log_content: str) -> List[Dict]:
        """从日志内容中提取waitlist条目"""
        entries = []
        
        # 匹配多种可能的日志格式
        patterns = [
            # 匹配 "Saving waitlist entry:" 格式
            r'Saving waitlist entry:\s*(\{[^}]*(?:\n[^}]*)*\})',
            # 匹配 "waitlist submission:" 格式  
            r'waitlist submission:\s*(\{[^}]*(?:\n[^}]*)*\})',
            # 匹配JSON格式的waitlist数据
            r'waitlist.*?(\{[^}]*"email"[^}]*\})',
        ]
        
        all_matches = []
        for pattern in patterns:
            matches = re.findall(pattern, log_content, re.MULTILINE | re.DOTALL)
            all_matches.extend(matches)
        
        self._log_info(f"找到 {len(all_matches)} 个潜在的waitlist条目")
        
        for i, match in enumerate(all_matches, 1):
            entry = self._parse_entry(match, i)
            if entry:
                entries.append(entry)
        
        return entries
    
    def _parse_entry(self, match: str, index: int) -> Optional[Dict]:
        """解析单个日志条目"""
        try:
            # 清理日志前缀
            cleaned = re.sub(r'^\d+\|\w+\s*\|\s*', '', match, flags=re.MULTILINE)
            cleaned = re.sub(r'^\[\d{4}-\d{2}-\d{2}.*?\]\s*', '', cleaned, flags=re.MULTILINE)
            
            # 尝试多种字段匹配模式
            email_patterns = [
                r'"?email"?\s*[:\s]+\s*["\']([^"\']+)["\']',
                r'email:\s*["\']([^"\']+)["\']',
                r'"email":\s*"([^"]+)"'
            ]
            
            name_patterns = [
                r'"?name"?\s*[:\s]+\s*["\']([^"\']+)["\']',
                r'name:\s*["\']([^"\']+)["\']',
                r'"name":\s*"([^"]+)"'
            ]
            
            source_patterns = [
                r'"?source"?\s*[:\s]+\s*["\']([^"\']+)["\']',
                r'source:\s*["\']([^"\']+)["\']',
                r'"source":\s*"([^"]+)"'
            ]
            
            company_patterns = [
                r'"?company"?\s*[:\s]+\s*["\']([^"\']*)["\']',
                r'company:\s*["\']([^"\']*)["\']',
                r'"company":\s*"([^"]*)"'
            ]
            
            usecase_patterns = [
                r'"?useCase"?\s*[:\s]+\s*["\']([^"\']*)["\']',
                r'useCase:\s*["\']([^"\']*)["\']',
                r'"useCase":\s*"([^"]*)"',
                r'"?use_case"?\s*[:\s]+\s*["\']([^"\']*)["\']'
            ]
            
            timestamp_patterns = [
                r'"?timestamp"?\s*[:\s]+\s*["\']([^"\']+)["\']',
                r'timestamp:\s*["\']([^"\']+)["\']',
                r'"timestamp":\s*"([^"]+)"',
                r'"?created_at"?\s*[:\s]+\s*["\']([^"\']+)["\']'
            ]
            
            # 提取字段
            email = self._extract_field(cleaned, email_patterns)
            name = self._extract_field(cleaned, name_patterns)
            source = self._extract_field(cleaned, source_patterns)
            company = self._extract_field(cleaned, company_patterns) or ''
            usecase = self._extract_field(cleaned, usecase_patterns) or ''
            timestamp = self._extract_field(cleaned, timestamp_patterns)
            
            if email and name and source:
                # 处理时间戳
                if timestamp:
                    try:
                        # 尝试解析各种时间格式
                        timestamp = timestamp.replace('Z', '+00:00')
                        parsed_time = datetime.fromisoformat(timestamp)
                    except:
                        timestamp = datetime.now().isoformat()
                else:
                    timestamp = datetime.now().isoformat()
                
                entry = {
                    'email': email.strip(),
                    'name': name.strip(),
                    'source': source.strip(),
                    'company': company.strip(),
                    'use_case': usecase.strip(),
                    'created_at': timestamp,
                    'status': 'pending',
                    'priority': 0
                }
                
                self._log_verbose(f"✓ 提取成功: {entry['email']} - {entry['name']} ({entry['source']})")
                return entry
            else:
                missing_fields = []
                if not email: missing_fields.append('email')
                if not name: missing_fields.append('name')
                if not source: missing_fields.append('source')
                self._log_verbose(f"✗ 条目 {index} 缺少必需字段: {', '.join(missing_fields)}")
                
        except Exception as e:
            self._log_verbose(f"✗ 处理条目 {index} 时出错: {e}")
            
        return None
    
    def _extract_field(self, text: str, patterns: List[str]) -> Optional[str]:
        """使用多个模式提取字段"""
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return None
    
    def deduplicate_entries(self, entries: List[Dict]) -> List[Dict]:
        """去重处理（基于email）"""
        unique_entries = {}
        
        for entry in entries:
            email = entry['email'].lower()
            
            if email not in unique_entries:
                unique_entries[email] = entry
            else:
                # 保留最新的条目
                existing_time = datetime.fromisoformat(unique_entries[email]['created_at'].replace('Z', '+00:00'))
                current_time = datetime.fromisoformat(entry['created_at'].replace('Z', '+00:00'))
                
                if current_time > existing_time:
                    unique_entries[email] = entry
        
        return list(unique_entries.values())
    
    def check_existing_emails(self, entries: List[Dict]) -> List[Dict]:
        """检查数据库中已存在的邮箱"""
        if not entries:
            return []
        
        emails = [entry['email'] for entry in entries]
        
        try:
            response = self.supabase.table('waitlist').select('email').in_('email', emails).execute()
            existing_emails = {row['email'] for row in response.data}
            
            new_entries = [entry for entry in entries if entry['email'] not in existing_emails]
            
            if existing_emails:
                self._log_info(f"跳过 {len(existing_emails)} 个已存在的邮箱: {', '.join(list(existing_emails)[:5])}{'...' if len(existing_emails) > 5 else ''}")
            
            return new_entries
            
        except Exception as e:
            self._log_info(f"检查已存在邮箱时出错: {e}")
            return entries
    
    def import_to_supabase(self, entries: List[Dict]) -> Dict:
        """将条目导入到Supabase"""
        if not entries:
            return {'success': 0, 'errors': 0, 'total': 0}
        
        self._log_info(f"\n开始导入 {len(entries)} 个条目到Supabase...")
        
        success_count = 0
        error_count = 0
        
        # 批量插入
        try:
            response = self.supabase.table('waitlist').insert(entries).execute()
            success_count = len(response.data)
            self._log_info(f"✓ 成功导入 {success_count} 个条目")
            
        except Exception as e:
            self._log_info(f"✗ 批量导入失败: {e}")
            
            # 逐个插入以识别问题条目
            self._log_info("尝试逐个插入...")
            for i, entry in enumerate(entries, 1):
                try:
                    self.supabase.table('waitlist').insert(entry).execute()
                    success_count += 1
                    self._log_verbose(f"✓ ({i}/{len(entries)}) {entry['email']}")
                except Exception as e:
                    error_count += 1
                    self._log_info(f"✗ ({i}/{len(entries)}) {entry['email']}: {e}")
        
        return {
            'success': success_count,
            'errors': error_count,
            'total': len(entries)
        }
    
    def generate_stats(self, entries: List[Dict]) -> Dict:
        """生成统计信息"""
        if not entries:
            return {}
        
        stats = {
            'total': len(entries),
            'sources': {},
            'date_range': {
                'earliest': None,
                'latest': None
            }
        }
        
        timestamps = []
        
        for entry in entries:
            # 来源统计
            source = entry.get('source', 'unknown')
            stats['sources'][source] = stats['sources'].get(source, 0) + 1
            
            # 时间范围
            try:
                timestamp = datetime.fromisoformat(entry['created_at'].replace('Z', '+00:00'))
                timestamps.append(timestamp)
            except:
                pass
        
        if timestamps:
            timestamps.sort()
            stats['date_range']['earliest'] = timestamps[0].isoformat()
            stats['date_range']['latest'] = timestamps[-1].isoformat()
        
        return stats

def parse_arguments():
    """解析命令行参数"""
    parser = argparse.ArgumentParser(
        description='从应用日志中提取waitlist数据并导入到Supabase数据库',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  %(prog)s log.txt
  %(prog)s ~/.pm2/logs/lovpen-out.log --dry-run
  %(prog)s /var/log/app.log --output extracted_data.json
  %(prog)s app.log --dry-run --output --verbose
  %(prog)s multiple_logs/*.log --batch --output results/
        """
    )
    
    # 位置参数
    parser.add_argument(
        'log_files',
        nargs='*',  # 改为可选，支持 --show-config 不需要文件
        help='要处理的日志文件路径（支持多个文件和通配符）'
    )
    
    # 可选参数
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='仅提取和分析数据，不导入数据库'
    )
    
    parser.add_argument(
        '--output', '-o',
        metavar='FILE',
        help='保存提取的数据到JSON文件（默认: extracted_waitlist.json）'
    )
    
    parser.add_argument(
        '--batch',
        action='store_true',
        help='批处理模式：处理多个日志文件'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='显示详细输出信息'
    )
    
    parser.add_argument(
        '--quiet', '-q',
        action='store_true',
        help='静默模式：减少输出信息'
    )
    
    parser.add_argument(
        '--encoding',
        default='utf-8',
        help='日志文件编码（默认: utf-8）'
    )
    
    parser.add_argument(
        '--skip-duplicates',
        action='store_true',
        help='跳过重复邮箱检查（加速处理）'
    )
    
    parser.add_argument(
        '--force',
        action='store_true',
        help='强制导入，即使存在重复邮箱'
    )
    
    parser.add_argument(
        '--show-config',
        action='store_true',
        help='显示检测到的Supabase配置信息'
    )
    
    parser.add_argument(
        '--version',
        action='version',
        version='%(prog)s 1.0.0'
    )
    
    return parser.parse_args()

def main():
    args = parse_arguments()
    
    # 如果只是显示配置，直接输出并退出
    if args.show_config:
        config = get_supabase_config()
        print("=== Supabase 配置信息 ===")
        print(f"URL: {config.get('url', '未检测到')}")
        
        if config.get('service_role_key'):
            key = config['service_role_key']
            masked_key = f"{'*' * 20}...{key[-4:] if len(key) > 4 else '****'}"
            print(f"Service Role Key: {masked_key}")
        else:
            print("Service Role Key: 未检测到")
        
        # 显示检测方法
        print("\n=== 配置来源 ===")
        if os.getenv('NEXT_PUBLIC_SUPABASE_URL'):
            print("URL来源: 环境变量 NEXT_PUBLIC_SUPABASE_URL")
        else:
            print("URL来源: 尝试从 supabase CLI 获取")
            
        if os.getenv('SUPABASE_SERVICE_ROLE_KEY'):
            print("Key来源: 环境变量 SUPABASE_SERVICE_ROLE_KEY")
        else:
            print("Key来源: 尝试从本地配置文件获取")
        
        sys.exit(0)
    
    # 检查是否提供了日志文件
    if not args.log_files:
        print("错误: 请提供至少一个日志文件路径")
        print("使用 --help 查看使用方法")
        sys.exit(1)
    
    # 设置输出级别
    verbose = args.verbose and not args.quiet
    quiet = args.quiet
    
    def log_info(message, force=False):
        if not quiet or force:
            print(message)
    
    def log_verbose(message):
        if verbose:
            print(f"[VERBOSE] {message}")
    
    # 展开文件路径（处理通配符）
    import glob
    all_log_files = []
    for pattern in args.log_files:
        if '*' in pattern or '?' in pattern:
            matched_files = glob.glob(pattern)
            if matched_files:
                all_log_files.extend(matched_files)
            else:
                log_info(f"警告: 模式 '{pattern}' 没有匹配到任何文件")
        else:
            all_log_files.append(pattern)
    
    # 检查文件存在性
    valid_files = []
    for log_file in all_log_files:
        if os.path.exists(log_file):
            valid_files.append(log_file)
        else:
            log_info(f"文件不存在，跳过: {log_file}")
    
    if not valid_files:
        log_info("错误: 没有找到有效的日志文件", force=True)
        sys.exit(1)
    
    log_info(f"准备处理 {len(valid_files)} 个日志文件")
    if verbose:
        for f in valid_files:
            log_verbose(f"文件: {f}")
    
    try:
        # 初始化提取器
        log_verbose("初始化Supabase连接...")
        extractor = WaitlistExtractor(verbose=verbose, quiet=quiet)
        
        # 处理多个文件
        all_entries = []
        total_file_size = 0
        
        for i, log_file in enumerate(valid_files, 1):
            log_info(f"正在处理文件 ({i}/{len(valid_files)}): {log_file}")
            
            # 读取日志文件
            try:
                with open(log_file, 'r', encoding=args.encoding, errors='ignore') as f:
                    log_content = f.read()
                    file_size = len(log_content)
                    total_file_size += file_size
                    log_verbose(f"文件大小: {file_size:,} 字符")
            except Exception as e:
                log_info(f"读取文件失败: {e}")
                continue
            
            # 提取条目
            entries = extractor.extract_waitlist_entries(log_content)
            if entries:
                all_entries.extend(entries)
                log_verbose(f"从 {log_file} 提取到 {len(entries)} 个条目")
            else:
                log_verbose(f"从 {log_file} 未找到任何条目")
        
        if not all_entries:
            log_info("未找到任何waitlist条目", force=True)
            sys.exit(0)
        
        log_info(f"\n总计从 {len(valid_files)} 个文件（{total_file_size:,} 字符）中找到 {len(all_entries)} 个条目")
        
        # 去重处理
        log_verbose("开始去重处理...")
        unique_entries = extractor.deduplicate_entries(all_entries)
        log_info(f"去重后剩余 {len(unique_entries)} 个唯一条目")
        
        # 生成统计信息
        stats = extractor.generate_stats(unique_entries)
        
        if not quiet:
            log_info("\n=== 提取统计 ===")
            log_info(f"总条目数: {stats['total']}")
            
            if stats.get('date_range', {}).get('earliest'):
                log_info(f"时间范围: {stats['date_range']['earliest']} ~ {stats['date_range']['latest']}")
            
            log_info("\n来源分布:")
            for source, count in stats['sources'].items():
                log_info(f"  {source}: {count}")
        
        # 保存到文件
        if args.output is not None:
            output_file = args.output if args.output else 'extracted_waitlist.json'
            
            # 如果是目录，创建文件名
            if os.path.isdir(output_file):
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                output_file = os.path.join(output_file, f"waitlist_{timestamp}.json")
            
            # 确保输出目录存在
            output_dir = os.path.dirname(output_file)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir)
                log_verbose(f"创建输出目录: {output_dir}")
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(unique_entries, f, indent=2, ensure_ascii=False)
            log_info(f"\n数据已保存到: {output_file}")
        
        # 导入数据库
        if not args.dry_run:
            log_verbose("开始数据库导入流程...")
            
            # 检查已存在的邮箱
            if not args.skip_duplicates and not args.force:
                log_verbose("检查数据库中已存在的邮箱...")
                new_entries = extractor.check_existing_emails(unique_entries)
            else:
                new_entries = unique_entries
                if args.force:
                    log_verbose("强制模式：跳过重复检查")
                else:
                    log_verbose("跳过重复检查模式")
            
            if new_entries:
                result = extractor.import_to_supabase(new_entries)
                
                log_info(f"\n=== 导入结果 ===")
                log_info(f"成功导入: {result['success']}")
                log_info(f"导入失败: {result['errors']}")
                log_info(f"总计处理: {result['total']}")
                
                if result['success'] > 0:
                    log_info("✓ 数据导入完成")
                else:
                    log_info("✗ 没有数据被导入")
            else:
                log_info("\n所有邮箱都已存在于数据库中，无需导入新数据")
        else:
            log_info("\n--dry-run 模式，跳过数据库导入")
            
    except KeyboardInterrupt:
        log_info("\n用户中断操作", force=True)
        sys.exit(1)
    except Exception as e:
        log_info(f"脚本执行出错: {e}", force=True)
        if verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()