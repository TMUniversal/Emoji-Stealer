import { Listener } from 'discord-akairo'
import { WebhookLogger } from '../structures/WebhookLogger'
import { Guild } from 'discord.js'

export default class GuildCreateListener extends Listener {
  logger: WebhookLogger
  constructor () {
    super('guildCreate', {
      emitter: 'client',
      event: 'guildCreate',
      category: 'client'
    })
    this.logger = WebhookLogger.instance
  }

  public exec (guild: Guild): void {
    this.logger.info('GUILD JOIN', `${this.client.user.tag} has joined ${guild.name}`)
  }
}
