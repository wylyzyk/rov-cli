"use strict";

import log from "./log.js";
import isDebug from "./debug.js";
import { makeList, makeInput, makePassword } from "./inquirer.js";
import { getLatestVersion } from "./npm.js";
import Github from "./git/Github.js";
import { getGitPlatform } from "./git/GitServer.js";
import { http } from './http.js'

const printErrorLog = (e, type) => {
  if (isDebug()) {
    // 调试模式下, 显示详细信息
    log.error(type, e);
  } else {
    // 正常模式下, 显示主要错误信息
    log.error(type, e.message);
  }
};

export {
  log, isDebug, makeList, makeInput, makePassword, getLatestVersion, printErrorLog, Github, getGitPlatform, http
};
