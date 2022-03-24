# graphql-kit

A set of graphql tools.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## 0.0.3

- feat: 🎸 执行`gk init`会自动生成 typeMapper 配置项（映射的默认值为 null）
- feat: 🎸 新增配置项`mock.schemaFiles`，用于前端在开发阶段自定义`schema`文件
- feat: 🎸 监听配置文件的所有依赖文件（会排除带有 node_modules 的文件），检测到变更后会自动重启服务

## bug

- 联合类型生成 gql 格式有误
- 嵌套参数无法解析
- 外层参数未包含嵌套参数
- playground 资源文件异常
