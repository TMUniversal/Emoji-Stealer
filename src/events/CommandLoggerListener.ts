import { Message } from 'discord.js'
import { Listener, Command } from 'discord-akairo'
import { WebhookLogger } from '../structures/WebhookLogger'
import CustomEventEmitter from '../structures/CustomEventEmitter'

export default class CommandLoggerListener extends Listener {
  logger: WebhookLogger
  eventEmitter: CustomEventEmitter
  constructor () {
    super('commandStarted', {
      emitter: 'commandHandler',
      event: 'commandStarted',
      category: 'commandHandler'
    })
    this.logger = WebhookLogger.instance
    this.eventEmitter = CustomEventEmitter.instance
  }

  public exec (message: Message, command: Command, args?: any): Promise<void> {
    const isPrivate: boolean = !(message.guild)
    this.eventEmitter.emit('logCommand', command.id)
    return this.logger.info('Command Issued', `${message.author.tag}: ${isPrivate ? '(in DMs)' : `${message.guild.name}`} > ${command.id}`)
  }
}
