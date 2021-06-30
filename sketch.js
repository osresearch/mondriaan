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

// default projection matrix
let mat = [
	1, 0, 0,
	0, 1, 0,
	0, 0, 1,
];
let invmat;

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
const outPts = [
	[51,9],
	[13,937],
	[1873,21],
	[1912,904],
];

/*
 * inPts are the four corners of the drawable region of the screen
 * and do not change.
 */
const inPts = [
	[0,0],
	[0,1080],
	[1920,0],
	[1920,1080],
];


let tx = 0;
let ty = 0;

/*
 * Compute the transform matrix to map four input canvas points in xy space
 * (which are normally cartesian, but don't have to be) into
 * four output screen points in uv space (which are typically a
 * skewed quadralateral and can be clicked on screen).
 */
function getAffine(inPts, outPts)
{
	const x0 = inPts[0][0];
	const x1 = inPts[1][0];
	const x2 = inPts[2][0];
	const x3 = inPts[3][0];

	const y0 = inPts[0][1];
	const y1 = inPts[1][1];
	const y2 = inPts[2][1];
	const y3 = inPts[3][1];

	const u0 = outPts[0][0];
	const u1 = outPts[1][0];
	const u2 = outPts[2][0];
	const u3 = outPts[3][0];

	const v0 = outPts[0][1];
	const v1 = outPts[1][1];
	const v2 = outPts[2][1];
	const v3 = outPts[3][1];

// Coefficients are calculated by solving linear system:
// / x0 y0  1  0  0  0 -x0*u0 -y0*u0 \ /c00\ /u0\
// | x1 y1  1  0  0  0 -x1*u1 -y1*u1 | |c01| |u1|
// | x2 y2  1  0  0  0 -x2*u2 -y2*u2 | |c02| |u2|
// | x3 y3  1  0  0  0 -x3*u3 -y3*u3 |.|c10|=|u3|,
// |  0  0  0 x0 y0  1 -x0*v0 -y0*v0 | |c11| |v0|
// |  0  0  0 x1 y1  1 -x1*v1 -y1*v1 | |c12| |v1|
// |  0  0  0 x2 y2  1 -x2*v2 -y2*v2 | |c20| |v2|
// \  0  0  0 x3 y3  1 -x3*v3 -y3*v3 / \c21/ \v3/

	const U = [
		[x0, y0, 1, 0, 0, 0, -x0*u0, -y0*u0],
		[x1, y1, 1, 0, 0, 0, -x1*u1, -y1*u1],
		[x2, y2, 1, 0, 0, 0, -x2*u2, -y2*u2],
		[x3, y3, 1, 0, 0, 0, -x3*u3, -y3*u3],
		[0, 0, 0, x0, y0, 1, -x0*v0, -y0*v0],
		[0, 0, 0, x1, y1, 1, -x1*v1, -y1*v1],
		[0, 0, 0, x2, y2, 1, -x2*v2, -y2*v2],
		[0, 0, 0, x3, y3, 1, -x3*v3, -y3*v3],
	];
	const b = [u0, u1, u2, u3, v0, v1, v2, v3];

	return math.lusolve(U, b).map((x) => x[0]);
}

function setup()
{
	frameRate(25);
	createCanvas(windowWidth-10, windowHeight-10);
	//createCanvas(windowWidth-10, windowHeight-10, WEBGL);
	background(255);

	// use the default outPts
	mat = getAffine(inPts, outPts);
	invmat = getAffine(outPts, inPts);

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
	skew_translate(x,y);
	fill(0,0,0,100);
	noStroke();
/*
	skew_rect(0,-40,480,40);
	skew_rect(0,1080,480,40);
	skew_rect(0,-40,20,1080);
	skew_rect(480-20,-10,20,1080);
	skew_rect(480/2 - 5, -10, 10, 1080);
	skew_rect(0,1080/3, 480, 10);
	skew_rect(0,1080*2/3, 480, 10);
*/
	skew_rect(-10,0,20,1080);
	pop();
	tx = ty = 0;
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

function apply_matrix(m,x,y)
{
	const z = x * m[6] + y * m[7] + 1;

	return [
		(x * m[0] + y * m[1] + m[2]) / z,
		(x * m[3] + y * m[4] + m[5]) / z,
	];
}

function skew_translate(x,y)
{
	tx = x;
	ty = y;
}

function skew_vertex(x,y)
{
	const p = apply_matrix(mat, x+tx, y+ty);
	vertex(p[0], p[1]);
}

function skew_rect(x,y,w,h)
{
	beginShape();
	skew_vertex(x,y);
	skew_vertex(x+w,y);
	skew_vertex(x+w,y+h);
	skew_vertex(x,y+h);
	endShape(CLOSE);
}

class MovingRect
{
draw() {
	this.update();

	strokeWeight(15);
	stroke(20);

	fill(this.color);

	skew_rect(this.x, this.y, this.w, this.h);
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
	this.color = colors[i % colors.length]; // colors.sample();
	this.sleep = 30;
	this.smooth = Math.random() * 128 + 64;
}

}

function draw()
{
	//translate(-width/2, -height/2);
	blendMode(BLEND);

	// white or dark background
	background(brightness[bright]);

	// adjust the scale so that the width is always 1920
	scale(width / 1920);


	// the matrix returned from the modifier is row major
	//applyMatrix(mat[0][0], mat[3][0], mat[1][0], mat[4][0], mat[2][0], mat[5][0]);
	//applyMatrix(mat[0], mat[3], mat[1], mat[4], mat[2], mat[5]);
// / x0 y0  1  0  0  0 -x0*u0 -y0*u0 \ /c00\ /u0\
// | x1 y1  1  0  0  0 -x1*u1 -y1*u1 | |c01| |u1|
// | x2 y2  1  0  0  0 -x2*u2 -y2*u2 | |c02| |u2|
// | x3 y3  1  0  0  0 -x3*u3 -y3*u3 |.|c10|=|u3|,
// |  0  0  0 x0 y0  1 -x0*v0 -y0*v0 | |c11| |v0|
// |  0  0  0 x1 y1  1 -x1*v1 -y1*v1 | |c12| |v1|
// |  0  0  0 x2 y2  1 -x2*v2 -y2*v2 | |c20| |v2|
// \  0  0  0 x3 y3  1 -x3*v3 -y3*v3 / \c21/ \v3/
/*
	applyMatrix(
		mat[0], mat[3], mat[6], 0,
		mat[1], mat[4], mat[7], 0,
		mat[2], mat[5], 1, 0,
		0, 0, 0, 1
	);
*/

	//blendMode(MULTIPLY);
	// adjust the scale so that the frame is 1920x1080
	//scale(1920 / width);

	for(r of rects)
		r.draw();

	// draw the munton and door frames
	blendMode(BLEND);
	for(let x of dividers)
		door(x,0);
}

function testAffine(x,y)
{
	const outPts = [
		[0,0],
		[0,1080],
		[1920,0],
		[1920,1080],
	];

	const inPts = [
		[0,0],
		[0,1080],
		[1920,0],
		[1920,1080],
	];

	const m = getAffine(inPts, outPts);
	console.log(m);

	for(let i = 0 ; i < 4; i++)
	{
		console.log(apply_matrix(m, inPts[i][0], inPts[i][1]));
	}

	return m;
}


function corner_set(n,x,y)
{
	outPts[n][0] = x;
	outPts[n][1] = y;
	mat = getAffine(inPts, outPts);
	invmat = getAffine(outPts, inPts);

	console.log("corner", n, "x=", x, "y=", y, "mat=", mat);
}

function mouseClicked(event)
{
	const s = 1920 / width;
	const x = mouseX * s;
	const y = mouseY * s;
	const corner =
		x < 1920/2 && y < 1080/2 ? 0 :
		x < 1920/2 && y > 1080/2 ? 1 :
		x > 1920/2 && y < 1080/2 ? 2 :
		x > 1920/2 && y > 1080/2 ? 3 :
		0;

	corner_set(corner, x, y);
}

function keyPressed()
{
	//console.log("key=", key);

	if (key == ' ') {
		const s = 1920 / width;
		const x = mouseX * s;
		const y = mouseY * s;
		const inv = apply_matrix(invmat, x, y);
		console.log(x,y,inv[0], inv[1]);
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
