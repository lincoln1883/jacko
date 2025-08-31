#!/bin/bash

# Docker Helper Script for Jacko
# Provides easy commands for Docker operations

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="lincolngibson7832/jacko"
DOCKERFILE_PATH="."

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info &> /dev/null; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Get current Git commit SHA
get_git_sha() {
    git rev-parse --short HEAD 2>/dev/null || echo "unknown"
}

# Get current Git branch
get_git_branch() {
    git branch --show-current 2>/dev/null || echo "unknown"
}

# Build Docker image
build_image() {
    local tag=${1:-"local"}
    local sha=$(get_git_sha)
    local branch=$(get_git_branch)
    
    log_info "Building Docker image..."
    log_info "Tag: $tag"
    log_info "Branch: $branch"
    log_info "SHA: $sha"
    
    docker build \
        --build-arg RAILS_ENV=production \
        --build-arg BUNDLE_WITHOUT=development:test \
        --build-arg NODE_ENV=production \
        --tag "$IMAGE_NAME:$tag" \
        --tag "$IMAGE_NAME:$branch-$sha" \
        --tag "$IMAGE_NAME:latest" \
        "$DOCKERFILE_PATH"
    
    log_success "Docker image built successfully!"
    log_info "Available tags:"
    echo "  - $IMAGE_NAME:$tag"
    echo "  - $IMAGE_NAME:$branch-$sha"
    echo "  - $IMAGE_NAME:latest"
}

# Push Docker image
push_image() {
    local tag=${1:-"latest"}
    
    log_info "Pushing Docker image: $IMAGE_NAME:$tag"
    
    # Check if we're logged in to Docker Hub
    if ! docker info | grep -q "Username:"; then
        log_warning "Not logged in to Docker Hub. Attempting login..."
        docker login
    fi
    
    docker push "$IMAGE_NAME:$tag"
    log_success "Image pushed successfully!"
}

# Test Docker image
test_image() {
    local tag=${1:-"latest"}
    
    log_info "Testing Docker image: $IMAGE_NAME:$tag"
    
    # Check if master key exists
    if [ ! -f "config/master.key" ]; then
        log_error "config/master.key not found. Cannot test image."
        exit 1
    fi
    
    local master_key=$(cat config/master.key)
    
    log_info "Running Rails console test..."
    docker run --rm \
        -e RAILS_ENV=production \
        -e RAILS_MASTER_KEY="$master_key" \
        "$IMAGE_NAME:$tag" \
        /rails/bin/rails runner "puts 'Rails application loaded successfully! Version: #{Rails.version}'"
    
    log_success "Docker image test passed!"
}

# Run Docker image locally
run_image() {
    local tag=${1:-"latest"}
    local port=${2:-"3000"}
    
    log_info "Running Docker image locally: $IMAGE_NAME:$tag"
    log_info "Port: $port"
    log_info "Access at: http://localhost:$port"
    
    # Check if master key exists
    if [ ! -f "config/master.key" ]; then
        log_error "config/master.key not found. Cannot run image."
        exit 1
    fi
    
    local master_key=$(cat config/master.key)
    
    log_info "Starting container... (Press Ctrl+C to stop)"
    docker run --rm -it \
        -p "$port:80" \
        -e RAILS_ENV=production \
        -e RAILS_MASTER_KEY="$master_key" \
        "$IMAGE_NAME:$tag"
}

# Clean up Docker resources
cleanup() {
    log_info "Cleaning up Docker resources..."
    
    # Remove dangling images
    if docker images -f "dangling=true" -q | grep -q .; then
        docker rmi $(docker images -f "dangling=true" -q)
        log_success "Removed dangling images"
    fi
    
    # Clean build cache
    docker builder prune -f
    log_success "Cleaned build cache"
    
    log_success "Docker cleanup completed!"
}

# Show image information
info() {
    local tag=${1:-"latest"}
    
    log_info "Docker image information: $IMAGE_NAME:$tag"
    
    if docker image inspect "$IMAGE_NAME:$tag" &> /dev/null; then
        echo ""
        docker image inspect "$IMAGE_NAME:$tag" --format "Created: {{.Created}}"
        docker image inspect "$IMAGE_NAME:$tag" --format "Size: {{.Size}} bytes"
        docker image inspect "$IMAGE_NAME:$tag" --format "Architecture: {{.Architecture}}"
        docker image inspect "$IMAGE_NAME:$tag" --format "OS: {{.Os}}"
        echo ""
        
        # Show layers
        log_info "Image layers:"
        docker history "$IMAGE_NAME:$tag" --no-trunc --format "table {{.CreatedBy}}" | head -10
    else
        log_error "Image not found: $IMAGE_NAME:$tag"
        exit 1
    fi
}

# Help function
show_help() {
    echo "Docker Helper Script for Jacko"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  build [tag]     Build Docker image (default tag: local)"
    echo "  push [tag]      Push Docker image to registry (default tag: latest)"
    echo "  test [tag]      Test Docker image (default tag: latest)"
    echo "  run [tag] [port] Run Docker image locally (default: latest, 3000)"
    echo "  info [tag]      Show image information (default tag: latest)"
    echo "  cleanup         Clean up Docker resources"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build dev                    # Build with 'dev' tag"
    echo "  $0 test                         # Test latest image"
    echo "  $0 run latest 8080             # Run on port 8080"
    echo "  $0 push                        # Push latest to DockerHub"
    echo ""
}

# Main script logic
main() {
    check_docker
    
    case "${1:-help}" in
        "build")
            build_image "$2"
            ;;
        "push")
            push_image "$2"
            ;;
        "test")
            test_image "$2"
            ;;
        "run")
            run_image "$2" "$3"
            ;;
        "info")
            info "$2"
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
