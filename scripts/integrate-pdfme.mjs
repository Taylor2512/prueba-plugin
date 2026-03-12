import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = process.cwd()
const vendorBase = path.join(root, 'vendor', 'pdfme')
const destBase = path.join(root, 'src', '_pdfme')

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return false
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(srcPath, destPath)
    else {
      const content = fs.readFileSync(srcPath)
      fs.writeFileSync(destPath, content)
    }
  }
  return true
}

if (!fs.existsSync(vendorBase)) {
  console.error('vendor/pdfme not found at', vendorBase)
  process.exit(1)
}

const packages = fs.readdirSync(vendorBase).filter(d => fs.statSync(path.join(vendorBase, d)).isDirectory())
console.log('Found pdfme packages:', packages.join(', '))

for (const pkg of packages) {
  const srcDir = path.join(vendorBase, pkg, 'src')
  if (!fs.existsSync(srcDir)) {
    console.log('Skipping', pkg, 'no src dir')
    continue
  }
  const destDir = path.join(destBase, pkg)
  console.log('Copying', srcDir, '->', destDir)
  copyDir(srcDir, path.join(destDir, 'src'))
}

console.log('Integration complete. You can now import @pdfme/* from src/_pdfme/<pkg>/src')
