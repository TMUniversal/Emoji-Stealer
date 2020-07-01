import { Listener } from 'discord-akairo'
import { WebhookLogger } from '../structures/WebhookLogger'

export default class ReadyListener extends Listener {
  logger: WebhookLogger
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client'
    })
    this.logger = WebhookLogger.instance
  }

  public exec (): void {
    const users = this.client.users.cache.size
    const channels = this.client.channels.cache.size
    const guilds = this.client.channels.cache.size
    this.logger.info('CLIENT', `${this.client.user.tag} logged in with ${users} users, in ${channels} channels of ${guilds} guilds.`)
  }
}
