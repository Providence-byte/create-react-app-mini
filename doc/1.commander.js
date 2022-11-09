/**
 * commander 包的使用
 * commander是一个完整的node.js命令行解决方案
 *
 */
const chalk = require("chalk"); //可以在终端显示颜色
const { Command } = require("commander"); //Command是一个类

let program = new Command("create-react-app-mini");

// console.log('@', process.argv);
// [
//   'D:\\Node.js\\node_version\\node.exe', // node 的可执行路径
//   'D:\\Users\\86150\\Desktop\\projects\\01coreTechnologyStack\\React\\React生态-zfjg\\create-react-app\\monorepo\\doc\\1.commander.js'
//   '-V'  // 现在设置了version，也不会显示 -V 了 ,但命令已经可用
//]
program
  .version("1.0.1") // 设置版本号
  .arguments("<must1> <must2> [option1] [option2]")
  .usage(
    `${chalk.red("<must1>")} ${chalk.yellow("<must2>")} ${chalk.blueBright(
      "[option1]"
    )} ${chalk.green("[option2]")} `
  )
  .action((must1, must2, option1, ...args) => {
    console.log(must1, must2, option1);
  })
  .parse(process.argv);
