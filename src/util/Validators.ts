// eslint-disable-next-line no-useless-escape
export const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{1,24}\/([-a-zA-Z0-9()@:%._\+~#?&//=]*)$/gm

export const isUrl = (url: string): boolean => {
  return urlRegex.test(url)
}
