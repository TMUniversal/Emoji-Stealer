// eslint-disable-next-line no-useless-escape
export const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{1,24}\/([-a-zA-Z0-9()@:%._\+~#?&//=]*)$/gm

export const emojiRegex = /^[\w]{2,32}$/gm

export const isUrl = (url: string): boolean => {
  return urlRegex.test(url)
}

export const isValidEmojiName = (name: string): boolean => {
  return emojiRegex.test(name)
}

export const validEmojiName = (name: string): string => {
  // Filter disallowed characters
  const emojiName = name.replace(/[^a-zA-Z0-9]/gi, '')
  if (!isValidEmojiName(emojiName)) return 'invalid_name'
  return emojiName
}
