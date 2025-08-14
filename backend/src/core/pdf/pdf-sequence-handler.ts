export type SpeechMark = {
  time: number
  type: 'sentence' | 'viseme'
  start?: number
  end?: number
  value: string
}

export class TimeSequenceHandler {
  private accumulatedTime = 0

  /**
   * Finds the last viseme in a speech mark array
   */
  private findLastViseme(speechMarks: SpeechMark[]): SpeechMark | null {
    for (let i = speechMarks.length - 1; i >= 0; i--) {
      if (speechMarks[i].type === 'viseme') {
        return speechMarks[i]
      }
    }
    return null
  }

  /**
   * Processes an array of speech marks and adjusts their timestamps based on accumulated time
   * and the last viseme of the previous speech mark
   */
  processSpeechMarks(speechMarks: SpeechMark[]): SpeechMark[] {
    const adjustedSpeechMarks = speechMarks.map((mark) => ({
      ...mark,
      time: mark.time + this.accumulatedTime
    }))

    if (adjustedSpeechMarks.length > 0) {
      const lastViseme = this.findLastViseme(adjustedSpeechMarks)
      if (lastViseme) {
        this.accumulatedTime = lastViseme.time
      }
    }

    return adjustedSpeechMarks.filter((mark) => mark.type === 'sentence')
  }

  /**
   * Processes multiple files and combines them while maintaining chronological order
   */
  processFiles(files: SpeechMark[][]): SpeechMark[] {
    let allSpeechMarks: SpeechMark[] = []

    for (const file of files) {
      const processedMarks = this.processSpeechMarks(file)
      allSpeechMarks = allSpeechMarks.concat(processedMarks)
    }

    return allSpeechMarks.sort((a, b) => a.time - b.time)
  }

  /**
   * Resets the accumulated time to 0
   */
  reset(): void {
    this.accumulatedTime = 0
  }

  /**
   * Gets the current accumulated time
   */
  getAccumulatedTime(): number {
    return this.accumulatedTime
  }
}
