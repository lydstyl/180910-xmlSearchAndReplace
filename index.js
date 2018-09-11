/**
 * Prend un export récent d'xml + un csv avec des colonnes key, originalTxt (ex FR) et val (ex ES)
 * Parcour les lignes du csv et remplace originalTxt par val (bien pour les traductions)
 * Créé un nouvel xml avec les valeurs remplacées
 * 
 * \n par &#13;
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
const fs = require('fs')
const htmlspecialchars = require('./htmlspecialchars2');

function createResultXml(xml){
    fs.writeFile(global.opts.xml.resultFilePath, xml, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log('the new .xml was saved with replaced value and is: ' + global.opts.xml.resultFilePath);
        console.log('IMPOTANT: you have to replace the catalog-id="storefront-fr-babyliss" with the lang you whant to import');
    }); 
}
function createNotFoundCsv(notFound){
    let csvArr = [];
    notFound.forEach( line => {
        csvArr.push({KEY: line.key, SEARCH: line.normalSearch, WITHSPECIALCHAR: line.speSearch});
    });
    const Json2csvParser = require('json2csv').Parser;
    const fields = ['KEY', 'SEARCH', 'WITHSPECIALCHAR'];
    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(csvArr);
    fs.writeFile('./notFound.csv', csv, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log('the notFound.csv was saved !');
    }); 
}

getJsonFromCsv();
setTimeout(() => {
    fs.readFile(global.opts.xml.fileName, 'utf8', function (err, xml) {
        if (err) {
            return console.log(err);
        }
        let includesNb = 0;
        let replaceNb = 0;
        let notFound = [];
        global.jsonObj.forEach(line => {
            let sr = {
                key: line[global.opts.csv.header.key],
                s: {
                    normal: '>' + line[global.opts.csv.header.originalTxt] + '<',
                    lang: ' xml:lang="'+ global.opts.lang.from +'">' + line[global.opts.csv.header.originalTxt] + '<',
                    default: ' xml:lang="x-default">' + line[global.opts.csv.header.originalTxt] + '<',
                    normalSpe: '>' + htmlspecialchars(line[global.opts.csv.header.originalTxt]) + '<',
                    langSpe: ' xml:lang="'+ global.opts.lang.from +'">' + htmlspecialchars(line[global.opts.csv.header.originalTxt]) + '<',
                    defaultSpe: ' xml:lang="x-default">' + htmlspecialchars(line[global.opts.csv.header.originalTxt]) + '<',
                },
                r: {
                    normal: '>' + htmlspecialchars(line[global.opts.csv.header.val]) + '<',
                    lang: ' xml:lang="'+ global.opts.lang.to +'">' + htmlspecialchars(line[global.opts.csv.header.val]) + '<',
                    default: ' xml:lang="x-default">' + htmlspecialchars(line[global.opts.csv.header.val]) + '<',
                }
            }
            if (xml.includes(sr.s.normal) || xml.includes(sr.s.normalSpe)) {
                ++ includesNb;
                if (xml.includes(sr.s.lang)) {
                    xml = xml.replace(sr.s.lang, sr.r.lang)
                    ++ replaceNb;
                    // console.log(`LANG-REPLACING ${sr.s.lang} --> ${sr.r.lang}`);
                }
                else if (xml.includes(sr.s.langSpe)){
                    xml = xml.replace(sr.s.langSpe, sr.r.lang)
                    ++ replaceNb;
                }
                else if(xml.includes(sr.s.default)){
                    xml = xml.replace(sr.s.default, sr.r.lang)
                    ++ replaceNb;
                    // console.log(`DEFAULT-REPLACING ${sr.s.default} --> ${sr.r.lang}`);
                }else if(xml.includes(sr.s.defaultSpe)){
                    xml = xml.replace(sr.s.defaultSpe, sr.r.lang)
                    ++ replaceNb;
                }
                else{
                    if (xml.includes(sr.s.normal)) {
                        xml = xml.replace(sr.s.normal, sr.r.normal)
                        ++ replaceNb;
                    }else if(xml.includes(sr.s.normalSpe)){
                        xml = xml.replace(sr.s.normalSpe, sr.r.normal)
                        ++ replaceNb;
                    }
                    // console.log(`NORMAL-REPLACING ${sr.s.normal} --> ${sr.r.normal}`);
                }
            }else{
                notFound.push(
                    {
                        key: sr.key,
                        normalSearch: sr.s.normal,
                        speSearch: sr.s.normalSpe
                    }
                );
            }
        });
        createResultXml(xml);
        createNotFoundCsv(notFound);
        console.log(`surely found (includesNb): ${includesNb}`);
        console.log(`succesRate = replaceNb / global.jsonObj.length = ${replaceNb} / ${global.jsonObj.length} = ${replaceNb / global.jsonObj.length}`);
        console.log('notFound: ' + notFound.length + ' --> see notFound.csv and do them manualy');
    });
}, 3000);