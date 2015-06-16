/**
 * @class ESParamVal
 * @constructor @paramId @paramVal
 */

var _und = require("underscore");

function ESParamVal(paramId, paramVal) {
    this.paramVal = paramVal;
    this.paramCode = paramId;
}

ESParamVal.prototype.getExecuteVal = function() {
    return this.paramVal;
};


function ESNumericParamVal(paramId, paramVal) {
    //call super constructor
    ESParamVal.call(this, paramId, paramVal);
}

//inherit from ESParamval SuperClass
ESNumericParamVal.prototype = Object.create(ESParamVal.prototype);


ESNumericParamVal.prototype.getExecuteVal = function() {
    /*
    ESParamVal.prototype.getExecuteVal.apply(this, arguments);
    console.log('augmenting pattern');
    */
    return "ESNumeric(" + this.paramVal.oper.value + ", '" + this.paramVal.value + "')";
}



function ESParamValues(vals) {
    this.setParamValues(vals);
}

ESParamValues.prototype.setParamValues = function(vals) {

    var x = this;
    for (var prop in x) {

        if (x.hasOwnProperty(prop)) {
            if (delete x[prop]) {
                console.log("DELETED property ", prop);
            }
        }
    };



    if (!vals || !_und.isArray(vals) || vals.length == 0) {
        return;
    }


    vals.forEach(function(element, index, array) {
        x[element.paramCode] = element;
    });
}

ESParamValues.prototype.getExecuteVals = function() {
    var x = this;
    var f = x.getOwnPropertyNames();
    console.log(f.length);

    var v = _und.reduce(Object.getOwnPropertyNames(x), function(st, pName) {
        var p = x[pName];

        if (p.paramVal) {
            console.log("** ", p);

            st[p.paramCode] = p.getExecuteVal();
        }
        return st;
    }, {});
    return v;
}

//usage
var p1 = new ESParamVal("p1", 98.97);
var p2 = new ESParamVal("p2", "Hello");
var p3 = new ESNumericParamVal("p3", {
    value: 87.95,
    oper: {
        caption: ">=",
        value: 'GE'
    }
});


var pall = new ESParamValues([p1, new ESParamVal("cd", null), p2, p3]);
var tbo = new ESParamValues([p3]);

console.log(tbo);
console.log("--------");
console.log(pall);

/*
for (var prop in tbo) {
    if (tbo.hasOwnProperty(prop)) {
        if (delete tbo[prop]) {
            console.log("DELETED property ", prop, " with value ", tbo[prop]);
        }
    }
}
*/

tbo.setParamValues([p2]);
console.log("--------");
console.log(tbo);
var st = pall.getExecuteVals();
//console.log(st);
