var express = require('express');
var router = express.Router();

function safeRead(variable)
{   //console.log('var:\n',variable)
//console.log(type(variable))
    if(variable !== undefined && variable !== '' && variable !== null)
    {
        return variable.split("'").join("''");
    }
    return undefined;
}

module.exports = {
    router: router, safeRead: safeRead
};