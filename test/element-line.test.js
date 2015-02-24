define(function (require) {
    var expect = require('chai').expect;
    var schemes = require('schemes');

    var testUtils = require('testUtils');
    var assert = require('chai').assert;
    var getLine = testUtils.getLine;
    var attrib = testUtils.attrib;
    var tauChart = require('tau_modules/tau.charts');
    var cssClassMap = require('tau_modules/utils/css-class-map');
    describe("ELEMENT.LINE", function () {

        var testData = [
            {x: 1, y: 1, color: 'red'},
            {x: 1, y: 2, color: 'red'},
            {x: 2, y: 0.5, color: 'green'},
            {x: 2, y: 2, color: 'green'}
        ];

        var element;
        var chart;

        beforeEach(function () {
            element = document.createElement('div');
            document.body.appendChild(element);
            chart = new tauChart.Plot({
                spec: {
                    unit: {
                        type: 'COORDS.RECT',
                        x: 'x',
                        y: 'y',
                        guide: {},
                        unit: [
                            {
                                type: 'ELEMENT.LINE',
                                color: 'color',
                                x: 'x',
                                y: 'y'
                            }
                        ]
                    }
                },
                data: testData
            });
            chart.renderTo(element, {width: 800, height: 800});
        });
        afterEach(function () {
            element.parentNode.removeChild(element);
        });

        it("should render two line element", function () {
            var lines = getLine();
            assert.ok(schemes.line(chart.config.spec), 'spec is right');
            expect(lines.length).to.equal(2);
            assert.notEqual(attrib(lines[0], 'class'), attrib(lines[1], 'class'), 'should different class');
            assert.ok(testUtils.hasClass(lines[0],'graphical-report__line-width-5'), 'should different class');
            assert.ok(testUtils.hasClass(lines[0],'graphical-report__line-opacity-2'), 'should different class');
        });
    });
    describe("ELEMENT.LINE WITH ONE POINT", function () {

        var testData = [
            {x: 1, y: 1, color: 'red'}
        ];

        var element;
        var chart;

        beforeEach(function () {
            element = document.createElement('div');
            document.body.appendChild(element);
            chart = new tauChart.Plot({
                spec: {
                    unit: {
                        type: 'COORDS.RECT',
                        x: 'x',
                        y: 'y',
                        guide: {},
                        unit: [
                            {
                                type: 'ELEMENT.LINE',
                                color: 'color',
                                x: 'x',
                                y: 'y'
                            }
                        ]
                    }
                },
                data: testData
            });
            chart.renderTo(element, {width: 800, height: 800});
        });
        afterEach(function () {
            element.parentNode.removeChild(element);
        });

        it("should render poin element", function () {
            var dotLines = d3.selectAll('.dot-line');
            assert.equal(dotLines.length, 1, 'should draw point');
        });
    });
    var assertByCountClass
    describe("ELEMENT.LINE generates class in depend on size and count line", function(){
        var assertClassByCount = function(value,index){
            expect(value).to.equal('graphical-report__line-opacity-' + index);
        };
        var assertClassByWidth = function(value,index){
            expect(value).to.equal('graphical-report__line-width-' + index);
        };
        assertClassByCount(cssClassMap.getLineClassesByCount(1),1);
        assertClassByCount(cssClassMap.getLineClassesByCount(2),2);
        assertClassByCount(cssClassMap.getLineClassesByCount(3),3);
        assertClassByCount(cssClassMap.getLineClassesByCount(4),4);
        assertClassByCount(cssClassMap.getLineClassesByCount(5),5);
        assertClassByCount(cssClassMap.getLineClassesByCount(6),5);

        assertClassByWidth(cssClassMap.getLineClassesByWidth(100),1);
        assertClassByWidth(cssClassMap.getLineClassesByWidth(160),2);
        assertClassByWidth(cssClassMap.getLineClassesByWidth(320),3);
        assertClassByWidth(cssClassMap.getLineClassesByWidth(480),4);
        assertClassByWidth(cssClassMap.getLineClassesByWidth(655),5);
        assertClassByWidth(cssClassMap.getLineClassesByWidth(1800),5);

    });
});