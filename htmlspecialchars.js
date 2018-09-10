const htmlspecialchars = require('htmlspecialchars');

module.exports = function (str) {
    str = htmlspecialchars(str);
    str = str.replace('\n', '&#13;');
    return str;
}