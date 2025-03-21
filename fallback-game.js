// Fallback game implementation (non-module version)
// This is a simplified version that doesn't use ES6 modules

// Wait for THREE.js to load
window.addEventListener('load', function() {
    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded');
        return;
    }

    console.log('Initializing fallback game...');
    
    // Get the canvas element
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    // Game state
    const game = {
        // Controls state
        input: {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            dimensionShift: false // Control for dimension shifting
        },
        // Scene objects
        objects: {
            box: null,
            ground: null,
            skatePark: null,
            skateboarder: null
        },
        // Animation frame ID
        animationFrame: null,
        // Last time for delta calculation
        lastTime: 0,
        // Game state
        state: {
            running: true,
            paused: false,
            currentDimension: 0, // 0 = normal, 1 = alternate dimension
            dimensions: [
                { name: "Normal", gravity: 9.8, groundColor: 0x808080, skyColor: 0x87ceeb },
                { name: "Low Gravity", gravity: 3.0, groundColor: 0x4040a0, skyColor: 0xff00ff }
            ],
            // Asset loading
            assetsLoaded: false,
            // Performance monitoring
            fps: 0,
            frameCount: 0,
            lastFpsUpdate: 0,
            physicsTime: 0,
            renderTime: 0
        }
    };
    
    // Make game globally accessible
    window.fallbackGame = game;
    
    // Initialize THREE.js
    function initThree() {
        // Create scene
        const scene = new THREE.Scene();
        
        // Get current dimension data
        const dimension = game.state.dimensions[game.state.currentDimension];
        scene.background = new THREE.Color(dimension.skyColor);
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Create lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        
        scene.add(directionalLight);
        
        // Create temporary placeholder objects
        createPlaceholderObjects(scene, dimension);
        
        // Load and create 3D models
        loadModels(scene);
        
        // Store in game object
        game.scene = scene;
        game.camera = camera;
        game.renderer = renderer;
        
        // Create FPS Counter
        createFpsCounter();
        
        console.log('THREE.js initialized in fallback mode');
        
        // Start animation loop
        gameLoop(0);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    // Create placeholder objects until models are loaded
    function createPlaceholderObjects(scene, dimension) {
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: dimension.groundColor,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to be flat
        ground.receiveShadow = true;
        scene.add(ground);
        game.objects.ground = ground;
        
        // Create box (player) as placeholder
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const boxMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000 // Bright red for visibility
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(0, 1, 0); // Start above ground
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        game.objects.box = box;
        
        // Add dimensional portal (visual indicator)
        const portalGeometry = new THREE.TorusGeometry(2, 0.3, 16, 50);
        const portalMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffff00,
            emissive: 0x887700,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        const portal = new THREE.Mesh(portalGeometry, portalMaterial);
        portal.position.set(5, 2, -5); // Position off to the side
        portal.rotation.x = Math.PI / 2; // Lay flat
        portal.castShadow = true;
        portal.receiveShadow = true;
        scene.add(portal);
        game.objects.portal = portal;
        
        updateDebugPanel('Placeholder objects created. Loading 3D models...');
    }
    
    // Load and create 3D models
    function loadModels(scene) {
        try {
            updateDebugPanel('Creating skate park model...');
            
            // Create skate park model
            const skateParkModel = new SkateParkModel();
            const parkScene = skateParkModel.getScene();
            scene.add(parkScene);
            game.objects.skatePark = skateParkModel;
            
            updateDebugPanel('Creating skateboarder model...');
            
            // Create skateboarder model
            const skateboarderModel = new SkateboarderModel();
            const skateboarderGroup = skateboarderModel.getGroup();
            
            // Position the skateboarder
            skateboarderGroup.position.set(0, 0, 0);
            scene.add(skateboarderGroup);
            game.objects.skateboarder = skateboarderModel;
            
            // Remove the placeholder box when models are loaded
            if (game.objects.box) {
                scene.remove(game.objects.box);
                game.objects.box = null;
            }
            
            game.state.assetsLoaded = true;
            
            updateDebugPanel('3D models loaded successfully!');
            
            // Hide loading screen
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            
        } catch (error) {
            console.error('Error loading models:', error);
            updateDebugPanel('Error loading 3D models. Using placeholder objects instead.');
        }
    }
    
    // Set up keyboard controls
    function initControls() {
        // Keyboard event listeners
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    game.input.forward = true;
                    break;
                case 's':
                case 'ArrowDown':
                    game.input.backward = true;
                    break;
                case 'a':
                case 'ArrowLeft':
                    game.input.left = true;
                    break;
                case 'd':
                case 'ArrowRight':
                    game.input.right = true;
                    break;
                case ' ': // Spacebar
                    game.input.jump = true;
                    // Trigger jump on skateboarder if loaded
                    if (game.objects.skateboarder && typeof game.objects.skateboarder.jump === 'function') {
                        game.objects.skateboarder.jump();
                    }
                    break;
                case 'q': // Q key for dimension shift
                    if (!game.input.dimensionShift) {
                        game.input.dimensionShift = true;
                        switchDimension();
                    }
                    break;
                case 'p': // P key to pause
                    game.state.paused = !game.state.paused;
                    updateDebugInfo();
                    break;
            }
        });
        
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    game.input.forward = false;
                    break;
                case 's':
                case 'ArrowDown':
                    game.input.backward = false;
                    break;
                case 'a':
                case 'ArrowLeft':
                    game.input.left = false;
                    break;
                case 'd':
                case 'ArrowRight':
                    game.input.right = false;
                    break;
                case ' ': // Spacebar
                    game.input.jump = false;
                    break;
                case 'q': // Q key for dimension shift
                    game.input.dimensionShift = false;
                    break;
            }
        });
        
        console.log('Keyboard controls initialized in fallback mode');
    }
    
    // Switch between dimensions
    function switchDimension() {
        // Toggle dimension
        game.state.currentDimension = (game.state.currentDimension + 1) % game.state.dimensions.length;
        const dimension = game.state.dimensions[game.state.currentDimension];
        
        // Update visuals
        game.scene.background = new THREE.Color(dimension.skyColor);
        game.objects.ground.material.color.set(dimension.groundColor);
        
        // Update skateboarder appearance
        if (game.objects.skateboarder && typeof game.objects.skateboarder.swapDimension === 'function') {
            game.objects.skateboarder.swapDimension(game.state.currentDimension);
        }
        
        // Visual feedback effect for portal
        if (game.objects.portal) {
            // Flash the portal
            const originalEmissive = game.objects.portal.material.emissiveIntensity;
            game.objects.portal.material.emissiveIntensity = 2;
            setTimeout(() => {
                game.objects.portal.material.emissiveIntensity = originalEmissive;
            }, 300);
        }
        
        console.log(`Switched to ${dimension.name} dimension`);
        updateDebugInfo();
    }
    
    // Physics update
    function updatePhysics(deltaTime) {
        const startTime = performance.now();
        
        // Get current dimension data for physics properties
        const dimension = game.state.dimensions[game.state.currentDimension];
        
        // Update the character if loaded
        if (game.objects.skateboarder) {
            // Pass the input state to the skateboarder for animation
            game.objects.skateboarder.update(deltaTime, game.input);
        } else if (game.objects.box) {
            // Fallback to updating the placeholder box
            updateBoxPhysics(deltaTime, dimension);
        }
        
        // Update skate park animations
        if (game.objects.skatePark && typeof game.objects.skatePark.update === 'function') {
            game.objects.skatePark.update(deltaTime);
        }
        
        // Check portal interaction
        updatePortalInteraction(deltaTime);
        
        game.state.physicsTime = performance.now() - startTime;
    }
    
    // Update the placeholder box (used when skateboarder model isn't loaded)
    function updateBoxPhysics(deltaTime, dimension) {
        const box = game.objects.box;
        if (!box) return;
        
        // Simple gravity
        if (box.position.y > 0.5) { // Box height/2
            box.position.y -= dimension.gravity * deltaTime; // Dimension-specific gravity
        }
        
        // Handle jump
        if (game.input.jump && box.position.y <= 0.5) {
            box.position.y += 0.2; // Initial jump impulse
            box.velocity = 5; // Upward velocity
        }
        
        // Apply velocity
        if (box.velocity > 0) {
            box.position.y += box.velocity * deltaTime;
            box.velocity -= dimension.gravity * deltaTime; // Dimension-specific gravity
        }
    }
    
    // Update portal interaction effects
    function updatePortalInteraction(deltaTime) {
        if (!game.objects.portal) return;
        
        // Get player position (either from skateboarder or box)
        let playerPosition;
        if (game.objects.skateboarder) {
            playerPosition = game.objects.skateboarder.getGroup().position;
        } else if (game.objects.box) {
            playerPosition = game.objects.box.position;
        } else {
            return;
        }
        
        // Check distance to portal
        const distance = playerPosition.distanceTo(game.objects.portal.position);
        if (distance < 5) {
            // Animate portal when player is close
            game.objects.portal.rotation.z += deltaTime * 2;
            
            // Visual hint that portal is usable
            game.objects.portal.material.opacity = 0.9 + Math.sin(performance.now() * 0.005) * 0.1;
            
            // Show tip in debug panel
            const debugElement = document.getElementById('debugInfo');
            if (debugElement) {
                if (!debugElement.innerHTML.includes("Press Q to shift dimension")) {
                    debugElement.innerHTML += "<br>Press Q to shift dimension";
                }
            }
        }
    }
    
    // Main game loop
    function gameLoop(currentTime) {
        // Update FPS counter
        updateFps(currentTime);
        
        // Calculate delta time
        currentTime *= 0.001; // Convert to seconds
        const deltaTime = Math.min(0.1, currentTime - game.lastTime);
        game.lastTime = currentTime;
        
        // Skip updates if paused (except for certain animations)
        if (!game.state.paused) {
            // Update player position based on input
            const moveSpeed = 10; // Increased for better feel
            const playerObject = game.objects.skateboarder ? 
                game.objects.skateboarder.getGroup() : 
                game.objects.box;
                
            if (playerObject) {
                if (game.input.left) {
                    playerObject.position.x -= moveSpeed * deltaTime;
                }
                if (game.input.right) {
                    playerObject.position.x += moveSpeed * deltaTime;
                }
                if (game.input.forward) {
                    playerObject.position.z -= moveSpeed * deltaTime;
                }
                if (game.input.backward) {
                    playerObject.position.z += moveSpeed * deltaTime;
                }
            }
            
            // Update physics
            updatePhysics(deltaTime);
        }
        
        // Portal always animates, even when paused
        if (game.objects.portal) {
            game.objects.portal.rotation.y += deltaTime * 0.5;
        }
        
        // Measure render time
        const renderStart = performance.now();
        
        // Position camera to follow player
        updateCamera();
        
        // Render scene
        game.renderer.render(game.scene, game.camera);
        
        game.state.renderTime = performance.now() - renderStart;
        
        // Continue animation loop
        game.animationFrame = requestAnimationFrame(gameLoop);
    }
    
    // Update camera to follow player
    function updateCamera() {
        const playerObject = game.objects.skateboarder ? 
            game.objects.skateboarder.getGroup() : 
            game.objects.box;
            
        if (playerObject && game.camera) {
            // Set target position slightly above and behind player
            const targetPosition = new THREE.Vector3();
            targetPosition.copy(playerObject.position);
            targetPosition.y += 5; // Look from above
            targetPosition.z += 10; // Look from behind
            
            // Smooth camera movement
            game.camera.position.lerp(targetPosition, 0.05);
            
            // Look at player
            game.camera.lookAt(
                playerObject.position.x,
                playerObject.position.y + 1, // Look slightly above
                playerObject.position.z
            );
        }
    }
    
    // Create FPS counter element
    function createFpsCounter() {
        const fpsElement = document.createElement('div');
        fpsElement.id = 'fpsCounter';
        fpsElement.style.position = 'fixed';
        fpsElement.style.top = '10px';
        fpsElement.style.right = '10px';
        fpsElement.style.background = 'rgba(0,0,0,0.5)';
        fpsElement.style.color = 'white';
        fpsElement.style.padding = '5px';
        fpsElement.style.borderRadius = '3px';
        fpsElement.style.fontFamily = 'monospace';
        fpsElement.style.zIndex = '1000';
        fpsElement.textContent = 'FPS: --';
        document.body.appendChild(fpsElement);
    }
    
    // Update FPS counter
    function updateFps(timestamp) {
        game.state.frameCount++;
        
        // Update every second
        if (timestamp - game.state.lastFpsUpdate >= 1000) {
            game.state.fps = Math.round((game.state.frameCount * 1000) / (timestamp - game.state.lastFpsUpdate));
            
            const fpsElement = document.getElementById('fpsCounter');
            if (fpsElement) {
                fpsElement.textContent = `FPS: ${game.state.fps} | Dimension: ${game.state.dimensions[game.state.currentDimension].name}`;
                
                // Color code based on performance
                if (game.state.fps >= 50) {
                    fpsElement.style.color = '#8f8';
                } else if (game.state.fps >= 30) {
                    fpsElement.style.color = '#ff8';
                } else {
                    fpsElement.style.color = '#f88';
                }
            }
            
            game.state.lastFpsUpdate = timestamp;
            game.state.frameCount = 0;
            
            // Update debug info every second
            updateDebugInfo();
        }
    }
    
    // Update debug panel with loading message
    function updateDebugPanel(message) {
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            const logElement = document.createElement('div');
            logElement.textContent = message;
            debugPanel.appendChild(logElement);
            // Auto-scroll to bottom
            debugPanel.scrollTop = debugPanel.scrollHeight;
        }
    }
    
    // Update debug panel with current state
    function updateDebugInfo() {
        const debugElement = document.getElementById('debugInfo');
        if (debugElement) {
            // Build status message with game state info
            const dimension = game.state.dimensions[game.state.currentDimension];
            let statusMsg = `<b>Game Status:</b><br>`;
            statusMsg += `- Dimension: ${dimension.name}<br>`;
            statusMsg += `- Gravity: ${dimension.gravity} m/s²<br>`;
            statusMsg += `- FPS: ${game.state.fps}<br>`;
            statusMsg += `- Physics time: ${game.state.physicsTime.toFixed(2)}ms<br>`;
            statusMsg += `- Render time: ${game.state.renderTime.toFixed(2)}ms<br>`;
            statusMsg += `- Models loaded: ${game.state.assetsLoaded ? 'Yes' : 'No'}<br>`;
            statusMsg += `- State: ${game.state.paused ? 'PAUSED' : 'RUNNING'}<br><br>`;
            
            statusMsg += `<b>Controls:</b><br>`;
            statusMsg += `- WASD/Arrows: Move<br>`;
            statusMsg += `- Spacebar: Jump<br>`;
            statusMsg += `- Q: Shift dimension<br>`;
            statusMsg += `- P: Pause/Resume<br>`;
            
            // Player position
            const playerObject = game.objects.skateboarder ? 
                game.objects.skateboarder.getGroup() : 
                game.objects.box;
            
            if (playerObject) {
                const pos = playerObject.position;
                statusMsg += `<br><b>Player:</b> X=${pos.x.toFixed(1)} Y=${pos.y.toFixed(1)} Z=${pos.z.toFixed(1)}`;
            }
            
            // Set the debug panel content
            debugElement.innerHTML = statusMsg;
        }
    }
    
    // Initialize everything
    function init() {
        // Set initial loading screen progress
        const loadingProgress = document.getElementById('loadingProgress');
        if (loadingProgress) {
            loadingProgress.style.width = '20%';
        }
        
        const loadingStatus = document.getElementById('loadingStatus');
        if (loadingStatus) {
            loadingStatus.textContent = 'Initializing 3D environment...';
        }
        
        initThree();
        
        if (loadingProgress) {
            loadingProgress.style.width = '50%';
        }
        
        if (loadingStatus) {
            loadingStatus.textContent = 'Setting up game controls...';
        }
        
        initControls();
        
        if (loadingProgress) {
            loadingProgress.style.width = '80%';
        }
        
        if (loadingStatus) {
            loadingStatus.textContent = 'Finalizing game setup...';
        }
        
        // Initialize debug panel
        updateDebugInfo();
        
        // Complete loading progress
        if (loadingProgress) {
            loadingProgress.style.width = '100%';
        }
        
        if (loadingStatus) {
            loadingStatus.textContent = 'Game ready! Loading 3D models...';
        }
        
        console.log('Game started with controls:');
        console.log('- WASD/Arrows: Move');
        console.log('- Spacebar: Jump');
        console.log('- Q: Shift dimension');
        console.log('- P: Pause/Resume');
    }
    
    // Start initialization
    init();
}); 