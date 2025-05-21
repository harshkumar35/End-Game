const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Directories to search
const directories = ["components", "lib", "pages"]

// Function to check if a file imports next/headers
function checkFileForHeadersImport(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")

    // Check for direct imports
    if (content.includes("from 'next/headers'") || content.includes('from "next/headers"')) {
      return true
    }

    // Check for named imports
    if (content.includes("import { cookies") || content.includes("import { headers")) {
      return true
    }

    return false
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return false
  }
}

// Function to recursively search directories
function searchDirectory(dir) {
  const results = []

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results.push(...searchDirectory(filePath))
    } else if (
      stat.isFile() &&
      (filePath.endsWith(".js") || filePath.endsWith(".jsx") || filePath.endsWith(".ts") || filePath.endsWith(".tsx"))
    ) {
      if (checkFileForHeadersImport(filePath)) {
        results.push(filePath)
      }
    }
  }

  return results
}

// Main function
function main() {
  console.log("Checking for next/headers usage...")

  const filesWithHeadersImport = []

  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir)
    if (fs.existsSync(dirPath)) {
      filesWithHeadersImport.push(...searchDirectory(dirPath))
    }
  }

  if (filesWithHeadersImport.length > 0) {
    console.log("\n⚠️ Found next/headers imports in the following files:")
    filesWithHeadersImport.forEach((file) => {
      console.log(`  - ${file}`)
    })

    console.log("\nThese files may cause build errors if used in the pages/ directory.")
    console.log("Consider refactoring them to use client-side alternatives.")
  } else {
    console.log("\n✅ No next/headers imports found in the checked directories.")
  }
}

main()
