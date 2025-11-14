# Change: OpenSpec中文国际化支持

## Why
OpenSpec项目目前完全基于英文，对中文环境用户不够友好。为了降低中文用户的使用门槛，需要提供中文界面支持，同时保持与官方项目的兼容性以便后续合并。

## What Changes
- **添加中文模板系统**: 创建`src/core/templates_chinese`目录，提供所有模板的中文版本
- **保留Gherkin关键字**: 保持`## ADDED|MODIFIED|REMOVED Requirements`、`### Requirement:`、`#### Scenario:`、`**WHEN**`、`**THEN**`、`**AND**`等关键格式为英文，确保openspec validate命令正常工作
- **上下文智能翻译**: 将用户界面文本翻译为中文，但保留技术术语和关键词不变
- **CLI命令国际化**: 修改CLI命令输出为`openspec-chinese`，与官方版本区分
- **配置化语言支持**: 添加语言选择机制，允许用户在中文和英文之间切换

## Impact
- **影响的规范**: 国际化支持(i18n)、CLI界面、模板系统
- **影响的代码**: `src/core/templates/`、`bin/openspec.js`、CLI输出模块
- **向后兼容**: 保持与官方OpenSpec的格式兼容性，确保现有规范文件仍然有效
- **构建系统**: 修改package.json和构建脚本以支持新的CLI命令名称

### 核心设计原则
1. **最小侵入性**: 代码修改尽可能少，便于与官方项目合并
2. **格式兼容**: 保留Gherkin关键格式，确保validation正常工作
3. **上下文翻译**: 技术术语保持英文，用户界面文本翻译为中文
4. **可维护性**: 中文模板与英文模板结构一致，便于同步更新

## 代码优化记录 (2025-11-14)

### 第一轮优化 (已完成)
在初次代码审查中，发现了一些非必要的格式化修改：
- `src/cli/index.ts` 中移除了必要的空行
- 调整了文件末尾的换行符
- **已撤销**: 恢复 `src/cli/index.ts` 的原始格式

### 第二轮深度优化 (建议方案)
进一步分析发现，即使最小化的修改仍然影响原有代码。提出**零侵入性方案**：

#### 核心原则：复制而非修改

**完全保留的原始文件**：
- ✅ `src/cli/index.ts` - 零修改
- ✅ `src/core/config.ts` - 零修改
- ✅ `src/core/update.ts` - 零修改
- ✅ `src/core/templates/index.ts` - 零修改

**新增的中文专用文件**：
- 🆕 `src/cli/index_chinese.ts` - 基于index.ts复制，集成中文模板
- 🆕 `src/core/config_chinese.ts` - 中文配置扩展
- 🆕 `src/core/update_chinese.ts` - 中文更新逻辑
- 🆕 `src/core/templates_chinese/` - 独立中文模板系统

**唯一修改的文件**：
- 🔧 `package.json` - 仅添加openspec-chinese命令入口

#### 方案优势对比

| 方案 | 修改文件数 | 新增文件数 | 原有代码影响 | 合并复杂度 |
|------|------------|------------|--------------|------------|
| 原方案 | 4个核心文件 | 5个文件 | 中等 | 较高 |
| 最小化方案 | 3个核心文件 | 5个文件 | 较低 | 中等 |
| **零侵入方案** | **1个构建文件** | **8个文件** | **零** | **极低** |

#### 推荐方案：零侵入性方案
- **安全性**: 原有功能完全不受影响
- **可维护性**: 中英文功能完全独立
- **兼容性**: 与官方项目100%兼容
- **扩展性**: 可以独立发展中文特色功能

### 正确的中文格式示例
```markdown
## ADDED Requirements
### Requirement: 中文功能描述
系统应当提供中文功能...

#### Scenario: 场景描述
- **WHEN** 用户执行某个操作
- **THEN** 系统返回中文结果

## MODIFIED Requirements
### Requirement: 现有功能
[完整的中文功能描述]

## REMOVED Requirements
### Requirement: 废弃功能
**Reason**: 中文说明原因
**Migration**: 中文说明迁移方案
```