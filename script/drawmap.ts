enum PlaceType {Land, Sea};
enum LinkType {Road, Rail, Sea};

class City {
    name : string;
    abbrev : string;
    id : number;
    x : number;
    y : number;
    type : PlaceType;
    constructor() {}
    addDetails(name : string, abbrev : string, type : PlaceType) {
        this.name = name;
        this.abbrev = abbrev;
        this.type = type;
    }
    addCoords(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
}

class Link {
    type: number;
    cities: Array<number>;
}

var places_json;
var coords : Array<Array<number>>;
var cities = Array<City>(73);
var links : Array<Link>;
var loadStatus = 0;
for (let i = 0; i < 73; i++) cities[i] = new City();

function drawCity(city : City) {
    if (city.id < 71) { // Ignore unknown locations
        if (city.type == PlaceType.Sea) {
            context.fillStyle = "deepskyblue";
        } else {
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

function drawLinks(type : LinkType, c1 : number, c2 : number) {
    if (type == LinkType.Road) {
        context.lineWidth = 3;
        context.strokeStyle = 'black';
    } else if (type == LinkType.Rail) {
        context.lineWidth = 8;
        context.strokeStyle = 'orange';
    } else if (type == LinkType.Sea) {
        context.lineWidth = 10;
        context.strokeStyle = 'skyblue';
    }
    context.beginPath()
    context.moveTo(cities[c1].x, cities[c1].y);
    context.lineTo(cities[c2].x, cities[c2].y);
    context.stroke();
}


function drawMap() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    links.filter((value) => value.type == LinkType.Sea)
        .forEach((l : Link) => drawLinks(l.type, l.cities[0], l.cities[1]));
    links.filter((value) => value.type == LinkType.Rail)
        .forEach((l : Link) => drawLinks(l.type, l.cities[0], l.cities[1]));
    links.filter((value) => value.type == LinkType.Road)
        .forEach((l : Link) => drawLinks(l.type, l.cities[0], l.cities[1]));
    cities.forEach(drawCity);
//for (let i = 0; i < 5; i++) drawPlayer(i, 4);
}

function populateCities() {
    if (!places_json) return;
    console.log("populateCities");
    for (let i = 0; i < 73; i++) {
        let name = places_json.places[i].name;
        let abbrev = places_json.places[i].abbrev;
        let type_num = places_json.places[i].type;
        let place;
        if (type_num == 1) {
            cities[i].addDetails(name, abbrev, PlaceType.Sea);
        } else {
            cities[i].addDetails(name, abbrev, PlaceType.Land);
        }
        cities[i].id = i;
    }
    loadStatus++;
    if (loadStatus >= 3) {
        if (txtMoves.value != "") btnSubmitMoves.click();
        else drawMap();
    }
}

function parseCoords(e : Event) {
    console.log("parseCoords");
    coords = <Array<Array<number>>> JSON.parse(request1.responseText).coordinates;
    coords.forEach((element, index) => {
        cities[index].addCoords(element[0], element[1]);
    });
    loadStatus++;
    if (loadStatus >= 3) {
        if (txtMoves.value != "") btnSubmitMoves.click();
        else drawMap();
    }
}

function parseLinks(e : Event) {
    console.log("parseLinks");
    links = <Array<Link>> JSON.parse(link_request.responseText).links;
    loadStatus++;
    if (loadStatus >= 3) {
        if (txtMoves.value != "") btnSubmitMoves.click();
        else drawMap();
    }
}

var request : XMLHttpRequest;
var request1 : XMLHttpRequest;
var link_request : XMLHttpRequest;

function loadJSONs () {
    request = new XMLHttpRequest();
    request.open("GET", "data/places.json", true);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                places_json = JSON.parse(request.responseText);
                populateCities();
            } else {
                console.error(request.statusText);
            }
        }
    };
    request.onerror = function(e) {
        console.error(request.statusText);
        document.getElementById('error-msg').innerHTML = "Error: failed to load data/places.json";
    };
    request.send(null);

    request1 = new XMLHttpRequest();
    request1.open("GET", "data/coords.json", true);
    request1.onload = parseCoords;
    request1.onerror = function (e) {
        console.error(request1.statusText);
        document.getElementById('error-msg').innerHTML = "Error: failed to load data/coords.json"; 
    };
    request1.send(null);

    link_request = new XMLHttpRequest();
    link_request.open("GET", "data/links.json", true);
    link_request.onload = parseLinks;
    link_request.onerror = function (e) {
        console.error(request1.statusText);
        document.getElementById('error-msg').innerHTML = "Error: failed to load data/links.json";
    };
    link_request.send(null);
}