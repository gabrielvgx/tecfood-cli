import prompts from 'prompts';
import UtilApp from '../../util/app.js';

const apk = {
    name: 'APK',
    async getQuestionProfile(defaultTitle = '',  defaultPath = ''){
        const { title, path } = await prompts([
            {
                type: 'text',
                name: 'title',
                message: "Nome do Perfil: ",
                initial: defaultTitle
            },
            {
                type: prev => !!prev ? 'text' : null,
                name: "path",
                message: "Caminho para o App-Cordova: ",
                initial: defaultPath
            }
        ]);
        return { title, path };
    },
    async handleProfilesCordova(){
        let app = UtilApp.loadAppConfig('app.json').apps || {};
        let profileNames = Object.keys(app).sort();
        let appList = profileNames.map( appTitle => {
            return ({title: appTitle, value: app[appTitle]});
        });
        if(Array.isArray(appList) ) {
            let choices = appList.map( appProfile => ({title: appProfile.title, value: appProfile.value}));
            const STYLE = '\n\t';
            const hint = STYLE.concat(choices.map( ({title}) => title).join(STYLE));
            const { operation, profileToBuild, keyToDelete, profileToEdit } = await prompts([
                {
                    type: 'select',
                    name: "operation",
                    message: "Apps",
                    hint,
                    choices: [
                        { title: "Adicionar App", value: "ADD" },
                        { title: "Editar App", value: "EDIT" },
                        { title: "Excluir App", value: "DELETE"},
                        { title: "Atualizar Lista", value: "RELOAD"},
                        { title: "Build Debug", value: "BUILD_DEBUG"},
                        { title: "Build Release", value: "BUILD_RELEASE"},
                        { title: "Voltar", value: "BACK"},
                    ],
                    initial: 0
                },
                {
                    type: prev => ['BUILD_DEBUG', 'BUILD_RELEASE'].includes(prev) ? 'select' : null,
                    name: "profileToBuild",
                    message: "App",
                    choices
                },
                {
                    type: prev => prev === 'DELETE' ? 'select' : null,
                    name: "keyToDelete",
                    message: "Perfil a ser deletado: ",
                    choices
                },
                {
                    type: prev => prev === 'EDIT' ? 'select' : null,
                    name: "profileToEdit",
                    message: "Perfil a ser editado: ",
                    choices
                }
            ]);
            switch( operation ) {
                case "ADD":
                    const { title, path } = await this.getQuestionProfile();
                    if( title && path ){
                        let appConfig = UtilApp.loadAppConfig('app.json');
                        appConfig.apps = appConfig.apps || {};
                        appConfig.apps[title] = path;
                        UtilApp.updateAppConfig('app.json', appConfig);
                        return this.handleProfilesCordova();
                    }
                    break;
                case "EDIT":
                    if( profileToEdit ) {
                        let appConfig = UtilApp.loadAppConfig('app.json');
                        appConfig.apps = appConfig.apps || {};
                        let profile = choices.find( ({value}) => profileToEdit == value).title;
                        const {
                            title,
                            path
                        } = await this.getQuestionProfile(profile, profileToEdit);
                        delete appConfig.apps[profile];
                        appConfig.apps[title] = path;
                        UtilApp.updateAppConfig('app.json', appConfig);
                    } else {
                        console.log(choices);
                    }
                    return this.handleProfilesCordova();
                case "DELETE":
                    if( keyToDelete ) {
                        let profile = choices.find( ({value}) => keyToDelete == value).title;
                        let appConfig = UtilApp.loadAppConfig('app.json');
                        appConfig.apps = appConfig.apps || {};
                        delete appConfig.apps[profile];
                        UtilApp.updateAppConfig('app.json', appConfig);
                    }
                    return this.handleProfilesCordova();
                case "RELOAD":
                    return this.handleProfilesCordova();
                case "BUILD_DEBUG":
                    break;
                case "BUILD_RELEASE":
                    break;
                default:
                    return null;
            }
            return this.handleProfilesCordova();
        }
    },
    async execute(){
        await this.handleProfilesCordova();
        return null;
    }
}

export default apk;