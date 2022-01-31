import fs from 'fs';
import DockerMnemonicsHelper from './helpers/docker_mnemonics.js';

const mnemonic = {
    CHR_START: '<>',
    CHR_END: '<>',
    readFile( fileName ){
        return fs.readFileSync(fileName, 'utf-8');
    },
    writeFile( fileName, content ){
        fs.writeFileSync( fileName, content );
    },
    replaceMnemonic(str, mnemonic, value){
        const pattern = new RegExp(`${this.CHR_START}${mnemonic}${this.CHR_END}`, 'gi');
        return str.replace(pattern, value);
    },
    replaceFromMap(fileNameTemplate, objMnemonicAndValue, eventsCallback){
        let file = this.readFile(fileNameTemplate);
        const { onBeforeWrite } = eventsCallback;
        const ENV = Object.assign({}, objMnemonicAndValue, DockerMnemonicsHelper.run(objMnemonicAndValue));
        let newFileContent = file;
        Object.keys(ENV).forEach( MNEMONIC => {
            const VALUE = ENV[MNEMONIC];
            newFileContent = this.replaceMnemonic(newFileContent, MNEMONIC, VALUE);
        });
        let newFileName = fileNameTemplate.replace(/\.template/gi, '');
        if(typeof onBeforeWrite == 'function') newFileContent = onBeforeWrite.apply(null, [ newFileContent ]);
        this.writeFile( newFileName, newFileContent );
        return newFileContent;
    },
    listMnemonics(fileName){
        const fileContent = fs.readFileSync(fileName, 'utf-8');
        let mnemonics = fileContent.match(/<>.+<>/gi);
        if(mnemonics){
            let uniqueMnemonics = Array.from(new Set(mnemonics));
            return uniqueMnemonics.map( item => item.replace(/<>/gi, ''));
        } else {
            return [];
        }
    }
}

export default mnemonic;