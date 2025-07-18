#!/bin/bash

# 生产环境部署脚本
set -e

echo "🚀 开始部署 Lovpen Web 到生产环境..."

# 检查必要的环境变量
if [ -z "$ACR_REGISTRY" ] || [ -z "$ACR_NAMESPACE" ] || [ -z "$ACR_USERNAME" ] || [ -z "$ACR_PASSWORD" ]; then
    echo "❌ 缺少必要的环境变量:"
    echo "   ACR_REGISTRY: 阿里云容器镜像仓库地址"
    echo "   ACR_NAMESPACE: 镜像仓库命名空间"
    echo "   ACR_USERNAME: 仓库用户名"
    echo "   ACR_PASSWORD: 仓库密码"
    exit 1
fi

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker build -t lovpen-web:latest .

# 标记镜像
echo "🏷️  标记镜像..."
docker tag lovpen-web:latest $ACR_REGISTRY/$ACR_NAMESPACE/lovpen-web:latest
docker tag lovpen-web:latest $ACR_REGISTRY/$ACR_NAMESPACE/lovpen-web:$(date +%Y%m%d-%H%M%S)

# 登录阿里云容器镜像仓库
echo "🔑 登录容器镜像仓库..."
docker login $ACR_REGISTRY -u $ACR_USERNAME -p $ACR_PASSWORD

# 推送镜像
echo "📤 推送镜像到仓库..."
docker push $ACR_REGISTRY/$ACR_NAMESPACE/lovpen-web:latest
docker push $ACR_REGISTRY/$ACR_NAMESPACE/lovpen-web:$(date +%Y%m%d-%H%M%S)

# 部署到 Kubernetes
echo "🎯 部署到 Kubernetes 集群..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# 等待部署完成
echo "⏳ 等待部署完成..."
kubectl rollout status deployment/lovpen-web-app -n lovpen-web --timeout=300s

echo "✅ 部署完成！"
echo "🌐 访问地址: https://your-domain.com"
echo "📊 监控状态: kubectl get pods -n lovpen-web"