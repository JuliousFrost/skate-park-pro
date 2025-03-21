// Main application entry point

import { Renderer } from './renderer.js';
import Physics from './physics.js';

class Main {
    constructor() {
        console.log('Skate Park Pro initializing...');
        
        try {
            // Get the canvas element
            this.canvas = document.getElementById('gameCanvas');
            if (!this.canvas) {
                throw new Error('Canvas element "gameCanvas" not found!');
            }
            console.log('Canvas found:', this.canvas);
            
            // Initialize game components
            this.initializeComponents();
            
            // Setup game loop
            this.lastTime = 0;
            this.gameLoop(0);
            
            console.log('Game initialization complete');
        } catch (error) {
            console.error('Error during game initialization:', error);
        }
    }
    
    initializeComponents() {
        try {
            // Initialize rendering
            this.renderer = new Renderer(this.canvas);
            console.log('Renderer initialized');
            
            // Initialize physics
            this.physics = new Physics();
            console.log('Physics initialized');
            
            // Create ground plane
            this.groundBody = this.physics.createGround();
            console.log('Ground created in physics world');
            
            // Create a test box
            this.testBox = this.physics.createBox(
                { x: 1, y: 1, z: 1 }, // dimensions
                { x: 0, y: 5, z: 0 }  // position
            );
            console.log('Test box created at y=5');
            
            // Make sure renderer has a reference to physics objects
            this.syncPhysicsToGraphics();
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }
    
    syncPhysicsToGraphics() {
        try {
            // Create visual representations of physics objects
            
            // Ground
            this.renderer.createGround();
            console.log('Ground visual created');
            
            // Test box
            this.renderer.createBox(
                { x: 1, y: 1, z: 1 },
                this.testBox.position
            );
            console.log('Box visual created at:', this.testBox.position);
        } catch (error) {
            console.error('Error syncing physics to graphics:', error);
        }
    }
    
    updatePhysicsObjects() {
        try {
            // Update the position and rotation of all 3D objects based on physics state
            this.renderer.updateBox(this.testBox.position, this.testBox.quaternion);
        } catch (error) {
            console.error('Error updating physics objects:', error);
        }
    }
    
    resizeCanvas() {
        try {
            // Get the actual size of the canvas container
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight;
            
            console.log('Resizing canvas to:', containerWidth, 'x', containerHeight);
            
            // Set the canvas size
            this.canvas.width = containerWidth;
            this.canvas.height = containerHeight;
            
            // Update renderer with new canvas size
            if (this.renderer) {
                this.renderer.resize(containerWidth, containerHeight);
            }
        } catch (error) {
            console.error('Error resizing canvas:', error);
        }
    }
    
    gameLoop(currentTime) {
        try {
            // Convert time to seconds
            currentTime *= 0.001;
            const deltaTime = Math.min(0.1, currentTime - this.lastTime);
            this.lastTime = currentTime;
            
            // Update physics
            this.physics.update(deltaTime);
            
            // Update visual objects with physics data
            this.updatePhysicsObjects();
            
            // Render the scene
            this.renderer.render(deltaTime);
            
            // Request next frame
            requestAnimationFrame(this.gameLoop.bind(this));
        } catch (error) {
            console.error('Error in game loop:', error);
        }
    }
    
    // Start the game
    start() {
        try {
            console.log('Starting game...');
            // Make sure canvas is correctly sized
            this.resizeCanvas();
            
            // Listen for window resize events
            window.addEventListener('resize', this.resizeCanvas.bind(this));
            console.log('Game started successfully');
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }
}

// Create and export an instance of the Main class
const game = new Main();
game.start();

console.log('Main module loaded, game object created and started');

// Make game accessible globally
window.game = game;

export default game; 