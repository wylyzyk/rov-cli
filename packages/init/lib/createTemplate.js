import { homedir } from "node:os";
import path from "node:path";
import { getLatestVersion, log, makeInput, makeList } from "@rovls/utils";

const ADD_TEMPLATE = [
  { name: "vue3", value: "template-vue3", npmName: "@imooc.com/template-vue3", version: "1.0.1" },
  { name: "react18", value: "template-react18", npmName: "@imooc.com/template-react18", version: "1.0.0" },
  {
    name: "vue-element-admin",
    value: "template-vue-element-admin",
    npmName: "@imooc.com/template-vue-element-admin",
    version: "1.0.0"
  }
];

const TYPE_VALUE = {
  PROJECT: "project",
  PAGE: "page"
};

const ADD_TYPE = [
  { name: "项目", value: TYPE_VALUE.PROJECT },
  { name: "页面", value: TYPE_VALUE.PAGE }
];

const CACHE_HOME = ".rov";

// 获取创建类型
function getAddType () {
  return makeList({
    choices: ADD_TYPE,
    message: "请选择初始化类型",
    defaultValue: TYPE_VALUE.PROJECT
  });
}

function getAddName () {
  return makeInput({
    message: "请输入项目的名称",
    defaultValue: "Project Name"
  });
}

function getAddTemplate () {
  return makeList({
    choices: ADD_TEMPLATE,
    message: "请选择项目模板",
    defaultValue: "template-vue3",
    validate (val) {
      if (val.length > 0) {
        return true;
      }
      return "项目名称必须输入";
    }
  });
}

function makeTargetPath () {
  return path.resolve(`${ homedir() }/${ CACHE_HOME }`, "addTemplate");
}

export const createTemplate = async (name, opts) => {
  console.log(opts)
  const { type = null, template = null } = opts;
  const addType = type ? type : await getAddType();
  log.verbose("addType", addType);
  if (addType === TYPE_VALUE.PROJECT) {
    const addName = name ? name : await getAddName();
    log.verbose("addName", addName);

    let selectTemp = null;
    if (template) {
      selectTemp = ADD_TEMPLATE.find(t => t.value === template);
      if (!selectTemp) {
        throw new Error("项目模板不存在");
      }
    } else {
      const tem = await getAddTemplate();
      selectTemp = ADD_TEMPLATE.find(_ => _.value === tem);
      log.verbose("addTemplate", tem);
      log.verbose("selectTemplate", selectTemp);
    }
    // 获取最新版本库
    const version = await getLatestVersion(selectTemp.npmName);
    log.verbose(version);
    selectTemp.version = version;
    const targetPath = makeTargetPath();
    return {
      type: addType,
      name: addName,
      template: selectTemp,
      targetPath
    };
  } else {
    throw new Error(`创建的项目类型 ${ addType } 不支持`);
  }
};
