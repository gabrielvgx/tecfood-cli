import fs from 'fs';

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
    replaceFromMap(fileNameTemplate, objMnemonicAndValue){
        let file = this.readFile(fileNameTemplate);
        let newFileContent = file;
        Object.keys(objMnemonicAndValue).forEach( MNEMONIC => {
            const VALUE = objMnemonicAndValue[MNEMONIC];
            newFileContent = this.replaceMnemonic(newFileContent, MNEMONIC, VALUE);
        });
        let newFileName = fileNameTemplate.replace(/\.template/gi, '');
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