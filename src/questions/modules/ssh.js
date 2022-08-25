import prompts from 'prompts';
import gitlab from '../../util/gitlab.js';
import UtilSsh from '../../util/ssh.js';

const ssh = {
    name: 'SSH',
    async handleSshKeys(){
        let sshList = await gitlab.listSSH();
        if(Array.isArray(sshList) && sshList.length) {
            let choices = sshList.map( sshInfo => ({title: sshInfo.title, value: sshInfo.id}));
            const STYLE = '\n\t';
            const hint = STYLE.concat(choices.map( ({title}) => title).join(STYLE));
            const { operation, title, keyToDelete } = await prompts([
                {
                    type: 'select',
                    name: "operation",
                    message: "SSH",
                    hint,
                    choices: [
                        { title: "Adicionar", value: "ADD" },
                        { title: "Excluir", value: "DELETE"},
                        { title: "Atualizar", value: "RELOAD"},
                        { title: "Voltar", value: "BACK"},
                    ],
                    initial: 0
                },
                {
                    type: prev => prev === 'ADD' ? 'text' : null,
                    name: 'title',
                    message: "Título: ",
                    initial: `GENERATED_BY_CLI_${(new Date()).getTime()}`
                },
                {
                    type: prev => prev === 'DELETE' ? 'select' : null,
                    name: "keyToDelete",
                    message: "SSH a ser deletada: ",
                    choices
                }
            ]);
            switch( operation ) {
                case "ADD":
                    if( title ){
                        let sshText = await UtilSsh.createSSH(gitlab.email);
                        sshText = sshText.substring(sshText.indexOf('ssh')).replace('\n', '');
                        await gitlab.createSSH(title, sshText);
                    }
                    break;
                case "DELETE":
                    if( keyToDelete ) {
                        await gitlab.deleteSSH(keyToDelete);
                    }
                    break;
                case "RELOAD":
                    return this.handleSshKeys();
                default:
                    return null;
            }
            return this.handleSshKeys();
        }
    },
    async execute(){
        const { host, email, token } = await prompts([
            {
                type: 'text',
                name: 'host',
                message: 'Host (Repositorio Remoto)',
                initial: 'http://gitlab.teknisa.com'
            },
            {
                type: 'text',
                name: 'email',
                message: 'Email: '
            },
            {
                type: 'text',
                name: "token",
                message: "Token (GitLab): "
            }
        ]);
        let response = [];
        if (host && email && token) {
            gitlab.host = host;
            gitlab.token = token;
            gitlab.email = email;
            await this.handleSshKeys();
            // response = sshList;
            // console.log(sshList);
        }
        return response;
    }
}

export default ssh;