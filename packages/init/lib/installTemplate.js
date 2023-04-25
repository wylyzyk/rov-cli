import path from "node:path";
import fse from "fs-extra";
import { pathExistsSync } from "path-exists";
import { log } from "@rovls/utils";
import ora from "ora";
import { glob } from "glob";

function getCacheFilePath (targetPath, template) {
  return path.resolve(targetPath, "node_modules", template.npmName, "template");
}

function copyFile (targetPath, template, installDir) {
  const originFile = getCacheFilePath(targetPath, template);
  const fileList = fse.readdirSync(originFile);
  const spinner = ora("正在拷贝模板文件...").start();
  // 拷贝
  fileList.map(file => {
    fse.copySync(`${ originFile }/${ file }`, `${ installDir }/${ file }`);
  });
  spinner.stop();
  log.success("模板拷贝成功");
}

function ejsRender (path, template, name) {
  const { ignore = ["**/public/**"] } = template
  const ejsData = {
    name // 项目名称
  }
  glob('**', {
    cwd: path, nodir: true, ignore: [...ignore, "**/node_modules/**"]
  }, (err, files) => {
    files.forEach(file => {
      const filePath = path.join(path, file);
      ejs.renderFile(filePath, ejsData, (err, result) => {
        if (err) {
          log.error("err")
          return
        }
        fse.writeFileSync(filePath, result);
        console.log(err, result);
      })
    })
    console.log(files);
  })
}

export const installTemplate = (tem, opts) => {
  const { targetPath, name, template } = tem;
  const { force = false } = opts;

  // 获取当前执行目录
  const rootDir = process.cwd();
  // 确保 targetPath 存在
  fse.ensureDirSync(targetPath);
  const installDir = path.resolve(`${ rootDir }/${ name }`);
  // installDir 安装目录是否存在
  if (pathExistsSync(installDir)) {
    if (!force) {
      log.error(`当前目录下已存在 ${ installDir } 文件夹`);
      return;
    } else {
      fse.removeSync(installDir);
      fse.ensureDirSync(installDir);
    }
  } else {
    fse.ensureDirSync(installDir);
  }
  copyFile(targetPath, template, installDir);
  // 对模板进行ejs渲染
  ejsRender(installDir, template, name)
};
