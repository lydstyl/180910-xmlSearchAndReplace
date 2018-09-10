// pour chaque ligne du csv
//     prendre la valeur fr et l'entourer de < et de >
//     si elle est trouvée dans l'xml
//         s'il y a xml:lang="fr-FR" ou xml:lang="x-default" devant 
//             rechercher et remplacer en mettant xml:lang="es-ES" + la traduction (en mode /g)
//         sinon
//             remplacer sans mettre le es-ES en mode /g