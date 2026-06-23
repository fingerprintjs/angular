import { spawn, execSync } from 'child_process'

export function executeCommand(cmd, args, opts, log) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, opts)
    if (log) {
      child.stdout.on('data', log)
      child.stderr.on('data', log)
    }
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with code ${code}: ${cmd} ${args.join(' ')}`))
      }
    })
  })
}

export function exec(cmd, options) {
  return execSync(cmd, options)
}
