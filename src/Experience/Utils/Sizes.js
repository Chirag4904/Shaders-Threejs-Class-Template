import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
	constructor() {
		super();
		//Setup
		//This is for full window canvas but if the canvas is small or in a specific area then better use canvass height and width
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.pixelRatio = Math.min(window.devicePixelRatio, 2);

		//Resize event
		window.addEventListener("resize", () => {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
			this.pixelRatio = Math.min(window.devicePixelRatio, 2);
			this.trigger("resize");
		});
	}
}
