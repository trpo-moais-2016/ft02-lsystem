function Point(x,y){
  this.x = x;
  this.y = y;
}
function parseString(){
  var canvas = document.getElementById("cvs"),
  ctx = canvas.getContext('2d');
  ctx.fillStyle="#9999ff";

  var stepLength = 10;
  var startPoint = new Point(50, 600);
  var newPoint;
  var step = 5;
  var angle = -Math.PI/3;
  var turnAngle = Math.PI/8;
  var rule = "F";
  var newRule = "-F+F+[+F-F-]-[-F+F+F]";
  var savePositionsX = [];
  var savePositionsY = [];
  var saveAngle = [];

  for(var i = 0; i < step; i++){
    console.log("Step " + i);
    console.log(rule);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for(var j = 0; j < rule.length; j++){
      switch (rule[j]){
        case 'F':
          ctx.moveTo(startPoint.x, startPoint.y);
          newPoint = new Point(startPoint.x + (stepLength)*Math.cos(angle), startPoint.y + (stepLength)*Math.sin(angle));
          ctx.lineTo(newPoint.x, newPoint.y);
          startPoint = newPoint;
          break;
        case '-':
          angle += turnAngle;
          break;
        case '+':
          angle -=turnAngle;
          break;
        case '[':
          savePositionsX.push(startPoint.x);
          savePositionsY.push(startPoint.y);
          saveAngle.push(angle);
          break;
        case ']':
          startPoint.x = savePositionsX.pop();
          startPoint.y = savePositionsY.pop();
          angle = saveAngle.pop();
          //ctx.moveTo(startPoint.x, startPoint.y)
          break;
        default:
          console.log("Something go wrong");
          break;
      }
    }
    rule = rule.replace(/F/g,newRule)
    ctx.stroke();
  }
}
