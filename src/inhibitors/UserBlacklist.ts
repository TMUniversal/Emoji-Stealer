import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'
import configFile from '../config'

export default class UserBlacklist extends Inhibitor {
  constructor () {
    super('blacklist', {
      reason: 'blacklist',
      priority: 1,
      category: 'blacklists'
    })
  }

  exec (message: Message) {
    return configFile.userBlacklist.includes(message.author.id)
  }
}
