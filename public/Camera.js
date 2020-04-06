export default class Camera {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.w = 100;
		this.h = 100;
		this.sx = 0;
		this.sy = 0;
		this.img;
		this.display;
		this.zoom = 1.0;
	}
	
	setImage(image) {
		this.img = image;
		this.sx = image.width / 2 - this.w / 2;
		this.sy = image.height / 2 - this.h / 2;
	}
	
	setDisplay(canvas) {
		console.log(canvas.width, canvas.height);
		this.display = canvas;
		this.w = canvas.width / 2;
		this.h = canvas.height / 2;
		this.x = canvas.width / 2 - this.w / 2;
		this.y = canvas.height / 2 - this.h / 2;
	}
	
	panX(m) {
		this.sx += m / this.zoom;
		this.render();
	}
	
	panY(m) {
		this.sy += m / this.zoom;
		this.render();
	}
	
	setZoom(n) {
		this.zoom = n;
		this.render();
	}
	
	modZoom(m) {
		if (this.zoom + m > 0.01) {
			this.zoom += m;
			this.render();
		}
	}
	
	render() {
		const ctx = this.display.getContext('2d');
		
		ctx.fillStyle = 'green';
		ctx.fillRect(this.x, this.y, this.w, this.h);
		
		// image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
		let zoomOffsetX = (1 - this.zoom) * (this.w / this.zoom / 2);
		let zoomOffsetY = (1 - this.zoom) * (this.h / this.zoom / 2);
		ctx.drawImage(this.img, this.sx - zoomOffsetX, this.sy - zoomOffsetY, this.w / this.zoom, this.h / this.zoom, this.x, this.y, this.w, this.h);
	}
}