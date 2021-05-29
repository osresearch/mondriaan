/*
 * Serve this directory with:
 * python -mSimpleHTTPServer 8000
 */
function setup()
{
	createCanvas(windowWidth-10, windowHeight-10);
	//createCanvas(windowWidth-10, windowHeight-10, WEBGL);
	background(0);
}

//function keyReleased() { }
//function keyPressed() { }
//function mousePressed() { }

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

class MovingRect
{
}

function draw()
{
	// white background
	background(255);

	// adjust the scale so that the frame is 1920x1080
	//scale(1920 / width);
	blendMode(MULTIPLY);

	strokeWeight(15);
	stroke(0);

	fill(255,0,0,80);
	rect(20,250,800,300);

	fill(0,0,255,80);
	rect(300,50,300,800);

	//blendMode(LIGHTEST);
	fill(255,255,0,80);
	rect(100,350,300,300);


	// draw the munton and door frames
	door(0*480,0);
	door(1*480,0);
	door(2*480,0);
	door(3*480,0);
}
