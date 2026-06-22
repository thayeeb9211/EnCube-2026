#!/usr/bin/env bash
# Quick setup script for developers

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Email & SFDC Case Generator - Setup ===${NC}"

# Check if folder exists
if [ ! -d "emailex" ]; then
    echo -e "${RED}Error: emailex folder not found${NC}"
    echo "Please run this script from the parent directory"
    exit 1
fi

cd emailex

# Verify required files
REQUIRED_FILES=(
    "manifest.json"
    "popup.html"
    "popup.js"
    "background.js"
    "styles/main.css"
)

echo -e "${YELLOW}Checking required files...${NC}"
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
    fi
done

# Check optional files
OPTIONAL_FILES=(
    "config.js"
    "utils/ai-generator.js"
    "README.md"
    "TESTING.md"
    "AI-INTEGRATION.md"
)

echo -e "\n${YELLOW}Checking optional files...${NC}"
for file in "${OPTIONAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${YELLOW}~${NC} $file (optional)"
    fi
done

# Verify manifest.json syntax
echo -e "\n${YELLOW}Validating manifest.json...${NC}"
if command -v python3 &> /dev/null; then
    python3 -m json.tool manifest.json > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} manifest.json is valid"
    else
        echo -e "${RED}✗${NC} manifest.json has syntax errors"
        exit 1
    fi
else
    echo -e "${YELLOW}~${NC} Python not found, skipping JSON validation"
fi

# Check file sizes
echo -e "\n${YELLOW}Checking file sizes...${NC}"
POPUP_SIZE=$(wc -c < popup.js)
if [ $POPUP_SIZE -gt 50000 ]; then
    echo -e "${YELLOW}⚠${NC} popup.js is large ($POPUP_SIZE bytes)"
else
    echo -e "${GREEN}✓${NC} File sizes reasonable"
fi

# Summary
echo -e "\n${GREEN}=== Setup Complete ===${NC}"
echo -e "${GREEN}Extension is ready for testing!${NC}"
echo ""
echo "Next steps:"
echo "1. Open Chrome/Edge"
echo "2. Go to chrome://extensions/ or edge://extensions/"
echo "3. Enable 'Developer Mode'"
echo "4. Click 'Load unpacked'"
echo "5. Select the emailex folder"
echo ""
echo "For more info, see README.md"
