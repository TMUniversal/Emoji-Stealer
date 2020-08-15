import { Command } from 'discord-akairo'
import { Activity, Message } from 'discord.js'

export default class SetStatusCommand extends Command {
  public constructor () {
    super('setstatus', {
      aliases: ['setstatus'],
      category: 'owner',
      description: {
        content: 'Set the bot\'s status',
        usage: 'setstatus [message]',
        examples: [
          'setstatus',
          'setstatus [Hello there]'
        ]
      },
      ratelimit: 3,
      args: [
        {
          id: 'status',
          type: 'string',
          default: '',
          match: 'rest',
          description: 'The status message'
        }
      ],
      ownerOnly: true
    })
  }

  public async exec (message: Message, args: { status: string }) {
    let newStatus: Activity
    if (!args.status || args.status === '' || args.status == null) newStatus = (await this.client.statusUpdater.updateStatus()).activities[0]
    else newStatus = (await this.client.statusUpdater.updateStatus({ name: args.status })).activities[0]
    return message.util.send(`Status changed to: \`${newStatus.type} ${newStatus.name}\``)
  }
}
