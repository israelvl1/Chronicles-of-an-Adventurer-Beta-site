// Obtém o canvas do HTML e define seu contexto 2D
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define o tamanho do canvas para ocupar a tela inteira
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Texto que será exibido como partículas
const text = "SoloDev Israel";

// Arrays que armazenam as partículas da imagem e do texto
const imgParticles = [];
const textParticles = [];

let imageDataReady = false; // Flag para indicar se os dados da imagem já foram carregados
let dispersed = false;      // Controla se as partículas estão dispersas ou agrupadas
let timer = 0;
const interval = 240;       // Intervalo de frames entre mudar o estado (dispersar ou agrupar)
const delayFrames = 300;    // Delay antes de iniciar a animação das partículas do texto (5 segundos a 60fps)

// Classe que representa uma partícula individual
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.origX = x; // Posição original X
        this.origY = y; // Posição original Y
        this.color = color;
        // Velocidades aleatórias para dispersão
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
    }

    // Atualiza a posição da partícula com base no estado (disperso ou não)
    update() {
        if (dispersed) {
            // Movimento livre se estiver dispersa
            this.x += this.vx;
            this.y += this.vy;
        } else {
            // Movimento suave de volta à posição original
            this.x += (this.origX - this.x) * 0.05;
            this.y += (this.origY - this.y) * 0.05;
        }
    }

    // Desenha a partícula no canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 2, 2); // Quadrado de 2x2 pixels
    }
}

// Cria imagem de onde as partículas serão geradas
const img = new Image();
img.src = '../fundos/dinamic.png'; // Caminho da imagem

// Cria partículas com base na imagem carregada
function createParticlesFromImage() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const imgW = 400;
    const imgH = 500;

    tempCanvas.width = imgW;
    tempCanvas.height = imgH;

    tempCtx.drawImage(img, 0, 0, imgW, imgH);
    const data = tempCtx.getImageData(0, 0, imgW, imgH).data;

    // Percorre a imagem a cada 3 pixels para criar partículas
    for (let y = 0; y < imgH; y += 3) {
        for (let x = 0; x < imgW; x += 3) {
            const index = (y * imgW + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            if (a > 128) {
                const color = `rgb(${r},${g},${b})`;
                const px = x + canvas.width / 2 - imgW / 2;
                const py = y + canvas.height / 2 - imgH / 2 - 100;
                imgParticles.push(new Particle(px, py, color));
            }
        }
    }
}

// Cria partículas com base no texto
function createParticlesFromText() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const fontSize = 80;
    tempCanvas.width = canvas.width;
    tempCanvas.height = 150;
    tempCtx.font = `${fontSize}px 'MedievalSharp', sans-serif`;
    tempCtx.textBaseline = 'top';

    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Cria um gradiente colorido para o texto
    const gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, 0);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'gold');
    gradient.addColorStop(1, 'green');

    const textWidth = tempCtx.measureText(text).width;
    tempCtx.fillStyle = gradient;
    tempCtx.fillText(text, (tempCanvas.width - textWidth) / 2, 0);

    const data = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;

    // Cria partículas para cada pixel do texto com opacidade suficiente
    for (let y = 0; y < tempCanvas.height; y += 4) {
        for (let x = 0; x < tempCanvas.width; x += 4) {
            const index = (y * tempCanvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            if (a > 128) {
                const color = `rgb(${r},${g},${b})`;
                const px = x;
                const py = y + canvas.height / 2 + 100;
                textParticles.push(new Particle(px, py, color));
            }
        }
    }
}

// Quando a imagem for carregada, cria as partículas
img.onload = () => {
    createParticlesFromImage();
    createParticlesFromText();
    imageDataReady = true;
};

const redirectDelay = 15000;
const fadeDuration = 1000; // tempo do fade em ms

setTimeout(() => {
    const overlay = document.getElementById('fade-overlay');
    overlay.style.opacity = 1; // inicia fade-out

    // espera o fade terminar antes de redirecionar
    setTimeout(() => {
        window.location.href = 'site.html';
    }, fadeDuration);
}, redirectDelay);

// Função principal de animação
function animate() {
    requestAnimationFrame(animate); // Chama recursivamente para criar a animação
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    if (!imageDataReady) return;

    timer++;

    // Alterna entre estado disperso e reunido a cada intervalo
    if (timer % interval === 0) dispersed = !dispersed;

    // Durante os primeiros segundos, só anima a imagem (o texto aparece fixo)
    if (timer < delayFrames) {
        imgParticles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        textParticles.forEach(p => p.draw(ctx)); // texto parado
    } else {
        // Após o delay, anima ambas as partículas
        imgParticles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        textParticles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
    }
}

animate(); // Inicia a animação

// Redimensiona o canvas e recria as partículas quando a janela muda de tamanho
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    imgParticles.length = 0;
    textParticles.length = 0;
    if (imageDataReady) {
        createParticlesFromImage();
        createParticlesFromText();
    }
});
