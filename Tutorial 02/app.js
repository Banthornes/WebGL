var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'	fragColor = vertColor;',
'	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText = 
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'	gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function()
{
	console.log('This is working');
	
	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');
	
	if(!gl)
	{
		console.log('WebGL not supported, failling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}
	
	if(!gl)
	{
		alert('Your browser does not support WebGL');
	}
	
	//canvas.width = window.innerWidth;
	//canvas.height = window.innerHeight;
	//gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	
	gl.clearColor(0.39, 0.58, 0.93, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);
	
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	{
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	
	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	
	var cubeVertices = 
	[
		// Top
		-1.0,  1.0, -1.0,		1.0, 1.0, 1.0,
		-1.0,  1.0,  1.0,		1.0, 1.0, 0.0,
		 1.0,  1.0,  1.0,		1.0, 0.0, 1.0,
		 1.0,  1.0, -1.0,		0.0, 1.0, 1.0,
		 
		 // Left
		-1.0,  1.0,  1.0,		1.0, 1.0, 0.0,
		-1.0, -1.0,  1.0,		1.0, 0.0, 0.0,
		-1.0, -1.0, -1.0,		0.0, 1.0, 0.0,
		-1.0,  1.0, -1.0,		1.0, 1.0, 1.0,
		 
		 // Right
		 1.0,  1.0,  1.0,		1.0, 0.0, 1.0,
		 1.0, -1.0,  1.0,		0.0, 0.0, 1.0,
		 1.0, -1.0, -1.0,		0.0, 0.0, 0.0,
		 1.0,  1.0, -1.0,		0.0, 1.0, 1.0,
		 
		 // Front
		 1.0,  1.0,  1.0,		1.0, 0.0, 1.0,
		 1.0, -1.0,  1.0,		0.0, 0.0, 1.0,
		-1.0, -1.0,  1.0,		1.0, 0.0, 0.0,
		-1.0,  1.0,  1.0,		1.0, 1.0, 0.0,
		 
		 // Back
		 1.0,  1.0, -1.0,		0.0, 1.0, 1.0,
		 1.0, -1.0, -1.0,		0.0, 0.0, 0.0,
		-1.0, -1.0, -1.0,		0.0, 1.0, 0.0,
		-1.0,  1.0, -1.0,		1.0, 1.0, 1.0,
		 
		 // Bottom
		-1.0, -1.0, -1.0,		0.0, 1.0, 0.0,
		-1.0, -1.0,  1.0,		1.0, 0.0, 0.0,
		 1.0, -1.0,  1.0,		0.0, 0.0, 1.0,
		 1.0, -1.0, -1.0,		0.0, 0.0, 0.0,
	];
	
	var cubeIndices = 
	[
		// Top
		0, 1, 2,
		0, 2, 3,
		
		// Left
		5, 4, 6,
		6, 4, 7,
		
		// Right
		8, 9, 10,
		8, 10, 11,
		
		// Front
		13, 12, 14,
		15, 14, 12,
		
		// Back
		16, 17, 18,
		16, 18, 19,
		
		// Bottom
		21, 20, 22,
		22, 20, 23
	];
	
	var cubeVertexBufferObject = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
	
	var cubeIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
	
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	
	gl.vertexAttribPointer(
		positionAttribLocation,				// Attribute location
		3,									// Number of elements per attribute
		gl.FLOAT, 							// Type of elements
		gl.FALSE, 							// Is normalized2
		6 * Float32Array.BYTES_PER_ELEMENT,	// Size of an individual vertex
		0									// Offset from the beginning of a single vertex to this attribute
	);
		
	gl.vertexAttribPointer(
		colorAttribLocation,				// Attribute location
		3,									// Number of elements per attribute
		gl.FLOAT, 							// Type of elements
		gl.FALSE, 							// Is normalized2
		6 * Float32Array.BYTES_PER_ELEMENT,	// Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT	// Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	
	gl.useProgram(program);
	
	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
	
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0,0,-8], [0,0,0], [0,1,0]);
	
	var aspectRatio = canvas.width / canvas.height;
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);
	
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	
	var angle = 0;
	var loop = function()
	{
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
		
		mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
		
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		
		gl.clearColor(0.39, 0.58, 0.93, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
		
		requestAnimationFrame(loop);
	};
	
	requestAnimationFrame(loop);
	
};
