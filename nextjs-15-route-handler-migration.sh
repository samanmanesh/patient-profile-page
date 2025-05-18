#!/bin/bash

# Next.js 15 Route Handler Migration Script
# This script updates Next.js App Router route handlers to use the new format required by Next.js 15
# which requires route handlers to use `context: { params: Promise<{ paramName: string }> }` 
# instead of the old `{ params }: { params: { paramName: string } }` format.

echo "Starting Next.js 15 Route Handler Migration"
echo "----------------------------------------"

# Step 1: Update all route handlers with the correct Promise-based context parameter
find app/api -name "route.ts" | while read -r file; do
  echo "Processing $file"
  
  # Find files with the old params destructuring pattern
  if grep -q "{ params }: { params: {" "$file"; then
    echo "  Found outdated parameter format - updating..."
    
    # Get param names from file (e.g., id, patientId, etc.)
    param_names=$(grep -o "{ params }: { params: { [a-zA-Z]*: string" "$file" | sed -E "s/.*\{ ([a-zA-Z]*): string.*/\1/g" | sort -u)
    
    for param_name in $param_names; do
      echo "  - Updating parameter: $param_name"
      
      # Replace the old destructured parameter pattern with the context parameter
      sed -i '' "s/{ params }: { params: { $param_name: string } }/context: { params: Promise<{ $param_name: string }> }/g" "$file"
      
      # Now we need to properly await the params in the route handler body
      if grep -q "params.$param_name" "$file"; then
        echo "  - Updating references to params.$param_name"
        
        # Update the references to use await and then() to access params
        sed -i '' "s/params.$param_name/await context.params.then(params => params.$param_name)/g" "$file"
        
        # Check if we need to extract the param ID outside of filter/find functions
        # (since await can't be used in non-async functions like filter callbacks)
        if grep -q "=== await context.params.then" "$file" || grep -q "!== await context.params.then" "$file"; then
          echo "  - Fixing await in filter/find callbacks"
          
          # For each handler type (GET, PUT, DELETE, etc.) in the file
          for method in "export async function GET" "export async function PUT" "export async function POST" "export async function DELETE" "export async function PATCH"; do
            if grep -q "$method" "$file"; then
              # Get the line number of the method declaration
              method_line=$(grep -n "$method" "$file" | cut -d ':' -f 1)
              
              # Get the line number of the first reference to context.params.then
              params_line=$(grep -n "await context.params.then(params => params.$param_name)" "$file" | head -1 | cut -d ':' -f 1)
              
              if [[ -n "$method_line" && -n "$params_line" && $params_line -gt $method_line ]]; then
                # Calculate the line where we'll insert extraction code (right after the try { line)
                try_line=$(tail -n +$method_line "$file" | grep -n "try {" | head -1 | cut -d ':' -f 1)
                insert_line=$((method_line + try_line))
                
                # Create a temp file
                temp_file=$(mktemp)
                
                # Copy content to temp file
                head -n $insert_line "$file" > "$temp_file"
                echo "    const $param_name = await context.params.then(params => params.$param_name);" >> "$temp_file"
                tail -n +$((insert_line + 1)) "$file" >> "$temp_file"
                
                # Replace original file with temp file
                mv "$temp_file" "$file"
                
                # Now replace all instances of await context.params.then with the extracted variable
                sed -i '' "s/await context.params.then(params => params.$param_name)/$param_name/g" "$file"
              fi
            fi
          done
        fi
      fi
    done
  else
    echo "  No updates needed (already using modern format)"
  fi
done

# Step 2: Fix any pages that might be affected by the new Promise-based searchParams
find app -path "app/api" -prune -o -name "page.tsx" -print | while read -r file; do
  echo "Checking page: $file"
  
  # Check if the page uses searchParams with non-Promise type
  if grep -q "searchParams: { \[key: string\]: " "$file"; then
    echo "  Updating searchParams in $file"
    
    # Update the type definition
    sed -i '' 's/searchParams: { \[key: string\]: string | string\[] | undefined; }/searchParams: Promise<{ [key: string]: string | string[] | undefined; }>/g' "$file"
    
    # Update default export to be async if it's not already
    sed -i '' 's/export default function /export default async function /g' "$file"
    
    # Add an await before using searchParams
    if grep -q "export default async function" "$file"; then
      # Create a temp file
      temp_file=$(mktemp)
      
      # Find the component line and extract name
      component_line=$(grep -n "export default async function" "$file" | head -1)
      component_name=$(echo "$component_line" | sed -E 's/.*function ([a-zA-Z0-9_]+).*/\1/g')
      line_num=$(echo "$component_line" | cut -d ':' -f 1)
      
      # Add const params = await searchParams; at the start of the component body
      closing_bracket_line=$((line_num + 1))
      if [[ -n "$component_name" && -n "$line_num" ]]; then
        head -n $closing_bracket_line "$file" > "$temp_file"
        echo "  const params = await searchParams;" >> "$temp_file"
        tail -n +$((closing_bracket_line + 1)) "$file" >> "$temp_file"
        
        # Replace original file with temp
        mv "$temp_file" "$file"
        
        # Now replace references to searchParams with params
        sed -i '' 's/searchParams={searchParams}/searchParams={params}/g' "$file"
      fi
    fi
  fi
done

echo "----------------------------------------"
echo "Migration complete! Please test your application with:"
echo "npm run dev"
echo "or"
echo "npm run build" 