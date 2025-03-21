// Skateboarder Model
// Creates a simple skateboarder character using THREE.js primitives

class SkateboarderModel {
    constructor() {
        this.group = new THREE.Group();
        this.createSkateboarder();
        
        // Animation properties
        this.animationTime = 0;
        this.isJumping = false;
        this.jumpHeight = 0;
        this.jumpTime = 0;
    }

    createSkateboarder() {
        // Create the skateboarder and the skateboard
        this.createCharacter();
        this.createSkateboard();
        
        // Position the whole group
        this.group.position.y = 0.2; // Slight offset from ground
    }

    createCharacter() {
        // Create a simple character using primitives
        this.character = new THREE.Group();
        
        // Head (sphere)
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.y = 1.5;
        this.head.castShadow = true;
        this.character.add(this.head);
        
        // Body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.6, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 1.1;
        this.body.castShadow = true;
        this.character.add(this.body);
        
        // Arms
        this.createLimb(0.1, 0.5, 0x1E90FF, 0.25, 1.1, 0.25, true);  // Right arm
        this.createLimb(0.1, 0.5, 0x1E90FF, -0.25, 1.1, 0.25, true); // Left arm
        
        // Legs
        this.rightLeg = this.createLimb(0.12, 0.6, 0x191970, 0.15, 0.7, 0, false);
        this.leftLeg = this.createLimb(0.12, 0.6, 0x191970, -0.15, 0.7, 0, false);
        
        // Add character to main group
        this.group.add(this.character);
    }

    createLimb(radius, height, color, x, y, z, isArm) {
        const limbGeometry = new THREE.CylinderGeometry(radius, radius, height, 16);
        const limbMaterial = new THREE.MeshLambertMaterial({ color: color });
        const limb = new THREE.Mesh(limbGeometry, limbMaterial);
        limb.position.set(x, y, z);
        
        if (isArm) {
            limb.rotation.z = Math.PI / 2;
        } else {
            // Store leg references for animation
            limb.userData.isLeg = true;
        }
        
        limb.castShadow = true;
        this.character.add(limb);
        return limb;
    }

    createSkateboard() {
        this.skateboard = new THREE.Group();
        
        // Deck (elongated box)
        const deckGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.3);
        const deckMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const deck = new THREE.Mesh(deckGeometry, deckMaterial);
        deck.castShadow = true;
        this.skateboard.add(deck);
        
        // Trucks (metal parts)
        const truckGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.25);
        const truckMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        
        const frontTruck = new THREE.Mesh(truckGeometry, truckMaterial);
        frontTruck.position.set(0.2, -0.05, 0);
        frontTruck.castShadow = true;
        this.skateboard.add(frontTruck);
        
        const backTruck = new THREE.Mesh(truckGeometry, truckMaterial);
        backTruck.position.set(-0.2, -0.05, 0);
        backTruck.castShadow = true;
        this.skateboard.add(backTruck);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const wheelPositions = [
            [0.2, -0.08, 0.13],  // Front right
            [0.2, -0.08, -0.13], // Front left
            [-0.2, -0.08, 0.13], // Back right
            [-0.2, -0.08, -0.13] // Back left
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(position[0], position[1], position[2]);
            wheel.rotation.z = Math.PI / 2; // Rotate to correct orientation
            wheel.castShadow = true;
            this.skateboard.add(wheel);
        });
        
        // Position skateboard
        this.skateboard.position.y = 0.1;
        
        // Add skateboard to main group
        this.group.add(this.skateboard);
    }

    // Animation methods
    update(deltaTime, input) {
        this.animationTime += deltaTime;
        
        // Update jump if currently jumping
        if (this.isJumping) {
            this.updateJump(deltaTime);
        }
        
        // Animate character based on movement
        this.animateCharacter(input);
        
        // Tilt based on input
        this.tiltModel(input);
    }
    
    animateCharacter(input) {
        // Simple idle animation (subtle up and down motion)
        if (!this.isJumping) {
            const idleY = Math.sin(this.animationTime * 3) * 0.05;
            this.character.position.y = idleY;
            
            // Leg animation when moving
            if (input.forward || input.backward || input.left || input.right) {
                const legAngle = Math.sin(this.animationTime * 10) * 0.2;
                if (this.rightLeg) this.rightLeg.rotation.x = legAngle;
                if (this.leftLeg) this.leftLeg.rotation.x = -legAngle;
            } else {
                // Reset leg positions when idle
                if (this.rightLeg) this.rightLeg.rotation.x = 0;
                if (this.leftLeg) this.leftLeg.rotation.x = 0;
            }
        }
    }
    
    tiltModel(input) {
        // Tilt skateboard based on movement direction
        const targetRotationX = input.forward ? -0.2 : input.backward ? 0.2 : 0;
        const targetRotationZ = input.left ? -0.2 : input.right ? 0.2 : 0;
        
        // Smooth transition to target rotation
        this.group.rotation.x += (targetRotationX - this.group.rotation.x) * 0.1;
        this.group.rotation.z += (targetRotationZ - this.group.rotation.z) * 0.1;
    }
    
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpTime = 0;
            
            // Adjust character pose for jump
            if (this.rightLeg) this.rightLeg.rotation.x = -0.3;
            if (this.leftLeg) this.leftLeg.rotation.x = -0.3;
        }
    }
    
    updateJump(deltaTime) {
        this.jumpTime += deltaTime;
        
        // Jump duration
        const jumpDuration = 0.8; // seconds
        
        if (this.jumpTime < jumpDuration) {
            // Parabolic jump trajectory
            const jumpProgress = this.jumpTime / jumpDuration;
            const jumpCurve = Math.sin(jumpProgress * Math.PI); // 0 to 1 to 0
            
            // Update height
            this.jumpHeight = jumpCurve * 2; // max height = 2 units
            this.group.position.y = 0.2 + this.jumpHeight;
            
            // Rotate skateboard during jump (trick)
            this.skateboard.rotation.z = jumpProgress * Math.PI * 2; // 360 degree flip
            
            // Crouch character during take-off and landing
            const crouchFactor = Math.max(0, 0.3 - Math.abs(jumpProgress - 0.5) * 0.6);
            this.character.scale.y = 1 - crouchFactor;
            this.character.position.y = -crouchFactor * 0.3;
        } else {
            // Jump complete
            this.isJumping = false;
            this.jumpHeight = 0;
            this.group.position.y = 0.2; // Reset to default height
            this.skateboard.rotation.z = 0; // Reset skateboard rotation
            this.character.scale.y = 1; // Reset character scale
            this.character.position.y = 0; // Reset character position
            
            // Reset leg positions
            if (this.rightLeg) this.rightLeg.rotation.x = 0;
            if (this.leftLeg) this.leftLeg.rotation.x = 0;
        }
    }

    // Swap the character's appearance for dimension shift
    swapDimension(dimensionId) {
        const dimensions = {
            0: { // Normal dimension
                head: 0xFFD700,
                body: 0xFF0000,
                limbs: 0x1E90FF,
                deck: 0x8B4513
            },
            1: { // Alternate dimension
                head: 0x9370DB, // Purple
                body: 0x00CED1, // Dark Turquoise
                limbs: 0x32CD32, // Lime Green
                deck: 0x708090  // Slate Grey
            }
        };
        
        const colors = dimensions[dimensionId] || dimensions[0];
        
        // Update character colors
        if (this.head) {
            this.head.material.color.setHex(colors.head);
        }
        
        if (this.body) {
            this.body.material.color.setHex(colors.body);
        }
        
        // Update limbs
        this.character.children.forEach(child => {
            if (child !== this.head && child !== this.body) {
                child.material.color.setHex(colors.limbs);
            }
        });
        
        // Update skateboard deck
        if (this.skateboard && this.skateboard.children.length > 0) {
            this.skateboard.children[0].material.color.setHex(colors.deck);
        }
    }

    getGroup() {
        return this.group;
    }
}

// Export for use as module
if (typeof module !== 'undefined') {
    module.exports = { SkateboarderModel };
} 