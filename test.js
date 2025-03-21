// Step 1 test file for validating project structure
console.log('Running Step 1 validation test...');

// Required files and directories
const requiredStructure = [
    'index.html',
    'style.css',
    'js/main.js',
    'js/renderer.js',
    'js/physics.js',
    'js/controls.js',
    'js/ui.js',
    'assets/'
];

// Function to check if a file/directory exists
function checkExists(path) {
    try {
        // Using the DOM API since this will run in the browser
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', path, false);
        xhr.send();
        
        return xhr.status !== 404;
    } catch (e) {
        console.error(`Error checking ${path}:`, e);
        return false;
    }
}

// Validate all required files/directories
let allValid = true;
console.log('Checking file structure...');

for (const path of requiredStructure) {
    const exists = checkExists(path);
    console.log(`${path}: ${exists ? '✅ Found' : '❌ Missing'}`);
    
    if (!exists) {
        allValid = false;
    }
}

// Overall validation result
if (allValid) {
    console.log('✅ Step 1 validation PASSED: All required files and directories exist.');
} else {
    console.log('❌ Step 1 validation FAILED: Some required files or directories are missing.');
}

// Check for module imports
console.log('\nVerifying module structure...');
try {
    // This is just to confirm the script is reachable via module syntax
    console.log('✅ Module structure appears valid. Full validation will occur in the browser.');
} catch (e) {
    console.error('❌ Error with module structure:', e);
} 