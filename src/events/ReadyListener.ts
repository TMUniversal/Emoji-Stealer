import { Listener } from 'discord-akairo'

export default class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client'
    })
  }

  public exec (): void {
    // eslint-disable-next-line no-console
    console.log(`${this.client.user.tag} is logged in`)
  }
}
