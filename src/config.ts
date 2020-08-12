import { join } from 'path'
import { Snowflake } from 'discord.js'
const file = require('../data.json')

interface IConfigFile {
  clientToken: string
  webhook: {
    id: Snowflake,
    secret: string
  }
  weebToken?: string
  dblToken?: string
  prefix: string
  owners: Snowflake | Array<Snowflake>
  userBlacklist: Array<Snowflake>
  counter: {
    namespace: string,
    emojiKey: string,
    pfpKey: string
  }
}

const config: IConfigFile = { ...file }

export default config
