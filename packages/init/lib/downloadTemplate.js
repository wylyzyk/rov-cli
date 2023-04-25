import path from "node:path";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import ora from "ora";
import { log, printErrorLog } from "@rovls/utils";
import { execa } from "execa";

function getCacheDir (targetPath) {
  return path.resolve(targetPath, "node_modules");
}

function makeCacheDir (targetPath) {
  const cacheDir = getCacheDir(targetPath);
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir);
  }
}

async function downloadAddTemplate (targetPath, template) {
  const { version, npmName } = template;
  const installCommand = "npm";
  const installOption = ["install", `${ npmName }@${ version }`];
  const cwd = targetPath;
  log.verbose("install args", installOption);
  log.verbose("cwd", cwd);
  await execa(installCommand, installOption, { cwd });
}

export const downloadTemplate = async (temp) => {
  const { targetPath, template } = temp;
  makeCacheDir(targetPath);
  const spinner = ora("正在下载模板...").start();
  try {
    await downloadAddTemplate(targetPath, template);
    spinner.stop();
    log.success("下载模板成功");
  } catch (err) {
    spinner.stop();
    printErrorLog(err, "download template");
  }
};
