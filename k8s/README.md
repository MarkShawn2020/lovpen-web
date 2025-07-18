# 生产环境部署指南

## 部署架构

```
用户 → 阿里云 SLB → ACK Ingress → Kubernetes Service → Pod (3个副本)
                                                    ↓
                                            RDS PostgreSQL + Redis
```

## 预备工作

### 1. 创建阿里云 ACK 集群
```bash
# 在阿里云控制台创建托管版 ACK 集群
# 推荐配置：
# - 节点规格: 2核4G (ecs.c6.large)
# - 节点数量: 3个
# - 地域: 新加坡 (ap-southeast-1)
```

### 2. 配置容器镜像仓库 ACR
```bash
# 创建命名空间
# 仓库地址: registry.ap-southeast-1.aliyuncs.com/lovpen-web
```

### 3. 创建 RDS 数据库
```bash
# PostgreSQL 13
# 规格: 2核4G
# 存储: 100GB SSD
# 备份: 自动备份
```

### 4. 配置 Redis 缓存
```bash
# Redis 6.x
# 规格: 1GB
# 网络: 与 ACK 集群同一 VPC
```

## 部署步骤

### 1. 配置环境变量
```bash
export ACR_REGISTRY="registry.ap-southeast-1.aliyuncs.com"
export ACR_NAMESPACE="lovpen-web"
export ACR_USERNAME="your-username"
export ACR_PASSWORD="your-password"
```

### 2. 更新配置文件
编辑 `k8s/configmap.yaml` 和 `k8s/secret.yaml`，填入实际的配置信息：

```bash
# 生成 Secret 的 base64 值
echo -n "your-password" | base64
```

### 3. 执行部署
```bash
./k8s/deploy.sh
```

## 手动部署步骤

如果不使用脚本，可以手动执行：

```bash
# 1. 构建和推送镜像
docker build -t lovpen-web:latest .
docker tag lovpen-web:latest registry.ap-southeast-1.aliyuncs.com/lovpen-web/lovpen-web:latest
docker push registry.ap-southeast-1.aliyuncs.com/lovpen-web/lovpen-web:latest

# 2. 部署到 Kubernetes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

## 监控和维护

### 查看部署状态
```bash
kubectl get pods -n lovpen-web
kubectl get svc -n lovpen-web
kubectl get ingress -n lovpen-web
```

### 查看日志
```bash
kubectl logs -f deployment/lovpen-web-app -n lovpen-web
```

### 扩缩容
```bash
kubectl scale deployment lovpen-web-app --replicas=5 -n lovpen-web
```

### 更新部署
```bash
# 更新镜像
kubectl set image deployment/lovpen-web-app lovpen-web=registry.ap-southeast-1.aliyuncs.com/lovpen-web/lovpen-web:new-tag -n lovpen-web

# 查看更新状态
kubectl rollout status deployment/lovpen-web-app -n lovpen-web
```

## 故障排除

### 常见问题
1. **Pod 启动失败**: 检查镜像拉取权限和环境变量
2. **数据库连接失败**: 检查网络策略和数据库配置
3. **域名访问失败**: 检查 Ingress 配置和 DNS 解析

### 调试命令
```bash
# 进入 Pod 调试
kubectl exec -it deployment/lovpen-web-app -n lovpen-web -- /bin/sh

# 查看详细信息
kubectl describe pod <pod-name> -n lovpen-web
```

## 安全建议

1. 定期更新镜像和依赖
2. 设置资源限制
3. 配置网络策略
4. 启用 Pod 安全策略
5. 定期备份数据库

## 成本优化

1. 使用 HPA 自动扩缩容
2. 配置节点自动伸缩
3. 使用 Spot 实例降低成本
4. 定期清理不用的镜像
