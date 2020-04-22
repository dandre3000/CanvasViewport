// modified array singlton
const arr = [];
export default arr;

arr.__proto__.mouseDown = (e) => {
	for (let i = 0; i < arr.length; i++) {
		const viewport = arr[i];
		
		if (viewport.mouseDown(e)) {
			console.log(`viewportManager focus id: ${viewport.id}`);
			
			let tmp = viewport;
			arr.splice(i, 1);
			arr.unshift(tmp);
			
			arr.focus = viewport;
			break;
		}
	}
};

arr.__proto__.mouseMove = (e) => {
	for (let i = 0; i < arr.length; i++) {
		const viewport = arr[i];
		
		if (viewport.mouseMove(e)) {
			break;
		}
	}
};

arr.__proto__.mouseUp = (e) => {
	if (arr.length > 0) {
		arr[0].mouseUp(e);
	}
};

arr.__proto__.mouseOut = (e) => {
	if (arr.length > 0) {
		arr[0].mouseOut(e);
	}
};

arr.__proto__.keyDown = (e) => {
	if (arr.length > 0) {
		arr[0].keyDown(e);
	}
};

arr.__proto__.render = () => {
	for (let i = arr.length - 1; i > -1; i--) {
		const viewport = arr[i];
		
		viewport.render();
	};
};