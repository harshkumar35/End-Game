const fs = require("fs")
const path = require("path")

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recursive call for directories
        deleteFolderRecursive(curPath)
      } else {
        // Delete file
        fs.unlinkSync(curPath)
        console.log(`Deleted file: ${curPath}`)
      }
    })

    // Delete the empty directory
    fs.rmdirSync(folderPath)
    console.log(`Deleted directory: ${folderPath}`)
  }
}

// Delete the pages directory if it exists
const pagesDir = path.join(__dirname, "..", "pages")
if (fs.existsSync(pagesDir)) {
  console.log("Found pages directory. Deleting...")
  deleteFolderRecursive(pagesDir)
  console.log("Pages directory deleted successfully.")
} else {
  console.log("No pages directory found.")
}
