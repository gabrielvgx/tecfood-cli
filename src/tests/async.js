import async from 'async';

let longProcess = function(time){
    return new Promise( resolve => {
        setTimeout(()=>{
            resolve(`Item resolvido: ${time/1000}`);
        }, time);
    });
};

let responses = [];
let promise = async.eachSeries([1,2,3], function(item, callback){
    longProcess(item*1000).then(function(response){
        responses.push(response);
        callback();
    });
});

promise.then( response => {
    console.log(responses);
});