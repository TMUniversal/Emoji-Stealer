import moment, { Moment } from 'moment'

export function toDiscordMarkdownLink (url: string, name?: string) {
  return `[${name || url}](${url})`
}

export function dateFormat (date: Date | Moment = new Date(), options = { fromNow: true, suffix: true }) {
  const sMoment = moment(date)
  const formatted = sMoment.format('DD/MM/YYYY HH:mm:ss')
  if (options.fromNow) return `${formatted} (${sMoment.fromNow(!options.suffix)})`
  return formatted
}

export function markdownCodifyArray (input: string[] | number[], separator = ' ') {
  return '`' + input.join(`\`${separator}\``) + '`'
}
