import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
try {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem fallback
}


// Initial seed data
const initialData = {
  categories: [
    { id: 'cat-1', name: 'Artificial Intelligence', slug: 'artificial-intelligence', icon: 'Brain', count: 12, description: 'Neural networks, autonomous systems, and cognitive computing' },
    { id: 'cat-2', name: 'Machine Learning', slug: 'machine-learning', icon: 'Cpu', count: 15, description: 'Deep learning models, predictive analytics, and computer vision' },
    { id: 'cat-3', name: 'Robotics', slug: 'robotics', icon: 'Bot', count: 9, description: 'Autonomous mobile robots, robotic arms, kinematics, and ROS' },
    { id: 'cat-4', name: 'Internet of Things', slug: 'internet-of-things', icon: 'Wifi', count: 11, description: 'Smart sensor networks, edge gateways, and industrial telemetry' },
    { id: 'cat-5', name: 'Cybersecurity', slug: 'cybersecurity', icon: 'Shield', count: 8, description: 'Network defense, zero-trust architectures, and cryptanalysis' },
    { id: 'cat-6', name: 'Quantum Computing', slug: 'quantum-computing', icon: 'Atom', count: 5, description: 'Qubit simulation, quantum key distribution, and quantum algorithms' },
    { id: 'cat-7', name: 'Computer Science Engineering', slug: 'computer-science-engineering', icon: 'Code', count: 24, description: 'Distributed systems, compilers, database engines, and algorithms' },
    { id: 'cat-8', name: 'Information Technology', slug: 'information-technology', icon: 'Server', count: 14, description: 'Enterprise architectures, cloud integration, and systems design' },
    { id: 'cat-9', name: 'Data Science', slug: 'data-science', icon: 'BarChart3', count: 10, description: 'Big data pipelines, data visualization, and NLP transformers' },
    { id: 'cat-10', name: 'Electronics', slug: 'electronics', icon: 'Zap', count: 9, description: 'PCB design, signal processing, VLSI, and analog circuitry' },
    { id: 'cat-11', name: 'Electrical Engineering', slug: 'electrical-engineering', icon: 'Activity', count: 7, description: 'Smart grids, high-voltage transformers, and power electronics' },
    { id: 'cat-12', name: 'Mechanical Engineering', slug: 'mechanical-engineering', icon: 'Cog', count: 8, description: 'Finite element analysis, thermodynamics, CAD, and CAD/CAM' },
    { id: 'cat-13', name: 'Civil Engineering', slug: 'civil-engineering', icon: 'Building2', count: 6, description: 'Structural health monitoring, seismic modeling, and smart materials' },
    { id: 'cat-14', name: 'Embedded Systems', slug: 'embedded-systems', icon: 'Microchip', count: 13, description: 'RTOS, ARM Cortex firmware, bare-metal drivers, and microcontrollers' },
    { id: 'cat-15', name: 'Renewable Energy', slug: 'renewable-energy', icon: 'Sun', count: 6, description: 'Solar tracking arrays, wind turbine telemetry, and hydrogen fuel cells' },
    { id: 'cat-16', name: 'Electric Vehicles', slug: 'electric-vehicles', icon: 'BatteryCharging', count: 7, description: 'BMS battery management, regenerative braking, and motor controllers' },
    { id: 'cat-17', name: 'Web Development', slug: 'web-development', icon: 'Globe', count: 21, description: 'High-performance web applications, WebAssembly, and reactive platforms' },
    { id: 'cat-18', name: 'Mobile App Development', slug: 'mobile-app-development', icon: 'Smartphone', count: 12, description: 'Cross-platform native mobile applications, Bluetooth LE, and AR/VR' },
    { id: 'cat-19', name: 'Cloud Computing', slug: 'cloud-computing', icon: 'Cloud', count: 16, description: 'Kubernetes orchestration, serverless microservices, and multi-cloud' },
    { id: 'cat-20', name: 'Blockchain', slug: 'blockchain', icon: 'Link', count: 8, description: 'Smart contracts, zero-knowledge proofs, and decentralized storage' }
  ],
  technologies: [
    'Python', 'TypeScript', 'C++', 'Rust', 'Go', 'React', 'PyTorch', 'TensorFlow', 'ROS 2', 'OpenCV',
    'Docker', 'Kubernetes', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Solidity', 'ESP32', 'FreeRTOS',
    'WebAssembly', 'Next.js', 'TailwindCSS', 'GraphQL', 'AWS', 'Flutter', 'Qiskit', 'CUDA'
  ],
  users: [
    {
      id: 'usr-admin',
      name: 'Dr. Sarah Vance',
      username: 'admin_sarah',
      email: 'admin@limo.hub',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      bio: 'Chief Academic Officer & Lead Systems Architect at LIMO. 15+ years in distributed systems and robotics engineering.',
      engineeringDomain: 'Computer Science Engineering',
      skills: ['Distributed Systems', 'Platform Governance', 'Kubernetes', 'High-Performance Computing'],
      joinedDate: '2024-01-10',
      bookmarks: ['proj-1', 'proj-3', 'proj-6'],
      likes: ['proj-1', 'proj-2', 'proj-4', 'proj-5']
    },
    {
      id: 'usr-dev-1',
      name: 'Alex Rivera',
      username: 'alex_robotics',
      email: 'alex@limo.hub',
      role: 'DEVELOPER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Autonomous robotics researcher & ROS2 developer. Building next-gen perception pipelines and swarm algorithms.',
      engineeringDomain: 'Robotics',
      skills: ['ROS 2', 'C++', 'Python', 'SLAM', 'Computer Vision', 'PyTorch'],
      joinedDate: '2024-02-14',
      githubUrl: 'https://github.com/alexrivera-eng',
      linkedinUrl: 'https://linkedin.com/in/alexrivera-eng',
      bookmarks: ['proj-2', 'proj-4'],
      likes: ['proj-1', 'proj-3']
    },
    {
      id: 'usr-dev-2',
      name: 'Marcus Chen',
      username: 'marcus_quantum',
      email: 'marcus@limo.hub',
      role: 'DEVELOPER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      bio: 'Quantum hardware researcher and post-quantum cryptographic engineer. Passionate about open-source science.',
      engineeringDomain: 'Quantum Computing',
      skills: ['Qiskit', 'Python', 'Post-Quantum Crypto', 'Rust', 'Simulation'],
      joinedDate: '2024-03-01',
      githubUrl: 'https://github.com/marcuschen-q',
      linkedinUrl: 'https://linkedin.com/in/marcuschen-q',
      bookmarks: ['proj-1', 'proj-5'],
      likes: ['proj-2', 'proj-6']
    },
    {
      id: 'usr-student',
      name: 'Elena Rostova',
      username: 'elena_eng',
      email: 'student@limo.hub',
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      bio: 'Senior Electrical & Embedded Systems student. Curious explorer of energy systems and smart IoT grids.',
      engineeringDomain: 'Embedded Systems',
      skills: ['C', 'ESP32', 'PCB Design', 'MATLAB', 'Python'],
      joinedDate: '2024-05-18',
      bookmarks: ['proj-1', 'proj-2', 'proj-5'],
      likes: ['proj-1', 'proj-3', 'proj-4']
    }
  ],
  creators: [
    {
      id: 'creator-1',
      name: 'Devanathan',
      role: 'Lead Architect & Platform Creator',
      shortBio: 'Systems engineer & platform architect driving the vision of reproducible open engineering workflows for researchers and students globally.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      skills: ['Distributed Architecture', 'Full-Stack TypeScript', 'Systems Design', 'DevOps'],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
      contribution: 'Designed and built the core LIMO reactive architecture, unified project metadata schema, and role-based access pipeline.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      order: 1,
      isVisible: true
    },
    {
      id: 'creator-2',
      name: 'Sophia Patel',
      role: 'AI / Machine Learning Engineering Lead',
      shortBio: 'Specializes in high-throughput computer vision, federated neural networks, and scalable model serving pipelines for engineering benchmarks.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      skills: ['Deep Learning', 'PyTorch', 'Model Quantization', 'MLOps'],
      technologies: ['PyTorch', 'CUDA', 'Python', 'FastAPI', 'ONNX'],
      contribution: 'Engineered the AI benchmarking system, automated project metric analytics, and intelligent recommendation algorithms.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      order: 2,
      isVisible: true
    },
    {
      id: 'creator-3',
      name: 'Mateo Ramos',
      role: 'Embedded Systems & Hardware Specialist',
      shortBio: 'Veteran firmware developer and RTOS enthusiast with a focus on IoT telemetry, low-latency sensory processing, and hardware validation.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      skills: ['Bare-Metal C/C++', 'FreeRTOS', 'KiCAD', 'Sensor Fusion'],
      technologies: ['ESP32', 'STM32', 'Rust', 'MQTT', 'CAN Bus'],
      contribution: 'Authored the standardized hardware verification schematics, wiring templates, and reproducible firmware build guides.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      order: 3,
      isVisible: true
    },
    {
      id: 'creator-4',
      name: 'Aisha Al-Mansoor',
      role: 'UI/UX & Design Systems Engineer',
      shortBio: 'Pioneering accessible, futuristic glassmorphic interfaces and intuitive developer ergonomics that make technical exploration delightful.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      skills: ['Design Systems', 'CSS Architecture', 'Accessibility WCAG', '3D UI'],
      technologies: ['React', 'Figma', 'WebGL', 'Tailwind', 'SVG'],
      contribution: 'Created the unified LIMO theme engine with 8 presets, dynamic glassmorphic lighting, and responsive telemetry dashboards.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      order: 4,
      isVisible: true
    }
  ],
  projects: [
    {
      id: 'proj-1',
      slug: 'autonomous-drone-swarm-perception',
      title: 'Autonomous Drone Swarm Perception & Obstacle Avoidance',
      shortDescription: 'Decentralized multi-UAV path planning and real-time obstacle avoidance utilizing ROS 2, LiDAR-inertial odometry, and edge neural networks.',
      fullDescription: 'This project introduces a robust, fault-tolerant decentralized perception and collision avoidance architecture designed for quadcopter swarms operating in GPS-denied cluttered environments. Using lightweight 3D LiDAR point cloud processing and onboard stereoscopic depth cameras, each drone generates real-time OctoMap voxel representations and communicates state vectors via peer-to-peer Wi-Fi mesh protocols.\n\nThe trajectory optimization module integrates minimum-snap polynomials with distributed model predictive control (DMPC), guaranteeing safe clearances even in dense foliage and urban canyons. Benchmarked across both Gazebo PX4 SITL simulations and custom carbon-fiber quadrotors equipped with Jetson Orin Nano companion computers.',
      category: 'Robotics',
      engineeringDomain: 'Robotics',
      difficulty: 'Advanced',
      technologies: ['ROS 2', 'C++', 'Python', 'OpenCV', 'PyTorch', 'Docker'],
      programmingLanguages: ['C++', 'Python'],
      projectType: 'Open Source Hardware & Software',
      developer: {
        id: 'usr-dev-1',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
      },
      teamMembers: ['Alex Rivera (Lead)', 'Dr. Sarah Vance (Advisor)', 'Devanathan (Systems)'],
      status: 'Published',
      isFeatured: true,
      featuredOrder: 1,
      version: 'v2.4.0',
      githubUrl: 'https://github.com/limo-hub/autonomous-drone-swarm',
      demoUrl: 'https://drone-swarm.limo.hub/demo',
      demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      images: [
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80'
      ],
      features: [
        'Real-time 3D LiDAR FAST-LIO2 point cloud slam with sub-5cm positional drift',
        'Decentralized DMPC trajectory coordination preventing swarm inter-collision',
        'Onboard edge inference running YOLOv8-tiny on NVIDIA Jetson Orin Nano at 45 FPS',
        'Dynamic mesh networking maintaining heartbeat over IEEE 802.11s mesh routers',
        'Fail-safe autonomous return-to-home (RTH) upon radio link loss or low battery'
      ],
      requirements: [
        'NVIDIA Jetson Orin Nano / Xavier or x86 companion computer with Ubuntu 22.04 LTS',
        'ROS 2 Humble Hawksbill installation with FastDDS middleware',
        'Mid-360 Livox LiDAR or Intel RealSense D435i depth sensor',
        'PX4 Autopilot Firmware v1.14 or later on Pixhawk 6C / Holybro flight controller'
      ],
      installation: `### 1. Clone the Repository
git clone https://github.com/limo-hub/autonomous-drone-swarm.git
cd autonomous-drone-swarm

### 2. Install ROS 2 Dependencies
source /opt/ros/humble/setup.bash
rosdep update
rosdep install --from-paths src --ignore-src -r -y

### 3. Build Swarm Workspace with Colcon
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
source install/setup.bash`,
      usage: `### Launch Simulation in Gazebo
ros2 launch swarm_bringup multi_uav_gazebo.launch.py num_drones:=4

### Run Decentralized Swarm Controller
ros2 launch swarm_control dmpc_coordinator.launch.py`,
      documentation: `# Architecture & Data Flow

The system employs a layered decoupled architecture:
1. **Sensory Abstraction Layer**: Interfaces with hardware drivers via micro-ROS.
2. **State Estimation**: Fuses IMU measurements with Livox Mid-360 point clouds using an iterated Kalman filter.
3. **Spatial Representation**: Feeds point clouds into a dynamic spatial Octree with decay counters to prune transient obstacles.
4. **Trajectory Generator**: Solves convex optimization problems iteratively every 50ms to yield dynamically feasible polynomial trajectories.

## Communication Matrix
| Stream | Frequency | Transport | Payload |
|---|---|---|---|
| Drone State | 20 Hz | UDP Broadcast | Pose, Velocity, Bounds |
| Collision Buffer | 10 Hz | FastDDS | Spatial bounding spheres |
| Video Stream | 30 Hz | RTSP | H.264 Compressed Feed |`,
      downloadResources: [
        { name: 'Source Code Repository (v2.4.0)', size: '24.8 MB', type: 'ZIP Archive', filename: 'autonomous-drone-swarm-v2.4.0.zip' },
        { name: 'Hardware Schematics & 3D STL Mounts', size: '14.2 MB', type: 'CAD Files', filename: 'drone-mounts-and-schematics.zip' },
        { name: 'Gazebo Simulation Worlds & SITL Configs', size: '42.6 MB', type: 'Simulation Package', filename: 'gazebo-simulation-bundle.tar.gz' },
        { name: 'Peer-Reviewed Technical Whitepaper (PDF)', size: '3.8 MB', type: 'Research PDF', filename: 'limo-uav-swarm-whitepaper.pdf' }
      ],
      tags: ['Drones', 'UAV', 'ROS2', 'LiDAR', 'Robotics', 'Jetson', 'Computer Vision'],
      createdDate: '2024-03-12',
      updatedDate: '2024-09-20',
      views: 3840,
      likes: 428,
      bookmarks: 285,
      downloads: 712
    },
    {
      id: 'proj-2',
      slug: 'quantum-key-distribution-simulator',
      title: 'Quantum Key Distribution (QKD) & BB84 Simulator',
      shortDescription: 'High-fidelity quantum optical cryptography simulator implementing the BB84 protocol, decoy-state analysis, and Eve intercept-resend noise modeling.',
      fullDescription: 'As quantum computers advance toward Shor algorithm cryptanalysis, post-quantum key exchange mechanisms are paramount. This engineering project simulates end-to-end Quantum Key Distribution (QKD) via the BB84 polarization protocol and continuous-variable quantum channels.\n\nBuilt in Python and Rust using Qiskit and NumPy, the suite models single-photon sources, fiber birefringence, detector dark counts, and beam splitters. It provides comprehensive decoy-state mathematical bounds to thwart photon-number-splitting (PNS) attacks by potential eavesdroppers ("Eve"), enabling engineering students to compute Quantum Bit Error Rates (QBER) and secret key extraction rates interactively.',
      category: 'Quantum Computing',
      engineeringDomain: 'Quantum Computing',
      difficulty: 'Expert',
      technologies: ['Python', 'Qiskit', 'Rust', 'WebAssembly', 'React', 'TypeScript'],
      programmingLanguages: ['Python', 'Rust', 'TypeScript'],
      projectType: 'Research & Simulation Platform',
      developer: {
        id: 'usr-dev-2',
        name: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
      },
      teamMembers: ['Marcus Chen', 'Devanathan (Integration)'],
      status: 'Published',
      isFeatured: true,
      featuredOrder: 2,
      version: 'v1.6.2',
      githubUrl: 'https://github.com/limo-hub/qkd-bb84-simulator',
      demoUrl: 'https://qkd-simulator.limo.hub',
      images: [
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1000&auto=format&fit=crop&q=80'
      ],
      features: [
        'Exact polarization state preparation using computational (|0>, |1>) and Hadamard (|+>, |->) bases',
        'Statistical modeling of fiber attenuation at 1550nm telecom wavelength',
        'Simulation of active eavesdropping (Intercept-Resend and Photon-Number Splitting)',
        'Cascade error correction algorithm implementation with privacy amplification hashing',
        'WebAssembly interactive graphical UI for real-time photon exchange inspection'
      ],
      requirements: [
        'Python 3.10+ or Rust toolchain 1.75+',
        'Qiskit v1.0.0+ with Aer simulator provider',
        'NumPy, SciPy, Matplotlib for mathematical modeling'
      ],
      installation: `### Python Virtual Environment Setup
python -m venv venv
source venv/bin/activate  # Or on Windows: venv\\Scripts\\activate
pip install -r requirements.txt

### Rust Engine Compilation
cd rust_core
cargo build --release --lib`,
      usage: `### Run Monte Carlo QKD Simulation
python -m qkd_core.cli --pulses 100000 --channel-length-km 50 --dark-count-rate 1e-6 --eve-ratio 0.15`,
      documentation: `# BB84 Protocol Flow
1. **Alice prepares random photon states**: Chooses random bits (0, 1) and random bases (Rectilinear +, Diagonal x).
2. **Quantum Channel Transmission**: Photons propagate through fiber optic channel with exponential loss: T = 10^(-alpha * L / 10).
3. **Bob measures states**: Randomly selects measurement basis (+, x).
4. **Sifting Stage**: Alice and Bob communicate their bases over public classical channel and discard mismatched trials.
5. **Error Estimation**: Subsample revealed to calculate QBER:
   - If QBER < 11%, privacy amplification yields unconditional secrecy.
   - If QBER >= 11%, channel is aborted due to suspected eavesdropping.`,
      downloadResources: [
        { name: 'QKD Simulation Engine & Rust Library', size: '18.4 MB', type: 'Source Archive', filename: 'qkd-simulator-v1.6.2.zip' },
        { name: 'Jupyter Research Notebooks & Benchmarks', size: '8.1 MB', type: 'Notebooks', filename: 'qkd-jupyter-benchmarks.zip' }
      ],
      tags: ['Quantum', 'Qiskit', 'Cryptography', 'BB84', 'Photonics', 'Cybersecurity'],
      createdDate: '2024-04-05',
      updatedDate: '2024-09-15',
      views: 2950,
      likes: 360,
      bookmarks: 240,
      downloads: 485
    },
    {
      id: 'proj-3',
      slug: 'bionic-myoelectric-prosthetic-hand',
      title: 'Bionic Myoelectric 6-DOF Prosthetic Hand with Sensory Feedback',
      shortDescription: '3D printed multi-articulated prosthetic limb actuated by miniature linear servos and governed by multi-channel surface EMG pattern recognition.',
      fullDescription: 'Modern bionic prosthetics remain prohibitively expensive for most amputees. This engineering project presents an open-architecture, low-cost 6-Degree-of-Freedom (6-DOF) bionic hand featuring proportional grip force control, haptic sensory vibration feedback, and real-time EMG gesture recognition.\n\nThe mechanical chassis is optimized for lightweight FDM carbon-fiber composite printing with compliant flexure finger joints. Four dry-contact Ag/AgCl skin electrodes capture differential forearm muscle potentials, amplified via instrumental amplifiers and processed on an ESP32-S3 microcontroller using TinyML convolutional neural nets running directly on the edge.',
      category: 'Biomedical & Mechanical',
      engineeringDomain: 'Mechanical Engineering',
      difficulty: 'Intermediate',
      technologies: ['ESP32', 'FreeRTOS', 'KiCAD', 'TensorFlow Lite', 'Fusion 360', 'C++'],
      programmingLanguages: ['C++', 'Python'],
      projectType: 'Open Hardware & Firmware',
      developer: {
        id: 'usr-admin',
        name: 'Dr. Sarah Vance',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
      },
      teamMembers: ['Dr. Sarah Vance', 'Mateo Ramos', 'Elena Rostova'],
      status: 'Published',
      isFeatured: true,
      featuredOrder: 3,
      version: 'v3.1.0',
      githubUrl: 'https://github.com/limo-hub/bionic-myoelectric-hand',
      demoUrl: 'https://bionic-hand.limo.hub',
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1000&auto=format&fit=crop&q=80'
      ],
      features: [
        '6 individually actuated finger servos providing cylindrical, pinch, tripod, and point grips',
        'TinyML edge gesture classifier recognizing 8 distinct hand postures at 96.4% accuracy',
        'Sub-120ms actuation latency from muscle contraction trigger to physical grasp',
        'FSR tip pressure sensors mapped to ERM vibrotactile feedback motors on upper arm',
        'USB-C programmable with Bluetooth Low Energy (BLE) smartphone configuration app'
      ],
      requirements: [
        'ESP32-S3-WROOM-1 DevKit or custom PCB',
        '6x micro linear coreless servos (6V operating voltage)',
        'MyoWare 2.0 or AD8232 custom analog EMG conditioning front-end',
        '3D printer with minimum 200x200x200mm build volume using PETG or PLA-CF'
      ],
      installation: `### 1. 3D Print Components
Export STL files from /cad directory and slice at 0.16mm layer height with 40% gyroid infill.

### 2. Flash ESP32 Firmware
Use PlatformIO in VS Code:
pio run --target upload`,
      usage: `### Calibration Mode
Hold button S1 for 3 seconds to initiate 5-step muscle calibration:
Relaxed -> Fist -> Spread -> Pinch -> Point.`,
      documentation: `# Electrical Wiring & Pinout
- GPIO 14: EMG Channel 1 (Flexor carpi radialis)
- GPIO 15: EMG Channel 2 (Extensor digitorum)
- GPIO 18-23: PWM servo output signals (50 Hz pulse trains)
- GPIO 4: I2C SDA for fingertip tactile bus`,
      downloadResources: [
        { name: 'Complete 3D Printable STL & STEP Files', size: '36.5 MB', type: 'CAD Archive', filename: 'bionic-hand-cad-step.zip' },
        { name: 'ESP32 FreeRTOS Firmware & TinyML Model', size: '12.8 MB', type: 'Firmware Code', filename: 'bionic-firmware-v3.1.zip' },
        { name: 'KiCAD PCB Gerber Files & BOM', size: '6.4 MB', type: 'Hardware Schematics', filename: 'bionic-pcb-gerbers.zip' }
      ],
      tags: ['Prosthetics', 'Biomechatronics', 'ESP32', '3D Printing', 'TinyML', 'Robotics'],
      createdDate: '2024-02-18',
      updatedDate: '2024-08-11',
      views: 4520,
      likes: 512,
      bookmarks: 390,
      downloads: 820
    },
    {
      id: 'proj-4',
      slug: 'ai-smart-grid-demand-response',
      title: 'Decentralized Smart Grid Microgrid & EV Dynamic Charging Optimizer',
      shortDescription: 'Industrial IoT smart grid telemetry simulator forecasting renewable energy peaks and orchestrating bidirectional V2G (Vehicle-to-Grid) load balancing.',
      fullDescription: 'High penetration of intermittent photovoltaics and electric vehicle charging presents severe stability challenges to municipal electrical distribution networks. This project delivers an automated demand-response and microgrid orchestration system using Transformer-based temporal forecasting and reinforcement learning.\n\nThe system gathers high-frequency voltage, frequency, and phase phasor measurement unit (PMU) data across IEEE 33-bus distribution networks, simulating dynamic price incentives and balancing stationary lithium-ion BESS (Battery Energy Storage Systems) against thousands of parked EV charging sessions.',
      category: 'Electrical Engineering',
      engineeringDomain: 'Electrical Engineering',
      difficulty: 'Advanced',
      technologies: ['Python', 'Kafka', 'PostgreSQL', 'Docker', 'React', 'FastAPI'],
      programmingLanguages: ['Python', 'SQL', 'TypeScript'],
      projectType: 'Smart Infrastructure Platform',
      developer: {
        id: 'usr-dev-1',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
      },
      teamMembers: ['Alex Rivera', 'Elena Rostova'],
      status: 'Published',
      isFeatured: true,
      featuredOrder: 4,
      version: 'v2.0.1',
      githubUrl: 'https://github.com/limo-hub/smart-grid-optimizer',
      demoUrl: 'https://smart-grid.limo.hub',
      images: [
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1000&auto=format&fit=crop&q=80'
      ],
      features: [
        'IEEE 33-bus power flow simulation executing Newton-Raphson iterations under 10ms',
        'Bidirectional V2G charging schedule minimizing substation transformer thermal stress',
        'Reinforcement learning PPO agent dispatching local battery reserves during price spikes',
        'OpenTelemetry and Apache Kafka ingesting 50,000 telemetry points per second',
        'Interactive real-time SVG grid topology visualization with heatmaps'
      ],
      requirements: [
        'Docker & Docker Compose',
        'Python 3.11 with PyTorch & Pandapower library',
        'Kafka cluster or Redpanda instance'
      ],
      installation: `### Quickstart with Docker Compose
docker-compose -f deploy/docker-compose.yml up -d
python scripts/seed_grid_topology.py`,
      usage: `### Run Microgrid Balancing Simulation
python -m grid_optimizer.simulate --scenario extreme_solar_duck_curve --hours 48`,
      documentation: `# Power Flow Formulation
The bus admittance matrix Y_bus is solved iteratively to ensure voltage magnitudes remain within 0.95 to 1.05 p.u. per ANSI C84.1 standards.`,
      downloadResources: [
        { name: 'Grid Optimizer Source & Pandapower Models', size: '22.1 MB', type: 'Project ZIP', filename: 'smart-grid-optimizer.zip' },
        { name: 'IEEE 33-bus Benchmark Datasets', size: '15.4 MB', type: 'HDF5 Data', filename: 'ieee-33bus-telemetry.h5' }
      ],
      tags: ['Smart Grid', 'Electrical', 'EV', 'Renewable Energy', 'Machine Learning', 'Kafka'],
      createdDate: '2024-04-22',
      updatedDate: '2024-09-02',
      views: 2610,
      likes: 298,
      bookmarks: 215,
      downloads: 410
    },
    {
      id: 'proj-5',
      slug: 'zero-trust-ebpf-threat-hunter',
      title: 'eBPF-Powered Real-Time Linux Threat Detection & Zero-Trust Agent',
      shortDescription: 'Kernel-level telemetry collector leveraging Extended Berkeley Packet Filter (eBPF) to detect rootkits, privilege escalations, and unauthorized container escapes.',
      fullDescription: 'Traditional user-space endpoint detection agents suffer from high CPU overhead and vulnerability to sophisticated kernel rootkits. This project implements a zero-overhead, non-invasive threat surveillance system operating inside the Linux kernel via eBPF kprobes, tracepoints, and LSM (Linux Security Modules) hooks.\n\nEvents such as unexpected `execve`, raw socket creation, ptrace process injection, and container namespace jumping are intercepted in kernel space and streamed via ring buffers to a Rust user-space daemon for behavioral anomaly scoring against the MITRE ATT&CK matrix.',
      category: 'Cybersecurity',
      engineeringDomain: 'Cybersecurity',
      difficulty: 'Expert',
      technologies: ['eBPF', 'Rust', 'C', 'Linux Kernel', 'Docker', 'Prometheus'],
      programmingLanguages: ['Rust', 'C'],
      projectType: 'Open Source Security Tool',
      developer: {
        id: 'usr-dev-2',
        name: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
      },
      teamMembers: ['Marcus Chen', 'Devanathan'],
      status: 'Published',
      isFeatured: false,
      featuredOrder: 5,
      version: 'v1.4.0',
      githubUrl: 'https://github.com/limo-hub/ebpf-threat-hunter',
      demoUrl: 'https://threat-hunter.limo.hub',
      images: [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80'
      ],
      features: [
        'Kernel-level hook verification preventing malicious syscall tampering without rebooting',
        'High-performance BPF ring buffers minimizing packet drop at 100k events/sec',
        'Automated process tree lineage reconstruction to track parent-child process ancestry',
        'Pre-compiled CO-RE (Compile Once – Run Everywhere) binaries across Linux kernels 5.8 to 6.8',
        'Exportable Prometheus metrics and structured JSON audit logs for SIEM integration'
      ],
      requirements: [
        'Linux kernel 5.8 or newer with BTF (BPF Type Format) enabled',
        'Root or CAP_BPF / CAP_PERFMON privileges to load BPF programs',
        'Rust 1.77+ with bpf-linker'
      ],
      installation: `### Build with Cargo Aya
cargo install bpf-linker
cargo xtask build-ebpf --release
cargo build --release`,
      usage: `### Run Threat Hunter Daemon
sudo ./target/release/limo-threat-hunter --filter-namespaces --alert-level high`,
      documentation: `# Architecture of the Kernel Monitor
eBPF programs run in a sandboxed virtual machine within the Linux kernel verified for memory safety before execution.`,
      downloadResources: [
        { name: 'Threat Hunter Rust & eBPF Source Bundle', size: '16.9 MB', type: 'Release Package', filename: 'ebpf-threat-hunter-v1.4.tar.gz' },
        { name: 'Security Benchmark & MITRE ATT&CK Mapping Document', size: '2.5 MB', type: 'Technical PDF', filename: 'ebpf-mitre-mapping.pdf' }
      ],
      tags: ['eBPF', 'Rust', 'Linux', 'Cybersecurity', 'Kernel', 'Zero-Trust'],
      createdDate: '2024-05-01',
      updatedDate: '2024-08-30',
      views: 3120,
      likes: 380,
      bookmarks: 270,
      downloads: 540
    },
    {
      id: 'proj-6',
      slug: 'blockchain-decentralized-supply-chain',
      title: 'Decentralized Cold-Chain Supply Chain Provenance with Zero-Knowledge Proofs',
      shortDescription: 'Verifiable pharmaceutical cold-chain provenance tracker integrating IoT temperature sensors, Ethereum Layer-2 rollups, and zk-SNARKs for trade secret preservation.',
      fullDescription: 'Pharmaceutical supply chains require unbroken temperature tracking without exposing sensitive supplier pricing, volume, or route telemetry. This project implements a hybrid architecture combining cryptographic zero-knowledge proofs (zk-SNARKs with Circom) and IoT temperature data loggers.\n\nShipment carriers submit cryptographic commitments that temperature remained within the critical 2°C to 8°C corridor throughout transit without revealing precise GPS coordinates or intermediate stops, guaranteeing compliance before smart contracts automatically release escrow payments.',
      category: 'Blockchain',
      engineeringDomain: 'Blockchain',
      difficulty: 'Advanced',
      technologies: ['Solidity', 'Rust', 'TypeScript', 'Circom', 'React', 'Docker'],
      programmingLanguages: ['Solidity', 'TypeScript', 'Rust'],
      projectType: 'Web3 & Enterprise Architecture',
      developer: {
        id: 'usr-admin',
        name: 'Dr. Sarah Vance',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
      },
      teamMembers: ['Dr. Sarah Vance', 'Marcus Chen'],
      status: 'Published',
      isFeatured: false,
      featuredOrder: 6,
      version: 'v1.2.0',
      githubUrl: 'https://github.com/limo-hub/zk-supply-chain',
      demoUrl: 'https://supply-chain.limo.hub',
      images: [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80'
      ],
      features: [
        'Circom 2.1 zk-SNARK circuits generating groth16 proofs under 1.2 seconds in browser',
        'Smart contracts deployed on Arbitrum Sepolia Layer-2 for sub-cent transaction costs',
        'Tamper-evident cryptographic state hashes signed by hardware security modules (HSM)',
        'Automated automated escrow settlement upon verifiable proof validation',
        'Decentralized IPFS metadata storage for compliance inspection certificates'
      ],
      requirements: [
        'Node.js 18+ and Rust toolchain',
        'Circom compiler v2.1.6 and snarkjs',
        'Hardhat or Foundry for Solidity smart contract compilation'
      ],
      installation: `### 1. Compile zk Circuits
cd circuits
circom temperature_proof.circom --r1cs --wasm --sym
snarkjs groth16 setup temperature_proof.r1cs pot14_final.ptau circuit_0000.zkey

### 2. Compile Smart Contracts
cd ../contracts
npx hardhat compile`,
      usage: `### Run Integration Tests
npx hardhat test`,
      documentation: `# Cryptographic Circuit Constraints
The circuit verifies that for an array of N temperature points T[i], each value satisfies MinThreshold <= T[i] <= MaxThreshold without publishing the array T.`,
      downloadResources: [
        { name: 'Solidity Contracts & Circom Circuits Bundle', size: '14.7 MB', type: 'Web3 Source', filename: 'zk-supply-chain-v1.2.zip' },
        { name: 'Verification Verification Keys & Sample Inputs', size: '5.2 MB', type: 'Circuit Keys', filename: 'verification-keys.zip' }
      ],
      tags: ['Blockchain', 'Zero-Knowledge', 'Solidity', 'Supply Chain', 'IoT', 'Ethereum'],
      createdDate: '2024-05-15',
      updatedDate: '2024-09-08',
      views: 2240,
      likes: 275,
      bookmarks: 195,
      downloads: 360
    },
    {
      id: 'proj-7',
      slug: 'quantum-annealing-traffic-routing',
      title: 'Quantum Annealing Traffic Flow Optimization for Megacities',
      shortDescription: 'QUBO (Quadratic Unconstrained Binary Optimization) formulation solving real-time urban traffic congestion using D-Wave quantum annealer APIs.',
      fullDescription: 'Traffic congestion in global metropolitan areas incurs billions in lost productivity and fuel consumption. This project translates dynamic multi-agent vehicular routing into Quadratic Unconstrained Binary Optimization (QUBO) graphs solvable on D-Wave Advantage quantum annealers and hybrid quantum-classical solvers.',
      category: 'Quantum Computing',
      engineeringDomain: 'Quantum Computing',
      difficulty: 'Expert',
      technologies: ['Python', 'Qiskit', 'D-Wave Ocean', 'NetworkX', 'FastAPI'],
      programmingLanguages: ['Python'],
      projectType: 'Research Project',
      developer: {
        id: 'usr-dev-2',
        name: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
      },
      teamMembers: ['Marcus Chen'],
      status: 'Pending',
      submissionDate: '2024-10-14',
      isFeatured: false,
      featuredOrder: 7,
      version: 'v0.9.1',
      githubUrl: 'https://github.com/marcuschen-q/quantum-traffic-routing',
      demoUrl: 'https://quantum-traffic.demo.limo.hub',
      images: [
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80'
      ],
      features: [
        'QUBO conversion of 10,000 intersecting road graph nodes into binary spin matrices',
        'Benchmarked against Dijkstra and A* algorithms demonstrating 38% reduction in bottleneck formation',
        'Continuous hybrid classical-quantum cloud orchestration'
      ],
      requirements: ['Python 3.10+', 'dwave-ocean-sdk', 'networkx'],
      installation: `pip install dwave-ocean-sdk networkx matplotlib`,
      usage: `python run_routing_qubo.py --nodes 500 --vehicles 2000`,
      documentation: `# Mathematical QUBO Mapping
Minimizes the overlap function of pairwise routes weighted by road capacity and travel duration.`,
      downloadResources: [
        { name: 'Python QUBO Solver Source', size: '10.2 MB', type: 'Source Archive', filename: 'quantum-traffic-v0.9.1.zip' }
      ],
      tags: ['Quantum', 'Annealing', 'Traffic', 'Optimization', 'QUBO', 'Python'],
      createdDate: '2024-10-14',
      updatedDate: '2024-10-15',
      views: 120,
      likes: 18,
      bookmarks: 14,
      downloads: 22
    }
  ],
  comments: [
    {
      id: 'com-1',
      projectId: 'proj-1',
      userId: 'usr-student',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      userRole: 'USER',
      content: 'Incredible work on the FAST-LIO2 integration! I tested this with our university Pixhawk 6C setup and the point cloud synchronization is remarkably smooth. Have you benchmarked latency with more than 8 drones?',
      createdDate: '2024-08-20',
      likes: 14
    },
    {
      id: 'com-2',
      projectId: 'proj-1',
      userId: 'usr-dev-1',
      userName: 'Alex Rivera',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      userRole: 'DEVELOPER',
      content: 'Thanks Elena! Yes, with up to 12 drones in Gazebo, the mesh communications bandwidth stays under 1.8 Mbps per node. We plan to release the 12-UAV benchmark dataset in the next minor version.',
      createdDate: '2024-08-21',
      likes: 8
    },
    {
      id: 'com-3',
      projectId: 'proj-3',
      userId: 'usr-student',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      userRole: 'USER',
      content: 'The 3D print tolerances for the flexure joints are spot on. Highly recommended for any student robotics lab looking to get started with EMG prosthetics!',
      createdDate: '2024-09-01',
      likes: 19
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      recipientId: 'usr-admin',
      type: 'PROJECT_SUBMITTED',
      title: 'New Project Awaiting Approval',
      message: 'Marcus Chen submitted "Quantum Annealing Traffic Flow Optimization for Megacities" for review.',
      link: '/admin?tab=submissions',
      isRead: false,
      timestamp: '2024-10-15T09:30:00Z'
    },
    {
      id: 'notif-2',
      recipientId: 'usr-dev-1',
      type: 'PROJECT_APPROVED',
      title: 'Project Published Successfully',
      message: 'Your project "Autonomous Drone Swarm Perception" was featured on the LIMO homepage!',
      link: '/projects/autonomous-drone-swarm-perception',
      isRead: true,
      timestamp: '2024-10-12T14:20:00Z'
    },
    {
      id: 'notif-3',
      recipientId: 'usr-student',
      type: 'PROJECT_UPDATE',
      title: 'Update Released for Bookmarked Project',
      message: 'Bionic Myoelectric 6-DOF Hand released v3.1.0 with improved TinyML model weights.',
      link: '/projects/bionic-myoelectric-prosthetic-hand',
      isRead: false,
      timestamp: '2024-10-16T11:00:00Z'
    }
  ],
  activityLogs: [
    { id: 'act-1', user: 'Dr. Sarah Vance', action: 'Published Project', details: 'Bionic Myoelectric 6-DOF Hand v3.1.0', timestamp: '2024-10-16 10:15:22' },
    { id: 'act-2', user: 'Marcus Chen', action: 'Submitted Project', details: 'Quantum Annealing Traffic Flow Optimization', timestamp: '2024-10-15 09:30:11' },
    { id: 'act-3', user: 'Dr. Sarah Vance', action: 'Updated Creator Profile', details: 'Added new research lead bio for Meet the Creators', timestamp: '2024-10-14 16:42:00' },
    { id: 'act-4', user: 'Alex Rivera', action: 'Uploaded Resource', details: 'Updated Gazebo SITL simulation bundle', timestamp: '2024-10-12 18:05:31' }
  ],
  siteSettings: {
    siteTitle: 'LIMO',
    siteSubtitle: 'Engineering Project Hub',
    allowUserSubmissions: true,
    requireAdminApproval: true,
    featuredLimit: 6,
    defaultTheme: 'dark',
    maintenanceMode: false
  }
};

let memoryDb = null;

// Initialize DB file if not present
export function initDatabase() {
  if (memoryDb) return;
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(raw);
      return;
    }
  } catch (err) {
    // ignore
  }

  memoryDb = JSON.parse(JSON.stringify(initialData));
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (e) {
    // Serverless read-only fallback
  }
}

export function readDatabase() {
  if (!memoryDb) initDatabase();
  return memoryDb;
}

export function writeDatabase(data) {
  memoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // In serverless, memory persistence is maintained across requests in warm instance
  }
  return true;
}

export default {
  initDatabase,
  readDatabase,
  writeDatabase
};
