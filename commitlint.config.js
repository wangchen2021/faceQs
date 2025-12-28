module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    // 限定提交类型（适配 Angular/通用 项目场景）
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能（如新增AI健身课程组件）
        'fix', // Bug修复（如修复姿态识别逻辑）
        'docs', // 文档修改（如更新组件注释、README）
        'style', // 格式调整（无代码逻辑变更）
        'refactor', // 重构（无新功能/无bug修复）
        'test', // 测试用例
        'chore', // 杂项（如依赖更新）
        'build', // 构建配置（如 angular.json 修改）
        'ci', // CI/CD 配置（如 GitHub Actions 调整）
        'perf', // 性能优化
        'revert', // 回滚提交
      ],
    ],
    // 可选：限定 scope 范围
    'scope-enum': [
      2,
      'always',
      [
        'core', // 核心模块
        'shared', // 共享组件/指令
        'components', // 业务组件（如健身课程组件）
        'services', // 服务（如AI识别服务）
        'routes', // 路由配置
        'styles', // 样式
        'config', // 配置文件
      ],
    ],
    'subject-max-length': [2, 'always', 72],
  },
};
