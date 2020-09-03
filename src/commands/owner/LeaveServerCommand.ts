import { Command } from 'discord-akairo'
import { Activity, Message } from 'discord.js'
import { MessageEmbed } from '../../structures/MessageEmbed'
import { WebhookLogger } from '../../structures/WebhookLogger'

export default class LeaveServerCommand extends Command {
  logger: WebhookLogger = WebhookLogger.instance
  public constructor () {
    super('leave', {
      aliases: ['leave', 'leaveserver'],
      category: 'owner',
      description: {
        content: 'Leave a server',
        usage: 'leave [server id]',
        examples: [
          'leave',
          'leave 620623994877509648'
        ]
      },
      ratelimit: 3,
      args: [
        {
          id: 'serverId',
          type: 'string',
          match: 'phrase',
          description: 'The id of the server to leave'
        },
        {
          id: 'confirmed',
          prompt: {
            start: 'Are you sure you want to leave that server? Type `yes` to confirm.',
            retries: 1
          },
          match: 'rest'
        }
      ],
      ownerOnly: true
    })
  }

  public async exec (message: Message, args: { serverId: string, confirmed: 'yes' | string }) {
    if (!args.serverId || args.serverId === '' || args.serverId == null) return message.util.send('No server id given.')

    if (args.confirmed !== 'yes') return message.util.reply(`Will not leave *${args.serverId}*.`)

    const guild = this.client.guilds.resolve(args.serverId)

    if (!guild?.member(this.client.user.id)) return message.util.reply(`I am not a member of *${args.serverId}*.`)

    guild.leave().then(guild => {
      return message.util.send(new MessageEmbed({ description: `Success. I have left ${guild.name}`, color: 'GREEN' }))
    }).catch((err) => {
      this.logger.error(err || new Error())
      return message.util.send(new MessageEmbed({ description: `Error leaving guild. I have not left ${guild.name}`, color: 'RED' }))
    })
  }
}
