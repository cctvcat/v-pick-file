export type InputFileAttrs = {
  accept?: string | Array<string>
  capture?: string
  webkitdirectory?: boolean
  multiple?: boolean
  [key: string]: any
}

export function getFiles(opts: InputFileAttrs = {}) {
  const { accept, ...attrs } = opts

  const input = document.createElement('input')
  Object.keys(opts).forEach((key) => {
    input[key] = attrs[key]
  })

  input.type = 'file'
  if (accept) {
    input.accept = Array.isArray(accept) ? accept.join(',') : accept
  }

  return new Promise<File[]>((resolve) => {
    input.onchange = () => {
      input.onchange = null
      const files = Array.from(input.files!)
      input.value = ''
      resolve(files)
    }

    input.click()
  })
}