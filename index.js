/**
 * 
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
        // firstAndSecondLines: '<?xml version="1.0" encoding="UTF-8"?>\n<library xmlns="http://www.demandware.com/xml/impex/library/2006-10-31">',
        fileName: 'xmlToSearchInto.xml',
        resultFilePath: './result.xml'
    },
    lang:{
        from: 'fr-FR',
        to: 'es-ES'
    }
    // before:{
    //     search: 'xml:lang="fr-FR">',
    //     replace: 'xml:lang="es-ES">'
    // }
}
/////////////////////////////////

const getJsonFromCsv = require('./get-json-from-csv');
// const addSearchAndReplace = require('./add-search-and-replace');
// const createXml = require('./create-xml');

getJsonFromCsv();
setTimeout(() => {
    // pour chaque ligne du csv
    //     prendre la valeur fr et l'entourer de < et de >
    //     si elle est trouvée dans l'xml
    //         s'il y a xml:lang="fr-FR" ou xml:lang="x-default" devant 
    //             rechercher et remplacer en mettant xml:lang="es-ES" + la traduction (en mode /g)
    //         sinon
    //             remplacer sans mettre le es-ES en mode /g
    const fs = require('fs')
    let stillToReplace = [];
    fs.readFile(global.opts.xml.fileName, 'utf8', function (err, xml) {
        if (err) {
            return console.log(err);
        }
        global.jsonObj.forEach(line => {
            let search = '>' + line[global.opts.csv.header.originalTxt] + '<';
            let langSearch = ' xml:lang="fr-FR"' + search;
            let defaultSearch = ' xml:lang="x-default"' + search;

            let sr = { // search and replace obj
                s: {
                    normal: '>' + line[global.opts.csv.header.originalTxt] + '<',
                    lang: ' xml:lang="'+ global.opts.lang.from +'">' + line[global.opts.csv.header.originalTxt] + '<',
                    default: ' xml:lang="x-default">' + line[global.opts.csv.header.originalTxt] + '<',
                },
                r: {
                    normal: '>' + line[global.opts.csv.header.val] + '<',
                    lang: ' xml:lang="'+ global.opts.lang.to +'">' + line[global.opts.csv.header.val] + '<',
                }
            }
            if (xml.includes(sr.s.normal)) {
                if (xml.includes(sr.s.lang)) {
                    xml = xml.replace(sr.s.lang, sr.r.lang)
                    console.log(`Replacing ${sr.s.lang} --> ${sr.r.lang`);
                    
                }
                // else if(xml.includes(sr.s.default)){
                //     xml = xml.replace(sr.s.lang, sr.r.lang)
                // }
                else{
                    xml = xml.replace(sr.s.normal, sr.r.normal)
                }
            }
        });
    });
}, 3000);