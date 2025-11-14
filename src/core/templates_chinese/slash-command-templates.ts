export type SlashCommandId = 'proposal' | 'apply' | 'archive';

const baseGuardrails = `**Guardrails**
- 优先选择直接、最小化的实现，仅在请求或明确需要时才增加复杂性。
- 保持变更严格限制在请求的结果范围内。
- 如果需要额外的OpenSpec约定或澄清，请参考 \`openspec/AGENTS.md\`（位于 \`openspec/\`目录内——如果看不到，运行 \`ls openspec\` 或 \`openspec update\`）。`;

const proposalGuardrails = `${baseGuardrails}\n- 在编辑文件之前，识别任何模糊或不明确的细节，并询问必要的后续问题。`;

const proposalSteps = `**Steps**
1. 审查 \`openspec/project.md\`，运行 \`openspec list\` 和 \`openspec list --specs\`，并检查相关代码或文档（例如通过 \`rg\`/\`ls\`）以使提案基于当前行为；注意需要澄清的任何空白。
2. 选择唯一的动词引导的 \`change-id\`，并在 \`openspec/changes/<id>/\` 下创建 \`proposal.md\`、\`tasks.md\` 和 \`design.md\`（需要时）的脚手架。
3. 将变更映射到具体功能或需求，将多范围工作分解为具有清晰关系和排序的不同规范增量。
4. 当解决方案跨越多个系统、引入新模式或在提交规范前需要权衡讨论时，在 \`design.md\` 中捕获架构推理。
5. 在 \`changes/<id>/specs/<capability>/spec.md\` 中（每个功能一个文件夹）使用 \`## ADDED|MODIFIED|REMOVED Requirements\` 起草规范增量，每个需求至少包含一个 \`#### Scenario:\`，并在相关时交叉引用相关功能。
6. 将 \`tasks.md\` 起草为小的、可验证的工作项目的有序列表，这些项目提供用户可见的进度，包括验证（测试、工具），并突出显示依赖关系或可并行的工作。
7. 使用 \`openspec validate <id> --strict\` 验证并在共享提案前解决每个问题。`;

const proposalReferences = `**Reference**
- 当验证失败时，使用 \`openspec show <id> --json --deltas-only\` 或 \`openspec show <spec> --type spec\` 检查详细信息。
- 在编写新需求之前，使用 \`rg -n "Requirement:|Scenario:" openspec/specs\` 搜索现有需求。
- 使用 \`rg <keyword>\`、\`ls\` 或直接文件读取探索代码库，使提案与当前实现现实一致。`;

const applySteps = `**Steps**
将这些步骤作为TODOs逐一跟踪并完成。
1. 阅读 \`changes/<id>/proposal.md\`、\`design.md\`（如果存在）和 \`tasks.md\` 以确认范围和验收标准。
2. 按顺序处理任务，保持编辑最小化且专注于请求的变更。
3. 在更新状态前确认完成——确保 \`tasks.md\` 中的每个项目都已完成。
4. 在所有工作完成后更新检查清单，使每个任务标记为 \`- [x]\` 并反映实际情况。
5. 当需要额外上下文时，参考 \`openspec list\` 或 \`openspec show <item>\`。`;

const applyReferences = `**Reference**
- 如果在实施过程中需要来自提案的额外上下文，请使用 \`openspec show <id> --json --deltas-only\`。`;

const archiveSteps = `**Steps**
1. 确定要归档的变更ID：
   - 如果此提示已包含特定变更ID（例如在由斜杠命令参数填充的 \`<ChangeId>\` 块内），使用该值并修剪空白。
   - 如果对话松散引用变更（例如通过标题或摘要），运行 \`openspec list\` 显示可能的ID，分享相关候选项并确认用户打算使用哪一个。
   - 否则，审查对话，运行 \`openspec list\`，并询问用户要归档哪个变更；等待确认的变更ID后再继续。
   - 如果仍无法识别单个变更ID，停止并告诉用户您暂时无法归档任何内容。
2. 通过运行 \`openspec list\`（或 \`openspec show <id>\`）验证变更ID，如果变更丢失、已归档或未准备好归档则停止。
3. 运行 \`openspec archive <id> --yes\`，使CLI移动变更并应用规范更新而不提示（仅对仅工具工作使用 \`--skip-specs\`）。
4. 审查命令输出以确认目标规范已更新且变更已移至 \`changes/archive/\`。
5. 使用 \`openspec validate --strict\` 验证，如果发现任何问题，使用 \`openspec show <id>\` 检查。`;

const archiveReferences = `**Reference**
- 在归档前使用 \`openspec list\` 确认变更ID。
- 使用 \`openspec list --specs\` 检查更新的规范，并在交接前解决任何验证问题。`;

export const slashCommandBodies: Record<SlashCommandId, string> = {
  proposal: [proposalGuardrails, proposalSteps, proposalReferences].join('\n\n'),
  apply: [baseGuardrails, applySteps, applyReferences].join('\n\n'),
  archive: [baseGuardrails, archiveSteps, archiveReferences].join('\n\n')
};

export function getSlashCommandBody(id: SlashCommandId): string {
  return slashCommandBodies[id];
}