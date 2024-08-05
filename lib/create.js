const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const Generator = require('./generator')



module.exports = async function (name, options) {
  // 验证是否正常取到值
  console.log('>>> create.js', name, options);

  const cwd = process.cwd();

  const targetAir = path.join(cwd, name);

  if (fs.existsSync(targetAir)) {
    if (options?.force) {
      await fs.remove(targetAir);
    } else {
      let action = await inquirer.default.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },{
              name: 'Cancel',
              value: false
            }
          ]
        }
      ]);

      // console.log(action)
      if (!action) return
      else {
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetAir);

  // 开始创建项目
  generator.create()
};
