#!/bin/bash

# StreamPlay Billing System - AWS Amplify Deployment Script
set -e

echo "🚀 StreamPlay Billing System - AWS Amplify Deployment"
echo "===================================================="

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
APP_NAME="streamplay-billing"
BRANCH_NAME=${BRANCH_NAME:-"main"}
GITHUB_REPO=${GITHUB_REPO:-""}
REGION="us-east-1"
REPOSITORY_URL=""  # Will be detected from git

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
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Please run 'aws configure'."
        exit 1
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir &> /dev/null; then
        print_error "Not in a git repository. Please initialize git and push to GitHub first."
        exit 1
    fi
    
    # Get repository URL
    REPOSITORY_URL=$(git config --get remote.origin.url)
    if [ -z "$REPOSITORY_URL" ]; then
        print_error "No remote origin found. Please add a remote repository."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Get GitHub repository URL
get_github_repo() {
    if [ -z "$GITHUB_REPO" ]; then
        GITHUB_REPO=$(git config --get remote.origin.url)
        if [ -z "$GITHUB_REPO" ]; then
            print_error "GitHub repository URL not found. Please set GITHUB_REPO environment variable."
            exit 1
        fi
    fi
    
    # Convert SSH URL to HTTPS if needed
    if [[ $GITHUB_REPO == git@github.com:* ]]; then
        GITHUB_REPO=$(echo $GITHUB_REPO | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
    fi
    
    print_status "Using GitHub repository: $GITHUB_REPO"
}

# Create Amplify app
create_amplify_app() {
    print_status "Creating Amplify application..."
    
    # Check if app already exists
    APP_ID=$(aws amplify list-apps --query "apps[?name=='$APP_NAME'].appId" --output text)
    if [ -n "$APP_ID" ]; then
        print_warning "Amplify app '$APP_NAME' already exists"
    else
        # Create new app
        APP_ID=$(aws amplify create-app \
            --name "$APP_NAME" \
            --repository "$REPOSITORY_URL" \
            --platform "WEB" \
            --region "$REGION" \
            --query 'app.appId' \
            --output text)
        
        if [ $? -eq 0 ]; then
            print_success "Amplify app created with ID: $APP_ID"
            echo "$APP_ID" > .amplify-app-id
        else
            print_error "Failed to create Amplify app"
            exit 1
        fi
    fi
}

# Set environment variables
set_environment_variables() {
    print_status "Setting environment variables..."
    
    # Read app ID
    if [ -f ".amplify-app-id" ]; then
        APP_ID=$(cat .amplify-app-id)
    else
        print_error "App ID not found. Please run create-app first."
        exit 1
    fi
    
    # Set environment variables
    aws amplify put-backend-environment \
        --app-id "$APP_ID" \
        --environment-name "staging" \
        --region "$REGION" || true
    
    # Update app with environment variables
    aws amplify update-app \
        --app-id "$APP_ID" \
        --environment-variables NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,STREAMPLAY_MOCK_MODE=true \
        --region "$REGION"
    
    print_success "Environment variables set"
}

# Create branch and start deployment
create_branch() {
    print_status "Creating and deploying branch..."
    
    # Read app ID
    if [ -f ".amplify-app-id" ]; then
        APP_ID=$(cat .amplify-app-id)
    else
        print_error "App ID not found. Please run create-app first."
        exit 1
    fi
    
    # Create branch
    aws amplify create-branch \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --region "$REGION"
    
    # Start deployment
    JOB_ID=$(aws amplify start-job \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --job-type "RELEASE" \
        --region "$REGION" \
        --query 'jobSummary.jobId' \
        --output text)
    
    print_success "Deployment started with Job ID: $JOB_ID"
    print_status "You can monitor the deployment at: https://console.aws.amazon.com/amplify/home?region=$REGION#/$APP_ID"
}

# Configure custom domain (optional)
setup_domain() {
    print_status "Setting up custom domain (optional)..."
    
    if [ -z "$CUSTOM_DOMAIN" ]; then
        print_warning "No custom domain specified. Skipping domain setup."
        return
    fi
    
    # Read app ID
    if [ -f ".amplify-app-id" ]; then
        APP_ID=$(cat .amplify-app-id)
    else
        print_error "App ID not found. Please run create-app first."
        exit 1
    fi
    
    # Create domain association
    aws amplify create-domain-association \
        --app-id "$APP_ID" \
        --domain-name "$CUSTOM_DOMAIN" \
        --sub-domain-settings prefix="",branchName="$BRANCH_NAME" \
        --region "$REGION"
    
    print_success "Domain setup initiated for: $CUSTOM_DOMAIN"
}

# Get deployment information
get_app_url() {
    if [ -f ".amplify-app-id" ]; then
        APP_ID=$(cat .amplify-app-id)
        APP_URL="https://$BRANCH_NAME.$APP_ID.amplifyapp.com"
        print_success "Your app will be available at: $APP_URL"
    fi
}

# Cleanup on exit
cleanup() {
    print_status "Cleaning up temporary files..."
    # Add any cleanup tasks here
}

# Show help message
show_help() {
    echo "StreamPlay Billing System - AWS Amplify Deployment"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy        - Full deployment (recommended)"
    echo "  create-app    - Create Amplify application"
    echo "  set-env       - Set environment variables"
    echo "  deploy-branch - Deploy branch"
    echo "  domain        - Setup custom domain"
    echo "  status        - Show deployment status"
    echo "  help          - Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  CUSTOM_DOMAIN - Custom domain name (optional)"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  CUSTOM_DOMAIN=billing.streamplay.com $0 deploy"
}

# Show deployment status
show_status() {
    if [ -f ".amplify-app-id" ]; then
        APP_ID=$(cat .amplify-app-id)
        print_status "App ID: $APP_ID"
        print_status "Region: $REGION"
        print_status "Branch: $BRANCH_NAME"
        
        # Get app details
        aws amplify get-app --app-id "$APP_ID" --region "$REGION" --query 'app.{Name:name,Status:status,DefaultDomain:defaultDomain}' --output table
        
        # Get branch details
        aws amplify get-branch --app-id "$APP_ID" --branch-name "$BRANCH_NAME" --region "$REGION" --query 'branch.{BranchName:branchName,Stage:stage,LastDeployTime:lastDeployTime}' --output table
    else
        print_warning "No Amplify app found. Run 'deploy' or 'create-app' first."
    fi
}

# Main deployment flow
main() {
    print_status "Starting AWS Amplify deployment..."
    
    check_prerequisites
    create_amplify_app
    set_environment_variables
    create_branch
    setup_domain
    get_app_url
    
    print_success "AWS Amplify deployment completed!"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "create-app")
        check_prerequisites
        create_amplify_app
        ;;
    "set-env")
        set_environment_variables
        ;;
    "deploy-branch")
        create_branch
        ;;
    "domain")
        setup_domain
        ;;
    "status")
        show_status
        ;;
    "help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

# Cleanup on exit
trap cleanup EXIT
