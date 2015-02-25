/** @class
 * @extends Plugin */
class Plugins {
    /** @constructs */
    constructor(plugins, chart) {
        this.chart = chart;
        this._plugins = plugins.map(this.initPlugin, this);
    }

    initPlugin(plugin) {
        if (plugin.init) {
            plugin.init(this.chart);
        }
        var empty = () => {
// jscs:disable disallowEmptyBlocks
        };
// jscs:enable disallowEmptyBlocks
        this.chart.on('destroy', plugin.destroy && plugin.destroy.bind(plugin) || (empty));
        Object.keys(plugin).forEach((name) => {
            if (name.indexOf('on') === 0) {
                var event = name.substr(2);
                this.chart.on(event.toLowerCase(), plugin[name].bind(plugin));
            }
        });
    }
}

var elementEvents = ['click', 'mouseover', 'mouseout', 'mousemove'];
var propagateDatumEvents = function (chart) {
    return function () {
        elementEvents.forEach(function (name) {
            this.on(name, function (d) {
                chart.fire('element' + name, {
                    elementData: d,
                    element: this,
                    cellData: d3.select(this.parentNode.parentNode).datum()
                });
            });
        }, this);
    };
};

export {propagateDatumEvents, Plugins};
