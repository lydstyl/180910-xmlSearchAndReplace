/**
 * Prend un export récent d'xml + un csv avec des colonnes key, originalTxt (ex FR) et val (ex ES)
 * Parcour les lignes du csv et remplace originalTxt par val (bien pour les traductions)
 * Créé un nouvel xml avec les valeurs remplacées
 */

/////////////////////////////////
global.opts = {
    csv:{
        filePath: 'csv.csv',
        delimiters: [';'],
        header: {
            key: 'XPATH',
            originalTxt: 'ORIGINALTXT',
            val: 'TRANSLATEDTXT'
        }
    },
    xml:{
        fileName: 'xmlToSearchInto.xml',
        resultFilePath: './result.xml'
    },
    lang:{
        from: 'fr-FR',
        to: 'es-ES'
    }
}
/////////////////////////////////
const getJsonFromCsv = require('./get-json-from-csv');
getJsonFromCsv();
setTimeout(() => {
    const fs = require('fs')
    let stillToReplace = [];
    fs.readFile(global.opts.xml.fileName, 'utf8', function (err, xml) {
        if (err) {
            return console.log(err);
        }
        let replaceNb = 0;
        global.jsonObj.forEach(line => {
            let sr = {
                s: {
                    normal: '>' + line[global.opts.csv.header.originalTxt] + '<',
                    lang: ' xml:lang="'+ global.opts.lang.from +'">' + line[global.opts.csv.header.originalTxt] + '<',
                    default: ' xml:lang="x-default">' + line[global.opts.csv.header.originalTxt] + '<',
                },
                r: {
                    normal: '>' + line[global.opts.csv.header.val] + '<',
                    lang: ' xml:lang="'+ global.opts.lang.to +'">' + line[global.opts.csv.header.val] + '<',
                    default: ' xml:lang="x-default">' + line[global.opts.csv.header.val] + '<',
                }
            }
            if (xml.includes(sr.s.normal)) {
                if (xml.includes(sr.s.lang)) {
                    xml = xml.replace(sr.s.lang, sr.r.lang)
                    ++ replaceNb;
                    // console.log(`LANG-REPLACING ${sr.s.lang} --> ${sr.r.lang}`);
                }
                else if(xml.includes(sr.s.default)){
                    xml = xml.replace(sr.s.default, sr.r.lang)
                    ++ replaceNb;
                    // console.log(`DEFAULT-REPLACING ${sr.s.default} --> ${sr.r.lang}`);
                }
                else{
                    xml = xml.replace(sr.s.normal, sr.r.normal)
                    ++ replaceNb;
                    // console.log(`NORMAL-REPLACING ${sr.s.normal} --> ${sr.r.normal}`);
                }
            }else{
                console.log('NOT FOUND' + sr.s.normal);
                // add to manual list
            }
        });
        console.log(`\nreplaceNb / global.jsonObj.length = ${replaceNb} / ${global.jsonObj.length} = ${replaceNb / global.jsonObj.length}`);
    });
}, 3000);