import { readFile } from './fs.mjs'

export function logErrorSummary(logStream, logFile, err, version) {
  logStream.write(`\nError: ${err.message}\n`)
  console.log(`Angular ${version}: FAILED`)
  console.log(`Log: ${logFile}`)

  try {
    const logContent = readFile(logFile)
    const lines = logContent.split('\n')
    console.log(lines.slice(-15).join('\n'))
  } catch (e) {
    // ignore
  }
}
