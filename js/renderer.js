// Renderer module handles rendering of 3D graphics using ThreeJS

import * as THREE from './lib/three.module.js';

export class Renderer {
    constructor(canvas) {
        console.log("Initializing renderer...");
        
        // Store canvas reference
        this.canvas = canvas;
        
        // Setup ThreeJS scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue background
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75, // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        
        // Lighting
        this.setupLighting();
        
        // Objects registry
        this.objects = {
            ground: null,
            boxes: []
        };
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        
        // Shadow settings
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        
        this.scene.add(directionalLight);
    }
    
    createGround() {
        // Create a large ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to be flat
        ground.receiveShadow = true;
        
        this.scene.add(ground);
        this.objects.ground = ground;
        
        return ground;
    }
    
    createBox(dimensions, position) {
        // Create a box mesh
        const boxGeometry = new THREE.BoxGeometry(
            dimensions.x, 
            dimensions.y, 
            dimensions.z
        );
        const boxMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00 
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        
        // Set position based on physics body
        box.position.copy(this.vecToThree(position));
        
        // Enable shadows
        box.castShadow = true;
        box.receiveShadow = true;
        
        // Add to scene
        this.scene.add(box);
        this.objects.boxes.push(box);
        
        return box;
    }
    
    updateBox(physicsPosition, physicsQuaternion) {
        // If we have a box, update its position/rotation based on physics
        if (this.objects.boxes.length > 0) {
            const box = this.objects.boxes[0];
            
            // Update position
            box.position.copy(this.vecToThree(physicsPosition));
            
            // Update rotation
            box.quaternion.set(
                physicsQuaternion.x,
                physicsQuaternion.y,
                physicsQuaternion.z,
                physicsQuaternion.w
            );
        }
    }
    
    // Helper to convert CANNON vectors to THREE vectors
    vecToThree(cannonVec) {
        return new THREE.Vector3(cannonVec.x, cannonVec.y, cannonVec.z);
    }
    
    // Handle window resize
    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    // Render the scene
    render(deltaTime) {
        // Animation updates can be done here
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
} 