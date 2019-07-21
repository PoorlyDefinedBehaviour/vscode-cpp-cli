import Parser from "../parser/parser";

import mkdirp from "mkdirp";
import fse from "fs-extra";

import classSchema from "../schemas/class";
import tasksSchema from "../schemas/tasks";
import mainSchema from "../schemas/main";

import { Maybe } from "../types/Maybe";

enum EActions {
  PROJECT = "project",
  HEADER = "header",
  CLASS = "class",
  CPP = "cpp"
}

class FileManager {
  private readonly actions: Map<string, any> = new Map<string, any>();

  constructor() {
    this.actions.set(
      EActions.PROJECT,
      (path: string, file: string): void => this.createProject(path, file)
    );
    this.actions.set(
      EActions.HEADER,
      (path: string, file: string): void => this.createHeader(path, file)
    );
    this.actions.set(
      EActions.CLASS,
      (path: string, file: string): void => this.createClass(path, file)
    );
    this.actions.set(
      EActions.CPP,
      (path: string, file: string): void => this.createCppFile(path, file)
    );
  }

  createAndWriteToFile(path: string, fileName: string, content: string): void {
    mkdirp(path, (error: any): void => {});

    fse.outputFile(`${path}\\${fileName}`, content);
  }

  create(path: string, file: string, postfix: string): void {
    const action: Maybe<any> = this.actions.get(postfix);

    if (action) {
      action(path, file);
    } else {
      console.log(`λ Failed to create ${file}`);
    }
  }

  createProject(path: string, projectName: string): void {
    mkdirp(`${path}/${projectName}/src`, (error: any): void => {});
    mkdirp(`${path}/${projectName}/bin`, (error: any): void => {});
    this.createAndWriteToFile(
      `${path}/${projectName}/.vscode/`,
      "tasks.json",
      tasksSchema()
    );

    this.createAndWriteToFile(
      `${path}/${projectName}/src`,
      "main.cpp",
      mainSchema()
    );
  }

  createClass(path: string, fileName: string): void {
    const { header, cpp } = classSchema(fileName);
    this.createAndWriteToFile(path, `${fileName}.h`, header);
    this.createAndWriteToFile(path, `${fileName}.cpp`, cpp);
    this.updateTasks(`${path}/${fileName}`);
  }

  createHeader(path: string, fileName: string): void {
    this.createAndWriteToFile(path, `${fileName}.h`, "");
  }

  createCppFile(path: string, fileName: string): void {
    this.createAndWriteToFile(path, `${fileName}.cpp`, "");
    this.updateTasks(`${path}/${fileName}`);
  }

  async updateTasks(path: string): Promise<void> {
    const file = await fse.readJSON(".vscode/tasks.json");

    const command = await JSON.stringify(file.tasks[1].command);
    const commandOutput = command.slice(command.indexOf("-o"));
    const commandInput = command.replace(new RegExp(commandOutput, "g"), "");

    const tokenizedRoot = Parser.tokenize((global as any).appRoot);
    const tokenizedPath = Parser.tokenize(path);

    const tokenizedNewFilePath = tokenizedPath
      .splice(
        tokenizedPath.indexOf(tokenizedRoot[tokenizedRoot.length - 1]) + 1
      )
      .filter((element: string): boolean => element !== "");

    const updatedCommandInput =
      commandInput + tokenizedNewFilePath.join("/") + ".cpp ";

    file.tasks[0].command = file.tasks[1].command = (
      updatedCommandInput + commandOutput
    ).replace(/['"]/g, "");

    this.createAndWriteToFile(
      (global as any).appRoot + "/.vscode",
      "tasks.json",
      JSON.stringify(file)
    );
  }
}

export default new FileManager();
