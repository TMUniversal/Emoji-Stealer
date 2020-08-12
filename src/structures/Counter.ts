// Counter for uploaded emojis

import { EventEmitter } from 'events'
import countapi from 'countapi-js'
import config from '../config'
import { WebhookLogger } from './WebhookLogger'
import CustomCounter from '@tmuniversal/counter'

enum UpdateType {
  Emoji,
  Pfp
}

export default class Counter {
  protected static _instance: Counter;
  private eventEmitter: EventEmitter;
  private logger: WebhookLogger;
  private emojiCounter: CustomCounter;
  private pfpCounter: CustomCounter;
  private updateInterval;

  public static get instance (): Counter {
    return this._instance || new this()
  }

  public constructor () {
    if ((this.constructor as typeof Counter)._instance) {
      throw new Error('Can not create multiple instances of singleton.')
    }

    (this.constructor as typeof Counter)._instance = this

    this.logger = WebhookLogger.instance

    this.eventEmitter = new EventEmitter()

    this.emojiCounter = new CustomCounter(0)
    this.pfpCounter = new CustomCounter(0)

    this.logger.silly('Counter', 'Initializing counter...')

    // periodically post updates

    this.updateInterval = setInterval(() => {
      this.eventEmitter.emit('postUpdates')
    }, 5 * 60 * 1000)

    // Event handlers

    this.eventEmitter.on('emoji', amount => this.emojiCounter.increment(amount))
    this.eventEmitter.on('pfp', () => this.pfpCounter.increment())

    this.eventEmitter.on('postUpdates', () => {
      this.logger.debug('Counter', 'Uploading counts\n', `Emojis: ${this.emojiCounter}\nPfps: ${this.pfpCounter}`)
      try {
        this._updateEmojiCount(this.emojiCounter.value).then(() => this.emojiCounter.reset())
        this._updatePfpCount(this.pfpCounter.value).then(() => this.pfpCounter.reset())
      } catch (err) {
        this.logger.error('Counter', err || new Error())
        throw err || new Error()
      }
    })

    this.eventEmitter.on('ready', async () => {
      this.logger.silly('Counter', 'Ready.')
      this.logger.debug('Counter', 'API Data:', `Emojis: ${await this.getEmojiCount()}`, `Pfps: ${await this.getPfpCount()}`)
    })

    this.eventEmitter.emit('ready')
  }

  public async getEmojiCount () {
    try {
      return (await countapi.get(config.counter.namespace, config.counter.emojiKey)).value
    } catch (err) {
      this.logger.error('CountAPI', err || new Error())
      throw err || new Error()
    }
  }

  public async getPfpCount () {
    try {
      return (await countapi.get(config.counter.namespace, config.counter.pfpKey)).value
    } catch (err) {
      this.logger.error('CountAPI', err || new Error())
      throw err || new Error()
    }
  }

  public updateEmojiCount (amount: number = 1) {
    if (amount === 0) return this.emojiCounter.value
    return this.emojiCounter.increment(amount)
  }

  public updatePfpCount (amount: number = 1) {
    if (amount === 0) return this.pfpCounter.value
    return this.pfpCounter.increment(amount)
  }

  public async _updateEmojiCount (amount: number) {
    try {
      return await this._updateCount(amount, config.counter.emojiKey)
    } catch (err) {
      this.logger.error('CountAPI', err || new Error())
      throw err || new Error()
    }
  }

  public async _updatePfpCount (amount: number) {
    try {
      return await this._updateCount(amount, config.counter.pfpKey, UpdateType.Pfp)
    } catch (err) {
      this.logger.error('CountAPI', err || new Error())
      throw err || new Error()
    }
  }

  public async _updateCount (amount: number, key: string, type: UpdateType = UpdateType.Emoji) {
    if (amount === 0) return this.logger.silly('Counter', 'Amount is 0, passing.')
    try {
      this.logger.silly('CountAPI', `Updating type ${type}: adding ${amount}`)
      return await this._update(config.counter.namespace, key, amount)
    } catch (err) {
      try {
        return await this._create(key, config.counter.namespace, amount, 0, 0, type === UpdateType.Emoji ? 50 : 1)
      } catch (err) {
        this.logger.error('CountAPI', err || new Error())
        throw err || new Error()
      }
    }
  }

  private async _update (namespace: string, key: string, amount: number): Promise<Object> {
    return await countapi.update(namespace, key, amount)
  }

  private async _create (key: string, namespace: string, value = 0, enable_reset = 0, update_lowerbound = -1, update_upperbound = 1): Promise<Object> {
    return await countapi.create({ key, namespace, value, enable_reset, update_lowerbound, update_upperbound })
  }

  public destroy () {
    this.logger.silly('Counter', 'Exiting...')
    clearInterval(this.updateInterval)
    this.eventEmitter.emit('postUpdates')
  }
}
