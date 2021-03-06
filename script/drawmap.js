var PlaceType;
(function (PlaceType) {
    PlaceType[PlaceType["Land"] = 0] = "Land";
    PlaceType[PlaceType["Sea"] = 1] = "Sea";
})(PlaceType || (PlaceType = {}));
;
var LinkType;
(function (LinkType) {
    LinkType[LinkType["Road"] = 0] = "Road";
    LinkType[LinkType["Rail"] = 1] = "Rail";
    LinkType[LinkType["Sea"] = 2] = "Sea";
})(LinkType || (LinkType = {}));
;
class City {
    constructor() {
    }
    addDetails(name, abbrev, type) {
        this.name = name;
        this.abbrev = abbrev;
        this.type = type;
    }
    addCoords(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Link {
}
var places_json;
var coords;
var cities = Array(73);
var links;
var loadStatus = 0;
for (let i = 0; i < 73; i++)
    cities[i] = new City();
function drawCity(city) {
    if (city.id < 71) {
        if (city.type == PlaceType.Sea) {
            context.fillStyle = "deepskyblue";
        }
        else {
            context.fillStyle = "black";
        }
        let x = Math.floor(city.x);
        let y = Math.floor(city.y);
        context.fillRect(x - 10, y - 10, 20, 20);
        context.font = "16px serif";
        context.fillStyle = "black";
        context.fillText(city.abbrev, x + 10, y - 10);
    }
}
function drawLinks(type, c1, c2) {
    if (type == LinkType.Road) {
        context.lineWidth = 3;
        context.strokeStyle = 'black';
    }
    else if (type == LinkType.Rail) {
        context.lineWidth = 8;
        context.strokeStyle = 'orange';
    }
    else if (type == LinkType.Sea) {
        context.lineWidth = 10;
        context.strokeStyle = 'skyblue';
    }
    context.beginPath();
    context.moveTo(cities[c1].x, cities[c1].y);
    context.lineTo(cities[c2].x, cities[c2].y);
    context.stroke();
}
function drawMap() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    links.filter((value) => value.type == LinkType.Sea)
        .forEach((l) => drawLinks(l.type, l.cities[0], l.cities[1]));
    links.filter((value) => value.type == LinkType.Rail)
        .forEach((l) => drawLinks(l.type, l.cities[0], l.cities[1]));
    links.filter((value) => value.type == LinkType.Road)
        .forEach((l) => drawLinks(l.type, l.cities[0], l.cities[1]));
    cities.forEach(drawCity);
    //for (let i = 0; i < 5; i++) drawPlayer(i, 4);
}
function populateCities() {
    if (!places_json)
        return;
    console.log("populateCities");
    for (let i = 0; i < 73; i++) {
        let name = places_json.places[i].name;
        let abbrev = places_json.places[i].abbrev;
        let type_num = places_json.places[i].type;
        let place;
        if (type_num == 1) {
            cities[i].addDetails(name, abbrev, PlaceType.Sea);
        }
        else {
            cities[i].addDetails(name, abbrev, PlaceType.Land);
        }
        cities[i].id = i;
    }
    loadStatus++;
    if (loadStatus >= 3) {
        if (txtMoves.value != "")
            btnSubmitMoves.click();
        else
            drawMap();
    }
}
function parseCoords(e) {
    console.log("parseCoords");
    coords = JSON.parse(request1.responseText).coordinates;
    coords.forEach((element, index) => {
        cities[index].addCoords(element[0], element[1]);
    });
    loadStatus++;
    if (loadStatus >= 3) {
        if (txtMoves.value != "")
            btnSubmitMoves.click();
        else
            drawMap();
    }
}
function parseLinks(e) {
    console.log("parseLinks");
    links = JSON.parse(link_request.responseText).links;
    loadStatus++;
    if (loadStatus >= 3) {
        if (txtMoves.value != "")
            btnSubmitMoves.click();
        else
            drawMap();
    }
}
var request;
var request1;
var link_request;
function loadJSONs() {
    request = new XMLHttpRequest();
    request.open("GET", "data/places.json", true);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                places_json = JSON.parse(request.responseText);
                populateCities();
            }
            else {
                console.error(request.statusText);
            }
        }
    };
    request.onerror = function (e) {
        console.error(request.statusText);
    };
    request.send(null);
    request1 = new XMLHttpRequest();
    request1.open("GET", "data/coords.json", true);
    request1.onload = parseCoords;
    request1.onerror = function (e) { console.error(request1.statusText); };
    request1.send(null);
    link_request = new XMLHttpRequest();
    link_request.open("GET", "data/links.json", true);
    link_request.onload = parseLinks;
    link_request.onerror = function (e) { console.error(request1.statusText); };
    link_request.send(null);
}
//# sourceMappingURL=drawmap.js.map