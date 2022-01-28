import fs from 'fs';

const mnemonic = {
    CHR_START: '<>',
    CHR_END: '<>',
    RELATIVE_BASE_PATH: '../../',
    readFile( fileName ){
        return fs.readFileSync(fileName, 'utf-8');
    },
    writeFile( fileName, content ){
        fs.writeFileSync( fileName, content );
    },
    replaceMnemonic(str, mnemonic, value){
        const pattern = new RegExp(`${this.CHR_START}${this.mnemonic}${CHR_END}`, 'gi');
        return str.replace(pattern, value);
    },
    replaceFromMap(fileNameTemplate, objMnemonicAndValue){
        fileNameTemplate = fileNameTemplate.replace('@', this.RELATIVE_BASE_PATH);
        let file = readFile(fileNameTemplate);
        let newFileContent = file;
        Object.keys(objMnemonicAndValue).forEach( MNEMONIC => {
            const VALUE = objMnemonicAndValue[MNEMONIC];
            newFileContent = this.replaceMnemonic(newFileContent, MNEMONIC, VALUE);
        });
        let newFileName = fileNameTemplate.replace(/\.template/gi, '');
        this.writeFile( newFileName, newFileContent );
        return newFileContent;
    }
}

export default mnemonic;