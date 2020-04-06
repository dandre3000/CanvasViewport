import Camera from './Camera.js';

const canv = document.createElement('canvas');
canv.width = 1280;
canv.height = 720;
const ctx = canv.getContext('2d');

const cam = new Camera(0);
window.cam = cam;

window.onload = () => {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canv.width, canv.height);
	
	const img = new Image(); // Create new img element
	// https://www.deviantart.com/darkshadedx/art/Hoenn-Pokemon-Emerald-Full-Region-Map-796286390
	// DarkshadeDX
	img.src = './Hoenn.png';
	
	// when loaded
	img.addEventListener('load', function() {
		const imgCanv = document.createElement('canvas');
		imgCanv.width = img.width;
		imgCanv.height = img.height;
		const imgCtx = imgCanv.getContext('2d');
		imgCtx.drawImage(img, 0, 0);
		
		//ctx.drawImage(imgCanv, 0, 0);
		cam.setImage(imgCanv);
		cam.setDisplay(canv);
		cam.render();
	}, false);
	
	document.body.appendChild(canv);
	
	canv.addEventListener('mousemove', (e) => {
		//console.log(e.offsetX, e.offsetY);
	});
	
	document.addEventListener('keydown', (e) => {
		console.log(e);
		
		if (e.keyCode == 87) {
			cam.panY(-16);
		}
		if (e.keyCode == 83) {
			cam.panY(16);
		}
		if (e.keyCode == 65) {
			cam.panX(-16);
		}
		if (e.keyCode == 68) {
			cam.panX(16);
		}
		
		if (e.keyCode == 81) {
			cam.modZoom(-0.01);
		}
		if (e.keyCode == 69) {
			cam.modZoom(0.01);
		}
	});
	
	document.addEventListener('keyup', (e) => {
		//console.log(e);
	});
};