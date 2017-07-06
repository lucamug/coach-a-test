//
// Script for Doodle Weather by Luca Mugnaini
//
var 凸 = window.凸 || {};
凸.coachA = (function() {
    // Initializing all shared variables
    var doc = document;
    var win = window;
    var canvas = doc.getElementById('paper');
    var ctx = canvas.getContext('2d');
    var instructions = doc.getElementById("instructions");
    var cursorsElement = doc.getElementById('cursors');
    var id = Math.round((new Date()).getTime() * Math.random());
    var drawing = false;
    var clients = {};
    var cursors = {};
    var lineWidth = 3;
    var socket = io();
    var newDiv;
    var prev = {};
    var lastEmit = (new Date()).getTime();

    function movingEvent() {
        socket.addEventListener('moving', function(data) {
            if (!(data.id in clients)) {
                // a new user has come online. create a cursor for them
                var newDiv = doc.createElement("div");
                newDiv.className = "cursor";
                var temp = cursorsElement.appendChild(newDiv);
                cursors[data.id] = temp;
            }
            // Move the mouse pointer
            cursors[data.id].style.left = data.x + "px";
            cursors[data.id].style.top = data.y + "px";
            // Is the user drawing?
            if (data.drawing && clients[data.id]) {

                // Draw a line on the canvas. clients[data.id] holds
                // the previous position of this user's mouse pointer
                drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
            }
            // Saving the current client state
            clients[data.id] = data;
            clients[data.id].updated = (new Date()).getTime();
        });
    }

    function mousedownEvent() {
        canvas.addEventListener('mousedown', function(e) {
            e.preventDefault();
            drawing = true;
            prev.x = e.pageX;
            prev.y = e.pageY;
            hideInstructions();
            if (false) {
                window.temp = window.temp || [];
                window.temp.push({
                    "x": e.pageX,
                    "y": e.pageY,
                    "m": "a"
                });
                console.log(JSON.stringify(window.temp, null, "\t"));
            }
        });
    }

    function mouseupEvent() {
        doc.addEventListener('mouseup', function() {
            drawing = false;
        });
    }

    function mouseleaveEvent() {
        doc.addEventListener('mouseleave', function() {
            drawing = false;
        });
    }

    function mousemoveEvent() {
        doc.addEventListener('mousemove', function(e) {
            if ((new Date()).getTime() - lastEmit > 30) {
                socket.emit('mousemove', {
                    'x': e.pageX,
                    'y': e.pageY,
                    'drawing': drawing,
                    'id': id
                });
                lastEmit = (new Date()).getTime();
            }
            if (drawing) {
                drawLine(prev.x, prev.y, e.pageX, e.pageY);
                prev.x = e.pageX;
                prev.y = e.pageY;
            }
        });
    }

    function hideInstructions() {
        doc.body.classList.add("hiddenInstructions");
    }

    function showInstructions() {
        doc.body.classList.remove("hiddenInstructions");
    }

    function showSymbols() {
        doc.body.classList.add("showSymbols");
    }

    function removeInactiveClients() {
        setInterval(function() {
            for (var ident in clients) {
                if ((new Date()).getTime() - clients[ident].updated > 10000) {
                    cursors[ident].remove();
                    delete clients[ident];
                    delete cursors[ident];
                }
            }

        }, 10000);
    }

    function setLineWidth(width) {
        lineWidth = width;
    }

    function getLineWidth() {
        return lineWidth;
    }

    function drawLine(fromx, fromy, tox, toy) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = getLineWidth();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.stroke();
    }

    function scrollWin(x, y) {
        win.scroll({ top: y, left: x, behavior: 'smooth' });
    }

    function copyMap() {
        doc.getElementById("mapSmall").innerHTML = doc.getElementById("map").innerHTML;
    }

    function getData(file, fn) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    var allText = rawFile.responseText;
                    return fn(allText);
                }
            }
        };
        rawFile.send(null);
    }

    function initialiseElm(elm) {
        var node = doc.getElementById('main');
        var app = elm.BrushSize.embed(node);
        app.ports.brushChange.subscribe(function(size) {
            setLineWidth(size);
        });
    }

    function addSymbol(symbol) {
        return [
            "<div style='top: " + symbol.y + "px; left: " + symbol.x + "px'>",
            symbol.m,
            "</div>",
        ].join("\n");

    }

    function main() {
        if (Elm) {
            initialiseElm(Elm);
        }
        doc.getElementById("logo").addEventListener('mousedown', function(e) {
            showInstructions();
        });
        copyMap();
        movingEvent();
        mousedownEvent();
        mouseupEvent();
        mouseleaveEvent();
        mousemoveEvent();
        removeInactiveClients();
        setTimeout(function() {
            // Initial scroll
            scrollWin(1304, 1643);
            showInstructions();
            showSymbols();
        }, 500);
        var symbols = [];
        getData("countries/japan", function(data) {
            parsed = JSON.parse(data);
            parsed.weatherToday.map(function(element) {
                symbols.push(addSymbol(element));
            });
            doc.getElementById("symbols").innerHTML = symbols.join("\n");
            setTimeout(function() {
                showSymbols();
            }, 1000);
        });
    }

    // Exposing public methods
    return {
        scrollWin: scrollWin,
        main: main,
    };

})();
凸.coachA.main();
