import fs from 'node:fs'
import PDFParser from 'pdf2json'

type PDFMetadata = {
  Title?: string
}

type ContructorProps = {
  pathFile: string
  password?: string
  skipFirstPage?: boolean
}

export class PDF {
  private pathFile: string
  private pdfParser: PDFParser
  private skipFirstPage = false
  private totalPages = 0

  constructor({ pathFile, password, skipFirstPage = false }: ContructorProps) {
    this.pdfParser = new PDFParser(null, true, password)
    this.skipFirstPage = skipFirstPage
    this.pathFile = pathFile
  }

  getParser() {
    return this.pdfParser
  }

  getTotalPages() {
    return this.totalPages
  }

  private async preProcessIfNeeded() {
    if (!this.pdfParser.getRawTextContent()) {
      await this.getMetadata()
    }
  }

  filterIrrelevantCharacters(text: string): string {
    const removeSpecialSymbols = text.replace(/[!@#$%^&*()=]/g, '')
    const reduceExcessiveDots = removeSpecialSymbols.replace(/\.{4,}/g, '...')
    const reduceQuestionMarks = reduceExcessiveDots.replace(/\?{2,}/g, '?')
    const reduceExclamationMarks = reduceQuestionMarks.replace(/\!{2,}/g, '!')
    const removeParagraphPonctuation = reduceExclamationMarks.replace(
      /-/g,
      '\n'
    )

    const removeExcessivePunctuation = removeParagraphPonctuation.replace(
      /([!?,])\1+/g,
      '$1'
    )
    return removeExcessivePunctuation
  }

  async getMetadata(): Promise<PDFMetadata> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.pathFile, (err, pdfBuffer) => {
        if (!err) {
          this.pdfParser.parseBuffer(pdfBuffer)
        }

        this.pdfParser.on('pdfParser_dataReady', (pdfData) => {
          this.totalPages = pdfData.Pages.length
          resolve(pdfData.Meta)
        })

        this.pdfParser.on('pdfParser_dataError', (err) => {
          reject(err)
        })
      })
    })
  }

  async getPage(pageNumber: number) {
    await this.preProcessIfNeeded()

    const pages = this.getParser()
      .getRawTextContent()
      .split(/----------------Page \(\d+\) Break----------------/)
      .slice(this.skipFirstPage ? 1 : 0)

    if (pageNumber < 0 || pageNumber > pages.length) {
      throw new Error('Número da página inválido.')
    }

    return pages[pageNumber]
  }

  async getPages(number: number) {
    await this.preProcessIfNeeded()
    const pages: string[] = []

    for (let i = 0; i < number; i++) {
      pages.push(await this.getPage(i))
    }
    return pages
  }

  async getPrettifiedPage(pageNumber: number) {
    const page = await this.getPage(pageNumber)
    const prettifiedText = this.prettifyText(page)
    return this.filterIrrelevantCharacters(prettifiedText)
  }

  async getPrettifiedPages(number: number) {
    const pages = await this.getPages(number)
    return pages.map((page) => this.prettifyText(page))
  }

  async toChunks(textContent: string, maxChars = 3000) {
    await this.preProcessIfNeeded()

    const text = textContent
    const chunks: string[] = []
    let start = 0

    while (start < text.length) {
      let end = start + maxChars

      if (end >= text.length) {
        end = text.length
      } else {
        end = text.lastIndexOf(' ', end)
      }

      const chunk = text.slice(start, end).trim()
      chunks.push(chunk)

      start = end + 1
    }

    return chunks
  }

  prettifyText(textContent: string) {
    const lines = textContent.split(/\r?\n/)
    let organizedText = ''
    let paragraph = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line === '' || /^\d+$/.test(line)) continue

      const isNewParagraph =
        paragraph &&
        (/[.!?]$/.test(paragraph.slice(-1)) ||
          /^\s*[A-Z]/.test(line) ||
          /^\s+-\s*$/.test(line))

      if (isNewParagraph) {
        if (paragraph) {
          organizedText += `${paragraph}\n\n`
        }
        paragraph = line
        continue
      }

      paragraph += (paragraph.endsWith('-') ? '' : ' ') + line.replace(/-$/, '')
    }

    if (paragraph) {
      organizedText += paragraph
    }

    /** Remove links and emails. */
    return organizedText.replace(
      /(?:https?:\/\/|www\.)\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      ''
    )
  }
}
