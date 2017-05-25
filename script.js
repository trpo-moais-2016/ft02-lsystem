function fractal() {
    //получаем html-элемент типа canvas и его характеристики
    var canvas = document.getElementById("canvas");
    var canvasHeight = parseInt(canvas.getAttribute("height"));
    var canvasWidth = parseInt(canvas.getAttribute("width"));

    var context = canvas.getContext('2d');
    let n = 9;
    let length = 3000;
    let deltaAngle = 0;
    let angle = 0;
    let axiom;
    let rules = [];
    let multiplier = Math.pow(3,n);

    stringToRuleConversion("F++F++F\n3\nF: F-F++F-F");
    fractalCreate(axiom, length);
    alert("end");

    function fractalCreate(axiom, length) {
        context.strokeStyle = "black";
        let word = wordCreate(axiom, n);
        fractalDraw(length, word);
    }

    function fractalDraw(length, word) {
        var point={x: 1800, y: 2500}
        var positions = [];
        context.beginPath();
        context.lineWidth = 5;
        context.moveTo(point.x, point.y);
        for (let i = 0; i < word.length; i++) {
            switch (word[i]) {
                case 'F': {
                    point.x += (length * Math.cos(angle)) / multiplier;
                    point.y += (length * Math.sin(angle)) / multiplier;
                    context.lineTo(point.x, point.y);
                    continue;
                }
                case '+': {
                    angle-=deltaAngle;
                    continue;
                }
                case '-': {
                    angle+=deltaAngle;
                    continue;
                }
                case 'X': {
                    continue;
                }
                case 'Y':{
                    continue;
                }
                case '[':{
                    positions.push({x: point.x, y: point.y, ang: angle});
                    continue;
                }
                case ']':{
                    var tmp = positions.pop();
                    point.x = tmp.x;
                    point.y = tmp.y;
                    angle = tmp.ang;
                    context.moveTo(point.x, point.y);
                    continue;
                }
                default: {
                    alert("Wrong symbol in word");
                    return -1;
                }
            }
        }
        context.stroke();
    }

    function wordCreate(axiom, count) {
        if (count <= 0) {
            return axiom;
        }
        var nextWord = "";
        var cnt = 0;
        var match;
        var index = [];
        var lastInd = 0;
        var usingRules = rules.slice();
        while (true) {
            if (!usingRules.length) {
                break;
            }
            for (var i = 0; i < usingRules.length; i++) {
                match = usingRules[i].before.exec(axiom);
                if (match) {
                    index[match.index] = usingRules[i].after;
                    for (var j = 1; j < usingRules[i].len; j++) {
                        index[match.index + j] = -1;
                    }
                }
                else {
                    usingRules.splice(i, 1);
                    i--;
                }
            }
            for (var i = lastInd; i < index.length; i++) {
                if (!index[i]) {
                    index[i] = axiom[i];
                    lastInd = i;
                }
            }
        }
        nextWord = partAddition(index);
        return wordCreate(nextWord, count - 1);
    }

    function partAddition(array) {
        var resultString = "";
        for (var i in array) {
            if (array[i]+1) {
                resultString += array[i];
            }
        }
        return resultString;
    }

    function stringToRuleConversion(inputStr){
        var lineArr = [];
        var ruleArr = [];
        var tmp = [];
        lineArr = inputStr.split('\n');
        axiom = lineArr[0];
        deltaAngle = Math.PI/lineArr[1];
        for(var i = 2;i<lineArr.length;i++){
            tmp = lineArr[i].split(": ");
            rules[i-2] = {before: new RegExp(tmp[0], 'g'), after: tmp[1], len: tmp[0].length};
        }
    }
}