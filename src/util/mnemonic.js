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
    replaceFromMap(fileNameTemplate, objMnemonicAndValue, eventsCallback){
        let file = this.readFile(fileNameTemplate);
        const { onBeforeWrite } = eventsCallback;
        const ENV = Object.assign({}, objMnemonicAndValue, this.getComplexMnemonics(objMnemonicAndValue));
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
    getComplexMnemonics( ENV ){
        const ENV_MAP = Object.assign({}, ENV);
        const IMAGE_MNEMONICS = [
            { SERVICE_NAME: 'BIRT',    MNEMONIC_IMAGE_NAME: 'BIRT_IMAGE'    },
            { SERVICE_NAME: 'BASEDEV', MNEMONIC_IMAGE_NAME: 'BASEDEV_IMAGE' },
            { SERVICE_NAME: 'APP',     MNEMONIC_IMAGE_NAME: 'APP_IMAGE'     },
        ];
        IMAGE_MNEMONICS.forEach( MNEMONIC_STRUCTURE => {
            const { SERVICE_NAME, MNEMONIC_IMAGE_NAME } = MNEMONIC_STRUCTURE;
            const { REGISTRY, IMAGE, TAG} = ENV_MAP.SERVICES[SERVICE_NAME];
            let IMAGE_DESCRIPTION = (
                ( REGISTRY && IMAGE && TAG && `${REGISTRY}/${IMAGE}:${TAG}` ) || 
                ( REGISTRY && IMAGE &&        `${REGISTRY}/${IMAGE}`        ) ||
                (             IMAGE && TAG && `${IMAGE}:${TAG}`             ) ||
                (             IMAGE &&        `${IMAGE}`                    ) || 
                ''
            );
            ENV_MAP[MNEMONIC_IMAGE_NAME] = IMAGE_DESCRIPTION;
        });
        return ENV_MAP;
    },
    replaceSpecificMnemonics(fileNameTemplate, ENV){
        replaceDockerMnemonics(fileNameTemplate, ENV);
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