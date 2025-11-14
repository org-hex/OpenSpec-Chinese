export const agentsRootStubTemplate = `# OpenSpec 助手指令

这些指令适用于在此项目工作的AI助手。

当请求以下内容时，始终打开 \`@/openspec/AGENTS.md\`：
- 提及规划或提案（诸如proposal、spec、change、plan等词语）
- 引入新功能、破坏性变更、架构转变或大型性能/安全工作
- 听起来模糊，您需要在编码前获得权威规范

使用 \`@/openspec/AGENTS.md\` 学习：
- 如何创建和应用变更提案
- 规范格式和约定
- 项目结构和指南

保留此托管块，以便'openspec update'可以刷新指令。
`;