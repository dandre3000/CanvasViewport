import Camera from './CanvasViewport.js';
import viewportManager from './viewportManager.js';

const canv = document.createElement('canvas');
window.canv = canv;
canv.width = 800;
canv.height = 640;
const ctx = canv.getContext('2d');

window.viewportManager = viewportManager;

window.onload = () => {
	let render = null;
	
	const img = new Image(); // Create new img element
	// https://www.deviantart.com/darkshadedx/art/Hoenn-Pokemon-Emerald-Full-Region-Map-796286390
	// DarkshadeDX
	img.src = './Hoenn.png';
	
	
	// when loaded
	img.addEventListener('load', function() {
		/* const imgCanv = document.createElement('canvas');
		imgCanv.width = img.width;
		imgCanv.height = img.height;
		const imgCtx = imgCanv.getContext('2d');
		imgCtx.drawImage(img, 0, 0);
		ctx.drawImage(imgCanv, 0, 0); */
		
		const cam = new Camera(img, canv, 0, 0, 100, 100);
		window.cam = cam;
		viewportManager.push(cam);
		render();
	}, false);
	
	const img2 = new Image();
	img2.src = './Lakitu.png';
	
	// when loaded
	img2.addEventListener('load', function() {
		const cam2 = new Camera(img2, canv, 200, 200, 100, 100);
		window.cam2 = cam2;
		viewportManager.push(cam2);
		render();
	}, false);
	
	render = () => {
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canv.width, canv.height);
		viewportManager.render();
	};
	
	document.body.appendChild(canv);
	
	canv.addEventListener('mousedown', (e) => {
		/* if (cam.pointInDisplay(e.offsetX, e.offsetY)) {
			cam.sx = cam.displayToSourceX(e.offsetX) - cam.w / 2;
			cam.sy = cam.displayToSourceY(e.offsetY) - cam.h / 2;
			cam.render();
		} */
		
		viewportManager.mouseDown(e);
		render();
	});
	
	canv.addEventListener('mousemove', (e) => {
		//console.log('mousemove', e.offsetX, e.offsetY);
		
		if (cam.pointInDisplay(e.offsetX, e.offsetY)) {
			//console.log(e);
			/* e.preventDefault();
			
			if (e.buttons == 1) {
				//cam.sx = cam.displayToSourceX(e.offsetX) - cam.w / 2;
				//cam.sy = cam.displayToSourceY(e.offsetY) - cam.h / 2;
				cam.pan(-e.movementX, -e.movementY, true);
			} else if (e.buttons == 2) {
				cam.setDisplayPos(cam.x += e.movementX, cam.y += e.movementY, true);
			} */
			
			
			
			
		}
		
		viewportManager.mouseMove(e);
		render();
	});
	
	canv.addEventListener('mouseout', (e) => {
		viewportManager.mouseOut(e);
	});
	
	canv.addEventListener('mouseup', (e) => {
		viewportManager.mouseUp(e);
	});
	
	document.addEventListener('keydown', (e) => {
		//console.log(e);
		
		
		viewportManager.keyDown(e);
	});
	
	document.addEventListener('keyup', (e) => {
		//console.log(e);
	});
};