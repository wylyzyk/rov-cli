import { isDebug, log, printErrorLog } from "@rovls/utils";

// 监听普通错误
process.on("uncaughtException", e => printErrorLog(e, "error"));
// promise 错误
process.on("unhandledRejection", e => printErrorLog(e, "promise"));
