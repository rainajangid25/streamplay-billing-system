#!/bin/bash

# StreamPlay Billing System - AWS Deployment Script
set -e

echo "🚀 StreamPlay Billing System - AWS Deployment"
echo "=============================================="

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
ENVIRONMENT=${ENVIRONMENT:-"production"}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPOSITORY_NAME="streamplay-billing"
IMAGE_TAG=${IMAGE_TAG:-"latest"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Please run 'aws configure'."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Create ECR repository if it doesn't exist
create_ecr_repository() {
    print_status "Creating ECR repository..."
    
    if aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION &> /dev/null; then
        print_warning "ECR repository already exists"
    else
        aws ecr create-repository \
            --repository-name $ECR_REPOSITORY_NAME \
            --region $AWS_REGION \
            --image-scanning-configuration scanOnPush=true
        print_success "ECR repository created"
    fi
}

# Build and push Docker image
build_and_push_image() {
    print_status "Building Docker image..."
    
    # Build the image
    docker build -t $ECR_REPOSITORY_NAME:$IMAGE_TAG .
    
    # Tag for ECR
    ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:$IMAGE_TAG"
    docker tag $ECR_REPOSITORY_NAME:$IMAGE_TAG $ECR_URI
    
    print_status "Pushing image to ECR..."
    
    # Login to ECR
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    
    # Push the image
    docker push $ECR_URI
    
    print_success "Image pushed to ECR: $ECR_URI"
}

# Deploy CloudFormation stack
deploy_infrastructure() {
    print_status "Deploying infrastructure with CloudFormation..."
    
    STACK_NAME="streamplay-billing-$ENVIRONMENT"
    
    # Check if stack exists
    if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION &> /dev/null; then
        print_status "Updating existing stack..."
        aws cloudformation update-stack \
            --stack-name $STACK_NAME \
            --template-body file://aws-infrastructure.yml \
            --parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
            --capabilities CAPABILITY_NAMED_IAM \
            --region $AWS_REGION
        
        aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $AWS_REGION
    else
        print_status "Creating new stack..."
        aws cloudformation create-stack \
            --stack-name $STACK_NAME \
            --template-body file://aws-infrastructure.yml \
            --parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
            --capabilities CAPABILITY_NAMED_IAM \
            --region $AWS_REGION
        
        aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $AWS_REGION
    fi
    
    print_success "Infrastructure deployed successfully"
}

# Update secrets in AWS Secrets Manager
update_secrets() {
    print_status "Updating secrets in AWS Secrets Manager..."
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_warning ".env.local not found. Please create it with your environment variables."
        return
    fi
    
    # Read environment variables from .env.local
    source .env.local
    
    # Update secrets
    aws secretsmanager update-secret \
        --secret-id "streamplay/$ENVIRONMENT/supabase-url" \
        --secret-string "{\"SUPABASE_NEXT_PUBLIC_SUPABASE_URL\":\"$NEXT_PUBLIC_SUPABASE_URL\"}" \
        --region $AWS_REGION || print_warning "Failed to update Supabase URL secret"
    
    aws secretsmanager update-secret \
        --secret-id "streamplay/$ENVIRONMENT/supabase-anon-key" \
        --secret-stSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY\":\"$NEXT_PUBLIC_SUPABASE_ANON_KEY\"}" \
        --region $AWS_REGION || print_warning "Failed to update Supabase anon key secret"
    
    aws secretsmanager update-secret \
        --secret-id "streamplay/$ENVIRONMENT/supabase-service-role-key" \
        --secret-string "{\"SUPABASE_SERVICE_ROLE_KEY\":\"$SUPABASE_SERVICE_ROLE_KEY\"}" \
        --region $AWS_REGION || print_warning "Failed to update Supabase service role key secret"
    
    aws secretsmanager update-secret \
        --secret-id "streamplay/$ENVIRONMENT/api-key" \
        --secret-string "{\"STREAMPLAY_API_KEY\":\"$STREAMPLAY_API_KEY\"}" \
        --region $AWS_REGION || print_warning "Failed to update StreamPlay API key secret"
    
    aws secretsmanager update-secret \
        --secret-id "streamplay/$ENVIRONMENT/webhook-secret" \
        --secret-string "{\"STREAMPLAY_WEBHOOK_SECRET\":\"$STREAMPLAY_WEBHOOK_SECRET\"}" \
        --region $AWS_REGION || print_warning "Failed to update webhook secret"
    
    print_success "Secrets updated"
}

# Update ECS service to use new image
update_ecs_service() {
    print_status "Updating ECS service..."
    
    CLUSTER_NAME="$ENVIRONMENT-streamplay-cluster"
    SERVICE_NAME="$ENVIRONMENT-streamplay-service"
    
    # Force new deployment
    aws ecs update-service \
        --cluster $CLUSTER_NAME \
        --service $SERVICE_NAME \
        --force-new-deployment \
        --region $AWS_REGION
    
    print_status "Waiting for service to stabilize..."
    aws ecs wait services-stable \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --region $AWS_REGION
    
    print_success "ECS service updated successfully"
}

# Get deployment information
get_deployment_info() {
    print_status "Getting deployment information..."
    
    STACK_NAME="streamplay-billing-$ENVIRONMENT"
    
    # Get ALB DNS name
    ALB_DNS=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
        --output text \
        --region $AWS_REGION)
    
    # Get ECR URI
    ECR_URI=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`ECRRepository`].OutputValue' \
        --output text \
        --region $AWS_REGION)
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "====================================="
    echo "Environment: $ENVIRONMENT"
    echo "Region: $AWS_REGION"
    echo "Application URL: http://$ALB_DNS"
    echo "ECR Repository: $ECR_URI"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure your domain to point to: $ALB_DNS"
    echo "2. Set up SSL certificate in AWS Certificate Manager"
    echo "3. Update ALB listener to use HTTPS"
    echo "4. Configure StreamPlay webhooks to: http://$ALB_DNS/api/webhooks/streamplay"
    echo "5. Test the integration"
    echo ""
}

# Main deployment flow
main() {
    print_status "Starting AWS deployment for environment: $ENVIRONMENT"
    
    check_prerequisites
    create_ecr_repository
    build_and_push_image
    deploy_infrastructure
    update_secrets
    update_ecs_service
    get_deployment_info
    
    print_success "AWS deployment completed!"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build")
        check_prerequisites
        create_ecr_repository
        build_and_push_image
        ;;
    "infrastructure")
        check_prerequisites
        deploy_infrastructure
        ;;
    "secrets")
        update_secrets
        ;;
    "service")
        update_ecs_service
        ;;
    "info")
        get_deployment_info
        ;;
    *)
        echo "Usage: $0 [deploy|build|infrastructure|secrets|service|info]"
        echo ""
        echo "Commands:"
        echo "  deploy         - Full deployment (default)"
        echo "  build          - Build and push Docker image only"
        echo "  infrastructure - Deploy CloudFormation stack only"
        echo "  secrets        - Update secrets only"
        echo "  service        - Update ECS service only"
        echo "  info           - Show deployment information"
        exit 1
        ;;
esac
