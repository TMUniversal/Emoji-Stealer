import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

export default class UserBlacklist extends Inhibitor {
  constructor () {
    super('blockAll', {
      reason: 'blockAll',
      priority: 1,
      category: 'blacklists'
    })
  }

  exec (message: Message) {
    return (message.author.id !== this.client.ownerID && /beta/i.test(this.client.user.username))
  }
}
