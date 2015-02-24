/* jshint ignore:start */
import {default as d3} from 'd3';
/* jshint ignore:end */
var FORMATS_MAP = {

    "x-num-auto": function (x) {
        var v = parseFloat(x.toFixed(2));
        return (Math.abs(v) < 1) ? v.toString() : d3.format("s")(v);
    },

    percent: function (x) {
        var v = parseFloat((x * 100).toFixed(2));
        return v.toString() + '%';
    },

    'day': d3.time.format('%d-%b-%Y'),

    'day-short': d3.time.format('%d-%b'),

    'week': d3.time.format('%d-%b-%Y'),

    'week-short': d3.time.format('%d-%b'),

    'month': (x) => {
        var d = new Date(x);
        var m = d.getMonth();
        var formatSpec = (m === 0) ? '%B, %Y' : '%B';
        return d3.time.format(formatSpec)(x);
    },

    'month-short': (x) => {
        var d = new Date(x);
        var m = d.getMonth();
        var formatSpec = (m === 0) ? '%b \'%y' : '%b';
        return d3.time.format(formatSpec)(x);
    },

    'month-year': d3.time.format('%B, %Y'),

    'quarter': (x) => {
        var d = new Date(x);
        var m = d.getMonth();
        var q = (m - (m % 3)) / 3;
        return 'Q' + (q + 1) + ' ' + d.getFullYear();
    },

    'year': d3.time.format('%Y'),

    'x-time-auto': null
};

var FormatterRegistry = {

    get: (formatAlias, nullOrUndefinedAlias) => {

        var nullAlias = nullOrUndefinedAlias || '';

        var identity = ((x) => (((x === null) || (typeof x === 'undefined')) ? nullAlias : x).toString());

        var hasFormat = FORMATS_MAP.hasOwnProperty(formatAlias);
        var formatter = hasFormat ? FORMATS_MAP[formatAlias] : identity;

        if (hasFormat) {
            formatter = FORMATS_MAP[formatAlias];
        }

        if (!hasFormat && formatAlias) {
            formatter = (v) => {
                var f = _.isDate(v) ? d3.time.format(formatAlias) : d3.format(formatAlias);
                return f(v);
            };
        }

        if (!hasFormat && !formatAlias) {
            formatter = identity;
        }

        return formatter;
    },

    add: (formatAlias, formatter) => {
        FORMATS_MAP[formatAlias] = formatter;
    }
};

export {FormatterRegistry};