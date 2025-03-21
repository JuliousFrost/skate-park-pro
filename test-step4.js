// Test script for Step 4: Physics Integration
// This script validates that CannonJS physics is properly working

(function() {
    console.log('Running Step 4 Test: Physics Integration');
    
    // Check if main game object exists
    if (typeof game === 'undefined') {
        console.error('Test failed: Game object not found');
        return;
    }
    
    // Check if physics module exists
    if (!game.physics) {
        console.error('Test failed: Physics module not initialized');
        return;
    }
    
    // Check if we have a falling test box
    if (!game.testBox) {
        console.error('Test failed: Test box not created');
        return;
    }
    
    // Check if the physics world has been created
    if (!game.physics.world) {
        console.error('Test failed: Physics world not initialized');
        return;
    }
    
    // Check if the box is actually falling (y position should be changing)
    const initialY = game.testBox.position.y;
    
    // Add a check after a short delay to see if the box has moved
    setTimeout(() => {
        const newY = game.testBox.position.y;
        
        if (newY >= initialY) {
            console.error(`Test failed: Box is not falling. Y position: ${initialY} -> ${newY}`);
        } else {
            console.log(`Physics test passed! Box is falling. Y position: ${initialY} -> ${newY}`);
            console.log('Step 4 complete: CannonJS physics integration successful');
        }
    }, 1000); // Check after 1 second
    
    console.log('Physics test initiated, checking box movement in 1 second...');
})(); 