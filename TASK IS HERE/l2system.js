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
  var toSavePoint;
  var step = 3;
  var angle = -Math.PI/8;
  var turnAngle = Math.PI/8;
  var saveAngle;
  var rule = "F";
  var newRule = "-F+F+[+F-F-]-[-F+F+F]";

  ctx.beginPath();
  for(var i = 0; i < step; i++){
    console.log("Step " + i);
    console.log(rule);
    for(var j = 0; j < rule.length; j++){
      //console.log("step is " + rule[j]);
      switch (rule[j]){
        case 'F':
          ctx.moveTo(startPoint.x, startPoint.y);
          console.log("Zero Point is ", startPoint.x, startPoint.y);
          newPoint = new Point(startPoint.x + (stepLength)*Math.cos(angle), startPoint.y + (stepLength)*Math.sin(angle));
          ctx.lineTo(newPoint.x, newPoint.y);
          console.log("Point is ", newPoint.x, newPoint.y);
          startPoint = newPoint;
          break;
        case '-':
          angle += turnAngle;
          break;
        case '+':
          angle -=turnAngle;
          break;
        case '[':
          toSavePoint = startPoint;
          saveAngle = angle;
          ctx.moveTo(toSavePoint.x, toSavePoint.y)
          console.log("SAVE ", toSavePoint.x, toSavePoint.y);
          break;
        case ']':
          startPoint = toSavePoint;
          angle = saveAngle;
          ctx.moveTo(startPoint.x, startPoint.y)
          console.log("LOAD ", startPoint.x, startPoint.y);
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
