#!/bin/bash

# Find all route.ts files in the app/api directory
find app/api -name "route.ts" | while read -r file; do
  echo "Processing $file"
  
  # Check if the file contains the pattern { params }: { params: { 
  if grep -q "{ params }: { params: {" "$file"; then
    # Get the parameter names from the file
    param_names=$(grep -o "{ params }: { params: { [a-zA-Z]*: string" "$file" | sed -E "s/.*\{ ([a-zA-Z]*): string.*/\1/g" | sort -u)
    
    for param_name in $param_names; do
      echo "  - Updating parameter: $param_name"
      
      # Replace the destructured parameter pattern with the context parameter
      sed -i '' "s/{ params }: { params: { $param_name: string } }/context: { params: Promise<{ $param_name: string }> }/g" "$file"
      
      # Update the references to params.$param_name
      sed -i '' "s/params.$param_name/await context.params.then(params => params.$param_name)/g" "$file"
    done
  fi
done

echo "Finished updating route handler files" 