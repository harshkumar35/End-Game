const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

console.log(`${colors.cyan}Starting build fix script...${colors.reset}`)

// Step 1: Remove the pages directory
const pagesDir = path.join(process.cwd(), "pages")
if (fs.existsSync(pagesDir)) {
  console.log(`${colors.yellow}Removing pages directory...${colors.reset}`)
  try {
    fs.rmSync(pagesDir, { recursive: true, force: true })
    console.log(`${colors.green}Pages directory successfully removed.${colors.reset}`)
  } catch (error) {
    console.error(`${colors.red}Error removing pages directory:${colors.reset}`, error)
    // Continue with the script even if this fails
  }
} else {
  console.log(`${colors.green}Pages directory does not exist. Nothing to remove.${colors.reset}`)
}

// Step 2: Create an empty .gitkeep file in the pages directory to maintain the directory structure
try {
  fs.mkdirSync(pagesDir, { recursive: true })
  fs.writeFileSync(path.join(pagesDir, ".gitkeep"), "")
  console.log(`${colors.green}Created empty pages directory with .gitkeep file.${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error creating .gitkeep file:${colors.reset}`, error)
}

// Step 3: Check for any files that might be importing next/headers
console.log(`${colors.cyan}Scanning for files that import next/headers...${colors.reset}`)

function scanDirectory(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && file !== "node_modules" && file !== ".next" && file !== ".git") {
      scanDirectory(filePath)
    } else if (
      stat.isFile() &&
      (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx"))
    ) {
      const content = fs.readFileSync(filePath, "utf8")

      if (content.includes("next/headers")) {
        console.log(`${colors.yellow}Found next/headers import in:${colors.reset} ${filePath}`)

        // Check if the file is already marked as a server component
        if (!content.includes("'use server'") && !content.includes('"use server"')) {
          console.log(`${colors.magenta}Adding 'use server' directive to:${colors.reset} ${filePath}`)

          // Add 'use server' directive at the top of the file
          const updatedContent = "'use server';\n\n" + content
          fs.writeFileSync(filePath, updatedContent)
        }
      }
    }
  }
}

try {
  scanDirectory(process.cwd())
  console.log(`${colors.green}Scan complete.${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error scanning files:${colors.reset}`, error)
}

console.log(`${colors.green}Build fix script completed successfully!${colors.reset}`)
