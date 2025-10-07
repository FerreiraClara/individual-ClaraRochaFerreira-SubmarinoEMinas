// ========== CONFIGURAÇÃO DO CANVAS ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ========== ESTADO DO JOGO ==========
let gameState = 'playing'; // 'playing' ou 'gameOver'
let score = 0;
let minesDestroyed = 0;

// ========== CONTROLE DE TECLADO ==========
// Objeto para rastrear quais teclas estão pressionadas
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
    ' ': false
};

// Event listeners para capturar input do teclado
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
        e.preventDefault();
    }
});

// ========== SISTEMA DE PARALAXE ==========
/**
 * Classe que representa uma camada de fundo com efeito parallax
 * Camadas mais lentas criam sensação de profundidade
 */
class ParallaxLayer {
    constructor(speed, color, yOffset = 0) {
        this.speed = speed;
        this.color = color;
        this.x = 0;
        this.yOffset = yOffset;
        this.bubbles = [];
        
        // Criar bolhas aleatórias para cada camada
        for (let i = 0; i < 10; i++) {
            this.bubbles.push({
                x: Math.random() * WIDTH,
                y: Math.random() * HEIGHT,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2
            });
        }
    }

    update() {
        // Mover camada horizontalmente
        this.x -= this.speed;
        if (this.x <= -WIDTH) {
            this.x = 0;
        }
        
        // Atualizar bolhas (movimento vertical)
        this.bubbles.forEach(bubble => {
            bubble.y -= bubble.speed;
            if (bubble.y < -10) {
                bubble.y = HEIGHT + 10;
                bubble.x = Math.random() * WIDTH;
            }
        });
    }

    draw() {
        // Desenhar fundo gradiente com efeito de paralaxe
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(this.x, this.yOffset, WIDTH, HEIGHT);
        ctx.fillRect(this.x + WIDTH, this.yOffset, WIDTH, HEIGHT);
        
        // Desenhar bolhas
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.bubbles.forEach(bubble => {
            ctx.beginPath();
            ctx.arc(bubble.x + this.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1.0;
    }
}

// Criar camadas de paralaxe com velocidades diferentes (profundidade)
const parallaxLayers = [
    new ParallaxLayer(0.2, '#002244', 0),   // Camada mais lenta (fundo)
    new ParallaxLayer(0.5, '#003355', 100), // Camada média
    new ParallaxLayer(1.0, '#004466', 200)  // Camada mais rápida (frente)
];

// ========== SUBMARINO (PLAYER) ==========
/**
 * Classe do jogador - submarino controlado pelo usuário
 * Responde a inputs de teclado (WASD/Setas)
 */
class Submarine {
    constructor() {
        this.x = 100;
        this.y = HEIGHT / 2;
        this.width = 80;
        this.height = 40;
        this.speed = 4;
        this.health = 100;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        
        // Animação simples (oscilação)
        this.animFrame = 0;
        this.animSpeed = 0.1;
    }

    update() {
        // Movimento vertical
        if (keys.ArrowUp || keys.w) {
            this.y -= this.speed;
        }
        if (keys.ArrowDown || keys.s) {
            this.y += this.speed;
        }
        
        // Movimento horizontal
        if (keys.ArrowLeft || keys.a) {
            this.x -= this.speed;
        }
        if (keys.ArrowRight || keys.d) {
            this.x += this.speed;
        }

        // Limites da tela (impedir que saia do canvas)
        this.x = Math.max(0, Math.min(WIDTH - this.width, this.x));
        this.y = Math.max(0, Math.min(HEIGHT - this.height, this.y));

        // Atualizar animação
        this.animFrame += this.animSpeed;

        // Atualizar invulnerabilidade temporária após dano
        if (this.invulnerable) {
            this.invulnerableTimer--;
            if (this.invulnerableTimer <= 0) {
                this.invulnerable = false;
            }
        }
    }

    draw() {
        // Efeito de piscar quando invulnerável
        if (this.invulnerable && Math.floor(this.animFrame) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Corpo do submarino
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(this.x, this.y + 10, this.width - 20, this.height - 20);
        
        // Nariz do submarino (triângulo)
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 20, this.y + 10);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width - 20, this.y + this.height - 10);
        ctx.closePath();
        ctx.fill();

        // Torre de comando
        ctx.fillStyle = '#cc9900';
        ctx.fillRect(this.x + 20, this.y, 30, 15);

        // Janela
        ctx.fillStyle = '#66ccff';
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 20, 8, 0, Math.PI * 2);
        ctx.fill();

        // Hélice (animada com movimento senoidal)
        const propellerOffset = Math.sin(this.animFrame) * 3;
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + this.height / 2 - 10 + propellerOffset);
        ctx.lineTo(this.x + 5, this.y + this.height / 2 + 10 - propellerOffset);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
    }

    takeDamage(amount) {
        if (!this.invulnerable) {
            this.health -= amount;
            this.invulnerable = true;
            this.invulnerableTimer = 60; // 1 segundo de invulnerabilidade (60 frames)
            
            if (this.health <= 0) {
                gameState = 'gameOver';
                showGameOver();
            }
        }
    }

    // Retorna bounding box para detecção de colisão
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ========== TORPEDOS (PROJÉTEIS) ==========
/**
 * Classe de projéteis disparados pelo submarino
 * Movem-se horizontalmente e destroem minas
 */
class Torpedo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 6;
        this.speed = 8;
        this.active = true;
    }

    update() {
        this.x += this.speed;
        
        // Remover se sair da tela
        if (this.x > WIDTH) {
            this.active = false;
        }
    }

    draw() {
        // Corpo do torpedo
        ctx.fillStyle = '#ff3333';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Cauda do torpedo
        ctx.fillStyle = '#ff6666';
        ctx.fillRect(this.x - 5, this.y + 1, 5, 4);
    }

    // Retorna bounding box para detecção de colisão
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ========== MINAS (INIMIGOS) ==========
/**
 * Classe de inimigos - minas submarinas
 * Movem-se da direita para a esquerda
 * Requerem 2 hits para serem destruídas
 */
class Mine {
    constructor() {
        this.x = WIDTH + Math.random() * 200;
        this.y = Math.random() * (HEIGHT - 60) + 30;
        this.radius = 20;
        this.speed = 1 + Math.random() * 1.5;
        this.active = true;
        this.health = 2;
        
        // Animação de espinhos
        this.spikeAnim = Math.random() * Math.PI * 2;
    }

    update() {
        this.x -= this.speed;
        this.spikeAnim += 0.05;
        
        // Remover se sair da tela pela esquerda
        if (this.x < -this.radius * 2) {
            this.active = false;
        }
    }

    draw() {
        // Corpo da mina (esfera escura)
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Espinhos rotativos
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 3;
        const spikeCount = 8;
        for (let i = 0; i < spikeCount; i++) {
            const angle = (Math.PI * 2 / spikeCount) * i + this.spikeAnim;
            const x1 = this.x + Math.cos(angle) * this.radius;
            const y1 = this.y + Math.sin(angle) * this.radius;
            const x2 = this.x + Math.cos(angle) * (this.radius + 10);
            const y2 = this.y + Math.sin(angle) * (this.radius + 10);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Centro vermelho pulsante
        const pulseSize = this.radius * 0.5 + Math.sin(this.spikeAnim * 2) * 5;
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.active = false;
            return true; // Mina destruída
        }
        return false; // Mina ainda viva
    }

    // Retorna bounding box circular para detecção de colisão
    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}

// ========== PARTÍCULAS DE EXPLOSÃO ==========
/**
 * Classe de efeito visual para explosões
 * Partículas são criadas e desaparecem gradualmente
 */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 30;
        this.maxLife = 30;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravidade
        this.life--;
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}

// ========== INSTÂNCIAS DO JOGO ==========
// Arrays para armazenar entidades ativas
const submarine = new Submarine();
const torpedos = [];
const mines = [];
const particles = [];

// Variáveis de controle de gameplay
let shootCooldown = 0;
let mineSpawnTimer = 0;
let mineSpawnRate = 120; // Spawn a cada 2 segundos (120 frames)

// ========== DETECÇÃO DE COLISÃO AABB ==========
/**
 * Axis-Aligned Bounding Box (AABB) Collision Detection
 * Verifica se dois retângulos estão se sobrepondo
 * @param {Object} a - Primeiro objeto com {x, y, width, height}
 * @param {Object} b - Segundo objeto com {x, y, width, height}
 * @returns {boolean} True se há colisão
 */
function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// ========== CRIAR EXPLOSÃO ==========
/**
 * Cria um efeito visual de explosão na posição especificada
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {string} color - Cor das partículas
 */
function createExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// ========== ATUALIZAÇÃO DO JOGO (LÓGICA) ==========
/**
 * Função update() - Processa toda a lógica do jogo
 * Atualiza posições, detecta colisões, gerencia estado
 */
function update() {
    if (gameState !== 'playing') return;

    // Atualizar sistema de paralaxe
    parallaxLayers.forEach(layer => layer.update());

    // Atualizar submarino (movimento e animação)
    submarine.update();

    // Sistema de disparo de torpedos
    if ((keys[' ']) && shootCooldown <= 0) {
        torpedos.push(new Torpedo(
            submarine.x + submarine.width,
            submarine.y + submarine.height / 2 - 3
        ));
        shootCooldown = 15; // Cooldown de 15 frames entre disparos
    }
    if (shootCooldown > 0) shootCooldown--;

    // Atualizar todos os torpedos
    for (let i = torpedos.length - 1; i >= 0; i--) {
        torpedos[i].update();
        // Remover torpedos inativos
        if (!torpedos[i].active) {
            torpedos.splice(i, 1);
        }
    }

    // Sistema de spawn de minas
    mineSpawnTimer++;
    if (mineSpawnTimer >= mineSpawnRate) {
        mines.push(new Mine());
        mineSpawnTimer = 0;
        
        // Aumentar dificuldade gradualmente (spawn mais rápido)
        if (mineSpawnRate > 60) {
            mineSpawnRate -= 0.5;
        }
    }

    // Atualizar todas as minas
    for (let i = mines.length - 1; i >= 0; i--) {
        mines[i].update();
        
        // Colisão mina vs submarino
        if (checkCollision(submarine.getBounds(), mines[i].getBounds())) {
            submarine.takeDamage(20);
            createExplosion(mines[i].x, mines[i].y, '#ff6600');
            mines.splice(i, 1);
            continue;
        }

        // Remover minas inativas (saíram da tela)
        if (!mines[i].active) {
            mines.splice(i, 1);
        }
    }

    // Colisão torpedo vs mina
    for (let i = torpedos.length - 1; i >= 0; i--) {
        for (let j = mines.length - 1; j >= 0; j--) {
            if (checkCollision(torpedos[i].getBounds(), mines[j].getBounds())) {
                const destroyed = mines[j].takeDamage();
                torpedos[i].active = false;
                
                if (destroyed) {
                    score += 100;
                    minesDestroyed++;
                    createExplosion(mines[j].x, mines[j].y, '#ffff00');
                    mines.splice(j, 1);
                }
                break;
            }
        }
    }

    // Atualizar todas as partículas
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    // Atualizar pontuação por sobrevivência
    score += 1;
}

// ========== RENDERIZAÇÃO DO JOGO (VISUAL) ==========
/**
 * Função draw() - Renderiza todos os elementos visuais
 * Ordem de renderização importa (camadas)
 */
function draw() {
    // Limpar canvas
    ctx.fillStyle = '#001a33';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Desenhar camadas de paralaxe (fundo)
    parallaxLayers.forEach(layer => layer.draw());

    // Desenhar minas (inimigos)
    mines.forEach(mine => mine.draw());

    // Desenhar torpedos (projéteis)
    torpedos.forEach(torpedo => torpedo.draw());

    // Desenhar submarino (jogador)
    submarine.draw();

    // Desenhar partículas (efeitos)
    particles.forEach(particle => particle.draw());

    // Atualizar HUD (interface)
    document.getElementById('score').textContent = Math.floor(score);
    document.getElementById('health').textContent = Math.max(0, submarine.health);
    document.getElementById('minesDestroyed').textContent = minesDestroyed;
}

// ========== LOOP PRINCIPAL DO JOGO ==========
/**
 * Game Loop - Executa 60x por segundo
 * Chama update() e draw() continuamente
 */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// ========== GAME OVER ==========
/**
 * Exibe a tela de game over com estatísticas finais
 */
function showGameOver() {
    document.getElementById('finalScore').textContent = Math.floor(score);
    document.getElementById('finalMines').textContent = minesDestroyed;
    document.getElementById('gameOver').style.display = 'block';
}

// ========== REINICIAR JOGO ==========
/**
 * Reseta todas as variáveis e reinicia o jogo
 */
function restartGame() {
    // Resetar estado
    gameState = 'playing';
    score = 0;
    minesDestroyed = 0;
    shootCooldown = 0;
    mineSpawnTimer = 0;
    mineSpawnRate = 120;

    // Limpar arrays de entidades
    torpedos.length = 0;
    mines.length = 0;
    particles.length = 0;

    // Resetar submarino
    submarine.x = 100;
    submarine.y = HEIGHT / 2;
    submarine.health = 100;
    submarine.invulnerable = false;

    // Esconder tela de game over
    document.getElementById('gameOver').style.display = 'none';
}

// ========== INICIAR O JOGO ==========
gameLoop();