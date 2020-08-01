import _ from 'lodash'

export default class VariableParser {
  public data: VariableParserData;
  match: RegExp;
  /**
   * Parse in-string variables
   * @param {Object} data key-value object with variables to parse
   */
  public constructor (data: VariableParserData) {
    this.data = data
    this.match = /\{\w+\}/gui
  }

  /**
   * Parse in-string variables.
   * @param {String} input your text
   * @example parse("My app has {users} users.")
   * // => "My app has 69 users."
   * @returns {String} parsed input
   */
  public parse (input: string): string {
    const vars = input.match(this.match)
    const output = String(input)
    if (vars.length < 1) return input
    vars.forEach(element => {
      if (_.has(this.data, element)) {
        output.replace(new RegExp(element, 'gui'), this.data[element])
      }
    })
    return output
  }
}

interface VariableParserData {
  [variableName: string]: string
}
