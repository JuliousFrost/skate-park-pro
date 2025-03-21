// UI Manager for Skate Park Pro
// Handles all user interface elements, HUD, and menus

class UIManager {
    constructor() {
        this.elements = {};
        this.isVisible = true;
        this.initialized = false;
        this.score = 0;
        this.tricks = 0;
        this.currentCombo = 0;
        this.dimensionShifts = 0;
        this.gameState = 'menu'; // menu, playing, paused, gameover
    }

    // Initialize UI elements
    init() {
        if (this.initialized) return;
        
        // Create UI container
        this.createUIContainer();
        
        // Create HUD elements
        this.createHUD();
        
        // Create menu elements
        this.createMenus();
        
        // Set up event listeners
        this.setupEventListeners();
        
        this.initialized = true;
        
        // Show main menu by default
        this.showMainMenu();
    }

    // Create main UI container
    createUIContainer() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'ui-container';
        uiContainer.style.position = 'absolute';
        uiContainer.style.top = '0';
        uiContainer.style.left = '0';
        uiContainer.style.width = '100%';
        uiContainer.style.height = '100%';
        uiContainer.style.pointerEvents = 'none';
        uiContainer.style.zIndex = '10';
        uiContainer.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(uiContainer);
        
        this.elements.container = uiContainer;
    }

    // Create HUD elements (in-game UI)
    createHUD() {
        // Score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        scoreDisplay.className = 'hud-element';
        scoreDisplay.innerHTML = 'Score: 0';
        scoreDisplay.style.position = 'absolute';
        scoreDisplay.style.top = '20px';
        scoreDisplay.style.right = '20px';
        scoreDisplay.style.color = 'white';
        scoreDisplay.style.fontSize = '24px';
        scoreDisplay.style.fontWeight = 'bold';
        scoreDisplay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        this.elements.container.appendChild(scoreDisplay);
        this.elements.scoreDisplay = scoreDisplay;
        
        // Combo meter
        const comboMeter = document.createElement('div');
        comboMeter.id = 'combo-meter';
        comboMeter.className = 'hud-element';
        comboMeter.innerHTML = 'Combo: x1';
        comboMeter.style.position = 'absolute';
        comboMeter.style.top = '50px';
        comboMeter.style.right = '20px';
        comboMeter.style.color = 'white';
        comboMeter.style.fontSize = '18px';
        comboMeter.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        comboMeter.style.opacity = '0';
        comboMeter.style.transition = 'opacity 0.3s';
        this.elements.container.appendChild(comboMeter);
        this.elements.comboMeter = comboMeter;
        
        // Dimension indicator
        const dimensionIndicator = document.createElement('div');
        dimensionIndicator.id = 'dimension-indicator';
        dimensionIndicator.className = 'hud-element';
        dimensionIndicator.innerHTML = 'DIMENSION: NORMAL';
        dimensionIndicator.style.position = 'absolute';
        dimensionIndicator.style.top = '20px';
        dimensionIndicator.style.left = '20px';
        dimensionIndicator.style.color = 'white';
        dimensionIndicator.style.fontSize = '18px';
        dimensionIndicator.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        dimensionIndicator.style.padding = '5px 10px';
        dimensionIndicator.style.borderRadius = '4px';
        dimensionIndicator.style.background = 'rgba(0,0,0,0.3)';
        this.elements.container.appendChild(dimensionIndicator);
        this.elements.dimensionIndicator = dimensionIndicator;
        
        // Trick notification
        const trickNotification = document.createElement('div');
        trickNotification.id = 'trick-notification';
        trickNotification.className = 'hud-element';
        trickNotification.style.position = 'absolute';
        trickNotification.style.bottom = '100px';
        trickNotification.style.left = '50%';
        trickNotification.style.transform = 'translateX(-50%)';
        trickNotification.style.color = 'white';
        trickNotification.style.fontSize = '28px';
        trickNotification.style.fontWeight = 'bold';
        trickNotification.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        trickNotification.style.textAlign = 'center';
        trickNotification.style.opacity = '0';
        trickNotification.style.transition = 'opacity 0.3s, transform 0.3s';
        this.elements.container.appendChild(trickNotification);
        this.elements.trickNotification = trickNotification;
        
        // Pause button
        const pauseButton = document.createElement('div');
        pauseButton.id = 'pause-button';
        pauseButton.className = 'hud-element';
        pauseButton.innerHTML = '❚❚';
        pauseButton.style.position = 'absolute';
        pauseButton.style.top = '20px';
        pauseButton.style.left = '50%';
        pauseButton.style.transform = 'translateX(-50%)';
        pauseButton.style.color = 'white';
        pauseButton.style.fontSize = '24px';
        pauseButton.style.cursor = 'pointer';
        pauseButton.style.width = '40px';
        pauseButton.style.height = '40px';
        pauseButton.style.lineHeight = '40px';
        pauseButton.style.textAlign = 'center';
        pauseButton.style.background = 'rgba(0,0,0,0.3)';
        pauseButton.style.borderRadius = '50%';
        pauseButton.style.pointerEvents = 'auto';
        this.elements.container.appendChild(pauseButton);
        this.elements.pauseButton = pauseButton;
        
        // Hide HUD elements initially
        this.hideHUD();
    }

    // Create menu elements
    createMenus() {
        // Main Menu
        const mainMenu = document.createElement('div');
        mainMenu.id = 'main-menu';
        mainMenu.className = 'menu';
        mainMenu.style.position = 'absolute';
        mainMenu.style.top = '0';
        mainMenu.style.left = '0';
        mainMenu.style.width = '100%';
        mainMenu.style.height = '100%';
        mainMenu.style.display = 'flex';
        mainMenu.style.flexDirection = 'column';
        mainMenu.style.justifyContent = 'center';
        mainMenu.style.alignItems = 'center';
        mainMenu.style.background = 'rgba(0,0,0,0.7)';
        mainMenu.style.pointerEvents = 'auto';
        mainMenu.style.opacity = '0';
        mainMenu.style.visibility = 'hidden';
        mainMenu.style.transition = 'opacity 0.5s, visibility 0.5s';
        this.elements.container.appendChild(mainMenu);
        this.elements.mainMenu = mainMenu;
        
        // Main Menu Title
        const mainMenuTitle = document.createElement('h1');
        mainMenuTitle.innerHTML = 'SKATE PARK PRO';
        mainMenuTitle.style.color = 'white';
        mainMenuTitle.style.fontSize = '48px';
        mainMenuTitle.style.marginBottom = '40px';
        mainMenuTitle.style.textShadow = '0 0 10px #00FFFF, 0 0 20px #00FFFF';
        mainMenu.appendChild(mainMenuTitle);
        
        // Start button
        const startButton = this.createMenuButton('START GAME', 'start-button');
        mainMenu.appendChild(startButton);
        this.elements.startButton = startButton;
        
        // Controls button
        const controlsButton = this.createMenuButton('CONTROLS', 'controls-button');
        mainMenu.appendChild(controlsButton);
        this.elements.controlsButton = controlsButton;
        
        // Create Pause Menu
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.className = 'menu';
        pauseMenu.style.position = 'absolute';
        pauseMenu.style.top = '0';
        pauseMenu.style.left = '0';
        pauseMenu.style.width = '100%';
        pauseMenu.style.height = '100%';
        pauseMenu.style.display = 'flex';
        pauseMenu.style.flexDirection = 'column';
        pauseMenu.style.justifyContent = 'center';
        pauseMenu.style.alignItems = 'center';
        pauseMenu.style.background = 'rgba(0,0,0,0.7)';
        pauseMenu.style.pointerEvents = 'auto';
        pauseMenu.style.opacity = '0';
        pauseMenu.style.visibility = 'hidden';
        pauseMenu.style.transition = 'opacity 0.5s, visibility 0.5s';
        this.elements.container.appendChild(pauseMenu);
        this.elements.pauseMenu = pauseMenu;
        
        // Pause Menu Title
        const pauseMenuTitle = document.createElement('h2');
        pauseMenuTitle.innerHTML = 'PAUSED';
        pauseMenuTitle.style.color = 'white';
        pauseMenuTitle.style.fontSize = '36px';
        pauseMenuTitle.style.marginBottom = '40px';
        pauseMenu.appendChild(pauseMenuTitle);
        
        // Resume button
        const resumeButton = this.createMenuButton('RESUME', 'resume-button');
        pauseMenu.appendChild(resumeButton);
        this.elements.resumeButton = resumeButton;
        
        // Main menu button
        const mainMenuButton = this.createMenuButton('MAIN MENU', 'main-menu-button');
        pauseMenu.appendChild(mainMenuButton);
        this.elements.mainMenuButton = mainMenuButton;
        
        // Create Game Over Menu
        const gameOverMenu = document.createElement('div');
        gameOverMenu.id = 'game-over-menu';
        gameOverMenu.className = 'menu';
        gameOverMenu.style.position = 'absolute';
        gameOverMenu.style.top = '0';
        gameOverMenu.style.left = '0';
        gameOverMenu.style.width = '100%';
        gameOverMenu.style.height = '100%';
        gameOverMenu.style.display = 'flex';
        gameOverMenu.style.flexDirection = 'column';
        gameOverMenu.style.justifyContent = 'center';
        gameOverMenu.style.alignItems = 'center';
        gameOverMenu.style.background = 'rgba(0,0,0,0.7)';
        gameOverMenu.style.pointerEvents = 'auto';
        gameOverMenu.style.opacity = '0';
        gameOverMenu.style.visibility = 'hidden';
        gameOverMenu.style.transition = 'opacity 0.5s, visibility 0.5s';
        this.elements.container.appendChild(gameOverMenu);
        this.elements.gameOverMenu = gameOverMenu;
        
        // Game Over Title
        const gameOverTitle = document.createElement('h2');
        gameOverTitle.innerHTML = 'GAME OVER';
        gameOverTitle.style.color = 'white';
        gameOverTitle.style.fontSize = '36px';
        gameOverTitle.style.marginBottom = '20px';
        gameOverMenu.appendChild(gameOverTitle);
        
        // Final score
        const finalScore = document.createElement('div');
        finalScore.id = 'final-score';
        finalScore.style.color = 'white';
        finalScore.style.fontSize = '24px';
        finalScore.style.marginBottom = '40px';
        gameOverMenu.appendChild(finalScore);
        this.elements.finalScore = finalScore;
        
        // Retry button
        const retryButton = this.createMenuButton('RETRY', 'retry-button');
        gameOverMenu.appendChild(retryButton);
        this.elements.retryButton = retryButton;
        
        // Main menu button in game over
        const gameOverMainMenuButton = this.createMenuButton('MAIN MENU', 'game-over-main-menu-button');
        gameOverMenu.appendChild(gameOverMainMenuButton);
        this.elements.gameOverMainMenuButton = gameOverMainMenuButton;
        
        // Controls Menu
        const controlsMenu = document.createElement('div');
        controlsMenu.id = 'controls-menu';
        controlsMenu.className = 'menu';
        controlsMenu.style.position = 'absolute';
        controlsMenu.style.top = '0';
        controlsMenu.style.left = '0';
        controlsMenu.style.width = '100%';
        controlsMenu.style.height = '100%';
        controlsMenu.style.display = 'flex';
        controlsMenu.style.flexDirection = 'column';
        controlsMenu.style.justifyContent = 'center';
        controlsMenu.style.alignItems = 'center';
        controlsMenu.style.background = 'rgba(0,0,0,0.7)';
        controlsMenu.style.pointerEvents = 'auto';
        controlsMenu.style.opacity = '0';
        controlsMenu.style.visibility = 'hidden';
        controlsMenu.style.transition = 'opacity 0.5s, visibility 0.5s';
        this.elements.container.appendChild(controlsMenu);
        this.elements.controlsMenu = controlsMenu;
        
        // Controls Title
        const controlsTitle = document.createElement('h2');
        controlsTitle.innerHTML = 'CONTROLS';
        controlsTitle.style.color = 'white';
        controlsTitle.style.fontSize = '36px';
        controlsTitle.style.marginBottom = '20px';
        controlsMenu.appendChild(controlsTitle);
        
        // Controls content
        const controlsContent = document.createElement('div');
        controlsContent.style.color = 'white';
        controlsContent.style.fontSize = '18px';
        controlsContent.style.lineHeight = '1.6';
        controlsContent.style.textAlign = 'center';
        controlsContent.style.marginBottom = '30px';
        controlsContent.innerHTML = `
            <div style="background: rgba(0,0,0,0.5); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3>KEYBOARD</h3>
                <p>WASD / Arrow Keys: Move</p>
                <p>Spacebar: Jump</p>
                <p>Q: Shift Dimension</p>
                <p>P: Pause Game</p>
            </div>
            <div style="background: rgba(0,0,0,0.5); padding: 20px; border-radius: 10px;">
                <h3>MOBILE</h3>
                <p>Left Joystick: Move</p>
                <p>Right Joystick Tap: Jump</p>
                <p>Dimension Button: Shift Dimension</p>
                <p>Pause Button: Pause Game</p>
            </div>
        `;
        controlsMenu.appendChild(controlsContent);
        
        // Back button
        const backButton = this.createMenuButton('BACK', 'back-button');
        controlsMenu.appendChild(backButton);
        this.elements.backButton = backButton;
    }

    // Create a styled button for menus
    createMenuButton(text, id) {
        const button = document.createElement('div');
        button.id = id;
        button.className = 'menu-button';
        button.innerHTML = text;
        button.style.color = 'white';
        button.style.fontSize = '24px';
        button.style.padding = '10px 30px';
        button.style.margin = '10px 0';
        button.style.background = 'rgba(0, 255, 255, 0.2)';
        button.style.border = '2px solid rgba(0, 255, 255, 0.5)';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.2s';
        button.style.pointerEvents = 'auto';
        
        // Hover effect
        button.addEventListener('mouseover', () => {
            button.style.background = 'rgba(0, 255, 255, 0.4)';
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.background = 'rgba(0, 255, 255, 0.2)';
            button.style.transform = 'scale(1)';
        });
        
        return button;
    }

    // Set up event listeners for all buttons
    setupEventListeners() {
        // Start button
        if (this.elements.startButton) {
            this.elements.startButton.addEventListener('click', () => {
                this.hideMainMenu();
                this.showHUD();
                this.startGame();
            });
        }
        
        // Controls button
        if (this.elements.controlsButton) {
            this.elements.controlsButton.addEventListener('click', () => {
                this.hideMainMenu();
                this.showControlsMenu();
            });
        }
        
        // Back button in controls menu
        if (this.elements.backButton) {
            this.elements.backButton.addEventListener('click', () => {
                this.hideControlsMenu();
                this.showMainMenu();
            });
        }
        
        // Pause button
        if (this.elements.pauseButton) {
            this.elements.pauseButton.addEventListener('click', () => {
                this.pauseGame();
            });
        }
        
        // Resume button
        if (this.elements.resumeButton) {
            this.elements.resumeButton.addEventListener('click', () => {
                this.resumeGame();
            });
        }
        
        // Main menu button in pause menu
        if (this.elements.mainMenuButton) {
            this.elements.mainMenuButton.addEventListener('click', () => {
                this.hidePauseMenu();
                this.hideHUD();
                this.showMainMenu();
                this.endGame();
            });
        }
        
        // Retry button
        if (this.elements.retryButton) {
            this.elements.retryButton.addEventListener('click', () => {
                this.hideGameOverMenu();
                this.resetStats();
                this.showHUD();
                this.startGame();
            });
        }
        
        // Main menu button in game over menu
        if (this.elements.gameOverMainMenuButton) {
            this.elements.gameOverMainMenuButton.addEventListener('click', () => {
                this.hideGameOverMenu();
                this.showMainMenu();
            });
        }
    }

    // Show/hide methods for UI elements
    showHUD() {
        const hudElements = document.querySelectorAll('.hud-element');
        hudElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
        });
    }

    hideHUD() {
        const hudElements = document.querySelectorAll('.hud-element');
        hudElements.forEach(element => {
            element.style.opacity = '0';
            element.style.visibility = 'hidden';
        });
    }

    showMainMenu() {
        if (this.elements.mainMenu) {
            this.elements.mainMenu.style.opacity = '1';
            this.elements.mainMenu.style.visibility = 'visible';
            this.gameState = 'menu';
        }
    }

    hideMainMenu() {
        if (this.elements.mainMenu) {
            this.elements.mainMenu.style.opacity = '0';
            this.elements.mainMenu.style.visibility = 'hidden';
        }
    }

    showPauseMenu() {
        if (this.elements.pauseMenu) {
            this.elements.pauseMenu.style.opacity = '1';
            this.elements.pauseMenu.style.visibility = 'visible';
            this.gameState = 'paused';
        }
    }

    hidePauseMenu() {
        if (this.elements.pauseMenu) {
            this.elements.pauseMenu.style.opacity = '0';
            this.elements.pauseMenu.style.visibility = 'hidden';
        }
    }

    showGameOverMenu() {
        if (this.elements.gameOverMenu) {
            this.elements.finalScore.innerHTML = `Final Score: ${this.score}<br>Tricks: ${this.tricks}<br>Dimension Shifts: ${this.dimensionShifts}`;
            this.elements.gameOverMenu.style.opacity = '1';
            this.elements.gameOverMenu.style.visibility = 'visible';
            this.gameState = 'gameover';
        }
    }

    hideGameOverMenu() {
        if (this.elements.gameOverMenu) {
            this.elements.gameOverMenu.style.opacity = '0';
            this.elements.gameOverMenu.style.visibility = 'hidden';
        }
    }

    showControlsMenu() {
        if (this.elements.controlsMenu) {
            this.elements.controlsMenu.style.opacity = '1';
            this.elements.controlsMenu.style.visibility = 'visible';
        }
    }

    hideControlsMenu() {
        if (this.elements.controlsMenu) {
            this.elements.controlsMenu.style.opacity = '0';
            this.elements.controlsMenu.style.visibility = 'hidden';
        }
    }

    // Game state methods
    startGame() {
        this.gameState = 'playing';
        this.resetStats();
        this.updateScoreDisplay();
        this.updateDimensionIndicator(0); // Start in normal dimension
        
        // Tell the game to start (this will be implemented in the main game)
        if (window.fallbackGame) {
            fallbackGame.state.paused = false;
            fallbackGame.state.running = true;
        }
    }

    pauseGame() {
        this.showPauseMenu();
        
        // Tell the game to pause
        if (window.fallbackGame) {
            fallbackGame.state.paused = true;
        }
    }

    resumeGame() {
        this.hidePauseMenu();
        this.gameState = 'playing';
        
        // Tell the game to resume
        if (window.fallbackGame) {
            fallbackGame.state.paused = false;
        }
    }

    endGame() {
        // Tell the game to end/reset
        if (window.fallbackGame) {
            fallbackGame.state.running = false;
        }
    }

    gameOver() {
        this.hideHUD();
        this.showGameOverMenu();
        
        // Tell the game it's game over
        if (window.fallbackGame) {
            fallbackGame.state.running = false;
        }
    }

    // Score and stats methods
    resetStats() {
        this.score = 0;
        this.tricks = 0;
        this.currentCombo = 0;
        this.dimensionShifts = 0;
        this.updateScoreDisplay();
    }

    addScore(points) {
        this.score += points;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.innerHTML = `Score: ${this.score}`;
        }
    }

    showCombo(combo) {
        this.currentCombo = combo;
        if (this.elements.comboMeter) {
            this.elements.comboMeter.innerHTML = `Combo: x${combo}`;
            this.elements.comboMeter.style.opacity = '1';
            
            // Hide the combo meter after a delay
            setTimeout(() => {
                this.elements.comboMeter.style.opacity = '0';
            }, 3000);
        }
    }

    // Show trick notification
    showTrickNotification(trickName, points) {
        if (this.elements.trickNotification) {
            this.tricks++;
            this.elements.trickNotification.innerHTML = `${trickName}<br><span style="font-size: 20px; color: #00FFFF;">+${points} points</span>`;
            this.elements.trickNotification.style.opacity = '1';
            this.elements.trickNotification.style.transform = 'translateX(-50%) translateY(0)';
            
            // Hide the notification after a delay
            setTimeout(() => {
                this.elements.trickNotification.style.opacity = '0';
                this.elements.trickNotification.style.transform = 'translateX(-50%) translateY(20px)';
            }, 2000);
        }
    }

    // Update dimension indicator
    updateDimensionIndicator(dimensionId) {
        if (this.elements.dimensionIndicator) {
            this.dimensionShifts++;
            
            let dimensionName, color;
            if (dimensionId === 0) {
                dimensionName = 'NORMAL';
                color = '#87CEEB'; // Sky blue
            } else {
                dimensionName = 'LOW GRAVITY';
                color = '#FF00FF'; // Purple
            }
            
            // Flash effect
            this.elements.dimensionIndicator.style.background = color;
            this.elements.dimensionIndicator.style.color = '#000';
            this.elements.dimensionIndicator.innerHTML = `DIMENSION: ${dimensionName}`;
            
            // Reset after flash
            setTimeout(() => {
                this.elements.dimensionIndicator.style.background = 'rgba(0,0,0,0.3)';
                this.elements.dimensionIndicator.style.color = '#FFF';
            }, 500);
        }
    }
}

// Create a global instance for use throughout the application
const uiManager = new UIManager();

// Export for use as module
if (typeof module !== 'undefined') {
    module.exports = { UIManager, uiManager };
} 