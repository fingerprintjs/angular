import fs from 'fs'

export function logErrorSummary(logStream, logFile, err, version) {
  logStream.write(`\nError: ${err.message}\n`)
  console.log(`Angular ${version}: FAILED`)
  console.log(`Log: ${logFile}`)

  try {
    const logContent = fs.readFileSync(logFile, 'utf8')
    const lines = logContent.split('\n')
    console.log(lines.slice(-15).join('\n'))
  } catch (e) {
    // ignore
  }
}
