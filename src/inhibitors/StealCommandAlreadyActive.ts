import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

export default class StealCommandAlreadyActive extends Inhibitor {
  constructor () {
    super('stealCommandAlreadyActive', {
      reason: 'alreadyActive',
      priority: 3,
      category: 'alreadyActive'
    })
  }

  exec (message: Message): boolean {
    // true > block
    // false > okay
    const activeStealCommands = this.client.activeStealCommands.filter(cmd => cmd.guild.id === message.guild.id)
    if (activeStealCommands.find(cmd => cmd.author.id === message.author.id)) {
      // Command is active
      message.channel.send('You are already doing that. Please wait until you last menu completes!')
      return true
    }
    return false
  }
}
