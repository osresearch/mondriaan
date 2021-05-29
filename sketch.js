/*
 * Serve this directory with:
 * python -mSimpleHTTPServer 8000
 */

// choose a random value from an array with array.sample()
Array.prototype.sample = function () { return this[Math.floor(Math.random()*this.length)] };

// objects to be drawn
let rects = [];
let colors = [];

function setup()
{
	createCanvas(windowWidth-10, windowHeight-10);
	//createCanvas(windowWidth-10, windowHeight-10, WEBGL);
	background(0);

	colors.push( color(255,0,0,80) );
	colors.push( color(255,255,0,80) );
	colors.push( color(0,0,255,80) );

	rects.push(new MovingRect());
	rects.push(new MovingRect());
	rects.push(new MovingRect());
	rects.push(new MovingRect());
	rects.push(new MovingRect());
}

//function keyReleased() { }
//function keyPressed() { }
//function mousePressed() { }

// draw the overlay of the door frame for reference
function door(x,y)
{
	push();
	blendMode(BLEND);
	translate(x,y);
	fill(0,0,0,100);
	noStroke();
	rect(0,0,480,40);
	rect(0,1080-40,480,40);
	rect(0,0,20,1080);
	rect(480-20,0,20,1080);
	rect(480/2 - 5, 0, 10, 1080);
	rect(0,1080/3 - 5, 480, 10);
	rect(0,1080*2/3 - 5, 480, 10);
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
	strokeWeight(15);
	stroke(0);

	console.log(this)
	fill(this.color);

	rect(this.x, this.y, this.w, this.h);
}

// something lined up with a square
random_x() { return Math.floor(Math.random() * 16) * 1920 / 16 }
random_y() { return Math.floor(Math.random() * 6) * 1080 / 6 }
random_w() { return Math.floor(Math.random() * 8) * 1920 / 16 }
random_h() { return Math.floor(Math.random() * 3) * 1080 / 6 }

constructor() {
	this.x = this.random_x();
	this.y = this.random_y();
	this.w = this.random_w();
	this.h = this.random_h();
	this.color = colors.sample();
	this.motion = 0;
	this.sleeptime = Math.random() * 10;
}

}

function draw()
{
	// white background
	background(255);

	// adjust the scale so that the frame is 1920x1080
	//scale(1920 / width);
	blendMode(MULTIPLY);

	for(r of rects)
		r.draw();

	// draw the munton and door frames
	door(0*480,0);
	door(1*480,0);
	door(2*480,0);
	door(3*480,0);
}
