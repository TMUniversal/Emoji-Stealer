import { ActivityOptions, Presence } from 'discord.js'
import _ from 'lodash'
import { isUrl } from '../util/Validators'
import BotClient from '../client/BotClient'
import VariableParser from '../util/VariableParser'
import Axios from 'axios'
import { WebhookLogger } from './WebhookLogger'
import config from '../config'
import Counter from './Counter'

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
  private client: BotClient
  private parser: VariableParser
  public statusUrl?: string
  private _statuses: ActivityOptions[]
  private logger: WebhookLogger
  private isReady: boolean
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
  constructor (client: BotClient, statuses?: ActivityOptions[] | string) {
    this.client = client
    this.parser = new VariableParser({ website: 'tmuniversal.eu', prefix: config.prefix, version: config.version })
    if (statuses) {
      if (typeof statuses === 'string') {
        if (!isUrl(statuses)) throw new Error('Invalid statuses URL')
        this.statusUrl = statuses
      } else if (_.isArray(statuses)) this._statuses = statuses
      else throw new Error('Invalid status options.')
    }

    this.logger = WebhookLogger.instance

    this.isReady = false

    this._init()
  }

  private async _init () {
    this.logger.silly('StatusUpdater', 'Initializing Status Updater.')
    this._getStatuses().then(() => {
      this.isReady = true
      this.logger.silly('StatusUpdater', 'Ready.')
    }).catch(err => {
      this.logger.error('StatusUpdater', err)
    })
  }

  /**
   * Try to download the latest ActivityOptions data.
   */
  private async _getStatuses (): Promise<ActivityOptions[]> {
    if (this.statusUrl) {
      this.logger.silly('StatusUpdater', 'Attempting to download...')
      const statuses = await Axios.get(this.statusUrl)
      this._statuses = statuses.data
      this.logger.silly('StatusUpdater', 'Download successful.')
      return this._statuses
    } else {
      this.logger.warn('StatusUpdater', 'Something went wrong while downloading and/or parsing the data.')
      return defaultStatuses
    }
  }

  /**
   * Update the variable parser with the latest data from the client.
   */
  private async _updateParserData () {
    this.parser.updateData({ users: this.client.users.cache.size, guilds: this.client.guilds.cache.size, channels: this.client.channels.cache.size })
    this.parser.updateData({ emojis: await this.client.counter.getEmojiCount(), pfps: await this.client.counter.getPfpCount() })
  }

  /**
   * An array of possible status messages (as ActivityOptions)
   * @type ActivityOptions[]
   */
  public get statuses (): ActivityOptions[] {
    // If the status download isn't done yet, serve the default statuses instead.
    if (!this.isReady) return defaultStatuses
    return this._statuses
  }

  /**
   * Trigger a status update
   * @returns {Promise<Presence>}
   */
  public updateStatus (activity?: ActivityOptions, shardId?: number): Promise<Presence> {
    this._updateParserData()
    const $activity = this.getSafeActivity(activity) || this._chooseActivity()
    if (shardId) $activity.shardID = shardId
    return this.client.user.setActivity($activity)
  }

  private _chooseActivity (): ActivityOptions {
    return this.getSafeActivity(this.statuses[~~(Math.random() * this.statuses.length)])
  }

  private getSafeActivity = (info: ActivityOptions): ActivityOptions => {
    if (!info) return
    return { ...info, type: info.type || 'PLAYING', name: this.parser.parse(info.name) || 'a game' }
  }
}
