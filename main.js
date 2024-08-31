function createCanvas(container) {
	if (!container) {
		throw new Error('Container was not provided');
	}

	const canvasEl = document.createElement('canvas');
	canvasEl.id = 'app';
	container.appendChild(canvasEl);

	return canvasEl;
}

function draw(gl, canvas) {
	if (gl === null) {
		throw new Error('Unable to initialize WebGL.');
	}

	const vertices = [
		 0.0,  0.5, 0.0, 1.0, 0.0, 0.0,
		-0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
		 0.5, -0.5, 0.0, 0.0, 0.0, 1.0,
	];
	const indices = [0, 1, 2];

	const vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const ibo = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	const vertCode =
	'attribute vec3 coordinates;' +
	'attribute vec3 color;' +
	'varying highp vec4 v_Color;' +
	'void main(void) {' +
	'	gl_Position = vec4(coordinates, 1.0);' +
	'	v_Color = vec4(color, 1.0);' +
	'}';
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertCode);
	gl.compileShader(vertexShader);

	const fragCode =
	'varying highp vec4 v_Color;' +
	'void main(void) {' +
	'	gl_FragColor = v_Color;' +
	'}';
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragCode);
	gl.compileShader(fragmentShader);

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

	const coord = gl.getAttribLocation(shaderProgram, "coordinates");
	gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 0);
	gl.enableVertexAttribArray(coord);

	const color = gl.getAttribLocation(shaderProgram, "color");
	gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
	gl.enableVertexAttribArray(color);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

(function main() {
	const wrapperEl = document.getElementById('app-wrapper');

	if (!wrapperEl) {
		throw new Error('Wrapper #app-wrapper was not found!');
	}

	const canvasEl = createCanvas(wrapperEl);
	function resizeCanvas() {
		canvasEl.width = window.innerWidth;
		canvasEl.height = window.innerHeight;
		const gl = canvasEl.getContext('webgl');
		draw(gl, canvasEl);
	}
	window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
})();
