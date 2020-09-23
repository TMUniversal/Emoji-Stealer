import { Command } from 'discord-akairo'
import { User, Message, Collection } from 'discord.js'
import { MessageEmbed } from '../../structures/MessageEmbed'
import { markdownCodifyArray } from '../../util/commonFunctions'
import config from '../../config'

export default class HelpCommand extends Command {
  public constructor () {
    super('help', {
      aliases: ['help'],
      category: 'basic',
      description: {
        content: 'Show help',
        usage: 'help [command]',
        examples: [
          'help',
          'help help'
        ]
      },
      ratelimit: 3,
      args: [
        {
          id: 'command',
          type: 'string',
          default: '',
          match: 'rest',
          description: 'The command to get help for'
        }
      ]
    })
  }

  public exec (message: Message, { command }: { command: string }): Promise<Message> {
    if (!command || command?.length === 0) {
      const helpEmbed = new MessageEmbed()
        .setTitle(this.client.user.username + ' Command List')
        .setFooter(`${this.client.user.username} v${config.version}`)
        .setTimestamp()

      for (const [id, category] of this.client.commandHandler.categories) {
        if (id === 'owner' && !this.hasAccess(message.author)) continue
        const commands = category.filter(c => c.ownerOnly ? this.hasAccess(message.author) : true).map(c => c.id)
        helpEmbed.addField(`**${id[0].toUpperCase() + id.slice(1)}**`, markdownCodifyArray(commands))
      }

      return message.util.send(helpEmbed)
    } else {
      const cmd = this.client.commandHandler.findCommand(command)
      if (!cmd || (cmd.ownerOnly && !this.hasAccess(message.author))) {
        return message.util.send('Unknown command!')
      }

      const embed = new MessageEmbed()
        .setTitle(cmd.aliases[0])
        .setDescription(cmd.description.content)
        .addField('Aliases', markdownCodifyArray(cmd.aliases), true)
        .addField('Usage', `\`${cmd.description.usage}\``, true)
        .addField('Examples', markdownCodifyArray(cmd.description.examples, '\n'))
        .setFooter(`${this.client.user.username} v${config.version}`)
        .setTimestamp()

      return message.util.send(embed)
    }
  }

  private hasAccess (user: User): boolean {
    // Check if they have perms
    // message.guild.member(user).permissions.has(command.userPermissions)
    return this.client.isOwner(user)
  }
}
