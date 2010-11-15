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

var _step = 100;
var _time;

function size() {
    _scr = {
	h: _canvas.height = window.innerHeight,
	w: _canvas.width = window.innerWidth};
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

function draw() {
    _c.fillStyle = $(".bg").css("color");
    _c.fillRect(0, 0, _scr.w, _scr.h);
    var dTime = new Date().getTime() - _time;
    _ball.v.x += _ball.a.x * dTime / 1000;
    _ball.v.y += _ball.a.y * dTime / 1000;
    if(_ball.y + _ball.r + _ball.v.y * dTime / 1000 > _scr.h) {
	_ball.v.y = - _ball.v.y * 0.5;
    }
    _ball.x += _ball.v.x * dTime / 1000;
    _ball.y += _ball.v.y * dTime / 1000;

    _c.fillStyle = $(".ball").css("color");
    _c.beginPath();
    _c.arc(_ball.x, _ball.y, _ball.r, 0, 360);
    _c.fill();

    _time = new Date().getTime();
    setInterval(draw, _step);
}

$(window).load(function() {
    var eventSource = $('canvas');
//  eventSource.mousedown(mdown);
    eventSource.mousemove(mmove);
//  eventSource.mouseup(mup);
    eventSource.mouseout(mout);
    $(window).resize(resize);
    _canvas = $('#canvas')[0];
    _c = _canvas.getContext('2d');
    size();
    _ball = {
	x: _scr.w/2,
	y: _scr.h/2,
	r: 25,
	m: 50,
	v: {
	    x: 0,   // pix.s^-1
	    y: 0},
	a: {
	    x: 0,
	    y: 980} // pix.s^-2
    };
    _time = new Date().getTime();
    setInterval(draw, _step);
});
