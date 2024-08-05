#! /usr/bin/env node

const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const { program, Option } = require('commander');
const figlet = require('figlet');
const chalk = require('chalk');

// const program = new Command();

// 分隔符
// program
//   .option('--first')
//   .option('-s, --separator <char>');

// program.parse();

// const options = program.opts();
// const limit = options.first ? 1 : undefined;
// console.log(program.args[0].split(options.separator, limit), options.separator, limit);

// .option()方法来定义选项，同时可以附加选项的简介。
// 每个选项可以定义一个短选项名称（-后面接单个字符）和一个长选项名称（--后面接一个或多个单词），使用逗号、空格或|分隔。

// 通过program.parse(arguments)方法处理参数，
// 没有被使用的选项会存放在program.args数组中。
// 该方法的参数是可选的，默认值为process.argv
// https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md
// program
//   .command('split')
//   .description('split substring')
//   program.addHelpText('beforeAll', `
//     Example call:
//     $ custom-help --help`)
//   .argument('<string>', 'string to split')
//   .option('--first', 'display first string')
//   .option('-s --separator <char>', 'separator character', ',')
//   .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue')
//   .addOption(new Option('-d, --drink <size>', 'drink size').choices(['small', 'medium', 'large']))
//   .action((str, options) => {
//     const limit = options.first ? 1 : undefined;

//     console.log(str.split(options.separator, limit));
//     console.log(program.opts());
//   });

program
  // 定义命令和参数
  .command('create <app-name>')
  .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    // 打印执行结果
    // console.log('name:',name,'options:',options)

    require('./lib/create.js')(name, options);
  });

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g --get <value>', 'get value')
  .option('-s --set <name> <value>', 'set value')
  .action(runConfig);

function runConfig(str, opts) {
  console.log(opts, str)
}

program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option)
  })

program
  // 配置版本号信息
  .version(`v${require('./package.json').version}`)
  .usage('<command> [option]');


program
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('ssq', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`node-cli <command> --help`)} for detailed usage of given command\r\n`)
  })


// 解析用户执行命令传入参数
program.parse(process.argv);

// inquirer.default
//   .prompt([
//     {
//       type: 'input',
//       name: 'name',
//       message: 'Your name',
//       default: 'node-cli',
//     },
//   ])
//   .then((answer) => {
//     const destUrl = path.join(__dirname, 'templates');

//     const cwdUrl = process.cwd();

//     fs.readdir(destUrl, (err, files) => {
//       if (err) throw err;

//       files.forEach((file) => {
//         // 使用 ejs 渲染对应的模版文件
//         // renderFile（模版文件地址，传入渲染数据）
//         ejs.renderFile(path.join(destUrl, file), answer).then((data) => {
//           // 生成 ejs 处理后的模版文件
//           fs.writeFileSync(path.join(cwdUrl, file), data);
//         });
//       });
//     });
//   });

// console.log('my cli working...');
