const chalk = require("chalk"); //可以在终端显示颜色
const spawn = require("cross-spawn"); // 是node的spawn和spawnSync的跨平台解决方案
// spawn可以用于调用系统上的命令
const { Command } = require("commander"); //Command是一个类
const fs = require("fs-extra"); //加强版的fs模块，可以对目录进行增删改查操作
const path = require("path");
const packageJSON = require("./package.json");
// 项目名字 来自命令行 例如 create-react-app app1 此处 app1 即为项目名字
let projectName;

async function init() {
  new Command(packageJSON.name)
    .version(packageJSON.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")}`)
    .action((name) => {
      projectName = name;
    })
    .parse(process.argv); // [node完整路径，当前node脚本所在路径]

  await createApp(projectName);
}

async function createApp(appName) {
  let root = path.resolve(appName); // 得到将要生成项目的绝对路径
  fs.ensureDirSync(appName); //确定目录存在，如果不存在，则创建
  console.log(`Creating a new React app in ${chalk.green(root)}.`);

  // 创建一个package.json对象
  let packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
  };
  // 写入文件
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  const originDirectory = process.cwd(); // 返回当前工作目录
  process.chdir(root); // change dir 改变工作目录

  // console.log('root', root);
  // console.log('originDirectory', originDirectory);
  // console.log('appName',appName);

  await run(root, originDirectory, appName);
}

/**
 *
 * @param {*} root 创建项目的路径
 * @param {*} appName 项目名
 * @param {*} originDirectory 原始的工作目录
 */
async function run(root, appName, originDirectory) {
  // 默认脚本
  let scriptsName = "react-scripts"; // cra生成的代码里，源文件编译，启动服务器都放在了react-scripts中
  // 默认模板
  let templateName = "cra-template";
  const allDependencies = ["react", "react-dom", scriptsName, templateName];

  console.log("Installing packages. This might take a couple of minutes.");
  console.log(
    `Installing ${chalk.cyan("react")}, ${chalk.cyan(
      "react-dom"
    )}, and ${chalk.cyan(scriptsName)}${` with ${chalk.cyan(templateName)}`}...`
  );
  // 拼接命令参数，执行依赖的安装
  await install(root, allDependencies);

  //项目根目录 项目名字 verbose是否显示详细信息 原始目录 模板名字cra-template
  let data = [root, appName, true, originDirectory, templateName];
  // 下文中process.argv[1]是一个数组，放的是 -- 后面从参数 即上一行中的data
  // 详细逻辑看executeNodeScript函数
  let source = `
        const init = require('${scriptsName}/scripts/init.js');
        init.apply(null, JSON.parse(process.argv[1]));
      `;
  await executeNodeScript({ cwd: process.cwd }, data, source);
  console.log("done");
  process.exit(0);
}

async function install(root, allDependencies) {
  return new Promise((resolve) => {
    const command = "yarn";
    let args = ["add", "--exact", ...allDependencies, "--cwd", root]; // 将命令放入一个数组中
    // 开启一个子进程,调用系统上的命令
    const child = spawn(command, args, { stdio: "inherit" }); // inherit 继承，表示子进程和父进程共享一个输入输出
    // 监听close事件，结束后调用该 reslove
    child.on("close", resolve);
  });
}

async function executeNodeScript({ cwd }, data, source) {
  return new Promise((resolve) => {
    //process.execPath 为 node 的可执行路径， 即 命令行中 node xxx.js
    const child = spawn(
      process.execPath,
      ["-e", source, "--", JSON.stringify(data)],
      {
        cwd,
        stdio: "inherit",
      }
    );
    child.on('close', resolve);
  });
}

module.exports = {
  init,
};
