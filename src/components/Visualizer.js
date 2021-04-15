/* eslint-disable import/no-anonymous-default-export */
import React, { useRef, useEffect } from "react";
import p5 from "p5";

const DUR_EXPAND = 1000;

class Radial {
	constructor(props) {
		const { s } = props;
		Object.assign(this, props);
		this.initMs = s.millis();
		this.age = 0;
		this.stroke = s.color(255, 0, 0);
		this.fill = s.color(0, 0, 0);
	}

	display() {
		const s = this.s;
		this.age = s.millis() - this.initMs;
		const x = this.x;
		const y = this.y;
		const life = this.age / this.lifespan;
		const currentRadius = this.r * life;
		s.fill(s.color(0, 0, 0, 0));
		s.stroke("red");
		s.strokeWeight(2);
		s.ellipse(x, y, currentRadius);

		if (life >= 1) {
			this.kill();
		}
	}
}

export default (props) => {
	const cnrRef = useRef();
	const p5Ref = useRef();
	const sketchRef = useRef();
	const sceneRef = useRef();
	const sizeRef = useRef({ width: 0, height: 0, x: 0, y: 0 });
	const objects = useRef({});
	const audioRef = useRef();
	const volRef = useRef();

	useEffect(() => {
		p5Ref.current = new p5(initter, cnrRef.current);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			sketchRef.current && sketchRef.current.remove();
		};
	}, []);

	function initter(s) {
		s.setup = () => {
			const dims = getSize();
			const scene = s.createCanvas(dims.width, dims.height);
			sceneRef.current = scene;
			spawnRadial(dims.width / 2, dims.height / 2, 100);
		};
		s.draw = () => {
			s.background(0);
			const obIds = Object.keys(objects.current);
			for (let i = 0; i < obIds.length; i++) {
				objects.current[obIds[i]].display();
			}
		};
		s.mouseClicked = () => {
			spawnRadial(s.mouseX, s.mouseY, Math.random() * 300, 500);
		};
		sketchRef.current = s;
	}

	function getSize() {
		return cnrRef.current.getBoundingClientRect();
	}

	function handleResize() {
		const dims = getSize();
		sketchRef.current.resizeCanvas(dims.width, dims.height);
		sizeRef.current = dims;
	}

	function spawnRadial(x = 0, y = 0, r = 50, lifespan = DUR_EXPAND) {
		const id = `${+new Date()}-${Object.keys(objects.current).length}}`;
		objects.current[id] = new Radial({
			x,
			y,
			r,
			id,
			lifespan,
			s: sketchRef.current,
			kill() {
				delete objects.current[id];
			},
		});
	}

	function plugAudio() {
		console.log(audioRef);
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContext = new AudioContext();
		const track = audioContext.createMediaElementSource(audioRef.current);
		const gainNode = audioContext.createGain();
		track.connect(gainNode).connect(audioContext.destination);

		volRef.current.addEventListener(
			"input",
			function () {
				gainNode.gain.value = this.value;
				console.log(this.value);
			},
			false
		);
	}

	return (
		<>
			<div ref={cnrRef} className="visualizer"></div>
			<audio ref={audioRef} {...props} onLoadedData={plugAudio}></audio>
			<input
				ref={volRef}
				type="range"
				id="volume"
				min="0"
				max="2"
				value="1"
				step="0.01"
			></input>
		</>
	);
};
