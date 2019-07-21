class Parser {
  tokenize = (str: string): Array<string> =>
    str ? str.replace(/\\/g, "/").split("/") : [];

  getCommandLineArgs = (): any => this.parseCommands(process.argv.splice(2));

  parseCommands(commands: any): any {
    let [command, _file] = commands;
    const [prefix, postfix] = command.split(":");

    !_file && (_file = "");

    const splitIndex: number = _file.lastIndexOf("/");
    const nestedPath: string = _file.substring(0, splitIndex);
    const file: string = _file.substring(splitIndex + 1, _file.length);

    const path: string = `${(global as any).appRoot}/${nestedPath}`;

    return {
      prefix,
      postfix,
      file,
      path
    };
  }
}

export default new Parser();
