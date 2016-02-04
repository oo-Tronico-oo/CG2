/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "BufferGeometry", "random", "band", "parametric", "robot", "bender"],
        (function ($, BufferGeometry, Random, Band, ParametricSurface, Robot, Bender) {
            "use strict";

            /*
             * define callback functions to react to changes in the HTML page
             * and provide them with a closure defining context and scene
             */
            var HtmlController = function (scene) {

                $("#random").show();
                $("#band").hide();
                $("#ellipsoid").hide();
                $("#parametric").hide();

                $("#btnRandom").click((function () {

                    $("#random").show();
                    $("#band").hide();
                    $("#ellipsoid").hide();
                    $("#parametric").hide();
                }));

                $("#btnBand").click((function () {

                    $("#random").hide();
                    $("#band").show();
                    $("#ellipsoid").hide();
                    $("#parametric").hide();
                }));

                $("#btnEllipsoid").click((function () {

                    $("#random").hide();
                    $("#band").hide();
                    $("#ellipsoid").show();
                    $("#parametric").hide();
                }));

                $("#btnParametric").click((function () {

                    $("#random").hide();
                    $("#band").hide();
                    $("#ellipsoid").hide();
                    $("#parametric").show();
                }));

                $("#btnRobot").click((function () {
                    var robot = new Robot();
                    scene.addMesh(robot.getMesh());
                }));
                
                $("#btnBender").click((function () {
                    var bender = new Bender(60);
                    scene.addMesh(bender.getMesh());
                }));


                // Berechnung von den 2 Punkten auf dem Kreis
                $("#btnTangentPoints").click((function () {

                    $("#random").hide();
                    $("#band").hide();
                    $("#ellipsoid").hide();
                    $("#parametric").hide();

                    $("dialog")[0].showModal();
                    $("#beenden").click((function () {
                        $("dialog")[0].close();
                    }));

                    $("#berechne").click((function () {

                        var p1x = $("#p1X").val() || 7;
                        var p1y = $("#p1Y").val() || 6;
                        var p2x = $("#p2X").val() || 8;
                        var p2y = $("#p2Y").val() || 13;
                        var radius = $("#radiusTP").val() * $("#radiusTP").val() || 25;
                        var resP3 = [0, 0];
                        var resP4 = [0, 0];

                        //berechnen
                        var quad = (function (zahl) {
                            return zahl * zahl;
                        });

                        //variablen vom Thales-Kreis
                        var xMt = (p1x + p2x) / 2;
                        var yMt = (p1y + p2y) / 2;
                        var radiusT = quad(xMt - p1x) + quad(yMt - p1y);

                        //variablen für pq-formel
                        var z1 = quad(p1x) + quad(p1y) - radius;
                        var z2 = quad(xMt) + quad(yMt) - radiusT;

                        var z3 = -(2 * p1x) + (2 * xMt);
                        var z4 = -(2 * p1y) + (2 * yMt);
                        var z5 = z1 - z2;

                        var z6 = -(z4) / z3;
                        var z7 = -(z5) / z3;

                        var z8 = quad(z6) + 1;
                        var z9 = (2 * z7 * z6) - (2 * p1x * z6) - (2 * p1y);
                        var z10 = quad(z7) - (2 * p1x * z7) + quad(p1x) + quad(p1y) - radius;

                        // pq-formel und ergebnis in polarformel eingesetzt
                        resP3[1] = -(z9 / z8) / 2 + Math.sqrt(quad((z9 / z8) / 2) - (z10 / z8));
                        resP3[0] = ((z6 * resP3[1]) + z7);

                        resP4[1] = -(z9 / z8) / 2 - Math.sqrt(quad((z9 / z8) / 2) - (z10 / z8));
                        resP4[0] = ((z6 * resP4[1]) + z7);


                        //result uebergeben
                        $("#p3").val("(" + resP3[0].toFixed(2) + ", " + resP3[1].toFixed(2) + ")");
                        $("#p4").val("(" + resP4[0].toFixed(2) + ", " + resP4[1].toFixed(2) + ")");
                        $("#result").show();
                    }));
                }));

                $("#btnNewRandom").click((function () {

                    var numPoints = parseInt($("#numItems").attr("value"));
                    var random = new Random(numPoints);
                    var bufferGeometryRandom = new BufferGeometry();
                    bufferGeometryRandom.addAttribute("position", random.getPositions());
                    bufferGeometryRandom.addAttribute("color", random.getColors());
                    bufferGeometryRandom.setWireframe($('#checkWireframe').is(':checked'));

                    $('#checkWireframe').change(function () {
                        bufferGeometryRandom.setWireframe($('#checkWireframe').is(':checked'));
                    });

                    scene.addBufferGeometry(bufferGeometryRandom);

                    scene.animate(false);
                    scene.animate($('#checkAnimate').is(':checked'));
                }));


                $("#btnNewBand").click((function () {

                    var config = {
                        segments: parseInt($("#numSegments").attr("value")),
                        radius: parseInt($("#radius").attr("value")),
                        height: parseInt($("#height").attr("value"))
                    };

                    var band = new Band(config);
                    var bufferGeometryBand = new BufferGeometry();
                    bufferGeometryBand.addAttribute("position", band.getPositions());
                    bufferGeometryBand.addAttribute("color", band.getColors());
                    bufferGeometryBand.setIndex(band.getIndices());
                    bufferGeometryBand.setWireframe($('#checkWireframe').is(':checked'));

                    $('#checkWireframe').change(function () {
                        bufferGeometryBand.setWireframe($('#checkWireframe').is(':checked'));
                    });

                    scene.addBufferGeometry(bufferGeometryBand);

                    scene.animate(false);
                    scene.animate($('#checkAnimate').is(':checked'));
                }));

                $("#btnNewEllipsoid").click((function () {
                    var xDim = "(" + $("#kRadiusEllipsoid").val() + " * 2) * Math.cos(u) * Math.cos(v)";
                    var yDim = "(" + $("#gRadiusEllipsoid").val() + " * 2) * Math.cos(u) * Math.sin(v)";
                    var zDim = $("#heightEllipsoid").val() + " * Math.sin(u)";

                    var paramFunction = function (u, v) {
                        try {
                            var pos3D = [
                                eval(xDim),
                                eval(yDim),
                                eval(zDim)
                            ];
                        } catch (e) {
                            if (e instanceof SyntaxError) {
                                alert("Syntax Error : Bitte Formeleingabe überprüfen\n\
                                und erneut ausführen ... " + e.message);
                                return;
                            } else {
                                throw(e);
                            }
                        }

                        return pos3D;
                    };

                    var config = {
                        segmentsU: parseInt($("#ellipsoidNumSegmentsU").val()) || 0,
                        segmentsV: parseInt($("#ellipsoidNumSegmentsV").val()) || 0,
                        uMin: -0.5 * Math.PI,
                        uMax: 0.5 * Math.PI,
                        vMin: -1 * Math.PI,
                        vMax: 1 * Math.PI
                    };

                    var paramSurface = new ParametricSurface(paramFunction, config);
                    var bufferGeometryParametric = new BufferGeometry();

                    bufferGeometryParametric.addAttribute("position", paramSurface.getPositions());
                    bufferGeometryParametric.addAttribute("color", paramSurface.getColors());
                    bufferGeometryParametric.setIndex(paramSurface.getIndices());
                    bufferGeometryParametric.setWireframe($('#checkWireframe').is(':checked'));

                    $('#checkWireframe').change(function () {
                        bufferGeometryParametric.setWireframe($('#checkWireframe').is(':checked'));
                    });

                    scene.addBufferGeometry(bufferGeometryParametric);

                    scene.animate(false);
                    scene.animate($('#checkAnimate').is(':checked'));
                }));

                $("#btnNewParametric").click((function () {
                    var xDim = $("#xDim").val() || "u*200";
                    var yDim = $("#yDim").val() || "v*200";
                    var zDim = $("#zDim").val() || "0";

                    var paramFunction = function (u, v) {
                        try {
                            var pos3D = [
                                eval(xDim),
                                eval(yDim),
                                eval(zDim)
                            ];
                        } catch (e) {
                            if (e instanceof SyntaxError) {
                                alert("Syntax Error : Bitte Formeleingabe überprüfen\n\
                                und erneut ausführen ... " + e.message);
                                return;
                            } else {
                                throw(e);
                            }
                        }

                        return pos3D;
                    };

                    var config = {
                        segmentsU: parseInt($("#numSegmentsU").val()) || 5,
                        segmentsV: parseInt($("#numSegmentsV").val()) || 5,
                        uMin: parseFloat($("#uMin").val()) || -1,
                        uMax: parseFloat($("#uMax").val()) || 1,
                        vMin: parseFloat($("#vMin").val()) || -1,
                        vMax: parseFloat($("#vMax").val()) || 1
                    };

                    var paramSurface = new ParametricSurface(paramFunction, config);
                    var bufferGeometryParametric = new BufferGeometry();

                    bufferGeometryParametric.addAttribute("position", paramSurface.getPositions());
                    bufferGeometryParametric.addAttribute("color", paramSurface.getColors());
                    bufferGeometryParametric.setIndex(paramSurface.getIndices());
                    bufferGeometryParametric.setWireframe($('#checkWireframe').is(':checked'));

                    $('#checkWireframe').change(function () {
                        bufferGeometryParametric.setWireframe($('#checkWireframe').is(':checked'));
                    });

                    scene.addBufferGeometry(bufferGeometryParametric);

                    scene.animate(false);
                    scene.animate($('#checkAnimate').is(':checked'));
                }));

                $('#checkAnimate').change(function () {
                    if ($(this).is(':checked')) {
                        scene.animate(true);
                    } else {
                        scene.animate(false);
                    }
                });

                $('#btnClear').click(function () {
                    scene.clearScene();
                });

                $('#btnSphere').click(function () {
                    $("#xDim").val("500 * Math.cos(u)*Math.cos(v)");
                    $("#yDim").val("500 * Math.cos(u)*Math.sin(v)");
                    $("#zDim").val("500 * Math.sin(u)");
                    $("#numSegmentsU").val("25");
                    $("#numSegmentsV").val("25");
                    $("#uMin").val(-0.5 * Math.PI);
                    $("#uMax").val(0.5 * Math.PI);
                    $("#vMin").val(-1 * Math.PI);
                    $("#vMax").val(1 * Math.PI);
                });

                $('#btnCube').click(function () {
                    var cubeConst = "Math.pow(Math.pow(Math.sin(u),6)*(Math.pow(Math.sin(v),6)+Math.pow(Math.cos(v),6)) + Math.pow(Math.cos(u),6), 1/6)";
                    $("#xDim").val("(300 * Math.sin(u) * Math.cos(v)) / Math.pow(Math.pow(Math.sin(u),6)*(Math.pow(Math.sin(v),6)+Math.pow(Math.cos(v),6)) + Math.pow(Math.cos(u),6), 1/6)");
                    $("#yDim").val("(300 * Math.sin(u) * Math.sin(v)) / " + cubeConst);
                    $("#zDim").val("(300 * Math.cos(u)) / " + cubeConst);
                    $("#numSegmentsU").val("25");
                    $("#numSegmentsV").val("25");
                    $("#uMin").val(-Math.PI);
                    $("#uMax").val(Math.PI);
                    $("#vMin").val(-0.5 * Math.PI);
                    $("#vMax").val(0.5 * Math.PI);
                });

                $('#btnPillow').click(function () {
                    $("#xDim").val("300 * Math.cos(u)");
                    $("#yDim").val("300 * Math.cos(v)");
                    $("#zDim").val("100 * Math.sin(u)*Math.sin(v)");
                    $("#numSegmentsU").val("25");
                    $("#numSegmentsV").val("25");
                    $("#uMin").val(-Math.PI);
                    $("#uMax").val(Math.PI);
                    $("#vMin").val(-Math.PI);
                    $("#vMax").val(Math.PI);
                });

                $('#btnTorus').click(function () {
                    $("#xDim").val("(300 + 150 * Math.cos(v))*Math.cos(u)");
                    $("#yDim").val("(300 + 150 * Math.cos(v))*Math.sin(u)");
                    $("#zDim").val("100 * Math.sin(v)");
                    $("#numSegmentsU").val("25");
                    $("#numSegmentsV").val("25");
                    $("#uMin").val(-Math.PI);
                    $("#uMax").val(Math.PI);
                    $("#vMin").val(-Math.PI);
                    $("#vMax").val(Math.PI);
                });

                $('#btnHyperboloid').click(function () {
                    $("#xDim").val("50 * Math.cosh(v)*Math.cos(u)");
                    $("#yDim").val("50 * Math.cosh(v)*Math.sin(u)");
                    $("#zDim").val("150 * Math.sinh(v)");
                    $("#numSegmentsU").val("25");
                    $("#numSegmentsV").val("25");
                    $("#uMin").val(-1 * Math.PI);
                    $("#uMax").val(Math.PI);
                    $("#vMin").val(-0.5 * Math.PI);
                    $("#vMax").val(0.5 * Math.PI);
                });

                $('#btnCylinder').click(function () {
                    $("#xDim").val("200 * Math.cos(v)");
                    $("#yDim").val("200 * Math.sin(v)");
                    $("#zDim").val("300 * Math.sin(u)");
                    $("#numSegmentsU").val("25");
                    $("#numSegmentsV").val("25");
                    $("#uMin").val(-0.5 * Math.PI);
                    $("#uMax").val(0.5 * Math.PI);
                    $("#vMin").val(-Math.PI);
                    $("#vMax").val(Math.PI);
                });
            };

            // return the constructor function
            return HtmlController;


        })); // require




