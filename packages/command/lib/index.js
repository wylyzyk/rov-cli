"use strict";

class Command {
  constructor (instance) {
    if (!instance) {
      throw new Error("Command instance must not be null !");
    }
    this.program = instance;

    const cmd = this.program.command(this.command);
    cmd.description(this.description);
    cmd.hook("preAction", () => {
      this.preAction();
    });
    cmd.hook("postAction", () => {
      this.postAction();
    });
    if (this.options?.length > 0) {
      this.options.forEach(option => {
        cmd.option(...option);
      });
    }
    cmd.action((...args) => {
      this.action(args);
    });
  }

  get command () {
    throw new Error("command must be implement !");
  }

  get description () {
    throw new Error("description must be implement !");
  }

  get options () {
    return [];
  }

  get action () {
    throw new Error("action must be implement !");
  }

  preAction () {
    // console.log("pre action");
  }

  postAction () {
    // console.log("post action");
  }
}

export default Command;
