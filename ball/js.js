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

var _canvas, _c, _scr, _mouse, _ball;

var _step = 1;
var _clipMargin = 5;
var _time;

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
   _c.clearRect(_ball.x - _ball.r - _clipMargin, _ball.y - _ball.r - _clipMargin,		2 * (_ball.r + _clipMargin), 2 * (_ball.r + _clipMargin));
}

function move(dTime) {
    _ball.v.x += (_ball.a.x * dTime) / 1000;
    _ball.v.y += (_ball.a.y * dTime) / 1000;
//    _ball.v.x *= 0.999;
//    _ball.v.y *= 0.999;
    next = {
	x: _ball.x + (_ball.v.x * dTime) / 1000,
	y: _ball.y + (_ball.v.y * dTime) / 1000
    };
    if(next.y + _ball.r > _mouse.y &&
       _ball.y + _ball.r < _mouse.y &&
       next.x - _ball.r < _mouse.x && 
       next.x + _ball.r > _mouse.x) {
	_ball.v.x += (next.x - _mouse.x) * 20 + Math.random() * 5;
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
    } else {
	_ball.y = next.y;
    }
}

function renderBall() {
    _c.beginPath();
    _c.arc(_ball.x, _ball.y, _ball.r, 0, 2 * Math.PI);
    _c.fill();
}

function draw() {
    clip();
    move(new Date().getTime() - _time);
    renderBall();
    _time = new Date().getTime();
    setTimeout(draw, _step);
}

$(window).load(function() {
    var eventSource = $('canvas');
//  eventSource.mousedown(mdown);
    eventSource.mousemove(mmove);
//  eventSource.mouseup(mup);
//    eventSource.mouseout(mout);
    $(window).resize(resize);
    _canvas = $('#canvas')[0];
    _c = _canvas.getContext('2d');
    size();
    _ball = {
	x: _scr.w/2,
	y: _scr.h/8,
	r: 50,
	m: 50,
	v: {
	    x: 0,   // pix.s^-1
	    y: 0},
	a: {
	    x: 0,
	    y: 980} // pix.s^-2
    };
    _mouse = {
	x: 0,
	y: 0,
    };
    _c.fillStyle =  $(".ball").css("color");
    _time = new Date().getTime();
    setTimeout(draw, _step);
});
