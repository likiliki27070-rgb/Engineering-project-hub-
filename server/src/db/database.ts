import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { DatabaseSchema, User, Project, Category, Technology, Creator, SiteSettings, ActivityLog } from '../types.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'limo_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialSeedData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);
  const devPasswordHash = bcrypt.hashSync('Dev@123', salt);
  const userPasswordHash = bcrypt.hashSync('User@123', salt);

  const users: User[] = [
    {
      id: 'usr-admin-01',
      name: 'Dr. Elena Vance',
      username: 'elena_vance',
      email: 'admin@limo.dev',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Platform Creator & Director of Engineering Systems at LIMO Hub. Pioneering open engineering education.',
      engineeringDomain: 'Quantum Computing & Robotics',
      skills: ['Distributed Systems', 'Quantum Algorithms', 'System Architecture', 'Rust', 'ROS 2'],
      githubUrl: 'https://github.com/elena-limo',
      linkedinUrl: 'https://linkedin.com/in/elena-vance-limo',
      websiteUrl: 'https://elena-vance.limo.dev',
      createdAt: new Date('2025-01-15').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'usr-dev-01',
      name: 'Alex Rivera',
      username: 'alex_rivera',
      email: 'dev@limo.dev',
      passwordHash: devPasswordHash,
      role: 'DEVELOPER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Robotics & Embedded Systems Engineer. Specializing in autonomous quadrotors and real-time edge intelligence.',
      engineeringDomain: 'Robotics & Autonomous Systems',
      skills: ['C++', 'ROS 2', 'Embedded Linux', 'Control Theory', 'Python', 'Computer Vision'],
      githubUrl: 'https://github.com/alexrivera-eng',
      linkedinUrl: 'https://linkedin.com/in/alex-rivera-eng',
      createdAt: new Date('2025-02-10').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'usr-dev-02',
      name: 'Sophia Chen',
      username: 'sophia_chen',
      email: 'sophia@limo.dev',
      passwordHash: devPasswordHash,
      role: 'DEVELOPER',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      bio: 'EV Powertrain & Battery Management Systems Researcher. Focused on neural battery degradation estimation.',
      engineeringDomain: 'Electric Vehicles',
      skills: ['MATLAB/Simulink', 'BMS Design', 'Thermal Modeling', 'Python', 'CAN Bus'],
      githubUrl: 'https://github.com/sophiachen-ev',
      linkedinUrl: 'https://linkedin.com/in/sophia-chen-ev',
      createdAt: new Date('2025-03-01').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'usr-student-01',
      name: 'Maya Lin',
      username: 'maya_lin',
      email: 'student@limo.dev',
      passwordHash: userPasswordHash,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      bio: 'Undergraduate Engineering Student enthusiastic about edge machine learning and sustainable energy.',
      engineeringDomain: 'Artificial Intelligence & IoT',
      skills: ['Python', 'TensorFlow', 'React', 'TypeScript', 'Arduino'],
      githubUrl: 'https://github.com/mayalin',
      linkedinUrl: 'https://linkedin.com/in/mayalin-student',
      createdAt: new Date('2025-03-20').toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const categories: Category[] = [
    { id: 'cat-1', name: 'Computer Science Engineering', slug: 'computer-science-engineering', description: 'Algorithms, distributed systems, compilers, and core computing foundations.', icon: 'Cpu' },
    { id: 'cat-2', name: 'Information Technology', slug: 'information-technology', description: 'Enterprise networks, database architectures, and IT infrastructure.', icon: 'Server' },
    { id: 'cat-3', name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Deep learning, cognitive computing, LLMs, and intelligent autonomous agents.', icon: 'Brain' },
    { id: 'cat-4', name: 'Machine Learning', slug: 'machine-learning', description: 'Statistical models, predictive analytics, reinforcement learning, and MLOps.', icon: 'Sparkles' },
    { id: 'cat-5', name: 'Data Science', slug: 'data-science', description: 'Big data pipelines, hyperspectral imagery, visualization, and statistical modeling.', icon: 'BarChart3' },
    { id: 'cat-6', name: 'Cybersecurity', slug: 'cybersecurity', description: 'Zero-trust architecture, threat hunting, cryptography, and network defense.', icon: 'ShieldCheck' },
    { id: 'cat-7', name: 'Internet of Things', slug: 'internet-of-things', description: 'Sensors, connected smart grids, telemetry, and MQTT edge networks.', icon: 'Wifi' },
    { id: 'cat-8', name: 'Electronics', slug: 'electronics', description: 'Circuit design, analog/digital signal processing, and semiconductor systems.', icon: 'Zap' },
    { id: 'cat-9', name: 'Electrical Engineering', slug: 'electrical-engineering', description: 'High-voltage grid analysis, power electronics, and electromagnetic devices.', icon: 'Activity' },
    { id: 'cat-10', name: 'Mechanical Engineering', slug: 'mechanical-engineering', description: 'Thermodynamics, kinematics, CAD modeling, and bionic mechanical structures.', icon: 'Cog' },
    { id: 'cat-11', name: 'Civil Engineering', slug: 'civil-engineering', description: 'Structural health monitoring, acoustic seismic sensors, and smart infrastructure.', icon: 'Building2' },
    { id: 'cat-12', name: 'Robotics', slug: 'robotics', description: 'Autonomous ground/aerial robots, ROS 2, kinematics, and sensor fusion.', icon: 'Bot' },
    { id: 'cat-13', name: 'Quantum Computing', slug: 'quantum-computing', description: 'Quantum circuit synthesis, superposition simulators, and QKD protocols.', icon: 'Atom' },
    { id: 'cat-14', name: 'Embedded Systems', slug: 'embedded-systems', description: 'Microcontrollers, RTOS, ARM Cortex, FPGA, and firmware programming.', icon: 'Microchip' },
    { id: 'cat-15', name: 'Renewable Energy', slug: 'renewable-energy', description: 'Photovoltaic MPPT algorithms, wind turbine controllers, and microgrids.', icon: 'Sun' },
    { id: 'cat-16', name: 'Electric Vehicles', slug: 'electric-vehicles', description: 'Battery management systems, regenerative braking, motor inverters, and EV telemetry.', icon: 'Car' },
    { id: 'cat-17', name: 'Web Development', slug: 'web-development', description: 'Modern reactive web platforms, high-performance APIs, and progressive web apps.', icon: 'Globe' },
    { id: 'cat-18', name: 'Mobile App Development', slug: 'mobile-app-development', description: 'Cross-platform mobile applications, telemetry dashboards, and on-device inference.', icon: 'Smartphone' },
    { id: 'cat-19', name: 'Cloud Computing', slug: 'cloud-computing', description: 'Microservices, Kubernetes orchestration, serverless, and cloud-native backends.', icon: 'Cloud' },
    { id: 'cat-20', name: 'Blockchain', slug: 'blockchain', description: 'Smart contracts, consensus mechanisms, zero-knowledge proofs, and decentralized ledgers.', icon: 'Layers' }
  ];

  const technologies: Technology[] = [
    { id: 'tech-1', name: 'ROS 2', slug: 'ros-2', category: 'Robotics', icon: 'Bot' },
    { id: 'tech-2', name: 'PyTorch', slug: 'pytorch', category: 'Artificial Intelligence', icon: 'Flame' },
    { id: 'tech-3', name: 'TensorFlow', slug: 'tensorflow', category: 'Machine Learning', icon: 'Layers' },
    { id: 'tech-4', name: 'Qiskit', slug: 'qiskit', category: 'Quantum Computing', icon: 'Atom' },
    { id: 'tech-5', name: 'Rust', slug: 'rust', category: 'Computer Science Engineering', icon: 'Terminal' },
    { id: 'tech-6', name: 'Python', slug: 'python', category: 'Software', icon: 'Code' },
    { id: 'tech-7', name: 'C++', slug: 'cpp', category: 'Embedded & Robotics', icon: 'FileCode' },
    { id: 'tech-8', name: 'React', slug: 'react', category: 'Web Development', icon: 'Component' },
    { id: 'tech-9', name: 'TypeScript', slug: 'typescript', category: 'Web Development', icon: 'FileText' },
    { id: 'tech-10', name: 'Docker', slug: 'docker', category: 'Cloud Computing', icon: 'Box' },
    { id: 'tech-11', name: 'Kubernetes', slug: 'kubernetes', category: 'Cloud Computing', icon: 'Server' },
    { id: 'tech-12', name: 'OpenCV', slug: 'opencv', category: 'Computer Vision', icon: 'Eye' },
    { id: 'tech-13', name: 'MQTT', slug: 'mqtt', category: 'Internet of Things', icon: 'Wifi' },
    { id: 'tech-14', name: 'ESP32', slug: 'esp32', category: 'Embedded Systems', icon: 'Cpu' },
    { id: 'tech-15', name: 'Solidity', slug: 'solidity', category: 'Blockchain', icon: 'Key' },
    { id: 'tech-16', name: 'PostgreSQL', slug: 'postgresql', category: 'Database', icon: 'Database' },
    { id: 'tech-17', name: 'Apache Kafka', slug: 'kafka', category: 'Data Science', icon: 'Radio' },
    { id: 'tech-18', name: 'WebAssembly', slug: 'webassembly', category: 'Web & Systems', icon: 'Binary' },
    { id: 'tech-19', name: 'CUDA', slug: 'cuda', category: 'High Performance Computing', icon: 'Zap' },
    { id: 'tech-20', name: 'CAN Bus', slug: 'can-bus', category: 'Automotive & EV', icon: 'GitCommit' }
  ];

  const projects: Project[] = [
    {
      id: 'proj-001',
      title: 'AeroVision ROS2 Quadrotor Autonomous Swarm',
      slug: 'aerovision-ros2-quadrotor-autonomous-swarm',
      shortDescription: 'Decentralized cooperative SLAM and formation flight controller for quadrotor swarms using ROS 2 Galactic and stereo vision.',
      fullDescription: 'AeroVision is a cutting-edge aerospace and robotics project that enables decentralized multi-agent quadrotors to perform indoor and GPS-denied navigation. It incorporates stereo-inertial visual odometry, distributed consensus algorithms for dynamic obstacle avoidance, and real-time mesh communications.',
      category: 'Robotics',
      engineeringDomain: 'Robotics & Autonomous Systems',
      difficulty: 'Cutting-Edge',
      technologies: ['ROS 2', 'C++', 'OpenCV', 'PyTorch', 'Docker'],
      programmingLanguages: ['C++', 'Python', 'Bash'],
      developerId: 'usr-dev-01',
      developerName: 'Alex Rivera',
      developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      teamMembers: ['Alex Rivera (Lead)', 'Dr. Elena Vance (Advisor)', 'Siddharth Rao (Perception)'],
      status: 'PUBLISHED',
      version: 'v2.4.1',
      githubUrl: 'https://github.com/limo-hub/aerovision-swarm',
      demoUrl: 'https://aerovision.limo.dev',
      documentationUrl: 'https://docs.limo.dev/projects/aerovision',
      markdownDoc: `# AeroVision ROS2 Quadrotor Swarm Documentation

## Abstract
AeroVision establishes a robust framework for cooperative decentralized micro-aerial vehicle (MAV) swarms navigating complex GPS-denied 3D structures.

## System Architecture
1. **Sensory Subsystem**: Stereo Global Shutter Cameras (120fps) paired with 6-DOF IMU clocked at 1kHz.
2. **State Estimation**: Decentralized Extended Kalman Filter (EKF) with factor-graph optimization.
3. **Trajectory Generation**: Minimum snap polynomial trajectories optimized with B-spline curves.
4. **Inter-Vehicle Comms**: Ad-hoc 802.11s mesh network communicating via zero-copy DDS channels.

## Key Hardware Requirements
- Carbon-fiber 250mm quadrotor airframe
- Companion Computer: NVIDIA Jetson Orin Nano (8GB)
- Flight Controller: Pixhawk 6C running PX4 Autopilot
- RealSense D435i or customized global-shutter stereo rig
- 4S LiPo 2200mAh 75C Battery
`,
      images: [
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80'
      ],
      demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      downloadFiles: [
        { name: 'aerovision-ros2-v2.4.1-firmware.zip', size: '48.2 MB', type: 'Firmware & Software', downloadUrl: '/api/projects/proj-001/download?file=firmware' },
        { name: 'aerovision-schematics-and-cad.step', size: '124.6 MB', type: '3D CAD & Schematics', downloadUrl: '/api/projects/proj-001/download?file=cad' },
        { name: 'aerovision-whitepaper.pdf', size: '3.4 MB', type: 'Technical Whitepaper', downloadUrl: '/api/projects/proj-001/download?file=paper' }
      ],
      requirements: [
        'Ubuntu 22.04 LTS with RT-Kernel Patch',
        'ROS 2 Galactic or Humble Hawksbill',
        'NVIDIA CUDA Toolkit 12.2 and TensorRT 8.6',
        'PX4 Firmware v1.14+'
      ],
      installation: [
        'git clone https://github.com/limo-hub/aerovision-swarm.git',
        'cd aerovision-swarm && colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release',
        'source install/setup.bash',
        'ros2 launch aerovision_core swarm_simulation.launch.py'
      ],
      usage: [
        'Launch simulation with: ros2 launch aerovision_bringup sitl.launch.py num_drones:=4',
        'Arm and takeoff: ros2 service call /swarm/command aerovision_msgs/srv/SwarmCmd "{action: \'TAKEOFF\', altitude: 2.5}"',
        'Engage autonomous formation exploration: ros2 run aerovision_planner formation_node --pattern diamond'
      ],
      features: [
        'Decentralized Peer-to-Peer State Coordination',
        'Real-time Stereo Depth Disparity at 60 FPS',
        'Dynamic 3D OctoMap Spatial Representation',
        'Automated Failsafe & Return-to-Home Mesh Relaying',
        'Hardware-in-the-loop (HIL) Gazebo Simulation Suite'
      ],
      futureImprovements: [
        'Integration of Neuromorphic Event Cameras for ultra-low latency optical flow',
        '5G RedCap Cellular Direct Interlinks',
        'Zero-Shot Obstacle Segmentation using On-Device Vision Transformers'
      ],
      tags: ['Robotics', 'ROS 2', 'Quadrotor', 'Autonomous Systems', 'SLAM', 'Computer Vision'],
      isFeatured: true,
      featuredOrder: 1,
      viewCount: 14280,
      likeCount: 942,
      bookmarkCount: 681,
      downloadCount: 3120,
      createdAt: new Date('2025-01-20').toISOString(),
      updatedAt: new Date('2025-04-12').toISOString()
    },
    {
      id: 'proj-002',
      title: 'QuantumSim Qubit Circuit Synthesis & Noise Simulator',
      slug: 'quantumsim-qubit-circuit-synthesis-noise-simulator',
      shortDescription: 'High-performance GPU-accelerated quantum state vector simulator with realistic decoherence, gate infidelity, and noise mitigation.',
      fullDescription: 'QuantumSim provides researchers and students with a high-fidelity virtual quantum computer capable of simulating up to 36 qubits with arbitrary unitary gate decompositions, Lindblad master equation decoherence, and zero-noise extrapolation benchmarks.',
      category: 'Quantum Computing',
      engineeringDomain: 'Quantum Information Science',
      difficulty: 'Cutting-Edge',
      technologies: ['Qiskit', 'CUDA', 'Python', 'C++', 'WebAssembly'],
      programmingLanguages: ['Python', 'C++', 'Rust'],
      developerId: 'usr-admin-01',
      developerName: 'Dr. Elena Vance',
      developerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      teamMembers: ['Dr. Elena Vance (Lead)', 'Prof. Kenji Takahashi (Quantum Optics)'],
      status: 'PUBLISHED',
      version: 'v3.1.0',
      githubUrl: 'https://github.com/limo-hub/quantumsim-engine',
      demoUrl: 'https://quantumsim.limo.dev',
      documentationUrl: 'https://docs.limo.dev/projects/quantumsim',
      markdownDoc: `# QuantumSim Qubit Engine

QuantumSim leverages NVIDIA cuQuantum and specialized Rust-based sparse matrix kernels to simulate quantum circuits under environmental thermal noise and T1/T2 decoherence.

### Supported Hamiltonian Solvers
- Trotterized VQE (Variational Quantum Eigensolver)
- QAOA for MaxCut and combinatorial optimization problems
- Shor's Period Finding with error tracking
`,
      images: [
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80'
      ],
      demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      downloadFiles: [
        { name: 'quantumsim-v3.1.0-win64.zip', size: '78.4 MB', type: 'Desktop Simulator Binary', downloadUrl: '/api/projects/proj-002/download?file=win64' },
        { name: 'quantumsim-python-wheel.whl', size: '18.1 MB', type: 'Python PyPI Package', downloadUrl: '/api/projects/proj-002/download?file=wheel' }
      ],
      requirements: ['Python 3.10+', 'NVIDIA GPU compute capability 7.0+ (optional)', 'CMake 3.22+'],
      installation: [
        'pip install quantumsim-core',
        'quantumsim-cli init-workspace',
        'quantumsim-cli benchmark --qubits 24'
      ],
      usage: [
        'from quantumsim import Circuit, NoiseModel',
        'circ = Circuit(qubits=5)',
        'circ.h(0); circ.cx(0, 1); circ.measure_all()',
        'result = circ.run_gpu(shots=10000)'
      ],
      features: [
        '36-Qubit State Vector Full Density Matrix Emulation',
        'Integrated QASM 3.0 Parser and Transpiler',
        'Real-time Bloch Sphere 3D Interactive Visualizer',
        'Clifford+T gate fault-tolerant synthesis algorithms'
      ],
      futureImprovements: [
        'Multi-node MPI distributed quantum state clustering for 40+ qubits',
        'Pulse-level OpenPulse control simulator'
      ],
      tags: ['Quantum Computing', 'Qiskit', 'CUDA', 'Physics', 'Simulation'],
      isFeatured: true,
      featuredOrder: 2,
      viewCount: 19850,
      likeCount: 1420,
      bookmarkCount: 1105,
      downloadCount: 4210,
      createdAt: new Date('2025-01-10').toISOString(),
      updatedAt: new Date('2025-04-01').toISOString()
    },
    {
      id: 'proj-003',
      title: 'VoltGuard EV Battery Management & Thermal Neural Predictor',
      slug: 'voltguard-ev-battery-management-thermal-neural-predictor',
      shortDescription: 'Embedded automotive CAN bus BMS with physics-informed neural network (PINN) for real-time State-of-Charge and thermal runaway anticipation.',
      fullDescription: 'VoltGuard is an automotive-grade Battery Management System engineered for high-voltage 800V EV architectures. It combines precision multi-cell voltage balancing with an on-edge Physics-Informed Neural Network (PINN) capable of predicting localized lithium dendrite propagation and thermal runaway 90 seconds before critical failure.',
      category: 'Electric Vehicles',
      engineeringDomain: 'Automotive & Electrical Engineering',
      difficulty: 'Advanced',
      technologies: ['CAN Bus', 'ESP32', 'PyTorch', 'C++', 'Python'],
      programmingLanguages: ['C', 'C++', 'Python'],
      developerId: 'usr-dev-02',
      developerName: 'Sophia Chen',
      developerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      teamMembers: ['Sophia Chen (Powertrain Lead)', 'Dr. Elena Vance (Advisor)'],
      status: 'PUBLISHED',
      version: 'v1.8.0',
      githubUrl: 'https://github.com/limo-hub/voltguard-bms',
      demoUrl: 'https://voltguard.limo.dev',
      documentationUrl: 'https://docs.limo.dev/projects/voltguard',
      markdownDoc: `# VoltGuard 800V BMS Architecture

VoltGuard monitors cell voltage (1mV accuracy) across 192 series cells (Lithium Iron Phosphate / NMC) alongside high-frequency thermocouple arrays.
`,
      images: [
        'https://images.unsplash.com/photo-1558441719-8b489c63f771?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&auto=format&fit=crop&q=80'
      ],
      demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      downloadFiles: [
        { name: 'voltguard-pcb-altium-gerbers.zip', size: '34.2 MB', type: 'PCB Gerbers & BOM', downloadUrl: '/api/projects/proj-003/download?file=gerbers' },
        { name: 'voltguard-firmware-v1.8.hex', size: '2.1 MB', type: 'Microcontroller Hex Binary', downloadUrl: '/api/projects/proj-003/download?file=hex' }
      ],
      requirements: ['CAN Interface (CANable / PCAN-USB)', 'Altium Designer or KiCAD 8.0', 'PlatformIO IDE'],
      installation: [
        'git clone https://github.com/limo-hub/voltguard-bms.git',
        'cd voltguard-bms/firmware && pio run --target upload'
      ],
      usage: [
        'Connect PCAN-USB to OBD2 or BMS auxiliary CAN port at 500kbps',
        'Run telemetry dashboard: python scripts/bms_telemetry_gui.py --port CAN0'
      ],
      features: [
        'Active and Passive Cell Balancing with 2.5A dissipation',
        'ISO 26262 ASIL-D Safety Architecture Compliance',
        'Physics-Informed Neural Network (PINN) SoC & SoH estimation',
        'High-voltage Isolation monitoring with optocouplers up to 3000V'
      ],
      futureImprovements: [
        'Wireless BMS (wBMS) mesh via Bluetooth LE 5.4',
        'Solid-state battery chemistry adaptive profile modeling'
      ],
      tags: ['Electric Vehicles', 'BMS', 'Automotive', 'Embedded Systems', 'CAN Bus'],
      isFeatured: true,
      featuredOrder: 3,
      viewCount: 11450,
      likeCount: 789,
      bookmarkCount: 520,
      downloadCount: 1890,
      createdAt: new Date('2025-02-05').toISOString(),
      updatedAt: new Date('2025-03-28').toISOString()
    },
    {
      id: 'proj-004',
      title: 'ZeroTrust Sentinel AI Cyber Defense Gateway',
      slug: 'zerotrust-sentinel-ai-cyber-defense-gateway',
      shortDescription: 'High-throughput eBPF packet inspection kernel module with real-time transformer anomaly detection for zero-day mitigation.',
      fullDescription: 'ZeroTrust Sentinel protects cloud infrastructure from advanced persistent threats (APTs). Operating directly in Linux kernel space using extended Berkeley Packet Filters (eBPF), it inspects millions of packets per second with sub-microsecond latency and classifies anomalies using an on-chip quantized neural network.',
      category: 'Cybersecurity',
      engineeringDomain: 'Information Security & Systems',
      difficulty: 'Advanced',
      technologies: ['Rust', 'Docker', 'Kubernetes', 'Python', 'WebAssembly'],
      programmingLanguages: ['Rust', 'C', 'Python'],
      developerId: 'usr-admin-01',
      developerName: 'Dr. Elena Vance',
      developerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      status: 'PUBLISHED',
      version: 'v4.0.2',
      githubUrl: 'https://github.com/limo-hub/zerotrust-sentinel',
      demoUrl: 'https://sentinel.limo.dev',
      documentationUrl: 'https://docs.limo.dev/projects/sentinel',
      markdownDoc: `# ZeroTrust Sentinel Kernel Gateway

eBPF zero-copy ring-buffer architecture for enterprise Kubernetes clusters.
`,
      images: [
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
      ],
      downloadFiles: [
        { name: 'sentinel-k8s-operator.tar.gz', size: '42.9 MB', type: 'Helm Chart & Operator', downloadUrl: '/api/projects/proj-004/download?file=helm' }
      ],
      requirements: ['Linux Kernel 5.15+ with BTF enabled', 'Rust 1.78+', 'LLVM/Clang 16+'],
      installation: [
        'cargo install cargo-bpf',
        'git clone https://github.com/limo-hub/zerotrust-sentinel.git',
        'cargo build --release'
      ],
      usage: [
        'sudo ./target/release/sentinel --interface eth0 --policy zero-trust-strict.yaml'
      ],
      features: [
        'eBPF XDP Line-Rate Packet Processing (10M+ pps)',
        'Zero-Day DDoS and DNS Amplification Mitigation',
        'Real-time JWT / mTLS Mutual Verification at Layer 4/7',
        'OpenTelemetry Audit Logging & Splunk Integration'
      ],
      futureImprovements: ['Hardware acceleration via Intel IPU / SmartNIC P4 offloading'],
      tags: ['Cybersecurity', 'Rust', 'eBPF', 'Networking', 'Zero-Trust'],
      isFeatured: true,
      featuredOrder: 4,
      viewCount: 16700,
      likeCount: 1120,
      bookmarkCount: 840,
      downloadCount: 2650,
      createdAt: new Date('2025-01-28').toISOString(),
      updatedAt: new Date('2025-04-10').toISOString()
    },
    {
      id: 'proj-005',
      title: 'SmartGrid Microgrid IoT Edge Controller',
      slug: 'smartgrid-microgrid-iot-edge-controller',
      shortDescription: 'Industrial edge gateway for solar/wind renewable microgrids with local load balancing, MPPT optimization, and MQTT SCADA.',
      fullDescription: 'An open industrial SCADA and edge automation system designed to stabilize decentralized clean energy microgrids. Features dynamic islanding detection, ultra-fast 20ms grid synchronization, and reinforcement learning for battery storage arbitrage.',
      category: 'Renewable Energy',
      engineeringDomain: 'Clean Energy & Power Systems',
      difficulty: 'Intermediate',
      technologies: ['MQTT', 'ESP32', 'React', 'TypeScript', 'PostgreSQL'],
      programmingLanguages: ['C++', 'TypeScript', 'Python'],
      developerId: 'usr-dev-01',
      developerName: 'Alex Rivera',
      developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      status: 'PUBLISHED',
      version: 'v2.0.0',
      githubUrl: 'https://github.com/limo-hub/smartgrid-iot',
      demoUrl: 'https://smartgrid.limo.dev',
      documentationUrl: 'https://docs.limo.dev/projects/smartgrid',
      images: [
        'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80'
      ],
      downloadFiles: [
        { name: 'smartgrid-firmware-esp32.bin', size: '3.8 MB', type: 'Firmware Binary', downloadUrl: '/api/projects/proj-005/download?file=bin' }
      ],
      requirements: ['ESP32-S3 DevKit', 'RS-485 Modbus Inverter', 'MQTT Broker (Mosquitto)'],
      installation: [
        'pio run -d edge_firmware -t upload',
        'docker compose up -d scada-dashboard'
      ],
      usage: [
        'Access local dashboard at http://localhost:8080',
        'Monitor Modbus RTU telemetry on channels 1-16'
      ],
      features: [
        'Modbus RTU/TCP Inverter Integration (SMA, Fronius, Huawei)',
        'Local SQLite & TimescaleDB Telemetry Caching during Outages',
        'Automated 20ms Grid-Tie Islanding Relay Trigger'
      ],
      futureImprovements: ['Peer-to-peer neighborhood energy trading via smart contracts'],
      tags: ['Renewable Energy', 'IoT', 'Microgrid', 'MQTT', 'Solar'],
      isFeatured: false,
      viewCount: 8900,
      likeCount: 540,
      bookmarkCount: 410,
      downloadCount: 1420,
      createdAt: new Date('2025-02-14').toISOString(),
      updatedAt: new Date('2025-03-15').toISOString()
    },
    {
      id: 'proj-006',
      title: 'BioGrip Neural Prosthetic Bionic Arm System',
      slug: 'biogrip-neural-prosthetic-bionic-arm-system',
      shortDescription: '3D printed multi-articulating bionic hand driven by 8-channel surface electromyography (sEMG) and on-device TinyML gesture classification.',
      fullDescription: 'BioGrip is an accessible, high-performance myoelectric prosthetic hand with independent finger flexion, opposable thumb rotation, and tactile haptic feedback. Utilizes an ARM Cortex-M4 microcontroller running a quantized convolutional neural network that translates muscle electrical signals into natural grasp patterns in under 35 milliseconds.',
      category: 'Mechanical Engineering',
      engineeringDomain: 'Biomedical & Mechatronics',
      difficulty: 'Advanced',
      technologies: ['TensorFlow', 'C++', 'ESP32', 'OpenCV'],
      programmingLanguages: ['C++', 'Python'],
      developerId: 'usr-dev-01',
      developerName: 'Alex Rivera',
      developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      status: 'PUBLISHED',
      version: 'v3.0.4',
      githubUrl: 'https://github.com/limo-hub/biogrip-prosthetic',
      demoUrl: 'https://biogrip.limo.dev',
      documentationUrl: 'https://docs.limo.dev/projects/biogrip',
      images: [
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&auto=format&fit=crop&q=80'
      ],
      downloadFiles: [
        { name: 'biogrip-stl-print-files.zip', size: '185.0 MB', type: '3D Print Models (STL/STEP)', downloadUrl: '/api/projects/proj-006/download?file=stl' },
        { name: 'biogrip-tinyml-models.tflite', size: '4.2 MB', type: 'Quantized TinyML Weights', downloadUrl: '/api/projects/proj-006/download?file=tflite' }
      ],
      requirements: ['3D Printer (PETG/TPU)', 'MyoWare 2.0 sEMG Sensors', 'STM32 Nucleo or ESP32-S3'],
      installation: [
        'Flash firmware with STM32CubeIDE',
        'Calibrate baseline resting muscle signal via calibration CLI'
      ],
      usage: [
        'Place electrodes on forearm extensor and flexor carpi radialis',
        'Perform 30-second user training routine'
      ],
      features: [
        '6 Active Degrees of Freedom with micro linear actuators',
        '96.8% classification accuracy across 12 distinct grasp gestures',
        'Force sensing resistor (FSR) closed-loop grip control',
        'Total weight under 420g with ergonomic forearm socket'
      ],
      futureImprovements: ['Direct peripheral nerve cuff interface integration'],
      tags: ['Prosthetics', 'Mechatronics', 'TinyML', 'Robotics', 'Biomedical'],
      isFeatured: false,
      viewCount: 13400,
      likeCount: 980,
      bookmarkCount: 790,
      downloadCount: 2200,
      createdAt: new Date('2025-02-22').toISOString(),
      updatedAt: new Date('2025-04-05').toISOString()
    },
    {
      id: 'proj-007',
      title: 'NexusChain Decentralized Carbon Credit & Provenance Ledger',
      slug: 'nexuschain-decentralized-carbon-credit-provenance-ledger',
      shortDescription: 'Enterprise Ethereum Layer-2 rollup protocol for transparent industrial emissions tracking and verified satellite carbon sequestration offsets.',
      fullDescription: 'NexusChain provides an immutable auditing layer for industrial supply chains. It combines IoT emissions sensors with smart contract verifications and decentralized storage to eliminate greenwashing and double-counting of renewable carbon credits.',
      category: 'Blockchain',
      engineeringDomain: 'Distributed Systems & Web3',
      difficulty: 'Intermediate',
      technologies: ['Solidity', 'Rust', 'Docker', 'PostgreSQL', 'TypeScript'],
      programmingLanguages: ['Solidity', 'Rust', 'TypeScript'],
      developerId: 'usr-dev-02',
      developerName: 'Sophia Chen',
      developerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      status: 'PUBLISHED',
      version: 'v1.2.0',
      githubUrl: 'https://github.com/limo-hub/nexuschain',
      demoUrl: 'https://nexuschain.limo.dev',
      images: [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop&q=80'
      ],
      downloadFiles: [
        { name: 'nexuschain-smart-contracts.zip', size: '12.4 MB', type: 'Solidity Contracts & Audits', downloadUrl: '/api/projects/proj-007/download?file=contracts' }
      ],
      requirements: ['Node.js 20+', 'Hardhat / Foundry', 'Docker'],
      installation: ['forge build', 'forge test --gas-report'],
      usage: ['forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast'],
      features: ['Zero-Knowledge SNARK verification for proprietary factory sensor data', 'ERC-1155 fractional carbon token standard', 'Low-gas zk-Rollup sequencer'],
      futureImprovements: ['Cross-chain bridge to Polkadot and Cosmos IBC'],
      tags: ['Blockchain', 'Solidity', 'Smart Contracts', 'Web3', 'Sustainability'],
      isFeatured: false,
      viewCount: 7600,
      likeCount: 430,
      bookmarkCount: 310,
      downloadCount: 950,
      createdAt: new Date('2025-03-05').toISOString(),
      updatedAt: new Date('2025-03-29').toISOString()
    },
    {
      id: 'proj-008',
      title: 'SkyBridge Parametric Structural Health Acoustic Sensor',
      slug: 'skybridge-parametric-structural-health-acoustic-sensor',
      shortDescription: 'Continuous seismic and acoustic emission monitoring network for suspension bridges and high-rises with automated micro-crack detection.',
      fullDescription: 'Civil engineering monitoring platform deploying piezoelectric transducer arrays on critical bridge tendons and concrete pillars. Detects micro-cracking acoustic stress waves before visible structural deformation occurs.',
      category: 'Civil Engineering',
      engineeringDomain: 'Structural Engineering & IoT',
      difficulty: 'Intermediate',
      technologies: ['ESP32', 'Python', 'React', 'PostgreSQL'],
      programmingLanguages: ['C++', 'Python'],
      developerId: 'usr-dev-01',
      developerName: 'Alex Rivera',
      developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      status: 'PUBLISHED',
      version: 'v2.1.0',
      githubUrl: 'https://github.com/limo-hub/skybridge-shm',
      demoUrl: 'https://skybridge.limo.dev',
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&auto=format&fit=crop&q=80'
      ],
      downloadFiles: [
        { name: 'skybridge-sensor-schematics.zip', size: '28.5 MB', type: 'Sensor Schematics & Firmware', downloadUrl: '/api/projects/proj-008/download?file=sensor' }
      ],
      requirements: ['Piezoelectric Acoustic Sensor Kit', 'LoRaWAN Gateway', 'Grafana / InfluxDB'],
      installation: ['pip install skybridge-analyzer', 'skybridge-analyzer --start-listener'],
      usage: ['Deploy nodes along bridge spans and monitor real-time strain tensors'],
      features: ['Acoustic emission wave velocity profiling (up to 5 MHz sampling)', 'LoRaWAN 15km wireless range', 'Solar energy harvesting with supercapacitors'],
      futureImprovements: ['Digital twin synchronization with BIM Revit models'],
      tags: ['Civil Engineering', 'Structural Health', 'Acoustic Sensors', 'LoRaWAN', 'Infrastructure'],
      isFeatured: false,
      viewCount: 6200,
      likeCount: 390,
      bookmarkCount: 280,
      downloadCount: 780,
      createdAt: new Date('2025-03-12').toISOString(),
      updatedAt: new Date('2025-04-02').toISOString()
    }
  ];

  const creators: Creator[] = [
    {
      id: 'cr-01',
      name: 'Dr. Elena Vance',
      role: 'Founder & Chief Architect',
      bio: 'Ph.D. in Computer Science & Robotics. Leading research in distributed autonomous systems, quantum simulation, and open engineering platforms.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
      skills: ['System Architecture', 'Distributed Systems', 'Quantum Algorithms', 'Rust', 'ROS 2'],
      technologies: ['Rust', 'Qiskit', 'ROS 2', 'Linux Kernel', 'WebAssembly'],
      contribution: 'Conceptualized and architected LIMO Hub, designed core project discovery paradigms, and leads platform engineering vision.',
      githubUrl: 'https://github.com/elena-limo',
      linkedinUrl: 'https://linkedin.com/in/elena-vance-limo',
      portfolioUrl: 'https://elena-vance.limo.dev',
      order: 1,
      isVisible: true,
      createdAt: new Date('2025-01-01').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cr-02',
      name: 'Alex Rivera',
      role: 'Lead Platform Developer & Systems Engineer',
      bio: 'Robotics and Full-Stack Systems engineer with 8+ years building mission-critical autonomous avionics and high-concurrency cloud infrastructure.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      skills: ['Full-Stack Development', 'Robotics Systems', 'C++', 'Node.js', 'React', 'DevOps'],
      technologies: ['TypeScript', 'React', 'Node.js', 'C++', 'Docker', 'Kubernetes'],
      contribution: 'Engineered backend REST APIs, authentication security architecture, real-time analytics engine, and developer submission workflow.',
      githubUrl: 'https://github.com/alexrivera-eng',
      linkedinUrl: 'https://linkedin.com/in/alex-rivera-eng',
      portfolioUrl: 'https://alexrivera.dev',
      order: 2,
      isVisible: true,
      createdAt: new Date('2025-01-02').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cr-03',
      name: 'Sophia Chen',
      role: 'Lead UI/UX Architect & Design Engineer',
      bio: 'Specialist in Human-Computer Interaction, glassmorphic UI design systems, and responsive web accessibility for complex engineering tooling.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
      skills: ['UI/UX Design', 'Design Systems', 'Tailwind CSS', 'Framer Motion', 'Accessibility'],
      technologies: ['React', 'Tailwind CSS', 'Figma', 'CSS Architecture', 'Canvas & WebGL'],
      contribution: 'Designed the complete LIMO brand identity, geometric logo, 8-theme customization engine, and fluid glassmorphic component system.',
      githubUrl: 'https://github.com/sophiachen-design',
      linkedinUrl: 'https://linkedin.com/in/sophia-chen-ui',
      portfolioUrl: 'https://sophiachen.design',
      order: 3,
      isVisible: true,
      createdAt: new Date('2025-01-03').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cr-04',
      name: 'Marcus Brody',
      role: 'Security Lead & Infrastructure Architect',
      bio: 'Cybersecurity researcher focused on zero-trust architectures, end-to-end data encryption, and resilient high-throughput cloud networks.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      skills: ['Zero Trust', 'Cloud Security', 'Kubernetes', 'Penetration Testing', 'PostgreSQL'],
      technologies: ['Rust', 'eBPF', 'Kubernetes', 'PostgreSQL', 'OpenTelemetry'],
      contribution: 'Implemented role-based access control, file upload sandboxing, input sanitization, and database query security.',
      githubUrl: 'https://github.com/marcusbrody-sec',
      linkedinUrl: 'https://linkedin.com/in/marcus-brody-sec',
      order: 4,
      isVisible: true,
      createdAt: new Date('2025-01-04').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cr-05',
      name: 'Aarav Patel',
      role: 'AI/ML Research & Community Lead',
      bio: 'Machine learning specialist passionate about democratizing open engineering datasets, edge intelligence, and mentorship for young innovators.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
      skills: ['Machine Learning', 'Computer Vision', 'PyTorch', 'Community Advocacy'],
      technologies: ['PyTorch', 'Python', 'OpenCV', 'TensorFlow', 'FastAPI'],
      contribution: 'Curated comprehensive engineering categories, developed technical benchmark datasets, and coordinates developer reviews.',
      githubUrl: 'https://github.com/aaravpatel-ai',
      linkedinUrl: 'https://linkedin.com/in/aarav-patel-ai',
      order: 5,
      isVisible: true,
      createdAt: new Date('2025-01-05').toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const settings: SiteSettings = {
    siteTitle: 'LIMO',
    siteSubtitle: 'Engineering Project Hub',
    heroHeading: 'Discover, explore, build and manage engineering projects in one intelligent platform.',
    heroDescription: 'A modern central ecosystem where students explore cutting-edge solutions across 20+ engineering disciplines, developers publish and manage production-grade projects, and administrators curate verified technical standards.',
    allowUserSubmissions: true,
    requireApproval: true,
    defaultTheme: 'dark',
    contactEmail: 'contact@limo.dev'
  };

  const activityLogs: ActivityLog[] = [
    {
      id: 'act-001',
      userId: 'usr-admin-01',
      userName: 'Dr. Elena Vance',
      action: 'PLATFORM_INITIALIZED',
      details: 'LIMO Hub v1.0.0 launched with 20 categories and core engineering projects.',
      timestamp: new Date('2025-01-15T10:00:00Z').toISOString()
    },
    {
      id: 'act-002',
      userId: 'usr-dev-01',
      userName: 'Alex Rivera',
      action: 'PROJECT_PUBLISHED',
      details: 'Published project "AeroVision ROS2 Quadrotor Autonomous Swarm".',
      timestamp: new Date('2025-01-20T14:30:00Z').toISOString()
    },
    {
      id: 'act-003',
      userId: 'usr-admin-01',
      userName: 'Dr. Elena Vance',
      action: 'PROJECT_FEATURED',
      details: 'Featured "QuantumSim Qubit Circuit Synthesis & Noise Simulator" on homepage.',
      timestamp: new Date('2025-02-01T09:15:00Z').toISOString()
    }
  ];

  return {
    users,
    projects,
    categories,
    technologies,
    submissions: [
      {
        id: 'sub-001',
        projectId: 'proj-003',
        developerId: 'usr-dev-02',
        developerName: 'Sophia Chen',
        status: 'APPROVED',
        adminFeedback: 'Exceptional BMS architecture and thorough CAN bus implementation documentation.',
        reviewedBy: 'Dr. Elena Vance',
        reviewedAt: new Date('2025-02-06T11:00:00Z').toISOString(),
        submittedAt: new Date('2025-02-05T08:30:00Z').toISOString()
      }
    ],
    likes: [
      { id: 'like-1', projectId: 'proj-001', userId: 'usr-admin-01', createdAt: new Date().toISOString() },
      { id: 'like-2', projectId: 'proj-001', userId: 'usr-student-01', createdAt: new Date().toISOString() },
      { id: 'like-3', projectId: 'proj-002', userId: 'usr-student-01', createdAt: new Date().toISOString() }
    ],
    bookmarks: [
      { id: 'bm-1', projectId: 'proj-001', userId: 'usr-student-01', createdAt: new Date().toISOString() },
      { id: 'bm-2', projectId: 'proj-002', userId: 'usr-student-01', createdAt: new Date().toISOString() },
      { id: 'bm-3', projectId: 'proj-003', userId: 'usr-student-01', createdAt: new Date().toISOString() }
    ],
    comments: [
      {
        id: 'cm-001',
        projectId: 'proj-001',
        userId: 'usr-student-01',
        userName: 'Maya Lin',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        userRole: 'USER',
        content: 'Incredible work on the PX4 fast-DDS bridge! Has anyone benchmarked the obstacle avoidance latency on the Jetson Orin Nano with 4 simultaneous agents?',
        createdAt: new Date('2025-02-18T16:20:00Z').toISOString()
      },
      {
        id: 'cm-002',
        projectId: 'proj-001',
        userId: 'usr-dev-01',
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        userRole: 'DEVELOPER',
        content: 'Hi Maya! We measured approximately 14.2ms end-to-end stereo disparity to avoidance vector computation on the Orin Nano at 15W mode. Check Section 4 of the documentation for thermal throttling benchmarks!',
        createdAt: new Date('2025-02-18T18:45:00Z').toISOString()
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        userId: 'usr-admin-01',
        title: 'Platform Ready',
        message: 'LIMO Hub engineering platform initialized successfully.',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        userId: 'usr-dev-02',
        title: 'Project Approved',
        message: 'Your project "VoltGuard EV Battery Management" was approved by Admin and is now published.',
        type: 'approval',
        link: '/projects/voltguard-ev-battery-management-thermal-neural-predictor',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-3',
        userId: 'usr-student-01',
        title: 'Welcome to LIMO Hub',
        message: 'Explore over 20 engineering domains and discover verified projects.',
        type: 'info',
        link: '/projects',
        read: false,
        createdAt: new Date().toISOString()
      }
    ],
    creators,
    settings,
    activityLogs
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('Error loading DB file, re-initializing with seed data:', err);
    }

    const initial = getInitialSeedData();
    this.persist(initial);
    return initial;
  }

  private persist(data: DatabaseSchema): void {
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  }

  public save(): void {
    this.persist(this.data);
  }

  public get users(): User[] { return this.data.users; }
  public get projects(): Project[] { return this.data.projects; }
  public get categories(): Category[] { return this.data.categories; }
  public get technologies(): Technology[] { return this.data.technologies; }
  public get submissions(): DatabaseSchema['submissions'] { return this.data.submissions; }
  public get likes(): DatabaseSchema['likes'] { return this.data.likes; }
  public get bookmarks(): DatabaseSchema['bookmarks'] { return this.data.bookmarks; }
  public get comments(): DatabaseSchema['comments'] { return this.data.comments; }
  public get notifications(): DatabaseSchema['notifications'] { return this.data.notifications; }
  public get creators(): Creator[] { return this.data.creators; }
  public get settings(): SiteSettings { return this.data.settings; }
  public get activityLogs(): ActivityLog[] { return this.data.activityLogs; }

  public logActivity(userId: string, userName: string, action: string, details: string): void {
    const log: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.activityLogs.unshift(log);
    if (this.data.activityLogs.length > 500) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 500);
    }
    this.save();
  }
}

export const db = new Database();
