import Constants from "../constants/Constants"

export default class Timeline {
  constructor() {
    this.commands = {}
  }
  add(time, code) {
    this.commands[time] = code
  }
  get(time) {
    let instructions = [];
    let code = this.commands[time]
    if(code) {
      let commands = code.split(" ")
      commands.forEach((command) => {
        let splitCommands = command.split("|")
        let action = splitCommands[0]
        let duration = parseInt(splitCommands[1]) * 10
        instructions.push({
          action: action,
          duration: duration,
        })
      })
      return(instructions)
    }
  }
}
