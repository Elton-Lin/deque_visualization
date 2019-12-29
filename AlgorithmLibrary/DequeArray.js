// Copyright 2011 David Galles, University of San Francisco. All rights reserved.

// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.

// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

// Elton Lin, 12/20/2019 - Visualization for Deque - implementated with array
// created based on Prof. Galles' source code and animation library
// link: https://www.cs.usfca.edu/~galles/visualization/Algorithms.html
// TODO: copy this to other deque files

// other resources used (readings):
// https://en.wikipedia.org/wiki/Double-ended_queue
// https://www.codeproject.com/Articles/5425/An-In-Depth-Study-of-the-STL-Deque-Container
// https://stackoverflow.com/questions/6292332/what-really-is-a-deque-in-stl

// The deque (double-ended queue) presented is inspired by the C++ STL. However, the code simulates
// allocating pointers (fixed-size arrays) dynamically by preallocate a constant number of arrays
// to achieve the desired animation result and ease of control over arrays elements and index.
// To reiterate, this is not an appropriate way to implement an actual deque. A circular buffer 
// would probably fit wtih Javascript better, but not as cool in my opinion.

var ARRAY_START_X = 330;
var ARRAY_START_Y = 140;
var ARRAY_ELEM_WIDTH = 50;
var ARRAY_ELEM_HEIGHT = 50;

var ARRRAY_ELEMS_PER_LINE = 5;
var ARRAY_LINE_SPACING = 130;

var HEAD_POS_X = 700;
var HEAD_POS_Y = 80;
var HEAD_LABEL_X = 700;
var HEAD_LABEL_Y =  80;

var TAIL_POS_X = 700;
var TAIL_POS_Y = 400;
var TAIL_LABEL_X = 700;
var TAIL_LABEL_Y =  400;

var ARRAY_LABEL_X = 50;
var ARRAY_LABEL_Y = 30;
var ARRAY_ELEMENT_X = 120;
var ARRAY_ELEMENT_Y = 30;

var INDEX_COLOR = "#0000FF"

var SIZE = 5;
var CHUNK_SIZE = 3;
var NUM_CHUNKS = 3;

var CHUNK_START_X = 500;
var CHUNK_START_Y = 50;
var CHUNK_ELEMS_PER_LINE = 3;
var CHUNK_LINE_SPACING = 130;

function DequeArray(am, w, h)
{
	this.init(am, w, h);
	
}

DequeArray.prototype = new Algorithm();
DequeArray.prototype.constructor = DequeArray;
DequeArray.superclass = Algorithm.prototype;


DequeArray.prototype.init = function(am, w, h)
{
	DequeArray.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];

	this.setup();
	this.initialIndex = this.nextIndex;
}


DequeArray.prototype.addControls =  function()
{
	this.controls = [];

	this.inputFieldFront = addControlToAlgorithmBar("Text", "");
	this.inputFieldFront.onkeydown = this.returnSubmit(this.inputFieldFront,  this.pushFrontCallback.bind(this), 6);
	this.controls.push(this.inputFieldFront);

	this.pushFrontButton = addControlToAlgorithmBar("Button", "pushFront");
	this.pushFrontButton.onclick = this.pushFrontCallback.bind(this);
	this.controls.push(this.pushFrontButton);

	this.popFrontButton = addControlToAlgorithmBar("Button", "popFront");
	this.popFrontButton.onclick = this.popFrontCallback.bind(this);
	this.controls.push(this.popFrontButton);

	this.inputFieldBack = addControlToAlgorithmBar("Text", "");
	this.inputFieldBack.onkeydown = this.returnSubmit(this.inputFieldBack,  this.pushBackCallback.bind(this), 6);
	this.controls.push(this.inputFieldBack);

	this.pushBackButton = addControlToAlgorithmBar("Button", "pushBack");
	this.pushBackButton.onclick = this.pushBackCallback.bind(this);
	this.controls.push(this.pushBackButton);

	this.popBackButton = addControlToAlgorithmBar("Button", "popBack");
	this.popBackButton.onclick = this.popBackCallback.bind(this);
	this.controls.push(this.popBackButton);


	// this.dequeueButton = addControlToAlgorithmBar("Button", "Dequeue");
	// this.dequeueButton.onclick = this.dequeueCallback.bind(this);
	// this.controls.push(this.dequeueButton);
	
	this.clearButton = addControlToAlgorithmBar("Button", "Clear");
	this.clearButton.onclick = this.clearCallback.bind(this);
	this.controls.push(this.clearButton);

	this.restartButton = addControlToAlgorithmBar("Button", "Restart");
	this.restartButton.onclick = this.restartCallback.bind(this);
	this.controls.push(this.restartButton);
	
}

DequeArray.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}
	
	
}
DequeArray.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


DequeArray.prototype.allocateChunk = function(num)
{

	for(var j = 0; j < CHUNK_SIZE; j++) {

		var index = num * NUM_CHUNKS + j;
		var xpos = CHUNK_START_X;
		var ypos = index * ARRAY_ELEM_WIDTH + CHUNK_START_Y + num * 10; // 10 for spacing between chunks

		this.cmd("CreateRectangle", this.chunkID[index],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, xpos, ypos);
	}

}

DequeArray.prototype.updateDataLabels = function()
{

	// display data labels accordingly from data[0] to data[len - 1]
	// go thru all labels everytime
	for(var i = 0; i < NUM_CHUNKS; i++)
	{

		for(var j = 0; j < CHUNK_SIZE; j++)
		{

			var index = i * NUM_CHUNKS + j;
			var xpos = CHUNK_START_X;
			var ypos = index * ARRAY_ELEM_WIDTH + CHUNK_START_Y + i * 10; // 10 for spacing between chunks
	
			var memIndex = this.chunkLabelID[index];
			var lab = "";
			if(index >= this.begin && index < this.end)
			{
				lab = "data[" + (index - this.begin) + "]";
			}
			
			this.cmd("delete", memIndex);
			this.cmd("CreateLabel", memIndex, lab, xpos + ARRAY_ELEM_WIDTH, ypos);
		}
		
	}
	
}

DequeArray.prototype.setup = function()
{

	// keeps track of memory(each object has an index)
	this.nextIndex = 0;

	this.expandedEnd = false;
	this.expandedBegin = false;

	// attemp to simulate independent fixed-size chunks(arrays) with one array
	this.chunkID = new Array(CHUNK_SIZE * NUM_CHUNKS);
	this.chunkLabelID = new Array(CHUNK_SIZE * NUM_CHUNKS);
	for (var i = 0; i < CHUNK_SIZE * NUM_CHUNKS; i++)
	{
		
		this.chunkID[i]= this.nextIndex++;
		this.chunkLabelID[i]= this.nextIndex++;
		// dummy labels for later use to show data[i] labels
		// need to create first before delete
		this.cmd("CreateLabel", this.chunkLabelID[i], "", 500, 500);
	}


	this.arrayID = new Array(SIZE);
	this.arrayLabelID = new Array(SIZE);
	for (var i = 0; i < SIZE; i++)
	{
		
		this.arrayID[i]= this.nextIndex++;
		this.arrayLabelID[i]= this.nextIndex++;
	}

	this.beginID = this.nextIndex++;
	headLabelID = this.nextIndex++;
	this.endID = this.nextIndex++;
	tailLabelID = this.nextIndex++;
	
	this.chunkData = new Array(CHUNK_SIZE * NUM_CHUNKS);

	// values don't directly display, but indicate position that the arrow pointing rather
	this.begin = 5; // init == end, should start at middle of the chunk array
	this.end = 5;

	this.arrayData = new Array(SIZE);
	// this.head = 0;
	// this.tail = 0;
	this.leftoverLabelID = this.nextIndex++;
	
	// top and bottom chunks are displayed later when needed
	this.allocateChunk(1);
	
	for (var i = 0; i < SIZE; i++)
	{
		var xpos = Math.floor(i / ARRRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +  ARRAY_START_X;
		var ypos = (i  % ARRRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_Y;

		this.cmd("CreateRectangle", this.arrayID[i],"", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,xpos, ypos);

		if(i > 0 && i < 4) {
			var lab = "chunk " + (i - 1);
			this.cmd("CreateLabel",this.arrayLabelID[i],  lab,  xpos, ypos);
			this.cmd("SetForegroundColor", this.arrayLabelID[i], INDEX_COLOR);
		}
	}

	this.cmd("CreateLabel", headLabelID, "begin()", HEAD_LABEL_X, HEAD_LABEL_Y);
	this.cmd("CreateRectangle", this.beginID, "", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, HEAD_POS_X, HEAD_POS_Y);
	this.cmd("CreateLabel", tailLabelID, "end()", TAIL_LABEL_X, TAIL_LABEL_Y);
	this.cmd("CreateRectangle", this.endID, "", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, TAIL_POS_X, TAIL_POS_Y);
	
	
	this.cmd("CreateLabel", this.leftoverLabelID, "", ARRAY_LABEL_X, ARRAY_LABEL_Y);
	
	// arrows from array to chunks - hard coded values
	this.cmd("connect", this.arrayLabelID[2], this.chunkID[3]);

	// begin and end arrows
	this.cmd("connect", this.beginID, this.chunkID[this.begin]);
	this.cmd("connect", this.endID, this.chunkID[this.end]);

	this.initialIndex = this.nextIndex;

	this.highlight1ID = this.nextIndex++;
	this.highlight2ID = this.nextIndex++;

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
		
	
}

// don't know when this is called (guessing at skip back?)
DequeArray.prototype.reset = function()
{
	this.expandedEnd = false;
	this.expandedBegin = false;
	this.begin = 5;
	this.end = 5;
	this.nextIndex = this.initialIndex;

}
		
DequeArray.prototype.pushFrontCallback = function(event) {

	// if chunk has room, assign values, this.inputField.value != ""
	if (this.begin != 0 && this.inputFieldFront.value != "") 
	{
		var pushVal = this.inputFieldFront.value;
		this.inputFieldFront.value = ""
		this.implementAction(this.pushFront.bind(this), pushVal);
	}

}

DequeArray.prototype.popFrontCallback = function(event)
{
	if(this.begin < 5)
	{
		this.implementAction(this.popFront.bind(this), "");
	}
}

DequeArray.prototype.pushBackCallback = function(event)
{
	if(this.end != 8 && this.inputFieldBack.value != "")
	{
		var pVal = this.inputFieldBack.value;
		this.inputFieldBack.value = ""
		this.implementAction(this.pushBack.bind(this), pVal);
	}
}

DequeArray.prototype.popBackCallback = function(event)
{
	if(this.end > 5)
	{
		this.implementAction(this.popBack.bind(this), "");
	}

}


DequeArray.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearAll.bind(this), false);
}

DequeArray.prototype.restartCallback = function(event)
{
	this.implementAction(this.clearAll.bind(this), true);
}

// DequeArray.prototype.enqueueCallback = function(event)
// {
// 	if ((this.tail + 1) % SIZE  != this.head && this.inputField.value != "")
// 	{
// 		//this.cmd("CreateLabel", this.chunkID[0], "abc", 800, 80);
// 		var pushVal = this.inputField.value;
// 		this.inputField.value = "";
// 		this.implementAction(this.enqueue.bind(this), pushVal);
// 	}
// }
		
		
// DequeArray.prototype.dequeueCallback = function(event)
// {
// 	//this.cmd("CreateRectangle", ++this.nextIndex,"13", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT,800, 90);
// 	if (this.tail != this.head)
// 	{
// 		this.implementAction(this.dequeue.bind(this), "");
// 	}
// }


DequeArray.prototype.pushFront = function(elemToPush) {
	
	this.commands = new Array();

	// "allocate" new chunk when current is full
	if(this.begin == 3 && !this.expandedBegin)
	{
		this.allocateChunk(0);
		this.cmd("connect", this.arrayLabelID[1], this.chunkID[0]);
		this.expandedBegin = true;
	}


	var labID = this.nextIndex++;
	var labValID = this.nextIndex++;
	
	this.cmd("SetText", this.leftoverLabelID, "");
	
	this.cmd("CreateLabel", labID, "Push Value: ", ARRAY_LABEL_X, ARRAY_LABEL_Y);
	this.cmd("CreateLabel", labValID,elemToPush, ARRAY_ELEMENT_X, ARRAY_ELEMENT_Y);
	
	this.cmd("Step");		
	this.cmd("CreateHighlightCircle", this.highlight1ID, INDEX_COLOR,  HEAD_POS_X, HEAD_POS_Y);
	this.cmd("Step");
	
	
	this.cmd("disconnect", this.beginID, this.chunkID[this.begin]);
	// move up to an empty spot
	this.begin = this.begin - 1;
	this.chunkData[this.begin] = elemToPush;
	this.cmd("connect", this.beginID, this.chunkID[this.begin]);

	var xpos = CHUNK_START_X;
	// 10 for spacing between chunks
	var ypos = this.begin * ARRAY_ELEM_HEIGHT + CHUNK_START_Y + Math.floor(this.begin / CHUNK_SIZE) * 10; 

	this.cmd("Move", this.highlight1ID, xpos, ypos);			
	this.cmd("Step");
	
	this.cmd("Settext", this.chunkID[this.begin], elemToPush); // added

	this.cmd("Delete", labValID);
	this.cmd("Delete", this.highlight1ID);
	
	this.cmd("SetHighlight", this.chunkID[this.begin], 1);
	this.cmd("Step");


	this.cmd("SetHighlight", this.chunkID[this.begin], 0);
	this.cmd("Delete", labID);
	
	this.updateDataLabels();

	return this.commands;
	
}

DequeArray.prototype.pushBack = function(elemToPush) {

	this.commands = new Array();

	this.cmd("Step");

	// "allocate" new chunk when current chunk full
	if(this.end == 5 && !this.expandedEnd)
	{
		this.allocateChunk(2);
		this.cmd("connect", this.arrayLabelID[3], this.chunkID[6]);
		this.expandedEnd = true;
	}

	this.chunkData[this.end] = elemToPush;
	this.cmd("settext", this.chunkID[this.end], elemToPush);

	this.cmd("Step");

	this.cmd("disconnect", this.endID, this.chunkID[this.end]);
	this.end = this.end + 1;
	this.cmd("connect", this.endID, this.chunkID[this.end]);

	this.updateDataLabels();

	return this.commands;

}

DequeArray.prototype.popFront = function(ignored) {


	this.commands = new Array();

	// can add animations just like in pushFront
	this.cmd("Settext", this.chunkID[this.begin], ""); // remove elem

	this.cmd("disconnect", this.beginID, this.chunkID[this.begin]);
	this.begin = this.begin + 1;
	this.cmd("connect", this.beginID, this.chunkID[this.begin]);

	this.updateDataLabels();

	return this.commands;

}

DequeArray.prototype.popBack = function(ignored) {

	this.commands = new Array();

	this.cmd("disconnect", this.endID, this.chunkID[this.end]);
	this.end = this.end - 1;
	this.cmd("Settext", this.chunkID[this.end], ""); // remove elem
	this.cmd("connect", this.endID, this.chunkID[this.end]);

	this.updateDataLabels();

	return this.commands;

}

DequeArray.prototype.clearAll = function(isRestart)
{
	this.commands = new Array();

	this.cmd("SetText", this.leftoverLabelID, "");
	
	// clear elements in deque
	for (var i = this.begin; i < this.end; i++)
	{
		this.cmd("SetText", this.chunkID[i], "");
	}


	if(isRestart) // "deallocate" the chunks
	{
		if(this.expandedBegin)
		{
			this.cmd("delete", this.chunkID[0]);
			this.cmd("delete", this.chunkID[1]);
			this.cmd("delete", this.chunkID[2]);
			this.expandedBegin = false;
		}
		if(this.expandedEnd)
		{
			this.cmd("delete", this.chunkID[6]);
			this.cmd("delete", this.chunkID[7]);
			this.cmd("delete", this.chunkID[8]);
			this.expandedEnd = false;
		}
	}
	
	
	this.cmd("disconnect", this.beginID, this.chunkID[this.begin]);
	this.cmd("disconnect", this.endID, this.chunkID[this.end]);
	this.begin = 5;
	this.end = 5;
	this.cmd("connect", this.beginID, this.chunkID[this.begin]);
	this.cmd("connect", this.endID, this.chunkID[this.end]);

	this.updateDataLabels();
	
	return this.commands;
	
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new DequeArray(animManag, canvas.width, canvas.height);
}
