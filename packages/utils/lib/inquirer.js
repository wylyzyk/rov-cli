import inquirer from "inquirer";

function make ({
  choices,
  defaultValue,
  message = "请选择",
  type = "list",
  require = true,
  mask = "*",
  validate,
  pageSize,
  loop
}) {
  const options = {
    name: "name",
    choices, default: defaultValue, message, require, mask, validate, pageSize, loop, type
  };
  if (type === "list") {
    options.choices = choices;
  }
  const prompt = inquirer.createPromptModule();
  return prompt(options, {}).then(answer => answer.name);
}

export function makeList (params) {
  return make({ ...params });
}

export function makeInput (params) {
  return make({ type: "input", ...params });
}

export function makePassword (params) {
  return make({ type: "password", ...params });
}
