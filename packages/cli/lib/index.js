import createInitCommand from "@rovls/init";
import createInstallCommand from '@rovls/install'
import { createCLI } from "./createCLI.js";
import "./exception.js"

export default function (args) {
  const program = createCLI();
  createInitCommand(program);
  createInstallCommand(program);
  // 解析参数
  program.parse(process.argv);
};
