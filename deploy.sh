#!/bin/bash

# eShop MERN App Deployment Script
# This script helps deploy your app to various platforms

echo "🚀 eShop MERN App Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/username/repository.git"
    exit 1
fi

echo "✅ Git repository configured"
echo ""

# Function to deploy to Render
deploy_render() {
    echo "🌐 Deploying to Render..."
    echo ""
    echo "📋 Steps to deploy:"
    echo "1. Go to https://render.com"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New +' and select 'Web Service'"
    echo "4. Connect your GitHub repository"
    echo "5. Configure backend service:"
    echo "   - Name: eshop-backend"
    echo "   - Environment: Node"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "   - Root Directory: backend"
    echo ""
    echo "6. Add environment variables:"
    echo "   MONGO_URL=your_mongodb_atlas_url"
    echo "   JWT_SECRET=your_jwt_secret"
    echo "   NODE_ENV=production"
    echo "   PORT=10000"
    echo ""
    echo "7. Deploy backend service"
    echo ""
    echo "8. Create frontend service (Static Site):"
    echo "   - Name: eshop-frontend"
    echo "   - Build Command: npm install && npm run build"
    echo "   - Publish Directory: dist"
    echo "   - Root Directory: frontend"
    echo ""
    echo "9. Deploy frontend service"
    echo ""
    echo "🔗 Your app will be available at:"
    echo "   Frontend: https://eshop-frontend.onrender.com"
    echo "   Backend: https://eshop-backend.onrender.com"
}

# Function to deploy with Docker
deploy_docker() {
    echo "🐳 Deploying with Docker..."
    echo ""
    echo "📋 Steps to deploy:"
    echo "1. Build the Docker image:"
    echo "   docker build -t eshop-app ."
    echo ""
    echo "2. Run the container:"
    echo "   docker run -d -p 10000:10000 --name eshop-app eshop-app"
    echo ""
    echo "3. Or use docker-compose:"
    echo "   docker-compose up -d"
    echo ""
    echo "🔗 Your app will be available at:"
    echo "   http://localhost:10000"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "⚡ Deploying to Vercel..."
    echo ""
    echo "📋 Steps to deploy:"
    echo "1. Install Vercel CLI:"
    echo "   npm i -g vercel"
    echo ""
    echo "2. Deploy frontend:"
    echo "   cd frontend"
    echo "   vercel --prod"
    echo ""
    echo "3. Deploy backend to Railway or similar:"
    echo "   - Go to https://railway.app"
    echo "   - Connect your GitHub repository"
    echo "   - Set root directory to 'backend'"
    echo "   - Add environment variables"
    echo ""
    echo "🔗 Your app will be available at the Vercel URL"
}

# Main menu
echo "Choose deployment option:"
echo "1) Render (Recommended for beginners)"
echo "2) Docker (Local/Cloud deployment)"
echo "3) Vercel + Railway"
echo "4) Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_render
        ;;
    2)
        deploy_docker
        ;;
    3)
        deploy_vercel
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "�� Happy deploying!"
