function main() {
    const canvas = document.getElementById("webgl-canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("Failed to get WebGL context.");
        return;
    }

    // Initialize shaders
    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    if (!program) {
        console.error("Failed to initialize shaders.");
        return;
    }
    gl.useProgram(program);

    // Set black background
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Define stick figure parts
    const head = createCircle(0.0, 0.5, 0.1, 50); // Head: center (0, 0.5), radius 0.1
    const torso = [
        0.0, 0.4, // Top
        0.0, -0.2 // Bottom
    ];
    const leftArm = [
        0.0, 0.3,  // Shoulder
        -0.2, 0.1 // Hand
    ];
    const rightArm = [
        0.0, 0.3,  // Shoulder
        0.2, 0.1  // Hand
    ];
    const leftLeg = [
        0.0, -0.2, // Hip
        -0.1, -0.5 // Foot
    ];
    const rightLeg = [
        0.0, -0.2, // Hip
        0.1, -0.5  // Foot
    ];

    // Draw all parts
    drawShape(gl, program, head, [1.0, 1.0, 1.0, 1.0], gl.TRIANGLE_FAN); // Head
    drawShape(gl, program, torso, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Torso
    drawShape(gl, program, leftArm, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Left arm
    drawShape(gl, program, rightArm, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Right arm
    drawShape(gl, program, leftLeg, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Left leg
    drawShape(gl, program, rightLeg, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Right leg

     // Add hair (curving around the face)
    const hair = createCurvedHair(0.0, 0.6, 0.1); // Above the head
    drawShape(gl, program, hair, [0.5, 0.3, 0.2, 1.0], gl.LINES); // Hair color
}
// Function to create hair that curves around the face
function createCurvedHair(cx, cy, radius) {
    const hairVertices = [];
    const numHairStrands = 8; // Number of hair strands
    const curveStrength = 0.4; // Controls how much the hair curves around the face
    const faceRadius = 0.1; // Distance from center to the face boundary

    for (let i = 0; i < numHairStrands; i++) {
        const angle = i * Math.PI / (numHairStrands - 1); // Spread out the hair over half the head
        const x1 = cx + radius * Math.cos(angle); // Starting point on top of the head
        const y1 = cy + radius * Math.sin(angle); // Starting point on top of the head

        // To create the curve, adjust both X and Y positions for a natural arc
        const curveFactor = (Math.random() - 0.5) * curveStrength; // Random factor to add a natural curve

        const x2 = x1 + curveFactor; // Curved x position
        const y2 = y1 - Math.abs(curveFactor); // Curved y position to fall around the face

        // Further adjust for the final curve around the face
        const x3 = x2 + (x2 > 0 ? faceRadius : -faceRadius); // Adjust curve direction around the face
        const y3 = y2 - Math.random() * 0.05; // Randomize the downward fall slightly

        hairVertices.push(x1, y1, x2, y2, x3, y3); // Add the curved path for each strand
    }

    return hairVertices;
}
function createCircle(cx, cy, radius, segments) {
    const vertices = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        vertices.push(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
    return vertices;
}

function drawShape(gl, program, vertices, color, mode) {
    // Create buffer and bind data
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Set attribute
    const a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Set uniform color
    const u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    gl.uniform4fv(u_FragColor, color);

    // Draw
    gl.drawArrays(mode, 0, vertices.length / 2);
}

// Initialize shaders (vertex and fragment shader)
function initShaders(gl, vertexShaderId, fragmentShaderId) {
    const vShaderSource = document.getElementById(vertexShaderId).textContent;
    const fShaderSource = document.getElementById(fragmentShaderId).textContent;

    const vShader = compileShader(gl, gl.VERTEX_SHADER, vShaderSource);
    const fShader = compileShader(gl, gl.FRAGMENT_SHADER, fShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Failed to link shaders:", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

main();
// function main() {
//     const canvas = document.getElementById("webgl-canvas");
//     const gl = canvas.getContext("webgl");

//     if (!gl) {
//         console.error("Failed to get WebGL context.");
//         return;
//     }

//     // Initialize shaders
//     const program = initShaders(gl, "vertex-shader", "fragment-shader");
//     if (!program) {
//         console.error("Failed to initialize shaders.");
//         return;
//     }
//     gl.useProgram(program);

//     // Set black background
//     gl.clearColor(0.0, 0.0, 0.0, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT);

//     // Define stick figure parts
//     const head = createCircle(0.0, 0.5, 0.1, 50); // Head: center (0, 0.5), radius 0.1
//     const torso = [
//         0.0, 0.4, // Top
//         0.0, -0.2 // Bottom
//     ];
//     const leftArm = [
//         0.0, 0.3,  // Shoulder
//         -0.2, 0.1 // Hand
//     ];
//     const rightArm = [
//         0.0, 0.3,  // Shoulder
//         0.2, 0.1  // Hand
//     ];
//     const leftLeg = [
//         0.0, -0.2, // Hip
//         -0.1, -0.5 // Foot
//     ];
//     const rightLeg = [
//         0.0, -0.2, // Hip
//         0.1, -0.5  // Foot
//     ];

//     // Draw all parts
//     drawShape(gl, program, head, [1.0, 1.0, 1.0, 1.0], gl.TRIANGLE_FAN); // Head
//     drawShape(gl, program, torso, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Torso
//     drawShape(gl, program, leftArm, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Left arm
//     drawShape(gl, program, rightArm, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Right arm
//     drawShape(gl, program, leftLeg, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Left leg
//     drawShape(gl, program, rightLeg, [1.0, 1.0, 1.0, 1.0], gl.LINES); // Right leg

//     // Add hair (curving around the face)
//     const hair = createCurvedHair(0.0, 0.6, 0.1); // Above the head
//     drawShape(gl, program, hair, [0.5, 0.3, 0.2, 1.0], gl.LINES); // Hair color

//     // Add smiley face
//     drawSmileyFace(gl, program, 0.0, 0.6, 0.1); // Smiley above the head
// }

// // Function to create the smiley face in WebGL
// function drawSmileyFace(gl, program, cx, cy, radius) {
//     // Circle for the face (just a simple circle)
//     const face = createCircle(cx, cy, radius, 50);
//     drawShape(gl, program, face, [1.0, 1.0, 0.0, 1.0], gl.TRIANGLE_FAN); // Yellow face

//     // Eyes (two small circles)
//     const eyeRadius = 0.02;
//     const leftEye = createCircle(cx - 0.03, cy + 0.05, eyeRadius, 10);
//     const rightEye = createCircle(cx + 0.03, cy + 0.05, eyeRadius, 10);
//     drawShape(gl, program, leftEye, [0.0, 0.0, 0.0, 1.0], gl.TRIANGLE_FAN); // Left eye
//     drawShape(gl, program, rightEye, [0.0, 0.0, 0.0, 1.0], gl.TRIANGLE_FAN); // Right eye

//     // Smile (an arc)
//     const smile = createSmile(cx, cy, radius - 0.05, 50);
//     drawShape(gl, program, smile, [0.0, 0.0, 0.0, 1.0], gl.LINES); // Black smile
// }

// // Function to create a smile (arc)
// function createSmile(cx, cy, radius, numPoints) {
//     const smileVertices = [];
//     const startAngle = Math.PI / 4;
//     const endAngle = 3 * Math.PI / 4;

//     for (let i = 0; i <= numPoints; i++) {
//         const angle = startAngle + (i / numPoints) * (endAngle - startAngle);
//         const x = cx + radius * Math.cos(angle);
//         const y = cy + radius * Math.sin(angle);
//         smileVertices.push(x, y);
//     }

//     return smileVertices;
// }

// function createCurvedHair(cx, cy, radius) {
//     const hairVertices = [];
//     const numHairStrands = 8; // Number of hair strands
//     const curveStrength = 0.4; // Controls how much the hair curves around the face
//     const faceRadius = 0.1; // Distance from center to the face boundary

//     for (let i = 0; i < numHairStrands; i++) {
//         const angle = i * Math.PI / (numHairStrands - 1); // Spread out the hair over half the head
//         const x1 = cx + radius * Math.cos(angle); // Starting point on top of the head
//         const y1 = cy + radius * Math.sin(angle); // Starting point on top of the head

//         // To create the curve, adjust both X and Y positions for a natural arc
//         const curveFactor = (Math.random() - 0.5) * curveStrength; // Random factor to add a natural curve

//         const x2 = x1 + curveFactor; // Curved x position
//         const y2 = y1 - Math.abs(curveFactor); // Curved y position to fall around the face

//         // Further adjust for the final curve around the face
//         const x3 = x2 + (x2 > 0 ? faceRadius : -faceRadius); // Adjust curve direction around the face
//         const y3 = y2 - Math.random() * 0.05; // Randomize the downward fall slightly

//         hairVertices.push(x1, y1, x2, y2, x3, y3); // Add the curved path for each strand
//     }

//     return hairVertices;
// }

// function createCircle(cx, cy, radius, segments) {
//     const vertices = [];
//     for (let i = 0; i <= segments; i++) {
//         const angle = (i / segments) * 2 * Math.PI;
//         vertices.push(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
//     }
//     return vertices;
// }

// function drawShape(gl, program, vertices, color, mode) {
//     // Create buffer and bind data
//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//     // Set attribute
//     const a_Position = gl.getAttribLocation(program, "a_Position");
//     gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_Position);

//     // Set uniform color
//     const u_FragColor = gl.getUniformLocation(program, "u_FragColor");
//     gl.uniform4fv(u_FragColor, color);

//     // Draw
//     gl.drawArrays(mode, 0, vertices.length / 2);
// }

// // Initialize shaders (vertex and fragment shader)
// function initShaders(gl, vertexShaderId, fragmentShaderId) {
//     const vShaderSource = document.getElementById(vertexShaderId).textContent;
//     const fShaderSource = document.getElementById(fragmentShaderId).textContent;

//     const vShader = compileShader(gl, gl.VERTEX_SHADER, vShaderSource);
//     const fShader = compileShader(gl, gl.FRAGMENT_SHADER, fShaderSource);

//     const program = gl.createProgram();
//     gl.attachShader(program, vShader);
//     gl.attachShader(program, fShader);
//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//         console.error("Failed to link shaders:", gl.getProgramInfoLog(program));
//         return null;
//     }
//     return program;
// }

// function compileShader(gl, type, source) {
//     const shader = gl.createShader(type);
//     gl.shaderSource(shader, source);
//     gl.compileShader(shader);

//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
//         return null;
//     }
//     return shader;
// }

// main();
