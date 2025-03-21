// Test script for Step 5: NippleJS Controls
// This script validates that mobile touch controls are properly working

(function() {
    console.log('Running Step 5 Test: Mobile Touch Controls');
    
    // Check if main game object exists
    if (typeof game === 'undefined') {
        console.error('Test failed: Game object not found');
        return;
    }
    
    // Check if controls module exists
    if (!game.controls) {
        console.error('Test failed: Controls module not initialized');
        return;
    }
    
    // Check if nipplejs is loaded
    if (typeof nipplejs === 'undefined') {
        console.error('Test failed: NippleJS library not loaded');
        return;
    }
    
    // Check if joysticks were created (if on mobile)
    if (game.controls.isMobile) {
        if (!game.controls.joystickMovement || !game.controls.joystickTrick) {
            console.error('Test failed: Joysticks not created on mobile device');
            return;
        }
        
        console.log('Mobile controls detected and initialized correctly');
        
        // Check for DOM elements
        const movementZone = document.getElementById('movement-zone');
        const trickZone = document.getElementById('trick-zone');
        
        if (!movementZone || !trickZone) {
            console.error('Test failed: Joystick zones not found in DOM');
            return;
        }
        
        console.log('Joystick DOM elements created successfully');
    } else {
        // On desktop, check if keyboard controls are working
        const controlsState = game.controls.getInputs();
        
        if (typeof controlsState.forward !== 'boolean' || 
            typeof controlsState.left !== 'boolean' || 
            typeof controlsState.right !== 'boolean' || 
            typeof controlsState.backward !== 'boolean' || 
            typeof controlsState.jump !== 'boolean' || 
            typeof controlsState.trick !== 'boolean') {
            console.error('Test failed: Controls state not properly initialized');
            return;
        }
        
        console.log('Desktop controls initialized correctly');
        console.log('Control inputs detected and ready:', Object.keys(controlsState).join(', '));
    }
    
    console.log('Step 5 complete: NippleJS touch controls integration successful');
    console.log('Controls available for: ' + (game.controls.isMobile ? 'Mobile (touch)' : 'Desktop (keyboard)'));
    
    // Show instructions in console
    if (game.controls.isMobile) {
        console.log('Mobile controls instructions:');
        console.log('- Left joystick: Movement');
        console.log('- Right joystick: Tap to jump, Swipe up for tricks');
    } else {
        console.log('Keyboard controls instructions:');
        console.log('- WASD or Arrow keys: Movement');
        console.log('- Spacebar: Jump');
        console.log('- Shift: Perform trick');
    }
})(); 