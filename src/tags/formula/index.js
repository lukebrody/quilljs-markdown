import AbstractTag from '../AbstractTag'
import meta from './meta'

class formula extends AbstractTag {
  constructor (quillJS, options = {}) {
    super()
    this.quillJS = quillJS
    this.name = 'formula'
    this.pattern = this._getCustomPatternOrDefault(options, this.name, (value) => { return /(\$){2}(.+)(\$){2}/g.test(value) ? value : null })
    this.getAction.bind(this)
    this._meta = meta()
    this.activeTags = this._getActiveTagsWithoutIgnore(this._meta.applyHtmlTags, options.ignoreTags)
  }

  getAction () {
    return {
      name: this.name,
      pattern: this.pattern,
      action: (text, selection, pattern, lineStart) => new Promise((resolve) => {
        let match = /(\$){2}(.+)(\$){2}/g.exec(text)
        if (!match || !this.activeTags.length) {
          resolve(false)
          return
        }

        const [annotatedText] = match
        const startIndex = lineStart + match.index
        setTimeout(() => {
          this.quillJS.deleteText(startIndex, annotatedText.length)
          setTimeout(() => {
            const message = annotatedText.replace(/\$/g, '')
            this.quillJS.insertEmbed(startIndex, 'formula', message)
            this.quillJS.insertText(startIndex + 1, ' ')
            this.quillJS.setSelection(startIndex + 2)
            resolve(true)
          }, 0)
        }, 0)
      })
    }
  }
}

export default formula
