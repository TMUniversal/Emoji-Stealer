import _ from 'lodash'

export default class VariableParser {
  public data: VariableParserData
  public identifiers: string
  public match: RegExp
  public identifierRegex: RegExp
  /**
   * Parse in-string variables
   * @param {Object} data key-value object with variables to parse
   * @param {String} identifiers pair of variable identifiers. defaults to {}
   */
  public constructor (data: VariableParserData, identifiers: string = '{}') {
    if (identifiers.length !== 2) throw new Error('"identifiers" must have a length of 2')
    this.data = data
    this.identifiers = identifiers
    this.match = new RegExp(`\\${this.identifiers[0]}\\w+\\${this.identifiers[1]}`, 'gu')
    this.identifierRegex = new RegExp(`[\\${identifiers[0]}\\${identifiers[1]}]`, 'gu')
  }

  /**
   * Parse in-string variables.
   * @param {String} input your text
   * @example const Parser = new VariableParser({ users: 69 })
   * Parser.parse("My app has {users} users.")
   * // => "My app has 69 users."
   * @returns {String} parsed input
   */
  public parse (input: string): string {
    let output = String(input)
    const vars = output.match(this.match)
    if (!vars || !vars[0]) { return input }
    vars.forEach(element => {
      const key = element.replace(this.identifierRegex, '')
      if (_.has(this.data, key)) {
        output = output.replace(`${this.identifiers[0]}${key}${this.identifiers[1]}`, this.data[key].toString())
      }
    })
    return output
  }

  /**
   * Get the data object
   * @returns {Object} The data object
   */
  public getData (): VariableParserData {
    return this.data
  }

  /**
   * Set the data object, this is an override.
   * @param {Object} data Override data
   * @returns {Object} the new data object
   */
  public _setData (data: VariableParserData): VariableParserData {
    this.data = data
    return this.data
  }

  /**
   * Update/add properties
   * @param {Object} data Update data
   * @returns {Object} the new data object
   */
  public updateData (data: VariableParserData): VariableParserData {
    return _.merge(this.data, data)
  }
}

interface VariableParserData {
  [variableName: string]: string | number
}
