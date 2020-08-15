import { join } from 'path'
import { Snowflake } from 'discord.js'
const file = require('../data.json')
const pkg: PackageJson = require('../package.json')

interface ConfigFile {
  version: string
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

interface PackageJson {
  name: string
  version: string
  description: string
  main: string
  scripts: {
    [name: string]: string;
  }
  author: string
  contributors: Array<string>
  license: string
  devDependencies?: {
    [packageName: string]: string;
  }
  dependencies?: {
    [packageName: string]: string;
  }
  repository?: {
    type: string;
    url: string;
  }
  keywords?: Array<string>
  bugs?: {
    url: string;
  }
  homepage?: string
}

const config: ConfigFile = { version: pkg.version, ...file }

export default config
