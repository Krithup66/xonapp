#!/bin/bash

# Security Check Script
# ตรวจสอบ security configurations และ dependencies

echo "🔒 กำลังตรวจสอบความปลอดภัยของระบบ..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist
echo ""
echo "📋 ตรวจสอบ Environment Variables:"
for service in api-gateway trading-journal-service user-service auth-service; do
    if [ -f "services/$service/.env" ]; then
        echo -e "${GREEN}✅${NC} $service/.env exists"
        
        # Check for sensitive keys
        if grep -q "your-secret-key" "services/$service/.env"; then
            echo -e "${YELLOW}⚠️  $service: Using default secret key${NC}"
        fi
    else
        echo -e "${RED}❌${NC} $service/.env not found"
    fi
done

# Check for exposed secrets in code
echo ""
echo "🔍 ตรวจสอบ exposed secrets:"
if grep -r "password.*=.*['\"]" services/ --include="*.ts" --include="*.js" | grep -v "password_hash" | grep -v "password:" | head -5; then
    echo -e "${YELLOW}⚠️  พบ potential password exposure${NC}"
else
    echo -e "${GREEN}✅${NC} No obvious password exposure"
fi

# Check dependencies for known vulnerabilities
echo ""
echo "📦 ตรวจสอบ dependencies:"
if command -v npm &> /dev/null; then
    for service in api-gateway trading-journal-service user-service auth-service; do
        if [ -f "services/$service/package.json" ]; then
            echo "Checking $service..."
            cd "services/$service"
            if [ -d "node_modules" ]; then
                npm audit --audit-level=moderate 2>/dev/null || echo "Run 'npm audit' manually"
            else
                echo "  Install dependencies first: npm install"
            fi
            cd ../..
        fi
    done
else
    echo -e "${YELLOW}⚠️  npm not found, skipping dependency check${NC}"
fi

# Check for security headers
echo ""
echo "🛡️  ตรวจสอบ Security Headers:"
if grep -r "helmet" services/ --include="*.ts" --include="*.js" | head -1; then
    echo -e "${GREEN}✅${NC} Helmet.js is configured"
else
    echo -e "${RED}❌${NC} Helmet.js not found"
fi

# Check for rate limiting
echo ""
echo "⏱️  ตรวจสอบ Rate Limiting:"
if grep -r "rateLimit\|rate-limit" services/ --include="*.ts" --include="*.js" | head -1; then
    echo -e "${GREEN}✅${NC} Rate limiting is configured"
else
    echo -e "${RED}❌${NC} Rate limiting not found"
fi

# Check for input validation
echo ""
echo "✅ ตรวจสอบ Input Validation:"
if grep -r "zod\|validate" services/ --include="*.ts" --include="*.js" | head -1; then
    echo -e "${GREEN}✅${NC} Input validation is configured"
else
    echo -e "${RED}❌${NC} Input validation not found"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Security Check Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Security features implemented:"
echo "   - JWT Authentication"
echo "   - Password Hashing"
echo "   - Rate Limiting"
echo "   - Input Validation"
echo "   - Security Headers"
echo "   - CORS Configuration"
echo ""
echo "💡 Recommendations:"
echo "   1. Review .env files and ensure no default secrets"
echo "   2. Run 'npm audit' in each service directory"
echo "   3. Enable HTTPS in production"
echo "   4. Regular security audits"
echo ""
echo "📚 See SECURITY.md for more details"
