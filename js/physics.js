// Physics module for Skate Park Pro
// Handles physics simulations using Cannon.js

import CANNON from './lib/cannon.module.js';

class Physics {
    constructor() {
        // Initialize the physics world
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0) // Earth gravity
        });

        // Store physics bodies
        this.bodies = [];

        // Default material
        this.defaultMaterial = null;
        this.skateboardMaterial = null;
        
        this.setupMaterials();
    }

    setupMaterials() {
        // This is a simplified version since our cannon implementation is basic
        this.defaultMaterial = {};
        this.skateboardMaterial = {};
    }

    update(deltaTime) {
        // Step the physics world forward in time
        this.world.step(deltaTime);
    }

    // Create a ground plane
    createGround() {
        // Create a plane body
        const groundBody = new CANNON.Body({
            mass: 0 // Static body
        });
        
        // Add a plane shape
        groundBody.addShape(new CANNON.Plane());
        
        // Position the ground
        groundBody.position.set(0, 0, 0);
        
        // Rotate the ground to be flat
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        
        // Add the ground to the world
        this.world.addBody(groundBody);
        
        // Keep a reference
        this.bodies.push(groundBody);
        
        return groundBody;
    }

    // Create a box
    createBox(dimensions, position, mass = 1) {
        // Create a box body
        const boxBody = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z)
        });
        
        // Add a box shape
        boxBody.addShape(new CANNON.Box(new CANNON.Vec3(
            dimensions.x / 2, 
            dimensions.y / 2, 
            dimensions.z / 2
        )));
        
        // Initialize velocity
        boxBody.velocity = new CANNON.Vec3(0, 0, 0);
        
        // Allow manual position/velocity updates
        boxBody.allowManualUpdate = true;
        
        // Add the box to the world
        this.world.addBody(boxBody);
        
        // Keep a reference
        this.bodies.push(boxBody);
        
        return boxBody;
    }

    // Create a sphere
    createSphere(radius, position, mass = 1) {
        // Create a sphere body
        const sphereBody = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z)
        });
        
        // Add a sphere shape
        sphereBody.addShape(new CANNON.Sphere(radius));
        
        // Initialize velocity
        sphereBody.velocity = new CANNON.Vec3(0, 0, 0);
        
        // Add the sphere to the world
        this.world.addBody(sphereBody);
        
        // Keep a reference
        this.bodies.push(sphereBody);
        
        return sphereBody;
    }

    // Remove a body from the physics world
    removeBody(body) {
        const index = this.bodies.indexOf(body);
        if (index !== -1) {
            this.bodies.splice(index, 1);
            // In a full implementation, we would also remove it from the world
        }
    }
}

export default Physics; 