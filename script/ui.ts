var modal = document.getElementById('popup');
var btnLoadMoves = <HTMLButtonElement> document.getElementById('change');
var spanClose = document.getElementById('close');
var txtMoves = <HTMLInputElement> document.getElementById('input-moves');
var btnSubmitMoves = <HTMLButtonElement> document.getElementById('submit-moves');
var btnNextMove = <HTMLButtonElement> document.getElementById('next-move');
var btnPrevMove = <HTMLButtonElement> document.getElementById('prev-move');
var changed = false;

var stats = {
    div : document.getElementById('stats'),
    roundCounter : document.getElementById('round-move'),
    moveEvent : document.getElementById('move-event'),
    update : function () {
        stats.roundCounter.innerText = "Move " + currentMove.toString() + '/' + (totalMoves - 1).toString() + ', Round ' + Math.floor(currentMove / 5).toString() + '/' + (Math.floor(totalMoves / 5));
        stats.moveEvent.innerHTML = playEvents[currentMove];
    }
};

function showStats() {
    stats.div.style.display = 'block';
}

btnLoadMoves.onclick = function () {
    modal.style.display = 'block';
    txtMoves.focus();
    changed = false;
}

spanClose.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

btnSubmitMoves.onclick = function () {
    modal.style.display = 'none';
    processMoves(txtMoves.value);
}

txtMoves.onkeyup = function (event : KeyboardEvent) {
    // console.log(event.keyCode);
    event.preventDefault();
    if (event.keyCode == 13 && changed) btnSubmitMoves.click();
    else if (event.keyCode == 27) modal.style.display = 'none';
    else changed = true;
}

document.body.onkeydown = function (e : KeyboardEvent) {
    if (document.activeElement == txtMoves) return;
    if (e.keyCode == 37) { // previous move
        btnPrevMove.focus();
        prevMove();
    } else if (e.keyCode == 39) {
        btnNextMove.focus();
        nextMove();
    } else if (e.keyCode == 36) { // home
        firstMove();
    } else if (e.keyCode == 35) { // end
        lastMove();
    }
}

btnNextMove.onclick = nextMove;
btnPrevMove.onclick = prevMove;

window.onload = function () {
    let query = window.location.search;
    if (query.substr(0, 6) == "?path=") {
        let path = query.substr(6);
        path = path.replace(new RegExp('%20', 'g'), ' ');
        txtMoves.value = path;
    } else {
        modal.style.display = 'block';
        txtMoves.focus();
        changed = false;
    }
    loadJSONs();
}