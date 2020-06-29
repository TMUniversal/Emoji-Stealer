/* eslint-disable no-unused-vars */
import { Command } from 'discord-akairo'
import { Message, Collection } from 'discord.js'
import { MessageEmbed } from '../../structures/MessageEmbed'

export default class HelpCommand extends Command {
  public constructor () {
    super('help', {
      aliases: ['help', '?'],
      category: 'basic',
      description: {
        content: 'Show help',
        usage: 'help [command]',
        examples: [
          'help',
          'help steal',
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
        .setFooter(this.client.user.username)
        .setTimestamp()

      for (const [id, category] of this.client.commandHandler.categories) {
        helpEmbed.addField(`**${id[0].toUpperCase() + id.slice(1)}**`, '`' + category.array().join('` `') + '`')
      }

      return message.util.send(helpEmbed)
    } else {
      const cmd = this.client.commandHandler.findCommand(command)
      if (!cmd) {
        return message.util.send('That\'s not a valid command!')
      }

      const embed = new MessageEmbed()
        .setTitle(cmd.aliases[0])
        .setDescription(cmd.description.content)
        .addField('Aliases', '`' + cmd.aliases.join('` `') + '`', true)
        .addField('Usage', `\`${cmd.description.usage}\``, true)
        .addField('Examples', '`' + cmd.description.examples.join('`\n`') + '`')
        .setFooter(this.client.user.username)
        .setTimestamp()

      return message.util.send(embed)
    }
  }
}
