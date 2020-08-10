import { EventEmitter } from 'events'

export default class CustomEventEmitter extends EventEmitter {
  protected static _instance: CustomEventEmitter;

  public static get instance (): CustomEventEmitter {
    return this._instance || new this()
  }

  public constructor () {
    super()
    if ((this.constructor as typeof CustomEventEmitter)._instance) {
      throw new Error('Can not create multiple instances of singleton.')
    }

    (this.constructor as typeof CustomEventEmitter)._instance = this

    this.emit('ready')
  }
}
