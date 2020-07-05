import { Message } from 'discord.js'
import { Listener, Command } from 'discord-akairo'
import { WebhookLogger } from '../structures/WebhookLogger'

export default class CommandLoggerListener extends Listener {
  logger: WebhookLogger
  constructor () {
    super('commandStarted', {
      emitter: 'commandHandler',
      event: 'commandStarted',
      category: 'commandHandler'
    })
    this.logger = WebhookLogger.instance
  }

  public exec (message: Message, command: Command, args?: any): Promise<void> {
    const isPrivate: boolean = !(message.guild)
    return this.logger.info('Command Issued', `${message.author.tag}: ${isPrivate ? '(in DMs)' : `${message.guild.name}`} > ${command.id}`)
    // TODO: Upload usage to BotStat API
  }
}
