## Context

OpenSpec是一个AI驱动的规范驱动开发工具，目前完全基于英文界面。为了服务中文用户群体，需要在不破坏现有功能的前提下添加国际化支持。关键挑战是在提供中文用户体验的同时，保持与官方项目的兼容性，便于后续代码合并。

## Goals / Non-Goals

### Goals
- 提供完整的中文用户界面体验
- 保持与官方OpenSpec的格式兼容性
- 最小化代码修改，便于维护和合并
- 支持灵活的语言切换机制
- 确保所有现有功能在中文环境下正常工作

### Non-Goals
- 完全重写现有代码架构
- 修改核心的Gherkin格式规范
- 支持除中文外的其他语言（本期）
- 改变现有的CLI命令接口结构

## Decisions

### Decision 1: 模板目录分离策略
**What**: 创建`src/core/templates_chinese`目录，与现有的`src/core/templates`并行存在
**Why**:
- 保持原有英文模板不变，确保向后兼容
- 便于与官方项目同步更新
- 允许用户在不同语言版本间切换
- 降低维护复杂度

**Alternatives considered**:
- 在同一模板文件中支持多语言（过于复杂）
- 使用配置文件控制语言（增加运行时开销）
- 完全替换现有模板（破坏兼容性）

### Decision 2: Gherkin关键字保留英文
**What**: 保留`## ADDED|MODIFIED|REMOVED Requirements`、`### Requirement:`、`#### Scenario:`、`**WHEN**`、`**THEN**`等关键字为英文
**Why**:
- 确保openspec validate命令继续正常工作
- 避免修改核心解析逻辑
- 保持与国际Gherkin标准的一致性
- 降低实现复杂度

**Alternatives considered**:
- 完全翻译为中文（需要修改验证器）
- 创建双语支持（增加维护成本）
- 使用自定义关键字（破坏兼容性）

### Decision 3: CLI命令差异化
**What**: 新的中文版本使用`openspec-chinese`命令，与官方的`openspec`命令区分
**Why**:
- 避免与官方安装冲突
- 明确标识这是社区中文版本
- 允许两个版本并存
- 便于用户识别和选择

**Alternatives considered**:
- 使用环境变量控制（用户体验复杂）
- 添加`--lang`参数（修改现有接口）
- 覆盖现有命令（破坏性变更）

### Decision 4: 配置驱动的语言选择
**What**: 通过环境变量`OPENSPEC_LANG=zh`或配置文件控制语言选择
**Why**:
- 提供灵活的语言切换机制
- 支持系统级和项目级配置
- 便于CI/CD集成
- 遵循国际化最佳实践

**Alternatives considered**:
- 硬编码语言选择（缺乏灵活性）
- 基于系统语言检测（不可靠）
- 每次命令询问（用户体验差）

## Risks / Trade-offs

### Risk 1: 维护成本增加
**Risk**: 需要同时维护英文和中文两套模板
**Mitigation**:
- 建立模板同步流程和检查机制
- 自动化检测模板版本差异
- 社区贡献者分担维护工作

### Risk 2: 与官方项目合并复杂度
**Risk**: 代码分支可能偏离主项目过远
**Mitigation**:
- 保持核心逻辑不变
- 最小化侵入性修改
- 定期与主项目同步

### Risk 3: 用户体验混淆
**Risk**: 用户可能在不同版本间产生混淆
**Mitigation**:
- 清晰的文档说明
- 明确的命令区分
- 版本信息中包含语言标识

### Trade-off: 完整翻译 vs 格式兼容
选择格式兼容性而非完全的中文化，确保核心功能稳定运行，但可能在某些场景下用户体验不够"纯粹"中文。

## Migration Plan

### Phase 1: 基础架构（1-2周）
1. 创建中文模板目录结构
2. 实现基础的语言选择机制
3. 修改构建系统支持多语言

### Phase 2: 模板翻译（2-3周）
1. 翻译所有核心模板文件
2. 验证格式兼容性
3. 创建测试用例

### Phase 3: CLI国际化（1-2周）
1. 创建openspec-chinese命令
2. 实现CLI输出国际化
3. 更新帮助文档

### Phase 4: 测试和优化（1周）
1. 全面测试功能
2. 性能优化
3. 文档完善

### Phase 5: 发布准备（1周）
1. 最终验证
2. 发布文档
3. 社区宣传

**Rollback Plan**: 如需回滚，可以删除`templates_chinese`目录和`openspec-chinese`命令，原有功能不受影响。

## Open Questions

1. **长期维护模式**: 如何建立可持续的中文模板维护机制？
2. **社区贡献流程**: 如何设计有效的中文贡献和审核流程？
3. **版本同步策略**: 如何处理官方版本更新时的中文模板同步？
4. **质量保证**: 如何确保中文翻译的质量和一致性？
5. **扩展性**: 未来是否考虑支持其他语言，如何设计可扩展的架构？

## Technical Architecture

### 模板系统架构
```
src/core/
├── templates/           # 原有英文模板
│   ├── project-template.ts
│   ├── agents-template.ts
│   └── ...
└── templates_chinese/   # 新增中文模板
    ├── project-template.ts
    ├── agents-template.ts
    └── ...
```

### 语言选择流程
```typescript
function selectTemplate(language: 'en' | 'zh') {
  const templateDir = language === 'zh' ? 'templates_chinese' : 'templates';
  return loadTemplates(templateDir);
}
```

### CLI命令结构
```javascript
// bin/openspec.js (原有)
// bin/openspec-chinese.js (新增)
```

### 配置层次
1. 环境变量 `OPENSPEC_LANG`
2. 项目配置文件 `.openspecrc`
3. 全局配置文件
4. 默认英文