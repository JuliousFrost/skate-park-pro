// Test script for Step 6: Main Game Loop
// This script validates that the game loop is working correctly with proper timing

(function() {
    console.log('Running Step 6 Test: Main Game Loop');
    
    // First try to check the module-based game
    if (typeof window.game !== 'undefined') {
        console.log('Testing module-based game loop...');
        testGameLoop(window.game);
    } 
    // Then check the fallback game
    else if (typeof window.fallbackGame !== 'undefined') {
        console.log('Testing fallback game loop...');
        testGameLoop(window.fallbackGame);
    } 
    else {
        console.error('Test failed: No game object found');
        return;
    }
    
    function testGameLoop(gameObj) {
        // Track FPS over time
        let frameCount = 0;
        let lastTime = performance.now();
        let minFps = Infinity;
        let maxFps = 0;
        let avgFps = 0;
        let fpsReadings = [];
        
        // Setup timer to measure consistent frame rate
        const frameTimer = setInterval(() => {
            const now = performance.now();
            const elapsed = now - lastTime;
            const fps = Math.round(frameCount * 1000 / elapsed);
            
            // Store FPS data
            fpsReadings.push(fps);
            minFps = Math.min(minFps, fps);
            maxFps = Math.max(maxFps, fps);
            
            // Calculate average
            avgFps = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
            
            // Output FPS info
            console.log(`Current FPS: ${fps} (Min: ${minFps}, Max: ${maxFps}, Avg: ${Math.round(avgFps)})`);
            
            // Reset counters
            frameCount = 0;
            lastTime = now;
        }, 1000);
        
        // Create hook for requestAnimationFrame to count frames
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            frameCount++;
            return originalRAF.call(window, callback);
        };
        
        // Test the loop for 5 seconds
        setTimeout(() => {
            clearInterval(frameTimer);
            
            // Restore original requestAnimationFrame
            window.requestAnimationFrame = originalRAF;
            
            // Check results
            if (minFps < 30) {
                console.warn(`Frame rate dropped below 30 FPS (min: ${minFps})`);
            }
            
            // Get loop validation data
            let validationInfo = '';
            
            if (gameObj.state && typeof gameObj.state.physicsTime !== 'undefined') {
                validationInfo += `Physics time: ${gameObj.state.physicsTime.toFixed(2)}ms, `;
                validationInfo += `Render time: ${gameObj.state.renderTime.toFixed(2)}ms, `;
                validationInfo += `Total: ${(gameObj.state.physicsTime + gameObj.state.renderTime).toFixed(2)}ms`;
            }
            
            console.log('Game loop validation complete:');
            console.log(`- Average FPS: ${Math.round(avgFps)}`);
            console.log(`- FPS Range: ${minFps} - ${maxFps}`);
            console.log(`- Timing: ${validationInfo}`);
            
            if (avgFps >= 50) {
                console.log('Step 6 complete: Game loop is performing well');
            } else if (avgFps >= 30) {
                console.log('Step 6 mostly complete: Game loop is acceptable but could be optimized');
            } else {
                console.warn('Step 6 needs optimization: Game loop is not performing adequately');
            }
            
            // Test extra features
            if (gameObj.state && gameObj.state.dimensions) {
                console.log('✓ Dimensional drift mechanic is implemented');
                console.log('  Try pressing Q to switch dimensions');
            }
        }, 5000);
    }
})(); 