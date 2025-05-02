const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Path to the pages directory
const pagesDir = path.join(process.cwd(), "pages")

// Check if the pages directory exists
if (fs.existsSync(pagesDir)) {
  console.log("Removing pages directory...")

  try {
    // Remove the pages directory and all its contents
    fs.rmSync(pagesDir, { recursive: true, force: true })
    console.log("Pages directory removed successfully.")

    // Create an empty pages directory with a .gitkeep file
    fs.mkdirSync(pagesDir)
    fs.writeFileSync(path.join(pagesDir, ".gitkeep"), "")
    console.log("Created empty pages directory with .gitkeep file.")
  } catch (error) {
    console.error("Error removing pages directory:", error)
    process.exit(1)
  }
} else {
  console.log("Pages directory does not exist. Nothing to remove.")
}

console.log("Build preparation completed successfully.")
