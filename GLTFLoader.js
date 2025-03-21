// Simplified GLTFLoader for Three.js
// This is a streamlined version of Three.js's GLTFLoader

class GLTFLoader {
    constructor(manager) {
        this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
    }

    // Load a GLTF resource
    load(url, onLoad, onProgress, onError) {
        const scope = this;

        const loader = new THREE.FileLoader(this.manager);
        loader.setPath(this.path);
        loader.setResponseType('arraybuffer');
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);

        loader.load(url, function(data) {
            try {
                scope.parse(data, '', onLoad);
            } catch (e) {
                if (onError) {
                    onError(e);
                } else {
                    console.error(e);
                }
                scope.manager.itemError(url);
            }
        }, onProgress, onError);
    }

    // Set path for loading related textures
    setPath(value) {
        this.path = value;
        return this;
    }

    // Parse the data
    parse(data, path, onLoad) {
        // This is a simplified version that adds a 3D skateboard model
        // In a real implementation, this would parse the GLTF file structure
        
        // Create a group to hold the model
        const group = new THREE.Group();
        
        // Simple skateboard model (built from primitives)
        const board = new THREE.Group();
        
        // Deck (elongated box)
        const deckGeometry = new THREE.BoxGeometry(2, 0.2, 0.8);
        const deckMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const deck = new THREE.Mesh(deckGeometry, deckMaterial);
        deck.position.y = 0.1;
        board.add(deck);
        
        // Trucks (metal parts)
        const truckGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.6);
        const truckMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
        
        const frontTruck = new THREE.Mesh(truckGeometry, truckMaterial);
        frontTruck.position.set(0.6, 0, 0);
        board.add(frontTruck);
        
        const backTruck = new THREE.Mesh(truckGeometry, truckMaterial);
        backTruck.position.set(-0.6, 0, 0);
        board.add(backTruck);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const wheels = [];
        const wheelPositions = [
            [0.6, -0.05, 0.25], // Front right
            [0.6, -0.05, -0.25], // Front left
            [-0.6, -0.05, 0.25], // Back right
            [-0.6, -0.05, -0.25]  // Back left
        ];
        
        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(position[0], position[1], position[2]);
            wheel.rotation.z = Math.PI / 2; // Rotate to correct orientation
            board.add(wheel);
            wheels.push(wheel);
        });
        
        // Add the skateboard to the group
        group.add(board);

        // Call the onLoad callback with our manufactured "GLTF" object
        onLoad({ scene: group });
    }
}

// Export for use as module
if (typeof module !== 'undefined') {
    module.exports = { GLTFLoader };
} 