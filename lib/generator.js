const { getRepoList, getTagList } = require('./http');
const ora = require('ora');
const inquirer = require('inquirer');
const util = require('util');
const path = require('path');
const chalk = require('chalk');
const downloadGitRepo = require('download-git-repo');


// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    // 状态为修改为失败
    spinner.fail('Request failed, refetch ...');
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;

    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo(user) {
    const repoList = await wrapLoading(
      getRepoList,
      'waiting fetching template',
      user
    );
    if (!repoList?.length) {
      console.log(`\r\n   ${chalk.cyan('There is no repo')}`)
      return;
    };

    // 过滤我们需要的模板名称
    const repos = repoList.map((item) => item.name);

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.default.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project',
    });

    return repo;
  }

  async getTag(user, repo) {
    const repoTags = await wrapLoading(
      getTagList,
      'waiting fetch repo Tags',
      user,
      repo
    );

    if (!repoTags?.length) return;

    const tagList = repoTags.map((item) => item.name);


    const { tag } = await inquirer.default.prompt({
      name: 'tag',
      choices: tagList,
      type: 'list',
      message: 'please choose a tag',
    });

    return tag;
  }

  async download(user, repo, tag){

    // 1）拼接下载地址
    const requestUrl = `${user}/${repo}${tag?'#'+tag:''}`;

    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir)) // 参数2: 创建位置
  }

  // 核心创建逻辑
  async create() {
    const { user } = await inquirer.default.prompt({
      type: 'input',
      name: 'user',
      message: 'please input your github user name or set SSQLQIANBB',
      default: 'SSQLQIANBB',
    })
    const repo = await this.getRepo(user);

    const tag = await this.getTag(user, repo);

    await this.download(user, repo, tag)
    
    // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}

module.exports = Generator;
