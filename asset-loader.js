// Asset Loader for Skate Park Pro
// Manages loading of 3D models and textures

class AssetLoader {
    constructor() {
        this.loadedModels = {};
        this.loadedTextures = {};
        this.loadQueue = [];
        this.loadingInProgress = false;
        this.onComplete = null;
        this.totalItems = 0;
        this.loadedItems = 0;
        
        // Debug helper
        this.logProgress = (item, success) => {
            const status = success ? 'loaded' : 'failed';
            console.log(`Asset ${item} ${status}`);
            this.updateDebugPanel(`Asset ${item} ${status}`);
        };
    }

    // Update the debug panel with loading status
    updateDebugPanel(message) {
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            const logElement = document.createElement('div');
            logElement.textContent = message;
            debugPanel.appendChild(logElement);
            // Auto-scroll to bottom
            debugPanel.scrollTop = debugPanel.scrollHeight;
        }
    }

    // Add a model to the load queue
    queueModel(name, path) {
        this.loadQueue.push({
            type: 'model',
            name: name,
            path: path
        });
        this.totalItems++;
        return this;
    }

    // Add a texture to the load queue
    queueTexture(name, path) {
        this.loadQueue.push({
            type: 'texture',
            name: name,
            path: path
        });
        this.totalItems++;
        return this;
    }

    // Start loading all queued assets
    startLoading(onComplete) {
        if (this.loadingInProgress) {
            console.warn('Loading already in progress');
            return;
        }

        this.onComplete = onComplete || function() {};
        this.loadingInProgress = true;
        this.loadedItems = 0;

        if (this.loadQueue.length === 0) {
            this.loadingInProgress = false;
            this.onComplete();
            return;
        }

        this.updateDebugPanel(`Starting to load ${this.totalItems} assets...`);
        this.processNextItem();
    }

    // Process the next item in the queue
    processNextItem() {
        if (this.loadQueue.length === 0) {
            this.loadingInProgress = false;
            this.updateDebugPanel('All assets loaded successfully!');
            this.onComplete();
            return;
        }

        const item = this.loadQueue.shift();
        
        if (item.type === 'model') {
            this.loadModel(item.name, item.path);
        } else if (item.type === 'texture') {
            this.loadTexture(item.name, item.path);
        }
    }

    // Load a 3D model using GLTFLoader
    loadModel(name, path) {
        const loader = new GLTFLoader();
        
        this.updateDebugPanel(`Loading model: ${name} from ${path}`);
        
        loader.load(
            path,
            // On load success
            (gltf) => {
                this.loadedModels[name] = gltf;
                this.logProgress(name, true);
                this.loadedItems++;
                this.processNextItem();
            },
            // On progress
            (xhr) => {
                if (xhr.lengthComputable) {
                    const percentComplete = xhr.loaded / xhr.total * 100;
                    this.updateDebugPanel(`${name}: ${Math.round(percentComplete)}% loaded`);
                }
            },
            // On error
            (error) => {
                console.error(`Error loading model ${name}:`, error);
                this.logProgress(name, false);
                this.loadedItems++;
                this.processNextItem();
            }
        );
    }

    // Load a texture using THREE.TextureLoader
    loadTexture(name, path) {
        const loader = new THREE.TextureLoader();
        
        this.updateDebugPanel(`Loading texture: ${name} from ${path}`);
        
        loader.load(
            path,
            // On load success
            (texture) => {
                this.loadedTextures[name] = texture;
                this.logProgress(name, true);
                this.loadedItems++;
                this.processNextItem();
            },
            // On progress
            (xhr) => {
                if (xhr.lengthComputable) {
                    const percentComplete = xhr.loaded / xhr.total * 100;
                    this.updateDebugPanel(`${name}: ${Math.round(percentComplete)}% loaded`);
                }
            },
            // On error
            (error) => {
                console.error(`Error loading texture ${name}:`, error);
                this.logProgress(name, false);
                this.loadedItems++;
                this.processNextItem();
            }
        );
    }

    // Get a loaded model by name
    getModel(name) {
        if (this.loadedModels[name]) {
            // Return a clone to prevent modifications to the original
            return this.loadedModels[name].scene.clone();
        }
        console.warn(`Model ${name} not found`);
        return null;
    }

    // Get a loaded texture by name
    getTexture(name) {
        return this.loadedTextures[name] || null;
    }

    // Get loading progress as a percentage
    getProgress() {
        if (this.totalItems === 0) return 100;
        return (this.loadedItems / this.totalItems) * 100;
    }
}

// Create a global instance for use throughout the application
const assetLoader = new AssetLoader();

// Export for use as module
if (typeof module !== 'undefined') {
    module.exports = { AssetLoader, assetLoader };
} 