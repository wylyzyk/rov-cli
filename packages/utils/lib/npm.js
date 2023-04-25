import urlJoin from "url-join";
import log from "./log.js";

// 获取 npm package 信息
async function getNpmInfo (npmName) {
  const registry = "https://registry.npmjs.org";
  const url = urlJoin(registry, npmName);
  try {
    const response = await fetch(url, { method: "get" });
    if (response.ok && response.status === 200) {
      return await response.json();
    } else {
      return Promise.reject(new Error("检查网络连接"));
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

// 获取 npm package 的最新版本
export async function getLatestVersion (npmName) {
  try {
    const data = await getNpmInfo(npmName);
    if (!data["dist-tags"] || !data["dist-tags"].latest) {
      log.error("没有 latest 版本");
      return Promise.reject(new Error("can not find latest version!"));
    }
    return data["dist-tags"].latest;
  } catch (err) {
    log.error(err);
  }
}
