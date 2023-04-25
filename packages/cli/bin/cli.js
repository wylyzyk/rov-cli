#!/usr/bin/env node
"use strict";

import importLocal from "import-local";
import { fileURLToPath } from "node:url";
import entry from "../lib/index.js";
import { log } from "@rovls/utils";

const __filename = fileURLToPath(import.meta.url);

// 判断项目中是否存在当前脚手架, 如果有使用本地版本
if (importLocal(__filename)) {
  log.info("cli", "使用本地的 rovls 版本");
} else {
  entry(process.argv.slice(2));
}
