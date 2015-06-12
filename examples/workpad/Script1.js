
/**
 * @class ESParamVal
 * @constructor @paramId @paramVal
 */

var _und = require("underscore");

function ESParamVal(paramId, paramVal) {
    this.paramId = paramId;
    this.paramVal = paramVal;
}

ESParamVal.prototype.getExecuteVal = function () {
    return this.paramVal;
};


function ESNumericParamVal(paramId, paramVal, paramOper)
{
    //call super constructor
    ESParamVal.call(this, paramId, paramVal);
    this.paramOper = paramOper;
}

//inherit from ESParamval SuperClass
ESNumericParamVal.prototype = Object.create(ESParamVal.prototype);


ESNumericParamVal.prototype.getExecuteVal = function () {
    /*
    ESParamVal.prototype.getExecuteVal.apply(this, arguments);
    console.log('augmenting pattern');
    */
    return "ESNumeric(" + this.paramOper + ", '" + this.paramVal + "')";
}



function ESParamValues() {
    this.pVals = [];
}

ESParamValues.prototype.setParamValues = function(vals)
{
    if (!vals || !_und.isArray(vals) || vals.length == 0) {
        this.pVals = [];
        return;
    }
    this.pVals = vals;
}

ESParamValues.prototype.getExecuteVals = function () {
    console.log("pvals = ", JSON.stringify(this.pVals));
    var v = _und.reduce(this.pVals, function (st, p) {
        st[p.paramId] = p.getExecuteVal();
        return st;
    }, {});
    return v;
}

//usage
var p1 = new ESParamVal("p1", 98.97);
var p2 = new ESParamVal("p2", "Hello");
var p3 = new ESNumericParamVal("p3", 76.54, 'GE');

console.log(p3.getExecuteVal());


var pall = new ESParamValues();
pall.setParamValues([p1, p2, p3]);
pall.pVals.push(new ESNumericParamVal("p4", 176.54, 'LT'));

console.log(JSON.stringify(pall.getExecuteVals()));