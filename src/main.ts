import Parser from "./parser/parser";
import FileManager from "./filemanager/filemanager";
import { Maybe } from "./types/Maybe";

(global as any).appRoot = process.cwd();

enum ECommands {
  HELP = "help",
  EXAMPLES = "examples",
  CREATE = "create"
}

const commands: Map<string, any> = new Map<string, any>();

commands.set(
  ECommands.HELP,
  (_: any): void =>
    console.log("λ commands available:\nexamples\ncreate:what <name>")
);

commands.set(
  ECommands.EXAMPLES,
  (_: any): void =>
    console.log(
      "λ usage:\ncreate:project foo\ncreate:class src/foo/Bar\ncreate:header foo\ncreate:cpp foo"
    )
);

commands.set(
  ECommands.CREATE,
  ({ file, path, postfix }: any): void => {
    FileManager.create(path, file, postfix);
  }
);

export default function main(): void {
  const args: any = Parser.getCommandLineArgs();

  const action: Maybe<any> = commands.get(args.prefix);

  if (action) {
    action(args);
  } else {
    console.log(
      "λ Unknown command, use 'vscpp help' to see available commands."
    );
  }
}
