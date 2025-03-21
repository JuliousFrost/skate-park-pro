// Controls module for Skate Park Pro
// Handles keyboard, mouse, and touch inputs

class Controls {
    constructor() {
        // Control state
        this.input = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            trick: false
        };

        // Joystick data
        this.joystickMovement = null;
        this.joystickTrick = null;
        
        // Mobile detection
        this.isMobile = this.detectMobile();
        
        // Initialize appropriate controls
        if (this.isMobile) {
            this.initTouchControls();
        } else {
            this.initKeyboardControls();
        }
        
        console.log(`Controls initialized for ${this.isMobile ? 'mobile' : 'desktop'}`);
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 800;
    }
    
    initKeyboardControls() {
        // Set up keyboard event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        console.log('Keyboard controls initialized');
    }
    
    initTouchControls() {
        try {
            // Create joystick container
            const joystickContainer = document.createElement('div');
            joystickContainer.id = 'joystick-container';
            joystickContainer.style.position = 'absolute';
            joystickContainer.style.bottom = '20px';
            joystickContainer.style.left = '0';
            joystickContainer.style.width = '100%';
            joystickContainer.style.height = '150px';
            joystickContainer.style.display = 'flex';
            joystickContainer.style.justifyContent = 'space-between';
            joystickContainer.style.zIndex = '1000';
            document.body.appendChild(joystickContainer);
            
            // Create movement zone (left side)
            const movementZone = document.createElement('div');
            movementZone.id = 'movement-zone';
            movementZone.style.width = '50%';
            movementZone.style.height = '100%';
            joystickContainer.appendChild(movementZone);
            
            // Create trick zone (right side)
            const trickZone = document.createElement('div');
            trickZone.id = 'trick-zone';
            trickZone.style.width = '50%';
            trickZone.style.height = '100%';
            joystickContainer.appendChild(trickZone);
            
            // Movement joystick (left)
            this.joystickMovement = nipplejs.create({
                zone: document.getElementById('movement-zone'),
                mode: 'static',
                position: { left: '25%', bottom: '50%' },
                color: 'gray',
                size: 100
            });
            
            // Trick joystick (right)
            this.joystickTrick = nipplejs.create({
                zone: document.getElementById('trick-zone'),
                mode: 'static',
                position: { right: '25%', bottom: '50%' },
                color: 'blue',
                size: 100
            });
            
            // Add event listeners for movement joystick
            this.joystickMovement.on('move', (evt, data) => {
                const angle = data.angle.radian;
                const force = Math.min(data.force, 1.0);
                
                // Reset movement inputs
                this.input.forward = false;
                this.input.backward = false;
                this.input.left = false;
                this.input.right = false;
                
                // Calculate movement based on angle and force
                const forwardValue = -Math.cos(angle) * force;
                const rightValue = Math.sin(angle) * force;
                
                // Apply threshold to avoid tiny movements
                const threshold = 0.3;
                if (Math.abs(forwardValue) > threshold) {
                    if (forwardValue > 0) {
                        this.input.forward = true;
                    } else {
                        this.input.backward = true;
                    }
                }
                
                if (Math.abs(rightValue) > threshold) {
                    if (rightValue > 0) {
                        this.input.right = true;
                    } else {
                        this.input.left = true;
                    }
                }
            });
            
            // Reset inputs when joystick returns to center
            this.joystickMovement.on('end', () => {
                this.input.forward = false;
                this.input.backward = false;
                this.input.left = false;
                this.input.right = false;
            });
            
            // Trick joystick events
            this.joystickTrick.on('start', () => {
                this.input.jump = true;
            });
            
            this.joystickTrick.on('end', () => {
                this.input.jump = false;
                this.input.trick = false;
            });
            
            // Special gesture for trick
            this.joystickTrick.on('dir:up', () => {
                this.input.trick = true;
                // Reset after short delay
                setTimeout(() => {
                    this.input.trick = false;
                }, 300);
            });
            
            console.log('Touch controls initialized');
        } catch (error) {
            console.error('Error initializing touch controls:', error);
        }
    }
    
    handleKeyDown(event) {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.input.forward = true;
                break;
            case 's':
            case 'ArrowDown':
                this.input.backward = true;
                break;
            case 'a':
            case 'ArrowLeft':
                this.input.left = true;
                break;
            case 'd':
            case 'ArrowRight':
                this.input.right = true;
                break;
            case ' ': // Spacebar
                this.input.jump = true;
                break;
            case 'Shift':
                this.input.trick = true;
                break;
        }
    }
    
    handleKeyUp(event) {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.input.forward = false;
                break;
            case 's':
            case 'ArrowDown':
                this.input.backward = false;
                break;
            case 'a':
            case 'ArrowLeft':
                this.input.left = false;
                break;
            case 'd':
            case 'ArrowRight':
                this.input.right = false;
                break;
            case ' ': // Spacebar
                this.input.jump = false;
                break;
            case 'Shift':
                this.input.trick = false;
                break;
        }
    }
    
    // Get current input state
    getInputs() {
        return this.input;
    }
    
    // Show mobile controls if needed
    showMobileControls() {
        if (this.isMobile) {
            const container = document.getElementById('joystick-container');
            if (container) {
                container.style.display = 'flex';
            }
        }
    }
    
    // Hide mobile controls if needed
    hideMobileControls() {
        if (this.isMobile) {
            const container = document.getElementById('joystick-container');
            if (container) {
                container.style.display = 'none';
            }
        }
    }
}

export default Controls; 