import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { MessageEmbed } from '../../structures/MessageEmbed'

export default class InviteCommand extends Command {
  public constructor () {
    super('invite', {
      aliases: ['invite', 'addbot'],
      category: 'basic',
      description: {
        content: 'Generate an invite link for the bot.',
        usage: 'invite',
        examples: [
          'invite'
        ]
      },
      ratelimit: 3
    })
  }

  public exec (message: Message): Promise<Message> {
    return message.util.send(MessageEmbed.common({ author: message.member.user }).setDescription(`[Add me to your server](https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=1074072576&scope=bot)`))
  }
}
