import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { program } from "commander";
import fse from "fs-extra";
import { log } from "@rovls/utils";
import semver from "semver";
import chalk from "chalk";

// 当前文件路径
const __filename = fileURLToPath(import.meta.url);
// 当前文件所在目录
const __dirname = dirname(__filename);
const pkgPath = resolve(__dirname, "../package.json");
const pkg = fse.readJsonSync(pkgPath);

const LOWEST_NODE_VERSION = "14.0.0";

function checkNodeVersion () {
  log.verbose(process.version);
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(chalk.red(`current node version: ${ process.version }, need node >= ${ LOWEST_NODE_VERSION }`));
  }
}

function preAction () {
  // 检查 node 版本
  checkNodeVersion();
}

export const createCLI = () => {
  log.info("version", pkg.version);
  // 初始化 commander
  // 基本信息
  program.name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .hook("preAction", preAction);

  program.on("command:*", (o) => {
    log.error(`unknown command: ${ o[0] }, maybe this is command is not register`);
  });

  program.on("option:debug", () => {
    // 获取 --debug 选项
    if (program.opts().debug) {
      log.verbose("debug", "launch debug mode")
    }
  })
  // // builder handler
  // program.command("init [name]")
  //   .description("init project")
  //   .option("-f, --force", "是否强制更新", false)
  //   .action((name, opts) => {
  //     console.log(name, opts, "init")
  //   })
  return program;
};
