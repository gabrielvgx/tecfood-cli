import getPort, {portNumbers} from 'get-port';
console.log(getPort.portNumber);
let a = portNumbers(3000, 3100); 
console.log(a);
console.log(await getPort({port: Array.from(a)}));