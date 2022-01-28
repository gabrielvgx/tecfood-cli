import { confirm, text } from '../template_option.js';

const birt = {
    async execute(){
        console.log(text);
        const resp = await text("Container name", 'birt-container');

    }
}
export default birt;