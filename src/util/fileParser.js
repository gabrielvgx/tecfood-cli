import fs from 'fs';
import YAML from 'js-yaml';

const fileParser = {
    yml2json( pathFileOrigin, pathToSave = null ){
        const json = YAML.load(fs.readFileSync(pathFileOrigin, 'utf8'));
        if( pathToSave ) {
            fs.writeFileSync(pathToSave, JSON.stringify(json));
        }
        return json;
    },
    json2yml( origin, originIsFile = false, pathToSave = null ){
        let json = {};
        if( originIsFile ) {
            JSON.parse(fs.readFileSync( pathFileOrigin , 'utf8'));
        } else {
            json = typeof origin === 'string' ? JSON.parse(origin) : origin;
        }
        let yaml = YAML.dump(json);
        if( pathToSave ) {
            fs.writeFileSync(pathToSave, yaml);
        }
        return yaml;
    }
}

const { yml2json, json2yml } = fileParser;

export {
    yml2json,
    json2yml
}

export default fileParser;