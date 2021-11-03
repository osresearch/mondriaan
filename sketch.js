/*
 * Serve this directory with:
 * python -mSimpleHTTPServer 8000
 */

// choose a random value from an array with array.sample()
Array.prototype.sample = function () { return this[Math.floor(Math.random()*this.length)] };

// objects to be drawn
let rects = [];
let colors = [];
let bright = 0;
const brightness = [ 255, 128, 64, 0 ];


//const smooth = 128; // slow, but noticable
//let smooth = 128;

// valid horizontal steps
const dividers = [
	0,
	200,
	501,
	692,
	1029,
	1225,
	1528,
	1725,
];

/*
 * outPts are the four corners of the projected rectangle.
 */
let mat = new ProjectionMatrix([
	[-1170, -633],
	[-1235, 610],
	[1253, -608],
	[1285, 574],
], null, "mondriaan");

let tx = 0;
let ty = 0;


function setup()
{
	frameRate(25);
	//createCanvas(windowWidth-10, windowHeight-10);
	createCanvas(windowWidth-10, windowHeight-10, WEBGL);
	background(255);
	mat.load();

	// some "Solid" colors
	colors.push( color(255,0,0,250) );
	colors.push( color(255,255,0,250) );
	colors.push( color(0,0,255,250) );
	// some "Softer" colors
	colors.push( color(255,0,0,200) );
	colors.push( color(255,255,0,200) );
	colors.push( color(0,0,255,200) );
	//colors.push( color(0,0,0,250) );

	rects.push(new MovingRect(0));
	rects.push(new MovingRect(1));
	rects.push(new MovingRect(2));

	rects.push(new MovingRect(3));
	rects.push(new MovingRect(4));
	rects.push(new MovingRect(5));

	rects.push(new MovingRect(6));
	rects.push(new MovingRect(7));
	rects.push(new MovingRect(8));

	//rects.push(new MovingRect(9));
	//rects.push(new MovingRect(10));
	//rects.push(new MovingRect(11));
}

//function keyReleased() { }
//function keyPressed() { }
//function mousePressed() { }

// draw the overlay of the door frame for reference
function door(x,y)
{
	push();
	translate(x,y);
	fill(0,0,0,100);
	noStroke();
	rect(-10,0,20,1080);
	pop();
}

/*
 * Rectangles can be sized 1/2 the height or width,
 * or a whole sized unit.
 *
 * Motion is either shrink/grow, or translate to a new location.
 * In between each motion the rectangle sleeps for a while.
 *
 * Color is always red, blue, or yellow.
 *
 */


class MovingRect
{
draw() {
	this.update();

	push();
	translate(0,0,this.z);
	strokeWeight(15);
	stroke(20);

	fill(this.color);

	rect(this.x, this.y, this.w, this.h);
	pop();
}

update() {
	if (this.sleep)
	{
		if (--this.sleep != 0)
			return;

		// done sleeping? choose a new action
		return this.new_action();
	}

	const smooth = this.smooth;

	// translate and scale, smoothly easing into the new parameter
	this.x = (this.x * smooth + this.new_x) / (smooth + 1);
	this.y = (this.y * smooth + this.new_y) / (smooth + 1);
	this.w = (this.w * smooth + this.new_w) / (smooth + 1);
	this.h = (this.h * smooth + this.new_h) / (smooth + 1);

	// if we're close enough, sleep for a little while
	if (abs(this.new_x - this.x) < 1
	&&  abs(this.new_y - this.y) < 1
	&&  abs(this.new_w - this.w) < 1
	&&  abs(this.new_h - this.h) < 1)
		this.sleep = Math.floor(Math.random() * 100) + 30;
}

new_action()
{
	let action = Math.floor(Math.random() * 8);
	if (action < 4)
		this.sleep = Math.floor(Math.random() * 100) + 30;
	if (action == 4)
		this.new_x = this.random_x();
	if (action == 5)
		this.new_y = this.random_y();
	if (action == 6)
		this.new_w = this.random_w();
	if (action == 7)
		this.new_h = this.random_h();

	//console.log("NEW ACTION", action, this);
}

// something lined up with a square
//random_x() { return Math.floor(Math.random() * 15) * 1920 / 16 }
random_x() { return dividers.sample(); }
random_y() { return Math.floor(Math.random() * 5) * 1080 / 6 }
random_w() { return Math.floor(Math.random() * 4 + 1) * 200 }
random_h() { return Math.floor(Math.random() * 2 + 1) * 1080 / 6 }

constructor(i) {
	this.new_x = this.x = this.random_x();
	this.new_y = this.y = this.random_y();
	this.new_w = this.w = this.random_w();
	this.new_h = this.h = this.random_h();
	this.z = Math.random();
	this.color = colors[i % colors.length]; // colors.sample();
	this.sleep = 30;
	this.smooth = Math.random() * 128 + 64;
}

}

function preload() {
	mono_font = loadFont('IBMPlexMono-Bold.ttf');
}

function draw()
{
	blendMode(BLEND);

	// white or dark background
	background(brightness[bright]);

	// project to mouse points to uv
	const uv = mat.project(mouseX - width/2, mouseY - height/2);

	// and draw the outpoint matrix near the bottom
	if (mat.edit)
	{
		push();
		fill(0,0,255);
		textFont(mono_font, 30);

		const s = int(uv[0]) + ", " + int(uv[1]);
		text(s, -width/2, height/2-20);
		pop();
	}

	mat.apply();

	if (mat.edit)
		mat.drawMouse();

	for(r of rects)
		r.draw();

	// draw the munton and door frames
	blendMode(BLEND);
	for(let x of dividers)
		door(x,0);

}

function mouseClicked(event)
{
	if (!mat.edit)
		return;

	// in webgl mode (0,0) is the *center* of the screen
	const x = mouseX - width/2;
	const y = mouseY - height/2;
	const n =
		x < 0 && y < 0 ? 0 :
		x < 0 && y > 0 ? 1 :
		x > 0 && y < 0 ? 2 :
		x > 0 && y > 0 ? 3 :
		0;
		
	mat.outPts[n][0] = int(x);
	mat.outPts[n][1] = int(y);
	mat.update();
}

function keyPressed()
{
	//console.log("key=", key);

	if (key == ' ') {
		mat.edit ^= 1;
	}

	if (key == 'b') {
		bright = (bright + 1) % brightness.length;
	}

	if (key == 'f') {
		const fs = fullscreen();
		fullscreen(!fs);
	}
}

function windowResized()
{
	resizeCanvas(windowWidth-0, windowHeight-4);
}
