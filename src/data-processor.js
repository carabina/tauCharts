import {utils} from './utils/utils';

var isObject = (obj) => obj === Object(obj);

var DataProcessor = {

    isYFunctionOfX: (data, xFields, yFields) => {
        var isRelationAFunction = true;
        var error = null;
        // domain should has only 1 value from range
        try {
            data.reduce(
                (memo, item) => {

                    var fnVar = (hash, f) => {
                        var propValue = item[f];
                        var hashValue = isObject(propValue) ? JSON.stringify(propValue) : propValue;
                        hash.push(hashValue);
                        return hash;
                    };

                    var key = xFields.reduce(fnVar, []).join('/');
                    var val = yFields.reduce(fnVar, []).join('/');

                    if (!memo.hasOwnProperty(key)) {
                        memo[key] = val;
                    } else {
                        var prevVal = memo[key];
                        if (prevVal !== val) {
                            error = {
                                type: 'RelationIsNotAFunction',
                                keyX: xFields.join('/'),
                                keyY: yFields.join('/'),
                                valX: key,
                                errY: [prevVal, val]
                            };

                            throw new Error('RelationIsNotAFunction');
                        }
                    }
                    return memo;
                },
                {});
        } catch (ex) {

            if (ex.message !== 'RelationIsNotAFunction') {
                throw ex;
            }

            isRelationAFunction = false;
        }

        return {
            result: isRelationAFunction,
            error: error
        };
    },

    excludeNullValues: (dimensions, onExclude) => {
        var fields = Object.keys(dimensions).reduce((fields, k) => {
            var d = dimensions[k];
            if ((!d.hasOwnProperty('hasNull') || d.hasNull) && ((d.type === 'measure') || (d.scale === 'period'))) {
                // rule: exclude null values of "measure" type or "period" scale
                fields.push(k);
            }
            return fields;
        }, []);
        return (row) => {
            var result = !fields.some((f) => (!(f in row) || (row[f] === null)));
            if (!result) {
                onExclude(row);
            }
            return result;
        };
    },

    autoAssignScales: function (dimensions) {

        var defaultType = 'category';
        var scaleMap = {
            category: 'ordinal',
            order: 'ordinal',
            measure: 'linear'
        };

        var r = {};
        Object.keys(dimensions).forEach((k) => {
            var v = dimensions[k];
            var t = (v.type || defaultType).toLowerCase();
            r[k] = {};
            r[k].type = t;
            r[k].scale = v.scale || scaleMap[t];
            r[k].value = v.value;
        });

        return r;
    },

    autoDetectDimTypes: function (data) {

        var defaultDetect = {
            type: 'category',
            scale: 'ordinal'
        };

        var detectType = (propertyValue, defaultDetect) => {

            var pair = defaultDetect;

            if (_.isDate(propertyValue)) {
                pair.type = 'measure';
                pair.scale = 'time';
            } else if (_.isObject(propertyValue)) {
                pair.type = 'order';
                pair.scale = 'ordinal';
            } else if (_.isNumber(propertyValue)) {
                pair.type = 'measure';
                pair.scale = 'linear';
            }

            return pair;
        };

        var reducer = (memo, rowItem) => {

            Object.keys(rowItem).forEach((key) => {

                var val = rowItem.hasOwnProperty(key) ? rowItem[key] : null;

                memo[key] = memo[key] || {
                    type: null,
                    hasNull: false
                };

                if (val === null) {
                    memo[key].hasNull = true;
                } else {
                    var typeScalePair = detectType(val, utils.clone(defaultDetect));
                    var detectedType = typeScalePair.type;
                    var detectedScale = typeScalePair.scale;

                    var isInContraToPrev = (memo[key].type !== null && memo[key].type !== detectedType);
                    memo[key].type = isInContraToPrev ? defaultDetect.type : detectedType;
                    memo[key].scale = isInContraToPrev ? defaultDetect.scale : detectedScale;
                }
            });

            return memo;
        };

        return _.reduce(data, reducer, {});
    }
};

export {DataProcessor};