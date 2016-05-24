function Point(x,y){
  this.x = x;
  this.y = y;
}
function pressButtonOne(){
  var startX = document.getElementById("txtX").value;
  var startY = document.getElementById("txtY").value;
  var stepChoise = document.getElementById("txt0").value;
  var pressAngle = document.getElementById("txt1").value;
  var pressTurnAngle = document.getElementById("txt2").value;
  var pressRule = document.getElementById("txt3").value;
  var pressNewRule = document.getElementById("txt4").value;
  if(isNaN(parseInt(stepChoise)) == false && isNaN(parseInt(pressAngle)) == false && isNaN(parseInt(pressTurnAngle)) == false){
    return parseString(parseInt(stepChoise),Math.PI/parseInt(pressAngle), Math.PI/parseInt(pressTurnAngle), pressRule, pressNewRule, startX, startY);
  }
}
function parseString(pressStep, pressAngle, pressTurnAngle, pressRule, pressNewRule, startX, startY){
  var canvas = document.getElementById("cvs"),
  ctx = canvas.getContext('2d');
  ctx.fillStyle="#9999ff";
  X = parseInt(startX);
  Y = parseInt(startY);
  var stepLength = 10;
  var startPoint = new Point(X, Y);
  var nextPoint = startPoint;
  var newPoint;
  var step = pressStep;
  var angle = pressAngle;
  var turnAngle = pressTurnAngle;
  var rule = pressRule;
  var newRule = pressNewRule;
  var savePositionsX = [];
  var savePositionsY = [];
  var saveAngle = [];

  for(var i = 1; i < step; i++){
    rule = rule.replace(/F/g,newRule);
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for(var j = 0; j < rule.length; j++){
    switch (rule[j]){
      case 'F':
        ctx.moveTo(nextPoint.x, nextPoint.y)
        newPoint = new Point(nextPoint.x + (stepLength)*Math.cos(angle), nextPoint.y + (stepLength)*Math.sin(angle));
        ctx.lineTo(newPoint.x, newPoint.y);
        nextPoint = newPoint;
        break;
      case '-':
        angle += turnAngle;
        break;
      case '+':
        angle -=turnAngle;
        break;
      case '[':
        savePositionsX.push(nextPoint.x);
        savePositionsY.push(nextPoint.y);
        saveAngle.push(angle);
        break;
      case ']':
        nextPoint.x = savePositionsX.pop();
        nextPoint.y = savePositionsY.pop();
        angle = saveAngle.pop();
        ctx.moveTo(nextPoint.x, nextPoint.y)
        break;
      default:
        console.log("Something goes wrong");
        break;
    }
  }
  ctx.stroke();
}
