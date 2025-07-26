/* global AFRAME, THREE */

AFRAME.registerComponent('mundo-invertido-particulas', {
    schema: {
        count: { type: 'number', default: 500 },
        size: { type: 'number', default: 0.05 },
        area: { type: 'number', default: 10 }
    },

    /**
     * Função que gera a textura da partícula dinamicamente.
     * @returns {HTMLCanvasElement} - Um elemento canvas com a partícula desenhada.
     */
    generateParticleTexture: function () {
        // 1. Criamos um elemento canvas na memória (ele não aparece na página)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 64; // Tamanho da textura em pixels (64x64 é suficiente)
        canvas.width = size;
        canvas.height = size;

        // 2. Criamos um gradiente radial (círculo que vai do centro para as bordas)
        const gradient = ctx.createRadialGradient(
            size / 2, size / 2, 0, // Círculo inicial (centro)
            size / 2, size / 2, size / 2 // Círculo final (borda)
        );

        // 3. Definimos as cores do gradiente para criar o efeito "suave"
        // Começa 100% branco e opaco no centro
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        // Termina 100% branco e totalmente transparente nas bordas
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        // 4. Preenchemos o canvas com o gradiente
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        // 5. Retornamos o canvas pronto para ser usado como textura
        return canvas;
    },

    init: function () {
        const data = this.data;
        const el = this.el;

        // --- GERAÇÃO DA TEXTURA VIA CÓDIGO ---
        // Aqui chamamos nossa nova função para criar a textura
        const particleCanvas = this.generateParticleTexture();
        
        // Em vez de usar TextureLoader, usamos CanvasTexture, que é feita para isso
        const particleTexture = new THREE.CanvasTexture(particleCanvas);
        // --- FIM DA GERAÇÃO DA TEXTURA ---

        // O resto do código é o mesmo de antes
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
