import fs from 'fs';
import YAML from 'js-yaml';

const TEST_PATH = '/home/gabrielvgx/workfolder/tecfood-cli/src/tests/';
// const doc = YAML.load(fs.readFileSync('/home/gabrielvgx/workfolder/tecfood-cli/src/docker/docker-compose.yml', 'utf8'));

let doc = JSON.parse(fs.readFileSync(TEST_PATH + 'docker-compose.json', 'utf8'));

fs.writeFileSync(TEST_PATH + 'docker-compose.yml', YAML.dump(doc));