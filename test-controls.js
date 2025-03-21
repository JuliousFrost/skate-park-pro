// Test script to verify controls are working
console.log("Running controls test...");

// Wait for the game to initialize
setTimeout(() => {
    // Check if game object exists
    if (typeof window.game === 'undefined') {
        console.error("ERROR: Game object not found!");
        
        // Check for specific errors
        console.log("Checking for potential issues:");
        
        // Check if modules are supported
        if (typeof import !== 'function') {
            console.error("ES6 modules may not be supported in this browser");
        }
        
        // Check if THREE.js is defined (imported in renderer.js)
        if (typeof THREE === 'undefined') {
            console.error("THREE is not defined - module imports may have failed");
        }
        
        // Check if files exist by creating test script elements
        const testScripts = [
            {path: 'js/lib/three.module.js', name: 'THREE.js module'},
            {path: 'js/lib/cannon.module.js', name: 'CANNON.js module'}
        ];
        
        testScripts.forEach(script => {
            const testScript = document.createElement('script');
            testScript.onload = () => console.log(`✓ ${script.name} exists at ${script.path}`);
            testScript.onerror = () => console.error(`✗ ${script.name} NOT FOUND at ${script.path}`);
            testScript.src = script.path;
            document.head.appendChild(testScript);
        });
        
        return;
    }
    
    console.log("Game object found, checking controls...");
    
    // Rest of controls test...
    if (window.game.controls) {
        console.log("Controls module loaded successfully!");
    }
}, 2000); 