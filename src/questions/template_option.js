import prompts from 'prompts';

const templateOption = {
    async confirm(message, defaultValue = true, onlyOptions = false){
        if(!defaultValue && defaultValue !== false && defaultValue !== 0) defaultValue = true;
        let options = {
            type: 'confirm',
            name: 'value',
            message,
            initial: defaultValue
        };
        if( onlyOptions ) {
            return options;
        }
        return await prompts(options);
    },
    async text(message, defaultValue = "Empty", onlyOptions = false){
        if(!defaultValue && defaultValue !== false && defaultValue !== 0) defaultValue = "Empty";
        let options = {
            type: 'text',
            name: 'value',
            message,
            initial: defaultValue
        };
        if( onlyOptions ) {
            return options;
        }
        return await prompts(options);
    },
    async password( message = "Password" ){
        let options = {
            type: 'password',
            name: 'value',
            message
        };
        return await prompts(options);
    }
}
const {
    confirm,
    text
} = templateOption;
export default templateOption;
export {
    confirm,
    text
};