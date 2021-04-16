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

const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

export default (props) => {
	const cnrRef = useRef();
	const p5Ref = useRef();
	const sketchRef = useRef();
	const sceneRef = useRef();
	const sizeRef = useRef({ width: 0, height: 0, x: 0, y: 0 });
	const objects = useRef({});
	const audioRef = useRef();
	const volRef = useRef();
	const analyserRef = useRef();
	var dataArray;
	var freq_max = 255;

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

			analyserRef.current.getByteFrequencyData(dataArray);
			freq_max -= 3;
			console.log("freq_max=", freq_max);
			if ((dataArray[5] > 1.1 * freq_max) & !audioRef.current.paused) {
				const dims = getSize();
				spawnRadial(dims.width / 2, dims.height / 2, 400, 1000);
			}
			freq_max = Math.max(freq_max, dataArray[5]);
		};
		s.mouseClicked = () => {
			const dims = getSize();
			if (
				s.mouseX > 0 &&
				s.mouseX < dims.width &&
				s.mouseY > 0 &&
				s.mouseY < dims.height
			) {
				audioRef.current.paused
					? audioRef.current.play()
					: audioRef.current.pause();
				spawnRadial(s.mouseX, s.mouseY, Math.random() * 300, 500);
			}
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
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContext = new AudioContext();

		analyserRef.current = audioContext.createAnalyser();
		analyserRef.current.fftSize = 32;
		var bufferLength = analyserRef.current.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);

		const track = audioContext.createMediaElementSource(audioRef.current);
		const gainNode = audioContext.createGain();
		track
			.connect(gainNode)
			.connect(analyserRef.current)
			.connect(audioContext.destination);

		volRef.current.addEventListener(
			"input",
			function () {
				gainNode.gain.value = this.value;
			},
			false
		);
	}

	return (
		<>
			<div ref={cnrRef} className="visualizer"></div>
			<audio
				ref={audioRef}
				{...props}
				controls={false}
				onLoadedData={plugAudio}
			></audio>
			<input
				ref={volRef}
				type="range"
				id="volume"
				min="0"
				max="5"
				defaultValue="1"
				step="0.01"
			></input>
		</>
	);
};
