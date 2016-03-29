function Point(x,y){
  this.x = x;
  this.y = y;
}
function parseString(){
  var example = document.getElementById("cvs"),
  ctx = example.getContext('2d');
  ctx.fillStyle="#9999ff";
  ctx.fillRect(0, 0, example.width, example.height);

  var stepLength = 20;
  var startPoint = new Point(350, 400); //new Point(x, y); function parseString(rule, x, y, angle)
  var newPoint;
  var step = 4;
  var angle = -Math.PI/4;
  var turnAngle = Math.PI/8;
  var rule = "F";
  var newRule = "-F+F+[+F-F-]-[-F+F+F]";
  var savePositionsX = [];
  var savePositionsY = [];
  var saveAngle = [];

  ctx.beginPath();
  for(var i = 0; i < step; i++){
    //console.log("Step " + i);
    //console.log(rule);
    for(var j = 0; j < rule.length; j++){
      //console.log("step is " + rule[j]);
      switch (rule[j]){
        case 'F':
          ctx.moveTo(startPoint.x, startPoint.y);
          //console.log("Zero Point is ", startPoint.x, startPoint.y);
          newPoint = new Point(startPoint.x + (stepLength)*Math.cos(angle), startPoint.y + (stepLength)*Math.sin(angle));
          ctx.lineTo(newPoint.x, newPoint.y);
          //console.log("Point is ", newPoint.x, newPoint.y);
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
          ctx.moveTo(startPoint.x, startPoint.y)
          //console.log("SAVE ", startPoint.x, startPoint.y);
          break;
        case ']':
          startPoint.x = savePositionsX.pop();
          startPoint.y = savePositionsY.pop();
          angle = saveAngle.pop();
          ctx.moveTo(startPoint.x, startPoint.y)
          //console.log("LOAD ", startPoint.x, startPoint.y);
          break;
        default:
          console.log("Something wrong");
          break;
      }
    }
    rule = rule.replace(/F/g,newRule)  //rule.replace(new RegExp("F",'g'),newRule);
  }
  ctx.stroke();
}
