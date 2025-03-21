// Step 2 test file for validating canvas initialization
console.log('Running Step 2 validation test...');

// Function to test canvas initialization
function testCanvasInitialization() {
    // Get the canvas element
    const canvas = document.getElementById('game-canvas');
    
    // Check if canvas exists
    if (!canvas) {
        console.error('❌ Canvas element not found!');
        return false;
    }
    console.log('✅ Canvas element found');
    
    // Check if canvas has proper dimensions
    if (canvas.width === 0 || canvas.height === 0) {
        console.error('❌ Canvas has invalid dimensions:', canvas.width, 'x', canvas.height);
        return false;
    }
    console.log(`✅ Canvas has valid dimensions: ${canvas.width}x${canvas.height}`);
    
    // Check if canvas context can be obtained
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('❌ Unable to get 2D context from canvas');
        return false;
    }
    console.log('✅ Canvas 2D context obtained successfully');
    
    // All tests passed
    return true;
}

// Run the test
window.addEventListener('load', () => {
    console.log('---------------------------------------');
    console.log('Step 2 Validation: Canvas Initialization');
    console.log('---------------------------------------');
    
    const result = testCanvasInitialization();
    
    if (result) {
        console.log('✅ Step 2 validation PASSED: Canvas initialized correctly');
    } else {
        console.error('❌ Step 2 validation FAILED: Canvas initialization issues detected');
    }
}); 