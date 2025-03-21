// Skate Park Model
// Creates a simple skate park environment using THREE.js primitives

class SkateParkModel {
    constructor() {
        this.scene = new THREE.Group();
        this.createSkatePark();
    }

    createSkatePark() {
        // Create the base ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x999999, 
            side: THREE.DoubleSide 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add a half-pipe
        this.addHalfPipe();
        
        // Add a funbox
        this.addFunBox();
        
        // Add a rail
        this.addRail();
        
        // Add some ramps
        this.addRamps();
        
        // Add dimensional portal (related to our dimensional drift mechanic)
        this.addDimensionalPortal();
    }

    addHalfPipe() {
        const halfPipeGroup = new THREE.Group();
        
        // Create the two sides of the half-pipe
        const sideGeometry = new THREE.BoxGeometry(15, 3, 0.5);
        const sideMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        
        const side1 = new THREE.Mesh(sideGeometry, sideMaterial);
        side1.position.set(0, 1, -5);
        side1.receiveShadow = true;
        side1.castShadow = true;
        halfPipeGroup.add(side1);
        
        const side2 = new THREE.Mesh(sideGeometry, sideMaterial);
        side2.position.set(0, 1, 5);
        side2.receiveShadow = true;
        side2.castShadow = true;
        halfPipeGroup.add(side2);
        
        // Create the curved surface of the half-pipe
        const segments = 20;
        const halfPipeCurveGeometry = new THREE.BufferGeometry();
        const positions = [];
        
        for (let i = 0; i <= segments; i++) {
            const angle = (Math.PI / segments) * i;
            const x = -7.5 + (15 / segments) * i;
            const y = 1.5 * Math.sin(angle);
            const z = 5 - 10 * Math.cos(angle);
            
            positions.push(x, y, z);
        }
        
        const indices = [];
        for (let i = 0; i < segments; i++) {
            indices.push(i, i + 1, i + segments + 1);
            indices.push(i, i + segments + 1, i + segments);
        }
        
        halfPipeCurveGeometry.setIndex(indices);
        halfPipeCurveGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        halfPipeCurveGeometry.computeVertexNormals();
        
        const halfPipeCurveMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xA0A0A0, 
            side: THREE.DoubleSide 
        });
        const halfPipeCurve = new THREE.Mesh(halfPipeCurveGeometry, halfPipeCurveMaterial);
        halfPipeCurve.receiveShadow = true;
        halfPipeCurve.castShadow = true;
        halfPipeGroup.add(halfPipeCurve);
        
        // Position the half-pipe in the scene
        halfPipeGroup.position.set(-20, 0, 0);
        this.scene.add(halfPipeGroup);
    }

    addFunBox() {
        const funBoxGroup = new THREE.Group();
        
        // Base platform
        const baseGeometry = new THREE.BoxGeometry(8, 1, 8);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xA0A0A0 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.5;
        base.receiveShadow = true;
        base.castShadow = true;
        funBoxGroup.add(base);
        
        // Ramps on each side
        const rampGeometry = new THREE.BoxGeometry(4, 1, 8);
        const rampMaterial = new THREE.MeshPhongMaterial({ color: 0x909090 });
        
        // Front ramp
        const frontRamp = new THREE.Mesh(rampGeometry, rampMaterial);
        frontRamp.position.set(6, 0.5, 0);
        frontRamp.rotation.z = -Math.PI / 8;
        frontRamp.receiveShadow = true;
        frontRamp.castShadow = true;
        funBoxGroup.add(frontRamp);
        
        // Back ramp
        const backRamp = new THREE.Mesh(rampGeometry, rampMaterial);
        backRamp.position.set(-6, 0.5, 0);
        backRamp.rotation.z = Math.PI / 8;
        backRamp.receiveShadow = true;
        backRamp.castShadow = true;
        funBoxGroup.add(backRamp);
        
        // Position the funbox in the scene
        funBoxGroup.position.set(15, 0, 0);
        this.scene.add(funBoxGroup);
    }

    addRail() {
        const railGroup = new THREE.Group();
        
        // Rail base supports
        const supportGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
        const supportMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
        
        const support1 = new THREE.Mesh(supportGeometry, supportMaterial);
        support1.position.set(-5, 0.75, 0);
        support1.receiveShadow = true;
        support1.castShadow = true;
        railGroup.add(support1);
        
        const support2 = new THREE.Mesh(supportGeometry, supportMaterial);
        support2.position.set(5, 0.75, 0);
        support2.receiveShadow = true;
        support2.castShadow = true;
        railGroup.add(support2);
        
        // Rail bar
        const railGeometry = new THREE.CylinderGeometry(0.1, 0.1, 12, 16);
        const railMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xC0C0C0,
            metalness: 0.8,
            roughness: 0.2
        });
        const rail = new THREE.Mesh(railGeometry, railMaterial);
        rail.rotation.z = Math.PI / 2;
        rail.position.y = 1.5;
        rail.receiveShadow = true;
        rail.castShadow = true;
        railGroup.add(rail);
        
        // Position the rail in the scene
        railGroup.position.set(0, 0, 15);
        this.scene.add(railGroup);
    }

    addRamps() {
        // Small ramp
        const smallRampGeometry = new THREE.BoxGeometry(5, 2, 8);
        const rampMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const smallRamp = new THREE.Mesh(smallRampGeometry, rampMaterial);
        smallRamp.position.set(-15, 0, 15);
        smallRamp.rotation.z = -Math.PI / 6;
        smallRamp.receiveShadow = true;
        smallRamp.castShadow = true;
        this.scene.add(smallRamp);
        
        // Large ramp
        const largeRampGeometry = new THREE.BoxGeometry(10, 4, 12);
        const largeRamp = new THREE.Mesh(largeRampGeometry, rampMaterial);
        largeRamp.position.set(25, 1, -15);
        largeRamp.rotation.z = -Math.PI / 8;
        largeRamp.receiveShadow = true;
        largeRamp.castShadow = true;
        this.scene.add(largeRamp);
    }

    addDimensionalPortal() {
        // Create a portal to represent our dimensional drift mechanic
        const portalGroup = new THREE.Group();
        
        // Portal ring
        const ringGeometry = new THREE.TorusGeometry(2, 0.3, 16, 32);
        const ringMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00FFFF,
            emissive: 0x00AAAA,
            emissiveIntensity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.receiveShadow = true;
        ring.castShadow = true;
        portalGroup.add(ring);
        
        // Portal energy effect (simple plane with special material)
        const portalGeometry = new THREE.CircleGeometry(1.7, 32);
        const portalMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00FFFF,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const portal = new THREE.Mesh(portalGeometry, portalMaterial);
        portal.name = "dimensionalPortal";
        portalGroup.add(portal);
        
        // Position the portal in the scene
        portalGroup.position.set(0, 10, -20);
        portalGroup.rotation.y = Math.PI / 4;
        this.scene.add(portalGroup);
        
        // Store a reference to animate it later
        this.portal = portalGroup;
    }

    // Animation method to be called in the game loop
    update(deltaTime) {
        if (this.portal) {
            // Rotate the portal
            this.portal.rotation.z += deltaTime * 0.5;
            
            // Pulse the portal energy
            const portalEnergy = this.portal.children[1];
            if (portalEnergy) {
                const scale = 0.9 + Math.sin(Date.now() * 0.003) * 0.1;
                portalEnergy.scale.set(scale, scale, scale);
            }
        }
    }

    // Get the scene with all skate park elements
    getScene() {
        return this.scene;
    }
}

// Export for use as module
if (typeof module !== 'undefined') {
    module.exports = { SkateParkModel };
} 