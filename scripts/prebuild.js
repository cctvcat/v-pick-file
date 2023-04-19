import fs from 'fs'
import path from 'path'

function rmDir(target) {
  if (!fs.existsSync(target)) {
    return
  }

  fs.readdirSync(target).forEach((file) => {
    const tmpPath = path.resolve(target, file)
    if (fs.statSync(tmpPath).isDirectory()) {
      rmDir(tmpPath)
    } else {
      fs.unlinkSync(tmpPath)
    }
  })
  fs.rmdirSync(target)
}

rmDir(path.resolve(path.resolve(), 'dist'))

