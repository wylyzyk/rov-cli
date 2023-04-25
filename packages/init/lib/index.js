"use strict";

import Command from "@rovls/command";
import { log } from "@rovls/utils";
import { createTemplate } from "./createTemplate.js";
import { downloadTemplate } from "./downloadTemplate.js";
import { installTemplate } from "./installTemplate.js";

class InitCommand extends Command {
  get command () {
    return "init [name]";
  }

  get description () {
    return "initial project";
  }

  get options () {
    return [
      ["-f, --force", "是否强制更新", false],
      ["-t, --type <type>", "项目类型(project / page)"],
      ["-tp, --template <template>", "项目名称"]
    ];
  }

  async action ([name, opts]) {
    log.verbose("init", name, opts);
    // 1. 选择项目模板, 生成项目信息
    const selectTem = await createTemplate(name, opts);
    // 2. 下载项目模板至缓存目录
    await downloadTemplate(selectTem);
    // 3. 安装项目模板至项目目录
    installTemplate(selectTem, opts);
  }
}

function Init (instance) {
  return new InitCommand(instance);
}

export default Init;
