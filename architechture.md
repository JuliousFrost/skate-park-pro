# Skate Park Pro - Architecture Overview

## Core Architecture

### Entry Points
- **index.html**: Main application entry point that loads the canvas and JavaScript modules
  - Contains a fullscreen canvas element for rendering the game
  - Loads the modular JavaScript components as ES6 modules

### Style & Layout
- **style.css**: Contains minimal styling to create a fullscreen canvas experience
  - Removes default margins and padding
  - Sets up the canvas to fill the entire viewport
  - Establishes core visual styling for the game interface

### JavaScript Module Structure
The game uses a modular architecture to separate concerns and allow for clean, maintainable code:

#### Core Files:
- `main.js`: Game entry point and main loop, initializes all required components
- `renderer.js`: Handles 3D rendering with ThreeJS, manages scene, camera, and visualization
- `physics.js`: Manages physics simulation using CannonJS, handles physical objects and collision
- `controls.js`: Manages user input, both keyboard for desktop and NippleJS for mobile
- `ui.js`: (Coming soon) Will manage game UI elements and HUD

#### External Libraries:
- `three.module.js`: ThreeJS library for 3D rendering
- `cannon.module.js`: Simplified implementation of CannonJS for physics simulation
- `nipplejs.min.js`: Library for creating virtual joysticks on touch devices

### Assets
- **assets/**: Directory for game resources
  - Will contain 3D models (skater, skate park elements)
  - Will store textures and materials
  - May include audio files for sound effects and music

### Testing
- **test.js**: Validates the project structure for Step 1
  - Checks for the existence of required files and directories
  - Confirms the module structure is valid

- **test-step2.js**: Validates the canvas initialization for Step 2
  - Confirms the canvas element exists and has proper dimensions
  - Verifies that a 2D context can be obtained from the canvas

- **test-step3.js**: Validates the ThreeJS implementation for Step 3
  - Checks if WebGL context is active
  - Verifies that animation is running
  - Prompts for visual confirmation of the 3D scene

## Design Principles
- **Modularity**: Each JavaScript file has a single responsibility
- **ES6 Modules**: Modern JavaScript module system for clean dependency management
- **Responsive Design**: Layout adjusts to different screen sizes and orientations
- **Cross-Platform**: Same codebase works on desktop and mobile browsers

## Graphics & Rendering
- **WebGL**: Hardware-accelerated 3D graphics via ThreeJS
- **Responsive Canvas**: Automatically adjusts to viewport changes
- **Optimized Rendering**: Using proper ThreeJS techniques for performance
- **Lighting System**: Combination of ambient and directional lights
- **Animation Loop**: Efficient rendering using requestAnimationFrame

## Canvas Handling
- The canvas element fills the entire viewport
- Automatic resizing when the window size changes
- Resolution matching to prevent blurry rendering
- Consistent handling of WebGL context across browser environments

### Physics
- Using a simplified CannonJS implementation for physics simulation
- Physics world with configurable gravity
- Support for different body types:
  - Static bodies (ground plane)
  - Dynamic bodies (player character, objects)
- Collision detection and response
- Synchronization between physics bodies and visual representations

### Controls

- Adaptive input system that detects device type (mobile vs desktop)
- Desktop controls:
  - WASD/Arrow keys for movement
  - Spacebar for jump action
  - Shift key for trick execution
- Mobile touch controls using NippleJS:
  - Dual joystick interface
  - Left joystick for directional movement
  - Right joystick for actions (jump and tricks)
- Clean interface for querying input state from the game loop
- Automatic control scheme switching based on device

### Game Loop

- Implements a professional game loop pattern with:
  - Fixed time step updates for consistent physics simulation
  - Separate processing phases for clean architecture
  - Performance monitoring and FPS management
  - Support for pausing and state management
- Features frame-rate independence for consistent gameplay across devices
- Handles both synchronous and asynchronous operations effectively
- Provides robust error handling to prevent crashing

### Dimensional Drift Mechanics

- Multi-dimensional gameplay system that allows players to switch between parallel dimensions
- Each dimension has unique:
  - Physics properties (gravity, friction, etc.)
  - Visual characteristics (colors, lighting, effects)
  - Environmental behaviors
- Core components:
  - Dimension state management in the game state
  - Physics property variations between dimensions
  - Visual transition effects when shifting dimensions
  - Dimension-specific interaction points (portals)
- Provides gameplay variety and strategic depth through dimensional shifting

### Asset Loading & 3D Models

- Comprehensive asset management system:
  - Queue-based loading for managing multiple assets
  - Progress tracking with visual feedback (loading screen)
  - Error handling with fallback mechanisms
  - Asynchronous loading to prevent UI blocking
  - Cache management for optimized performance

- 3D Model Structure:
  - Skate Park Environment:
    - Constructed using THREE.js primitives in a component-based design
    - Features various skateboarding elements (half-pipe, ramps, rails, funbox)
    - Custom geometry for specialized skateboarding surfaces
    - Optimized for performance with appropriate level of detail
  
  - Character Models:
    - Modular skateboarder design with separate body components
    - Skateboard model with detailed parts (deck, trucks, wheels)
    - Animation system for character movements and tricks
    - Dimension-specific visual variations
  
  - Visual Effects:
    - Dimensional portal with animated effects
    - Real-time shadows for enhanced visual quality
    - Material system with physically-based rendering properties
    - Dynamic lighting based on game state and actions

- Animation Framework:
  - Character animations for idle, movement, and tricks
  - Environmental animations for interactive elements
  - Procedural animations for dimension shifting effects
  - Smooth transitions between animation states

- Camera System:
  - Third-person camera that intelligently follows the player
  - Smooth transitions during movement and dimension shifts
  - Adjustable perspectives based on game context
  - Special camera behaviors during trick execution

### User Interface System

- Layered UI Architecture:
  - UI container positioned above the game canvas
  - Separation of in-game HUD elements and menu screens
  - DOM-based elements for optimal performance and accessibility
  - Responsive design that adapts to different screen sizes and orientations

- Game Menu System:
  - Main menu with game title and navigation options
  - Pause menu with resume and exit functionality
  - Game over screen with final score and retry options
  - Controls screen with input instructions
  - Consistent visual styling across all menus

- HUD Components:
  - Score display with real-time updates
  - Combo meter for tracking consecutive tricks
  - Dimension indicator showing current game dimension
  - Trick notification system for immediate feedback
  - Pause button for mobile accessibility

- Gameplay Feedback:
  - Visual notifications for completed tricks
  - Score animations for point accumulation
  - Dimension shift indicators with color cues
  - Combo multiplier display with timeout visualization

- State Management:
  - Centralized game state tracking (menu, playing, paused, game over)
  - Event-based communication between UI and game systems
  - Smooth transitions between different game states
  - Persistent scoring and statistics

- Visual Design:
  - Cyberpunk-inspired color scheme with neon accents
  - Semi-transparent backgrounds for unobtrusive overlays
  - Consistent typography and button styling
  - Interactive elements with hover and click effects
  - Animated transitions for enhanced user experience
