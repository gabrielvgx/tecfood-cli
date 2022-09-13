import prompts from 'prompts';

const CliCommonQuestions = {
    async backOrExit(){
        const { backOrExit } = await prompts({
            type: 'select',
            name: 'backOrExit',
            message: 'Deseja voltar ao menu anterior ou sair?',
            choices: [
                { title: 'Voltar', description: '', value: 'BACK' },
                { title: 'Sair',       description: '',  value: 'EXIT' },
            ],
            initial: 0,
        });  
        return backOrExit || 'EXIT';
    },
    async exit(){
        const { confirmExit } = await prompts({
            type: "confirm",
            name: "confirmExit",
            message: "Tem certeza que deseja sair do cli?",
            initial: true
        });
        return confirmExit ?? true;
     }
};

export default CliCommonQuestions;