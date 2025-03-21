// Test Script for Step 8: User Interface
// Tests functionality of UI elements, menus, and HUD

console.log('Running UI Test Script...');

// Check if uiManager is available
if (typeof uiManager === 'undefined') {
    console.error('Error: UI Manager not found!');
} else {
    console.log('UI Manager found, initializing UI...');
    // Initialize UI system
    uiManager.init();
    
    // Test UI functionality
    console.log('Testing UI functionality...');
    
    // Demo methods to show UI working
    setTimeout(() => {
        console.log('Simulating game start...');
        uiManager.hideMainMenu();
        uiManager.showHUD();
        uiManager.updateScoreDisplay();
        
        // Simulated gameplay events
        setTimeout(() => {
            console.log('Simulating trick completed...');
            uiManager.addScore(500);
            uiManager.showTrickNotification('360 FLIP', 500);
        }, 2000);
        
        setTimeout(() => {
            console.log('Simulating combo...');
            uiManager.showCombo(3);
            uiManager.addScore(300);
        }, 4000);
        
        setTimeout(() => {
            console.log('Simulating dimension shift...');
            // Toggle dimension (0 is normal, 1 is alternate dimension)
            if (fallbackGame) {
                fallbackGame.toggleDimension();
                const currentDimension = fallbackGame.state.currentDimension;
                uiManager.updateDimensionIndicator(currentDimension);
            } else {
                // Just for testing if fallbackGame is not available
                uiManager.updateDimensionIndicator(1);
            }
        }, 6000);
        
        setTimeout(() => {
            console.log('Simulating game pause...');
            uiManager.pauseGame();
            
            // Simulate resume after 2 seconds
            setTimeout(() => {
                console.log('Simulating game resume...');
                uiManager.resumeGame();
            }, 2000);
        }, 8000);
        
        setTimeout(() => {
            console.log('Simulating game over...');
            uiManager.score = 1500;
            uiManager.tricks = 5;
            uiManager.dimensionShifts = 3;
            uiManager.gameOver();
        }, 12000);
    }, 1000);
    
    console.log('UI test script loaded successfully.');
}

// Log current game state if fallbackGame is available
if (typeof fallbackGame !== 'undefined') {
    console.log('FallbackGame state:', fallbackGame.state);
} 