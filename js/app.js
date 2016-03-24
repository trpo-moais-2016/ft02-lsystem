'use strict';

var app = angular.module('app', []);

app.directive("drawing", function($timeout){
  return {
    restrict: "A",
    link: function(scope, element, attr){
        var ctx = element[0].getContext('2d');

        ctx.width = attr["width"];
        ctx.height = attr["height"];

        ctx.transform(1, 0, 0, -1, ctx.width / 2, ctx.height / 2);
        scope.draw(ctx);
    }
  };
});


app.controller("mainController", ["$scope", function($scope){
    $scope.templates = {
        bush: 'Куст',
        snowflake: 'Снежинка'
    };
    $scope.axiom='F';
    $scope.rule = '-F+F+[+F-F-]-[-F+F+F]';
    $scope.n = 5;
    $scope.q = 3;
    $scope.s = 25;

    $scope.drawTemplate = function(){
        if($scope.template == 'bush')
            drawBush();
        if($scope.template == 'snowflake')
            drawSnowflake();
    }

    function drawBush(){
        $scope.axiom='F';
        $scope.rule = '-F+F+[+F-F-]-[-F+F+F]';
        $scope.n = 5;
        $scope.q = 3;
        $scope.s = 25;
        $scope.draw();
    }
    function drawSnowflake(){
        $scope.axiom='[F]+[F]+[F]+[F]+[F]+[F]';
        $scope.rule = 'F[+FF][-FF]FF[+F][-F]FF';
        $scope.n = 2;
        $scope.q = 8;
        $scope.s = 25;
        $scope.draw();
    }
    
    $scope.draw = function(context){
        var a = $scope;
        var ctx = this.ctx = context || this.ctx;
        var points = turtlePaint(a.axiom, a.rule, a.n, Math.PI * a.q / 24, a.s );

        ctx.clearRect(-ctx.width/2, -ctx.height/2, ctx.width, ctx.height);
        ctx.save();
        scaling(points);
        draw(points);
        ctx.restore();

        function scaling(points){
            var left_bottom = new Point(0, 0),
                right_top = new Point(0, 0);
            for(var i = 0; i < points.length; i++){
                var p = points[i];
                if(typeof(p) != "string"){
                    if(p.x < left_bottom.x)
                        left_bottom.x = p.x;
                    if(p.x > right_top.x)
                        right_top.x = p.x;
                    if(p.y < left_bottom.y)
                        left_bottom.y = p.y;
                    if(p.y > right_top.y)
                        right_top.y = p.y;
                }
            }

            var bound = left_bottom.vectorTo(right_top);
            var ox = new Point(400.0 / bound.x, 0);
            var oy = new Point(0, 300.0 / bound.y);
            if(ox.length() > oy.length())
                ox = oy.orthoR();
            else
                oy = ox.orthoL();

            ctx.lineWidth = 1.0 / ox.length();
            ctx.transform(ox.x, ox.y, oy.x, oy.y, 0, 0);
        }

        function draw(points){
            var states = [];
            ctx.beginPath();
            
            for(var i = 0; i < points.length; i++)
                if(points[i] === 'save'){
                    states.push(points[i-1]);
                } else if(points[i] === 'restore'){
                    var p = states.pop();
                    points[i] = p;
                    ctx.moveTo(p.x, p.y);
                } else{
                    ctx.lineTo(points[i].x, points[i].y);
                }

            ctx.stroke();    
        }
    }
}]);


function turtlePaint(axiom, rule, n, q, s)
{
    var states = [];
    var curP = new Point(0, 0);
    var curQ = 0;
    var points = [curP.clone()];
    
    iterations(n, axiom);
    return points;

    function iterations(n, axiom){
        for(var i = 0; i < axiom.length; i++){
            var c = axiom[i];

            if(c == '+') curQ += q;
            if(c == '-') curQ -= q;
            
            if(c == '['){
                states.push({p: curP.clone(), q: curQ});
                points.push('save');
            } else if(c == ']'){
                var state = states.pop();
                curP = state.p;
                curQ = state.q;
                points.push('restore');
            }
            
            if(c == 'F' && n == 0){
                curP = curP.plus( new Point(s*Math.cos(curQ), s*Math.sin(curQ)) );
                points.push(curP.clone());
            } else if(c == 'F')
                iterations(n - 1, rule);
        }
    }
}


(function (window){
    function Point(x, y){
        this.x = x || 0;
        this.y = y || 0;
    }

    Point.prototype.clone = function(){
        return new Point(this.x, this.y);
    }

    Point.prototype.length = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    };

    Point.prototype.norm = function() {
        return new Point( this.x / this.length(),
                          this.y / this.length() );
    };

    Point.prototype.vectorTo = function(to) {
        var from = this;
        return new Point( to.x - from.x, 
                          to.y - from.y);
    };

    Point.prototype.orthoL = function() {
        return new Point(-this.y, this.x);
    };

    Point.prototype.orthoR = function() {
        return new Point(this.y, -this.x);
    };

    Point.prototype.plus = function(b) {
        var a = this;
        return new Point(a.x + b.x, a.y + b.y);
    };

    Point.prototype.multy = function(c) {
        return new Point(this.x * c, this.y * c);
    };

    window.Point = Point;
})(window);