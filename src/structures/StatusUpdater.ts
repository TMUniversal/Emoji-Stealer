import { ActivityOptions, Presence } from 'discord.js'
import _ from 'lodash'
import { isUrl } from '../util/Validators'
import BotClient from '../client/BotClient'
import VariableParser from '../util/VariableParser'
import Axios from 'axios'

const defaultStatuses: Array<ActivityOptions> = [
  { type: 'PLAYING', name: 'with {users} users' },
  { type: 'LISTENING', name: '{users} users' },
  { type: 'WATCHING', name: 'over {users} users' },
  { type: 'PLAYING', name: 'in {guilds} servers' },
  { type: 'WATCHING', name: '{website}' },
  { type: 'PLAYING', name: '{prefix}help for help' },
  { type: 'WATCHING', name: '{guilds} servers' }
]

export default class StatusUpdater {
  private client: BotClient;
  private parser: VariableParser;
  public statusUrl?: string;
  public statuses: ActivityOptions[];
  private _statuses: ActivityOptions[];
  /**
   * A status updater that can pull from the internet
   * @param {BotClient} client discord.js (extending) client
   * @param {VariableParser} parser an instance of the variable parser
   * @param {Array<ActivityOptions> | String} statuses Either an array of ActivityOptions or a url to download such an array from.
   * @example const StatusUpdater = new StatusUpdater(client, parser,
   * [
   *   { type: 'PLAYING', name: 'with {users} users'},
   *   { type: 'WATCHING', name: '{guilds} guilds'},
   *   ...
   * ])
   *
   * @example const StatusUpdater = new StatusUpdater(client, parser, 'https://example.com/statuses.json')
   */
  constructor (client: BotClient, parser: VariableParser, statuses?: ActivityOptions[] | string) {
    this.client = client
    this.parser = parser
    if (statuses) {
      if (typeof statuses === 'string') {
        if (!isUrl(statuses)) throw new Error('Invalid statuses URL')
        this.statusUrl = statuses
      } else if (_.isArray(statuses)) this._statuses = statuses
      else throw new Error('Invalid status options.')
    }
  }

  private async _getStatuses (): Promise<ActivityOptions[]> {
    if (this._statuses) return this._statuses
    else if (this.statusUrl) {
      const statuses = await Axios.get(this.statusUrl)
      this._statuses = statuses.data
      return this._statuses
    } else return defaultStatuses
  }

  private async getStatuses (): Promise<ActivityOptions[]> {
    this.statuses = await this._getStatuses()
    return this.statuses
  }

  /**
   * Trigger a status update
   * @returns {Promise<Presence>}
   */
  public async updateStatus (activity?: ActivityOptions, shardId?: number): Promise<Presence> {
    const $activity = activity || await this._chooseActivity()
    if (shardId) $activity.shardID = shardId
    return this.client.user.setActivity($activity)
  }

  private async _chooseActivity (): Promise<ActivityOptions> {
    const info = (await this.getStatuses())[~~(Math.random() * this.statuses.length)]
    const details: ActivityOptions = { ...info, type: info.type || 'PLAYING', name: this.parser.parse(info.name) || 'a game' }

    return details
  }
}
