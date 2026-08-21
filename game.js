// 游戏配置
const CONFIG = {
    GRID_SIZE: 20,
    CANVAS_SIZE: 400,
    INITIAL_SPEED: 100,
    MIN_SPEED: 30,
    SPEED_INCREMENT: 5,
};

// 游戏类
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 初始化游戏状态
        this.reset();
        this.loadHighScore();
        this.setupEventListeners();
        this.start();
    }

    reset() {
        // 蛇的初始位置和方向
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // 食物位置
        this.food = this.generateFood();
        
        // 游戏状态
        this.score = 0;
        this.level = 1;
        this.isPaused = false;
        this.isGameOver = false;
        this.speed = CONFIG.INITIAL_SPEED;
        
        // 更新 UI
        this.updateScore();
        this.updateLevel();
    }

    setupEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // 按钮控制
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.handleRestart());
        document.getElementById('restartBtn2').addEventListener('click', () => this.handleRestart());
    }

    handleKeyPress(e) {
        if (this.isGameOver) return;

        switch (e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                e.preventDefault();
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
                break;
            case 'arrowdown':
            case 's':
                e.preventDefault();
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
                break;
            case 'arrowleft':
            case 'a':
                e.preventDefault();
                if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
                break;
            case 'arrowright':
            case 'd':
                e.preventDefault();
                if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
                break;
            case ' ':
                e.preventDefault();
                this.togglePause();
                break;
            case 'r':
                e.preventDefault();
                this.handleRestart();
                break;
        }
    }

    togglePause() {
        if (this.isGameOver) return;
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '继续' : '暂停';
    }

    handleRestart() {
        this.reset();
        document.getElementById('gameOverModal').classList.remove('show');
        document.getElementById('pauseBtn').textContent = '暂停';
    }

    start() {
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isPaused) {
            this.update();
        }
        this.draw();
        
        // 根据等级调整速度
        const delay = Math.max(CONFIG.MIN_SPEED, CONFIG.INITIAL_SPEED - (this.level - 1) * CONFIG.SPEED_INCREMENT);
        setTimeout(() => this.gameLoop(), delay);
    }

    update() {
        // 更新方向
        this.direction = this.nextDirection;
        
        // 计算新的蛇头位置
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        
        // 检查碰撞（墙壁）
        if (this.checkWallCollision(newHead)) {
            this.endGame();
            return;
        }
        
        // 检查碰撞（自己）
        if (this.checkSelfCollision(newHead)) {
            this.endGame();
            return;
        }
        
        // 添加新头
        this.snake.unshift(newHead);
        
        // 检查是否吃到食物
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10 * this.level;
            this.updateScore();
            this.food = this.generateFood();
            
            // 每吃10个食物升级
            if ((this.score / 10) % 10 === 0) {
                this.level++;
                this.updateLevel();
            }
        } else {
            // 没有吃到食物，移除尾部
            this.snake.pop();
        }
    }

    checkWallCollision(head) {
        return head.x < 0 || head.x >= CONFIG.GRID_SIZE || 
               head.y < 0 || head.y >= CONFIG.GRID_SIZE;
    }

    checkSelfCollision(head) {
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    generateFood() {
        let food;
        let isOnSnake = true;
        
        while (isOnSnake) {
            food = {
                x: Math.floor(Math.random() * CONFIG.GRID_SIZE),
                y: Math.floor(Math.random() * CONFIG.GRID_SIZE)
            };
            
            isOnSnake = this.snake.some(segment => segment.x === food.x && segment.y === food.y);
        }
        
        return food;
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格（可选）
        this.drawGrid();
        
        // 绘制蛇
        this.drawSnake();
        
        // 绘制食物
        this.drawFood();
        
        // 绘制暂停文字
        if (this.isPaused) {
            this.drawPausedText();
        }
    }

    drawGrid() {
        const cellSize = this.canvas.width / CONFIG.GRID_SIZE;
        this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= CONFIG.GRID_SIZE; i++) {
            const pos = i * cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }

    drawSnake() {
        const cellSize = this.canvas.width / CONFIG.GRID_SIZE;
        
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头
                this.ctx.fillStyle = '#00ff00';
            } else {
                // 蛇身
                this.ctx.fillStyle = '#00cc00';
            }
            
            this.ctx.fillRect(
                segment.x * cellSize + 1,
                segment.y * cellSize + 1,
                cellSize - 2,
                cellSize - 2
            );
        });
    }

    drawFood() {
        const cellSize = this.canvas.width / CONFIG.GRID_SIZE;
        
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * cellSize + cellSize / 2,
            this.food.y * cellSize + cellSize / 2,
            cellSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    drawPausedText() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('暂停', this.canvas.width / 2, this.canvas.height / 2);
    }

    endGame() {
        this.isGameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('gameOverModal').classList.add('show');
        document.getElementById('pauseBtn').textContent = '暂停';
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    updateLevel() {
        document.getElementById('level').textContent = this.level;
    }

    saveHighScore() {
        const currentHighScore = parseInt(localStorage.getItem('snakeHighScore') || 0);
        if (this.score > currentHighScore) {
            localStorage.setItem('snakeHighScore', this.score);
            document.getElementById('highScore').textContent = this.score;
        }
    }

    loadHighScore() {
        const highScore = localStorage.getItem('snakeHighScore') || 0;
        document.getElementById('highScore').textContent = highScore;
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    
    // 监听游戏结束事件，保存最高分
    const originalEndGame = game.endGame.bind(game);
    game.endGame = function() {
        originalEndGame();
        this.saveHighScore();
    };
});
