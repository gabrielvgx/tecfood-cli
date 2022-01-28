import ora from 'ora';
import chalk from 'chalk';
import prompts from 'prompts';
import question from './src/questions/question.js'
question.executeQuestions();
// import templateOption from './src/questions/template_option.js'
// const spinner = ora(`Loading ${chalk.red('unicorns')}`).start();
// let options = templateOption.confirm("Utilizar configuracao padrao?");
// const resp = await prompts(options);
// const envOpts = {
//   type: 'multiselect',
//   name: 'value',
//   message: 'Ambientes a serem configurados',
//   choices: [
//     { title: 'Birt', value: 'BIRT' },
//     { title: 'Apps', value: 'APP', },
//     { title: 'PHP/Apache (image used in cloud9)', value: 'BASEDEV', selected: true }
//   ],
//   min: 1,
//   hint: '- Space to select. Return to submit'
// };
// const confirmOpts = {
//   type: 'text',
//   name: 'value',
//   message: 'Birt Container Name',
//   initial: "birt-container"
// };
// let response = await prompts(envOpts);
// let response2 = await prompts(confirmOpts);
// console.log(question.getTypes());
// console.log(response);
// setTimeout(_=>{
//     spinner.succeed("Finish");
//     spinner.fail("Fail");
//     spinner.warn("Warn");
//     spinner.info("Info");
//     spinner.stop()
// }, 3000);