import fs from 'fs';
import path from 'path';

import { getAppRootPath } from './app.js';

//############################## SCRIPT NAO UTILIZADO #########################

const git = {
    repositoriesJson: JSON.parse(
        fs.readFileSync(
            path.join(
                getAppRootPath(), 
                'src', 'config', 'repositories.json'
            ), 
            'utf-8'
        )
    ),
    clone( projectName ){
        const {
            repositories, 
            requiredModules = [], 
            modules = []
        } = this.repositoriesJson[projectName];
        requiredModules.forEach(function(moduleName){
            this.clone(moduleName);
        }.bind(this));
    }
};
git.clone('tecfood');
export default git;