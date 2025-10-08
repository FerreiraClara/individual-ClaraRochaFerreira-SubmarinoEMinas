# 🎮 Jogo 2D no Canvas com LLMs (ChatGPT, Gemini ou Claude)

**Data de Entrega**: 08/10/2025

📚 *Disciplina: Desenvolvimento de Jogos Digitais*
👨🏻‍🏫 **Professor:** Christien Lana Rachid (https://github.com/christienrachid)
📍 *Centro Universitário Academia*
---

# 🚢 Submarino e Minas - Jogo 2D Canvas

## 📝 Descrição do Projeto

Jogo 2D desenvolvido em HTML5 Canvas onde o jogador controla um submarino que precisa desviar e destruir minas submarinas enquanto explora as profundezas do oceano. O projeto foi desenvolvido como parte do desafio acadêmico de criação de jogos 2D com suporte de LLMs (Large Language Models).

## 🎮 Como Jogar

### Controles
- **WASD** ou **Setas do Teclado**: Movimentar o submarino
- **Espaço**: Disparar torpedos

### Objetivo
- Destruir o máximo de minas possível
- Sobreviver o maior tempo possível
- Acumular a maior pontuação

### Sistema de Pontuação
- **+1 ponto**: Por frame de sobrevivência
- **+100 pontos**: Por cada mina destruída
- **-20 HP**: Por colisão com mina

## 🛠️ Recursos Técnicos Implementados

✅ Requisitos Obrigatórios (5/5)

🎞️ Loop de Animação

Implementado com requestAnimationFrame
Separação clara entre update() (lógica) e draw() (renderização)
Taxa de atualização de 60 FPS
Localização: main.js - função gameLoop()


🎮 Eventos de Teclado

Sistema de input responsivo com objeto keys
Suporte para WASD e setas direcionais
Barra de espaço para disparo de torpedos
Cooldown de disparo para balanceamento
Localização: main.js - Event listeners e classe Submarine


🌄 Paralaxe

3 camadas de fundo com velocidades diferentes (0.2x, 0.5x, 1.0x)
Efeito de profundidade oceânica
Bolhas animadas em cada camada para maior imersão
Loop infinito das camadas
Localização: main.js - classe ParallaxLayer


💥 Detecção de Colisão (AABB)

Sistema de Axis-Aligned Bounding Box implementado
Colisões detectadas:

Submarino vs Minas
Torpedos vs Minas


Função checkCollision() reutilizável
Sistema de invulnerabilidade temporária (1 segundo)
Localização: main.js - função checkCollision() e lógica em update()


🔫 Disparo / Projéteis

Array dinâmico de torpedos
Criação sob demanda ao pressionar espaço
Velocidade e direção configuráveis
Remoção automática ao sair da tela
Sistema de cooldown entre disparos
Localização: main.js - classe Torpedo e sistema de disparo em update()



🎨 Recursos Adicionais

✨ Sistema de Animação

Hélice animada do submarino
Espinhos rotativos das minas
Centro pulsante das minas
Efeito de piscar quando invulnerável


💥 Sistema de Partículas

Explosões visuais ao destruir minas
15 partículas por explosão
Física com gravidade
Fade out gradual
Localização: main.js - classe Particle


📊 HUD Completo

Pontuação em tempo real
Barra de vida do submarino
Contador de minas destruídas
Tela de Game Over com estatísticas finais
Localização: index.html (estrutura) e style.css (estilização)


⚡ Dificuldade Progressiva

Taxa de spawn de minas aumenta gradualmente
Minas com velocidades variadas
Sistema de health para minas (2 hits para destruir)



🗂️ Estrutura do Projeto
dupla-[sobrenome1]-[sobrenome2]-submarino/
│
├── index.html          # Estrutura HTML e elementos da página
│   ├── Container do jogo
│   ├── HUD (interface de informações)
│   ├── Canvas principal (800x600)
│   └── Tela de Game Over
│
├── style.css           # Estilização e layout do jogo
│   ├── Reset CSS
│   ├── Layout centralizado com gradiente
│   ├── Estilização do canvas
│   ├── HUD com efeitos visuais
│   └── Tela de Game Over responsiva
│
└── main.js             # Lógica completa do jogo
    ├── Configuração do Canvas
    ├── Estado do Jogo (variáveis globais)
    ├── Sistema de Input (event listeners)
    ├── Classes:
    │   ├── ParallaxLayer    # Camadas de fundo (paralaxe)
    │   ├── Submarine        # Jogador controlável
    │   ├── Torpedo          # Projéteis
    │   ├── Mine             # Inimigos
    │   └── Particle         # Efeitos visuais
    ├── Funções Auxiliares:
    │   ├── checkCollision() # Detecção AABB
    │   └── createExplosion()# Gerador de partículas
    ├── Loop Principal:
    │   ├── update()         # Lógica do jogo
    │   ├── draw()           # Renderização
    │   └── gameLoop()       # RequestAnimationFrame
    └── Controle de Jogo:
        ├── showGameOver()   # Exibe tela final
        └── restartGame()    # Reinicia o jogo

## 🎯 Mecânicas de Jogo

### Submarino (Player)
- **Vida**: 100 HP
- **Velocidade**: 4 pixels/frame
- **Invulnerabilidade**: 1 segundo após dano
- **Tamanho**: 80x40 pixels

### Minas (Enemies)
- **Vida**: 2 HP (necessita 2 torpedos)
- **Velocidade**: 1-2.5 pixels/frame (variável)
- **Raio**: 20 pixels
- **Dano**: 20 HP

### Torpedos (Projectiles)
- **Velocidade**: 8 pixels/frame
- **Cooldown**: 15 frames (~0.25s)
- **Tamanho**: 20x6 pixels

## 🤖 Desenvolvimento com LLMs

### LLM A: Claude (Anthropic)

**Prompts Utilizados:**

1. **Prompt de Ideação Inicial:**
```
Atue como desenvolvedor de jogos 2D em HTML5 Canvas. Crie um jogo completo no tema 
'Submarino e minas', implementando: loop de animação com requestAnimationFrame, 
eventos de teclado (WASD/setas + espaço para disparar), paralaxe com múltiplas 
camadas oceânicas, sistema de colisão AABB, animações de sprites, e sistema de 
disparo de torpedos. O jogo deve ser funcional, com HUD, sistema de pontuação, 
game over e restart. Inclua comentários explicativos.
```

**Resultado:**
- ✅ Código completo funcional em um único arquivo HTML
- ✅ Todos os 5 recursos técnicos obrigatórios implementados
- ✅ Sistema de jogo completo (início, gameplay, game over)
- ✅ Código bem comentado e organizado
- ✅ Design visual coerente com tema submarino

## 📦 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/FerreiraClara/individual-ClaraRochaFerreira-SubmarinoEMinas.git
```

2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge)

3. Não é necessário servidor local - o jogo roda diretamente no navegador

## 🎨 Assets e Créditos

### Recursos Utilizados
- **Gráficos**: Desenvolvidos proceduralmente com Canvas API
- **Código**: Gerado com assistência de Claude (Anthropic)
- **Design**: Original, baseado no tema proposto (Submarino e Minas)

### Bibliotecas
- Nenhuma biblioteca externa utilizada
- Apenas HTML5, CSS3 e JavaScript vanilla


## 📚 Aprendizados

### Técnicos
- Implementação de game loop com requestAnimationFrame
- Sistema de colisão AABB eficiente
- Gerenciamento de estado de jogo
- Sistema de paralaxe para profundidade visual
- Otimização de canvas rendering

### Uso de IA
- Prompts claros e específicos geram melhores resultados
- Importância de validar e testar código gerado por IA
- IA como ferramenta de aceleração, não substituição
- Iteração e refinamento são fundamentais

## 👥 Equipe

- **Desenvolvedor 1**: Clara Rocha Ferreira - Geração com LLM A (Claude)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso Desenvolvimento de Jogos Digitais na Centro Universitário Academia.

## 🔗 Links

- **Repositório**: https://github.com/FerreiraClara/individual-ClaraRochaFerreira-SubmarinoEMinas.git

---
