import { exec } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'

export const mergeAudioFiles = async (
  audioFiles: string[],
  output: string,
  deleteAudioFiles = false
): Promise<void> => {
  if (audioFiles.length < 2) {
    console.log('Nenhum arquivo de áudio para mesclar')
    return
  }

  const tmpDir = path.resolve(__dirname, '../tmp')
  const listFilePath = path.join(tmpDir, 'file-list.txt')

  try {
    await fs.access(tmpDir)
  } catch {
    await fs.mkdir(tmpDir, { recursive: true })
  }

  await Promise.all(
    audioFiles.map(async (file) => {
      try {
        await fs.access(file)
      } catch {
        throw new Error(`Arquivo de áudio não encontrado: ${file}`)
      }
    })
  )

  const outputDir = path.dirname(output)

  try {
    await fs.access(outputDir)
  } catch {
    await fs.mkdir(outputDir, { recursive: true })
  }

  try {
    const listContent = audioFiles
      .map((file) => `file '${file.replace(/'/g, "'\\''")}'`)
      .join('\n')

    await fs.writeFile(listFilePath, listContent)

    await new Promise<void>((resolve, reject) => {
      const command = `"${ffmpegPath}" -f concat -safe 0 -i "${listFilePath}" -c copy -y "${output}" -loglevel quiet`

      exec(command, (error, _stdout, stderr) => {
        if (error) {
          reject(new Error(`FFmpeg error: ${error.message}\n${stderr}`))
          return
        }
        if (stderr) {
          console.warn('FFmpeg warnings:', stderr)
        }
        resolve()
      })
    })
  } catch (error) {
    await cleanup()
    throw error
  }

  cleanup()

  async function cleanup(): Promise<void> {
    const filesToDelete = [
      ...(deleteAudioFiles ? audioFiles : []),
      listFilePath
    ]

    await Promise.all(
      filesToDelete.map(async (file) => {
        try {
          await fs.unlink(file)
        } catch (error) {
          console.warn(
            `Aviso: Não foi possível excluir o arquivo ${file}:`,
            error
          )
        }
      })
    )
  }
}
