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
	frameRate(25);
	createCanvas(windowWidth-10, windowHeight-10);
	//createCanvas(windowWidth-10, windowHeight-10, WEBGL);
	background(255);

	// some "Solid" colors
	colors.push( color(255,0,0,250) );
	colors.push( color(255,255,0,250) );
	colors.push( color(0,0,255,250) );
	// some "Softer" colors
	colors.push( color(255,0,0,180) );
	colors.push( color(255,255,0,180) );
	colors.push( color(0,0,255,180) );
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
	rects.push(new MovingRect(9));
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
	this.update();

	strokeWeight(15);
	stroke(0);

	fill(this.color);

	rect(this.x, this.y, this.w, this.h);
}

update() {
	if (this.sleep)
	{
		if (--this.sleep != 0)
			return;

		// done sleeping? choose a new action
		return this.new_action();
	}

	// translate and scale, smoothly easing into the new parameter
	const smooth = 128;
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
random_x() { return Math.floor(Math.random() * 15) * 1920 / 16 }
random_y() { return Math.floor(Math.random() * 5) * 1080 / 6 }
random_w() { return Math.floor(Math.random() * 4 + 1) * 1920 / 16 }
random_h() { return Math.floor(Math.random() * 2 + 1) * 1080 / 6 }

constructor(i) {
	this.new_x = this.x = this.random_x();
	this.new_y = this.y = this.random_y();
	this.new_w = this.w = this.random_w();
	this.new_h = this.h = this.random_h();
	this.color = colors[i % colors.length]; // colors.sample();
	this.sleep = 30;
}

}

function draw()
{
	// white background
	//createCanvas(windowWidth-10, windowHeight-10);
	blendMode(BLEND);
	background(255,255,255);

	blendMode(MULTIPLY);
	// adjust the scale so that the frame is 1920x1080
	//scale(1920 / width);

	for(r of rects)
		r.draw();

	// draw the munton and door frames
	blendMode(BLEND);
	door(0*480,0);
	door(1*480,0);
	door(2*480,0);
	door(3*480,0);
}
