import { homedir } from 'node:os'
import path from 'node:path'
import { pathExistsSync } from "path-exists";
import fse from 'fs-extra'
import { makePassword } from "../inquirer.js";
import fs from "fs";
import { log } from '@rovls/utils'

const CACHE_HOME = ".rov";
const TEMP_TOKEN = ".token";
const TEMP_PLATFORM = ".git_platform";

function createTokenPath () {
  return path.resolve(homedir(), CACHE_HOME, TEMP_TOKEN);
}

function createPlatformPath () {
  return path.resolve(homedir(), CACHE_HOME, TEMP_PLATFORM);
}

export function getGitPlatform () {
  if (pathExistsSync(createPlatformPath())) {
    return fs.readFileSync(createPlatformPath()).toString()
  }
  return null;
}

class GitServer {
  constructor () {
  }

  async init () {
    // 判断token是否录入
    const tokenPath = createTokenPath()
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath).toString()
    } else {
      this.token = await this.getToken()
      fs.writeFileSync(tokenPath, this.token);
    }
    log.verbose('token', this.token)
    log.verbose("token path", tokenPath)
  }

  getToken () {
    return makePassword({
      message: "请输入token信息"
    })
  }

  savePlatform (platform) {
    this.platform = platform;
    fs.writeFileSync(createPlatformPath(), platform);
  }

  getPlatform () {
    return this.platform;
  }
}

export default GitServer;
