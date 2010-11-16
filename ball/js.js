/*
  2dplo.tk - A free fast online plotter - http://2dplo.tk/
  
  Copyright (C) 2010 Mounier Florian aka paradoxxxzero
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see http://www.gnu.org/licenses/.
*/

var _canvas, _c, _scr, _mouse, _balls, _step, _clipMargin, _time, _initTime;


function d(p, q) {
    return Math.sqrt(Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2));
}

function size() {
    _scr = {
	h: _canvas.height = window.innerHeight,
	w: _canvas.width = window.innerWidth
    };
}

function resize() {
    size();
}

function mout() {
}

function mmove(event) {
    _mouse = {
	x: event.clientX,
	y: event.clientY};
}

function clip() {
    $.each(_balls, function(i, _ball) {
	_c.clearRect(_ball.x - _ball.r - _clipMargin, _ball.y - _ball.r - _clipMargin,		2 * (_ball.r + _clipMargin), 2 * (_ball.r + _clipMargin));
    });
}

function move(dTime) {
    var lost = false;
    $.each(_balls, function(i, _ball) {
	_ball.v.x += (_ball.a.x * dTime) / 1000;
	_ball.v.y += (_ball.a.y * dTime) / 1000;
	//    _ball.v.x *= 0.999;
	//    _ball.v.y *= 0.999;
	next = {
	    x: _ball.x + (_ball.v.x * dTime) / 1000,
	    y: _ball.y + (_ball.v.y * dTime) / 1000
	};
	if(d(_mouse, next) < _ball.r) {
	    _ball.v.x += (next.x - _mouse.x) * 3 + Math.random() * 5;
	    _ball.v.y *= -1;
	}
	if(next.x + _ball.r > _scr.w) {
	    _ball.x = 2 * _scr.w - 2 * _ball.r - next.x;
	    _ball.v.x *= -0.75;
	} else if(next.x - _ball.r < 0) {
	    _ball.x = 2 * _ball.r - next.x;
	    _ball.v.x *= -0.75;
	} else {
	    _ball.x = next.x;
	}
	if(next.y + _ball.r > _scr.h) {
	    _ball.y = 2 * _scr.h - 2 * _ball.r - next.y;
	    _ball.v.y *= -0.75;
	    lost = true;
	} else {
	    _ball.y = next.y;
	}
    });
    return lost;
}
function collide(dTime) {
    for(var i = 0 ; i < _balls.length ; i++) {
	for(var j = 0 ; j < i ; j++) {
	    var _ball = _balls[i];
	    var _ball2 = _balls[j];
	    if(d(_ball, _ball2) < _ball.r + _ball2.r) {
		var v0 = {
		    x: _ball.v.x,
		    y: _ball.v.y,
		};
		_ball.v.x = _ball2.v.x;
		_ball.v.y = _ball2.v.y;
		_ball2.v.x = v0.x;
		_ball2.v.y = v0.y;
		_ball.v.x *= 0.9;
		_ball.v.y *= 0.9;
		move(dTime);
	    }
	}
    }
}

function renderBall() {
    $.each(_balls, function(i, _ball) {
	_c.beginPath();
	_c.fillStyle = _ball.color;
	_c.arc(_ball.x, _ball.y, _ball.r, 0, 2 * Math.PI, false);
	_c.fill();
    });

}

function draw() {
    clip();
    var dTime = new Date().getTime() - _time;
    var lost = move(dTime);
    collide(dTime);
    renderBall();
    _time = new Date().getTime();
    if(!lost) setTimeout(draw, _step);
    else setTimeout(init, 1000);
}

$(window).load(function() {
    var eventSource = $('canvas');
    //  eventSource.mousedown(mdown);
    eventSource.mousemove(mmove);
    //  eventSource.mouseup(mup);
    //  eventSource.mouseout(mout);
    $(window).resize(resize);
    init();
});
function init() {
    _step = 1;
    _clipMargin = 5;
    _canvas = $('#canvas')[0];
    _c = _canvas.getContext('2d');
    size();
    _balls = new Array();
    _balls.push({
	x: 2 * _scr.w / 3,
	y: _scr.h / 8,
	r: 50,
	v: {
	    x: 0,   // pix.s^-1
	    y: 0},
	a: {
	    x: 0,
	    y: 980}, // pix.s^-
	color: "#ff5995",
    });
    setTimeout(function () {
	_balls.push({
	    x: _scr.w / 3,
	    y: _scr.h / 8,
	    r: 75,
	    v: {
		x: 0,   // pix.s^-1
		y: 0},
	    a: {
		x: 0,
		y: 980}, // pix.s^-2
	    color: "#b6e354",
	});
    }, 500);
    setTimeout(function () {
	_balls.push({
	    x: _scr.w / 2,
	    y: _scr.h / 8,
	    r: 33,
	    v: {
		x: 0,   // pix.s^-1
		y: 0},
	    a: {
		x: 0,
		y: 980}, // pix.s^-2
	    color: "#8cedff",
	});
    }, 1000);    
    _mouse = {
	x: 0,
	y: 0,
    };
    _initTime = _time = new Date().getTime();
    setTimeout(draw, _step);
}
