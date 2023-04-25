import path from "node:path";
import { execa } from "execa";

const cli = path.join(__dirname, "../bin/cli.js");
const bin = () => (...args) => execa(cli, args);

/**
 * 运行错误命令
 */
test("run error command", async () => {
  const { stderr } = await bin()("iii");
  expect(stderr).toContain("unknown command: iii, maybe this is command is not register");
});

/**
 * 测试 help 命令
 */
test("should not throw error when use --help", async () => {
  let err = null;
  try {
    await bin()("--help");
  } catch (e) {
    err = e;
  }
  expect(err).toBe(null);
});

/**
 * 测试 version 命令
 */
test("show correct version", async () => {
  const { stdout } = await bin()("-V");
  expect(stdout).toBe(require("../package.json").version);
});

/**
 * 测试是否正确开启 debug 模式
 */
test("open debug mode", async () => {
  let errMsg = null;
  try {
    await bin()("--debug");
  } catch (err) {
    errMsg = err.message;
  }
  expect(errMsg).toContain("launch debug mode");
});
