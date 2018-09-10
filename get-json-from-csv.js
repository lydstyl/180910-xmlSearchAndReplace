const csv = require('csvtojson');

module.exports = function getJsonFromCsv() {
    let test = csv({
        delimiter: global.opts.csv.delimiters
    })
    .fromFile(global.opts.csv.filePath)
    .then((jsonObj)=>{
        global.jsonObj = jsonObj;
    })
}