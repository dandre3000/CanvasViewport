var id = 0;

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const BORDER_SIZE = 4;
const MIN_DISPLAY_SIZE = 32 + BORDER_SIZE * 2;

var PAN_N_KEY = 87;
var PAN_S_KEY = 83;
var PAN_W_KEY = 65;
var PAN_E_KEY = 68;

var ZOOM_IN_KEY = 69;
var ZOOM_OUT_KEY = 81;

const confine = (n, min, max) => {
	if (n < min) {
		n = min;
	}
	
	if (n > max) {
		n = max;
	}
	
	return n;
};

export default class CanvasViewport {
	constructor(image, canvas, x, y, w, h) {
		this.id = id++;
		this.image = image;
		this.display = canvas;
		
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.sx = 0;
		this.sy = 0;
		this.zoom = 1.0;
		
		
		this.borderPos = '';
		this.mouseFramePos = -1;
		this.mousePan = false;
		this.mouseDrag = false;
		this.mouseResize = false;
		
		this.debug = true;
	}
	
	// x setter/getter
	set x(x) {
		const setX = x => {
			// if there's a difference
			if (x != this.x) {
				x = confine(x, 0, this.display.width - this.w);
				// set x
				Object.defineProperty(this, 'x', {
					configurable: true,
					get: function() { return x},
					set: setX
				});
				
				if (this.debug) {
					console.log(`viewport id:${this.id}`, `x position: ${x}`);
				}
			}
		};
		
		setX(x);
	}
	
	// default
	get x() {
		return 0;
	}
	
	// y setter/getter
	set y(y) {
		const setY = y => {
			// if there's a difference
			if (y != this.y) {
				y = confine(y, 0, this.display.width - this.h);
				// set y
				Object.defineProperty(this, 'y', {
					configurable: true,
					get: function() { return y},
					set: setY
				});
				
				if (this.debug) {
					console.log(`viewport id:${this.id}`, `y position: ${y}`);
				}
			}
		};
		
		setY(y);
	}
	
	// default
	get y() {
		return 0;
	}
	
	// w setter/getter
	set w(w) {
		const setW = w => {
			// if there's a difference
			if (w != this.w) {
				w = confine(w, MIN_DISPLAY_SIZE, this.display.width - this.x);
				
				// set w
				Object.defineProperty(this, 'w', {
					configurable: true,
					get: function() { return w},
					set: setW
				});
				
				if (this.debug) {
					console.log(`viewport id:${this.id}`, `w position: ${w}`);
				}
			}
		};
		
		setW(w);
	}
	
	// default
	get w() {
		return MIN_DISPLAY_SIZE;
	}
	
	// h setter/getter
	set h(h) {
		const setH = h => {
			// if there's a difference
			if (h != this.h) {
				h = confine(h, MIN_DISPLAY_SIZE, this.display.height - this.y);
				
				// set h
				Object.defineProperty(this, 'h', {
					configurable: true,
					get: function() { return h},
					set: setH
				});
				
				if (this.debug) {
					console.log(`viewport id:${this.id}`, `h position: ${h}`);
				}
			}
		};
		
		setH(h);
	}
	
	// default
	get h() {
		return MIN_DISPLAY_SIZE;
	}
	
	// resize left side by modifying x and width
	resizeX(x) {
		/* const dx = this.x - x;
		if (x <= this.x + this.w - MIN_DISPLAY_SIZE) {
			this.x = x;
			this.w += dx;
			
			if (this.debug) {
				console.log(`viewport id:${this.id}`, `x position: ${x}`, `width: ${this.w}`);
			}
		} else {
			this.x = this.x + this.w - MIN_DISPLAY_SIZE;
			this.w = MIN_DISPLAY_SIZE;
		} */
		
		x = confine(x, 0, this.x + this.w - MIN_DISPLAY_SIZE - 1);
		const dx = this.x - x;
		
		if (dx < 0) {
			this.w += dx;
			this.x = x;
		} else {
			this.x = x;
			this.w += dx;
		}
	}
	
	// resize top side by modifying y and height
	resizeY(y) {
		/* const dy = this.y - y;
		if (y <= this.y + this.h - MIN_DISPLAY_SIZE) {
			this.y = y;
			this.h += dy;
			
			if (this.debug) {
				console.log(`viewport id:${this.id}`, `y position: ${y}`, `height: ${this.h}`);
			}
		} else {
			this.y = this.y + this.h - MIN_DISPLAY_SIZE;
			this.h = MIN_DISPLAY_SIZE;
		} */
		
		y = confine(y, 0, this.y + this.h - MIN_DISPLAY_SIZE - 1);
		const dy = this.y - y;
		
		if (dy < 0) {
			this.h += dy;
			this.y = y;
		} else {
			this.y = y;
			this.h += dy;
		}
	}
	
	// image setter/getter
	set image(image) {
		const setImage = image => {
			// validate image
			if (typeof(image) !== 'undefined') {
				if (image instanceof Image || image instanceof HTMLCanvasElement) {
					// set image
					Object.defineProperty(this, 'image', {
						configurable: true,
						get: function() { return image; },
						set: setImage
					});
				} else {
					throw new Error('image must be an instance of Image or HTMLCanvasElement');
				}
			} else {
				throw new Error('image is not defined');
			}
		};
		
		setImage(image);
	}
	
	// default to null
	get image() {
		return null;
	}
	
	// center viewport at the center of the image
	centerImage() {
		this.sx = this.image.width / 2 - this.w / 2;
		this.sy = this.image.height / 2 - this.h / 2;
		this.render();
	}
	
	setImagePos(x, y, render = false) {
		this.sx = x;
		this.sy = y;
		
		if (render) {
			this.render();
		}
	}
	
	// display setter/getter
	set display(canvas) {
		const setDisplay = display => {
			// validate display
			if (typeof(canvas) !== 'undefined') {
				if (canvas instanceof HTMLCanvasElement) {
					// set display
					Object.defineProperty(this, 'display', {
						configurable: true,
						get: function() { return display; },
						set: setDisplay
					});
				} else {
					throw new Error('canvas must be an instance of HTMLCanvasElement');
				}
			} else {
				throw new Error('canvas is not defined');
			}
		};
		
		setDisplay(canvas);
	}
	
	// default to null
	get display() {
		return null;
	}
	
	setDisplayPos(x, y) {
		this.x = x;
		this.y = y;
	}
	
	// center the display on a position within the canvas
	centerDisplay(x, y) {
		this.x = x - (this.w - 1) / 2;
		this.y = y - (this.h - 1) / 2;
		this.render();
	}
	
	// pan viewport
	panX(m, render = false) {
		this.sx += m / this.zoom;
		
		if (render) {
			this.render();
		}
	}
	
	panY(m, render = false) {
		this.sy += m / this.zoom;
		
		if (render) {
			this.render();
		}
	}
	
	pan(x, y, render = false) {
		this.panX(x);
		this.panY(y, render);
	}
	
	// zoom setter/getter
	set zoom(n) {
		const setZoom = n => {
			const tmp = this.zoom;
			const z = confine(n, MIN_ZOOM, MAX_ZOOM);
			
			// set zoom if there is a difference
			if (z != tmp) {
				// set zoom
				Object.defineProperty(this, 'zoom', {
					configurable: true,
					get: function() { return z; },
					set: setZoom
				});
				
				this.render();
			}
		}
		
		setZoom(n);
	}
	
	// default
	get zoom() {
		return 1.0;
	}
	
	// is the given position within the display
	pointInDisplay(x, y) {
		if (x >= this.x && x <= this.x + this.w - 1 && y >= this.y && y <= this.y + this.h - 1) {
			return true;
		}
		
		return false;
	}
	
	displayToSourceX(x) {
		const tmpX = (x - this.x) / this.zoom;
		const zoomOffsetX = (1 - this.zoom) * (this.w / this.zoom / 2);
		
		return this.sx + tmpX - zoomOffsetX;
	}
	
	displayToSourceY(y) {
		const tmpY = (y - this.y) / this.zoom;
		const zoomOffsetY = (1 - this.zoom) * (this.h / this.zoom / 2);
		
		return this.sy + tmpY - zoomOffsetY;
	}
	
	// calculate which edge/corner of the display the mouse is over
	getFramePos(x, y) {
		let pos = -1;
		let msg = '';
		
		if (this.pointInDisplay(x, y)) {
			if (x <= this.x + BORDER_SIZE - 1) {
				if (y <= this.y + BORDER_SIZE - 1) {
					msg = 'top left corner';
					pos = 7;
				} else if (y >= this.y + this.h - BORDER_SIZE - 1) {
					msg = 'bottom left corner';
					pos = 1;
				} else {
					msg = 'left edge';
					pos = 4;
				}
			} else if (x >= this.x + this.w - BORDER_SIZE - 1) {
				if (y <= this.y + BORDER_SIZE - 1) {
					msg = 'top right corner';
					pos = 9;
				} else if (y >= this.y + this.h - BORDER_SIZE - 1) {
					msg = 'bottom right corner';
					pos = 3;
				} else {
					msg = 'right edge';
					pos = 6;
				}
			} else if (y <= this.y + BORDER_SIZE - 1) {
				msg = 'top edge';
				pos = 8;
			} else if (y >= this.y + this.h - BORDER_SIZE) {
				msg = 'bottom edge';
				pos = 2;
			}
			
			if (pos == -1) {
				msg = 'within frame';
				pos = 5;
			}
		}
		
		if (this.debug && msg) {
			console.log(`viewport id:${this.id}`, `mouse at ${msg}`);
		}
		
		return pos;
	}
	
	changeCursor(e) {
		canv.style.cursor = 'auto';
		
		// get current frame position and change the cursor
		switch(this.getFramePos(e.offsetX, e.offsetY)) {
			case 5:
				canv.style.cursor='crosshair';
				return true;
			case 7:
				canv.style.cursor='nw-resize';
				return true;
			case 8:
				canv.style.cursor='n-resize';
				return true;
			case 9:
				canv.style.cursor='ne-resize';
				return true;
			case 6:
				canv.style.cursor='e-resize';
				return true;
			case 3:
				canv.style.cursor='se-resize';
				return true;
			case 2:
				canv.style.cursor='s-resize';
				return true;
			case 1:
				canv.style.cursor='sw-resize';
				return true;
			case 4:
				canv.style.cursor='w-resize';
				return true;
		}
		
		return false;
	}
	
	mouseDown(e) {
		if (!this.mouseResize) {
			this.mouseFramePos = this.getFramePos(e.offsetX, e.offsetY);
			
			if (this.mouseFramePos != -1) {
				if (e.buttons == 1) { // left button
					if (this.mouseFramePos == 5) {
						this.mousePan = true;
						
						return true;
					} else {
						this.mouseResize = true;
						
						return true;
					}
				} else if (e.buttons == 2) { // right button
					this.mouseDrag = true;
					
					return true;
				}
			}
		}
		
		return false;
	}
	
	mouseUp(e) {
		this.mousePan = false;
		this.mouseDrag = false;
		this.mouseResize = false; // stop resizing display
		
		canv.style.cursor = 'auto';
		
		this.changeCursor(e);
	}
	
	mouseMove(e) {
		let change = false;
			
		// mouse in display
		if (this.changeCursor(e)) {
			/* let imageCtx = this.image.getContext('2d');
			imageCtx.drawImage(this.image, 0, 0);
			imageCtx.fillStyle = 'red';
			imageCtx.fillRect(this.displayToSourceX(e.offsetX), this.displayToSourceY(e.offsetY), 4, 4);
			this.render(); */
			
			// pan view
			if (this.mousePan) {
				//cam.sx = cam.displayToSourceX(e.offsetX) - cam.w / 2;
				//cam.sy = cam.displayToSourceY(e.offsetY) - cam.h / 2;
				this.pan(-e.movementX, -e.movementY, true);
				
				//return true;
			}
			
			
			
			if (this.debug) {
				console.log(`viewport id:${this.id}`, `mouse position x:${this.displayToSourceX(e.offsetX)} y:${this.displayToSourceY(e.offsetY)}`);
				this.debug.mousePos = {x: this.displayToSourceX(e.offsetX), y: this.displayToSourceY(e.offsetY)};
				this.render();
			}
			
			change = true;
		}
		
		// resize display
		/*
		 * 7 8 9
		 * 4 5 6
		 * 1 2 3
		 */
		if (this.mouseResize) {
			switch(this.mouseFramePos) { // frame position is set in mouseDown
				case 7:
					canv.style.cursor='nw-resize';
					this.resizeX(e.offsetX);
					this.resizeY(e.offsetY);
					
					change = true;
					break;
				case 8:
					canv.style.cursor='n-resize';
					this.resizeY(e.offsetY);
					
					change = true;
					break;
				case 9:
					canv.style.cursor='ne-resize';
					this.w = e.offsetX - this.x;
					this.resizeY(e.offsetY);
					
					change = true;
					break;
				case 6:
					canv.style.cursor='e-resize';
					this.w = e.offsetX - this.x;
					
					change = true;
					break;
				case 3:
					canv.style.cursor='se-resize';
					this.w = e.offsetX - this.x;
					this.h = e.offsetY - this.y;
					
					change = true;
					break;
				case 2:
					canv.style.cursor='s-resize';
					this.h = e.offsetY - this.y;
					
					change = true;
					break;
				case 1:
					canv.style.cursor='sw-resize';
					this.resizeX(e.offsetX);
					this.h = e.offsetY - this.y;
					
					change = true;
					break;
				case 4:
					canv.style.cursor='w-resize';
					this.resizeX(e.offsetX);
					
					change = true;
					break;
			}
		}
		
		// drag viewport
		if (this.mouseDrag) {
			this.setDisplayPos(e.offsetX - this.w / 2, e.offsetY - this.h / 2);
			
			change = true;
		}
		
		return change;
	}
	
	mouseOut(e) {
		this.mousePan = false;
		this.mouseDrag = false;
		this.mouseResize = false;
	}
	
	keyDown(e) {
		if (e.keyCode == PAN_N_KEY) {
			this.panY(-16, true);
		}
		if (e.keyCode == PAN_S_KEY) {
			this.panY(16, true);
		}
		if (e.keyCode == PAN_W_KEY) {
			this.panX(-16, true);
		}
		if (e.keyCode == PAN_E_KEY) {
			this.panX(16, true);
		}
		
		if (e.keyCode == ZOOM_IN_KEY) {
			this.zoom += 0.01;
		}
		if (e.keyCode == ZOOM_OUT_KEY) {
			this.zoom -= 0.01;
		}
	}
	
	render() {
		const ctx = this.display.getContext('2d');
		
		ctx.fillStyle = 'green';
		ctx.fillRect(this.x, this.y, this.w, this.h);
		
		// image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
		ctx.drawImage(this.image, this.displayToSourceX(this.x), this.displayToSourceY(this.y), this.w / this.zoom, this.h / this.zoom, this.x, this.y, this.w, this.h);
		
		if (this.debug) {
			ctx.fillStyle = 'blue';
			
			// edges
			ctx.fillRect(this.x + BORDER_SIZE, this.y, this.w - BORDER_SIZE * 2, BORDER_SIZE); // N
			ctx.fillRect(this.x + BORDER_SIZE, this.y + this.h - BORDER_SIZE, this.w - BORDER_SIZE * 2, BORDER_SIZE); // S
			ctx.fillRect(this.x, this.y + BORDER_SIZE, BORDER_SIZE, this.h - BORDER_SIZE * 2); // E
			ctx.fillRect(this.x + this.w - BORDER_SIZE, this.y + BORDER_SIZE, BORDER_SIZE, this.h - BORDER_SIZE * 2); // W
			
			// corners
			ctx.fillRect(this.x, this.y, BORDER_SIZE, BORDER_SIZE); // NW
			ctx.fillRect(this.x + this.w - BORDER_SIZE, this.y, BORDER_SIZE, BORDER_SIZE); // NE
			ctx.fillRect(this.x, this.y + this.h - BORDER_SIZE, BORDER_SIZE, BORDER_SIZE); // SW
			ctx.fillRect(this.x + this.w - BORDER_SIZE, this.y + this.h - BORDER_SIZE, BORDER_SIZE, BORDER_SIZE); // SE
			
			ctx.fillStyle = 'lightgrey';
			ctx.fillRect(this.x + BORDER_SIZE, this.y + BORDER_SIZE, confine(this.w - BORDER_SIZE * 2, 0, 256), confine(64, 0, this.h - BORDER_SIZE * 2));
			ctx.fillStyle = 'black';
			ctx.fillText(`center x:${Math.ceil(this.displayToSourceX(this.x + this.w / 2 - 1))}, y:${Math.ceil(this.displayToSourceY(this.y + this.h / 2 - 1))}`, this.x + BORDER_SIZE * 2, this.y + BORDER_SIZE * 4);
			ctx.fillText(`mouse x:${Math.ceil(this.debug.mousePos.x)}, y:${Math.ceil(this.debug.mousePos.y)}`, this.x + BORDER_SIZE * 2, this.y + BORDER_SIZE * 4 + 16);
		}
	}
	
	// debug setter/getter
	set debug(bool) {
		// toggle debug to true or false
		const toggleDebug = bool => {
			if (typeof(bool) == 'boolean') {
				console.log(`viewport id:${this.id}`, 'debug', bool);
				
				let data = null;
				if (bool) {
					data = {
						mousePos: {x: 0, y: 0}
					};
				} else {
					
				}
				
				// set value
				Object.defineProperty(this, 'debug', {
					configurable: true,
					get: function() { return data; },
					set: toggleDebug
				});
				
				this.render();
			} else {
				console.log('debug value must be boolean');
			}
		};
		
		toggleDebug(bool);
	}
	
	// default
	get debug() {
		return null;
	}
}