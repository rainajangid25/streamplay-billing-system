#!/bin/bash

# StreamPlay Billing System Deployment Script
# Supports multiple deployment targets: Vercel, AWS, Docker, Railway

set -e

echo "🚀 StreamPlay Billing System Deployment"
echo "========================================"

# Check if deployment target is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh [vercel|aws|docker|railway]"
    exit 1
fi

DEPLOYMENT_TARGET=$1

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | xargs)
fi

case $DEPLOYMENT_TARGET in
    "vercel")
        echo "📦 Deploying to Vercel..."
        
        # Install Vercel CLI if not present
        if ! command -v vercel &> /dev/null; then
            npm install -g vercel
        fi
        
        # Deploy to Vercel
        vercel --prod
        
        echo "✅ Deployed to Vercel successfully!"
        echo "🔗 Your app is live at: https://your-app.vercel.app"
        ;;
        
    "aws")
        echo "☁️ Deploying to AWS..."
        
        # Build Docker image
        docker build -t streamplay-billing .
        
        # Tag for ECR
        docker tag streamplay-billing:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/streamplay-billing:latest
        
        # Push to ECR
        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/streamplay-billing:latest
        
        # Deploy to ECS or EKS
        echo "🚀 Deploying to AWS ECS..."
        aws ecs update-service --cluster streamplay-cluster --service streamplay-billing-service --force-new-deployment
        
        echo "✅ Deployed to AWS successfully!"
        ;;
        
    "docker")
        echo "🐳 Deploying with Docker..."
        
        # Build and run with Docker Compose
        docker-compose down
        docker-compose build
        docker-compose up -d
        
        echo "✅ Deployed with Docker successfully!"
        echo "🔗 Your app is running at: http://localhost:3000"
        ;;
        
    "railway")
        echo "🚂 Deploying to Railway..."
        
        # Install Railway CLI if not present
        if ! command -v railway &> /dev/null; then
            npm install -g @railway/cli
        fi
        
        # Deploy to Railway
        railway login
        railway up
        
        echo "✅ Deployed to Railway successfully!"
        ;;
        
    *)
        echo "❌ Unknown deployment target: $DEPLOYMENT_TARGET"
        echo "Supported targets: vercel, aws, docker, railway"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment completed!"
echo "📋 Next steps:"
echo "   1. Set up your environment variables"
echo "   2. Configure StreamPlay webhooks"
echo "   3. Test the integration"
echo "   4. Monitor the application"
