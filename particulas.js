/* global AFRAME, THREE */

AFRAME.registerComponent('mundo-invertido-particulas', {
    schema: {
        count: {type: 'number', default: 500},
        size: {type: 'number', default: 0.05},
        area: {type: 'number', default: 10}
    },

    // SUBSTITUA A FUNÇÃO 'init' ANTIGA POR ESTA
    init: function () {
        const data = this.data;
        const el = this.el;

        // --- INÍCIO DA MODIFICAÇÃO ---

        // 1. Criar o código da partícula usando SVG
        // Este SVG desenha um gradiente radial (círculo que vai de branco a transparente)
        const svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs>
                    <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:0" />
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="50" fill="url(#grad)"/>
            </svg>`;

        // 2. Converter a string do SVG para um Data URI
        // btoa() codifica a string em Base64
        const dataUri = 'data:image/svg+xml;base64,' + window.btoa(svgString);

        // 3. Usar o Data URI para carregar a textura
        const textureLoader = new THREE.TextureLoader();
        // O loader carrega o Data URI como se fosse um arquivo .png
        const particleTexture = textureLoader.load(dataUri);
        
        // --- FIM DA MODIFICAÇÃO ---

        // O resto do código permanece o mesmo
        this.geometry = new THREE.BufferGeometry();
        const positions = [];

        for (let i = 0; i < data.count; i++) {
            const x = (Math.random() - 0.5) * data.area;
            const y = (Math.random() - 0.5) * data.area;
            const z = (Math.random() - 0.5) * data.area;
            positions.push(x, y, z);
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        this.material = new THREE.PointsMaterial({
            color: '#FFFFFF',
            size: data.size,
            map: particleTexture, // A textura agora vem do nosso SVG
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0.7
        });

        this.points = new THREE.Points(this.geometry, this.material);
        el.setObject3D('particles', this.points);
    },

    // A função tick permanece exatamente a mesma
    tick: function (time, timeDelta) {
        const positions = this.geometry.attributes.position.array;
        const area = this.data.area;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += 0.001;
            positions[i] += Math.sin(time * 0.0005 + i) * 0.0005;

            if (positions[i + 1] > area / 2) {
                positions[i + 1] = -area / 2;
            }
        }
        this.geometry.attributes.position.needsUpdate = true;
    }
});
