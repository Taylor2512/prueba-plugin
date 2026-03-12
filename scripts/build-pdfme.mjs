import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const base = path.resolve(process.cwd(), 'src', '_pdfme')
if (!fs.existsSync(base)) {
  console.error('No src/_pdfme folder found. Nothing to build.')
  process.exit(1)
}

const pkgs = fs.readdirSync(base, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
for (const pkg of pkgs) {
  const srcDir = path.join(base, pkg, 'src')
  if (!fs.existsSync(srcDir)) {
    console.log(`skip ${pkg}: no src dir`)
    continue
  }
  console.log(`Building ${pkg}...`)
  try {
    // build esm
    execSync(`npm exec -- esbuild $(find ${srcDir} \( -name '*.ts' -o -name '*.tsx' \)) --outdir=${path.join(base,pkg,'dist','esm')} --outbase=${srcDir} --format=esm --platform=neutral --target=es2020 --sourcemap`, { stdio: 'inherit' })
    // build cjs
    execSync(`npm exec -- esbuild $(find ${srcDir} \( -name '*.ts' -o -name '*.tsx' \)) --outdir=${path.join(base,pkg,'dist','cjs')} --outbase=${srcDir} --format=cjs --platform=neutral --target=es2020 --sourcemap`, { stdio: 'inherit' })
    // run copy styles if exists
    const copyScript = path.join(base, pkg, 'scripts', 'copy-styles.mjs')
    if (fs.existsSync(copyScript)) {
      console.log('running copy-styles for', pkg)
      execSync(`node ${copyScript}`, { stdio: 'inherit' })
    }
  } catch (err) {
    console.error('Build failed for', pkg)
    console.error(err)
    process.exit(2)
  }
}
console.log('pdfme build complete')
