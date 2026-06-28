(function () {
  "use strict";

  /* ============================================================
   *  window.BelNews3D – graphe de réseau social interactif 3D
   *  (Three.js v0.160+ chargé via CDN dans index.html)
   * ============================================================ */

  const BelNews3D = function () {
    this.containerId = "#canvas-3d-container";
    this.nodeCount = 50;
    this.connectionThreshold = 4.5;
    this.pulseMaxDistance = 12;

    // Three.js core
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Nodes & edges
    this.nodes = [];
    this.nodeMeshes = [];
    this.edgeLines = null;
    this.edgePositions = null;
    this.edgeGeometry = null;

    // Pulse system
    this.pulses = [];
    this.pulseMaterial = null;
    this.pulsePool = [];

    // Theme
    this.currentColor = { r: 0.9, g: 0.25, b: 0.7 };
    this.targetColor = { r: 0.9, g: 0.25, b: 0.7 };
    this.isShaking = false;
    this.shakeTime = 0;
    this.shakeIntensity = 0;

    // Timing
    this.lastTime = 0;

    // Raycaster for interaction
    this.raycaster = null;
    this.mouse = new (window.THREE ? window.THREE.Vector2 : new Vector2Dummy)();

    this._init = this._init.bind(this);
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
  };

  /* ── Utility helpers ─────────────────────────────────────── */

  const rand = (min, max) => Math.random() * (max - min) + min;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── Initialisation Three.js ─────────────────────────────── */

  BelNews3D.prototype._init = function () {
    const container = document.querySelector(this.containerId);
    if (!container) return;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.setSize();
    container.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    this.camera.position.set(0, 0, 35);
    this.camera.lookAt(0, 0, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    const dir1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dir1.position.set(10, 15, 20);
    this.scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xffd0ff, 0.4);
    dir2.position.set(-10, -5, 15);
    this.scene.add(dir2);

    // Create nodes
    this._createNodes();

    // Create edges (merged buffer)
    this._createEdges();

    // Pulse material (shared)
    this.pulseMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });

    // Raycaster for hover
    this.raycaster = new THREE.Raycaster();

    // Events
    window.addEventListener("resize", this.handleResize);
    container.addEventListener(
      "mousemove",
      this._onMouseMove.bind(this)
    );
    container.addEventListener(
      "click",
      this._onCanvasClick.bind(this)
    );

    // Start animation loop
    requestAnimationFrame(this.animate);
  };

  /* ── Création des nœuds (sphères lumineuses) ─────────────── */

  BelNews3D.prototype._createNodes = function () {
    const sphereGeo = new THREE.SphereGeometry(0.28, 16, 12);

    for (let i = 0; i < this.nodeCount; i++) {
      // Position initiale aléatoire dans un volume sphérique
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = rand(3, 14);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Vitesse / direction organique
      const speed = rand(0.002, 0.008);
      const vx = (Math.random() - 0.5) * speed;
      const vy = (Math.random() - 0.5) * speed;
      const vz = (Math.random() - 0.5) * speed;

      // Couleur de base (rose/violet Belgogram)
      const hue = rand(280, 340);
      const hsl = new THREE.Color().setHSL(hue / 360, 0.7, 0.55);

      const material = new THREE.MeshStandardMaterial({
        color: hsl.clone(),
        emissive: hsl.clone().multiplyScalar(0.4),
        emissiveIntensity: 1.2,
        roughness: 0.3,
        metalness: 0.6,
      });

      const mesh = new THREE.Mesh(sphereGeo, material);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);

      // Petit halo autour du nœud
      const haloGeo = new THREE.SphereGeometry(0.5, 12, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: hsl.clone(),
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(halo);

      this.nodeMeshes.push(mesh);

      this.nodes.push({
        index: i,
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(vx, vy, vz),
        homePosition: new THREE.Vector3(x, y, z),
        color: hsl.clone(),
        baseEmissiveIntensity: 1.2,
        connectedIndices: [],
      });
    }
  };

  /* ── Création des arêtes (lignes de connexion) ───────────── */

  BelNews3D.prototype._createEdges = function () {
    const positions = [];

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dist = this.nodes[i].position.distanceTo(
          this.nodes[j].position
        );
        if (dist < this.connectionThreshold) {
          this.nodes[i].connectedIndices.push(j);
          this.nodes[j].connectedIndices.push(i);

          positions.push(
            this.nodes[i].position.x,
            this.nodes[i].position.y,
            this.nodes[i].position.z,
            this.nodes[j].position.x,
            this.nodes[j].position.y,
            this.nodes[j].position.z
          );
        }
      }
    }

    this.edgePositions = new Float32Array(positions);

    this.edgeGeometry = new THREE.BufferGeometry();
    this.edgeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.edgePositions, 3)
    );

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });

    this.edgeLines = new THREE.LineSegments(
      this.edgeGeometry,
      edgeMaterial
    );
    this.scene.add(this.edgeLines);
  };

  /* ── MAJ des arêtes par rapport aux positions actuelles ─── */

  BelNews3D.prototype._updateEdges = function () {
    const positions = [];

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dist = this.nodes[i].position.distanceTo(
          this.nodes[j].position
        );
        if (dist < this.connectionThreshold) {
          positions.push(
            this.nodes[i].position.x,
            this.nodes[i].position.y,
            this.nodes[i].position.z,
            this.nodes[j].position.x,
            this.nodes[j].position.y,
            this.nodes[j].position.z
          );
        }
      }
    }

    this.edgePositions = new Float32Array(positions);
    this.edgeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.edgePositions, 3)
    );
    this.edgeGeometry.attributes.position.needsUpdate = true;
  };

  /* ── Boucle d'animation (60 FPS) ───────────────────────── */

  BelNews3D.prototype.animate = function (timestamp) {
    requestAnimationFrame(this.animate);

    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    // ── Mouvement organique des nœuds ───────────────────────
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      // Force de rappel vers la position maison (léger oscillateur)
      const dx = node.homePosition.x - node.position.x;
      const dy = node.homePosition.y - node.position.y;
      const dz = node.homePosition.z - node.position.z;

      node.velocity.x += dx * 0.0003;
      node.velocity.y += dy * 0.0003;
      node.velocity.z += dz * 0.0003;

      // Répulsion entre nœuds proches
      for (let j = i + 1; j < this.nodes.length; j++) {
        const other = this.nodes[j];
        const distSq =
          (node.position.x - other.position.x) ** 2 +
          (node.position.y - other.position.y) ** 2 +
          (node.position.z - other.position.z) ** 2;

        if (distSq < 4 && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = 0.005 / dist;
          const fx = (node.position.x - other.position.x) * force;
          const fy = (node.position.y - other.position.y) * force;
          const fz = (node.position.z - other.position.z) * force;

          node.velocity.x += fx;
          node.velocity.y += fy;
          node.velocity.z += fz;
          other.velocity.x -= fx;
          other.velocity.y -= fy;
          other.velocity.z -= fz;
        }
      }

      // Amortissement
      node.velocity.multiplyScalar(0.985);

      // Mise à jour position
      node.position.add(node.velocity);

      // Limites douces (confinement sphérique)
      const maxR = 20;
      const currentR = node.position.length();
      if (currentR > maxR) {
        const pullBack = (currentR - maxR) * 0.01;
        const invLen = 1 / currentR;
        node.velocity.x -= node.position.x * invLen * pullBack;
        node.velocity.y -= node.position.y * invLen * pullBack;
        node.velocity.z -= node.position.z * invLen * pullBack;
      }

      // Application de la position
      this.nodeMeshes[i].position.copy(node.position);

      // Pulsation douce du mesh
      const pulse = 1 + Math.sin(timestamp * 0.002 + i) * 0.08;
      this.nodeMeshes[i].scale.setScalar(pulse);
    }

    // ── MAJ des arêtes toutes les quelques frames ──────────
    if (Math.floor(timestamp / 150) !== Math.floor((timestamp - dt * 1000) / 150)) {
      this._updateEdges();
    }

    // ── Changement progressif de couleur du réseau ────────
    const colorLerpSpeed = 0.03;
    this.currentColor.r = lerp(
      this.currentColor.r,
      this.targetColor.r,
      colorLerpSpeed
    );
    this.currentColor.g = lerp(
      this.currentColor.g,
      this.targetColor.g,
      colorLerpSpeed
    );
    this.currentColor.b = lerp(
      this.currentColor.b,
      this.targetColor.b,
      colorLerpSpeed
    );

    const newCol = new THREE.Color(
      this.currentColor.r,
      this.currentColor.g,
      this.currentColor.b
    );

    // Couleur des arêtes
    if (this.edgeLines) {
      this.edgeLines.material.color.copy(newCol);
      this.edgeLines.material.opacity = lerp(
        this.edgeLines.material.opacity,
        0.22,
        colorLerpSpeed
      );
    }

    // Couleur des nœuds
    for (let i = 0; i < this.nodes.length; i++) {
      const nodeMesh = this.nodeMeshes[i];
      if (nodeMesh && nodeMesh.material) {
        nodeMesh.material.color.copy(newCol);
        const emissive = newCol.clone().multiplyScalar(0.35);
        nodeMesh.material.emissive.copy(emissive);
        // Halo
        const childCount = nodeMesh.children.length;
        for (let c = 0; c < childCount; c++) {
          if (nodeMesh.children[c].material) {
            nodeMesh.children[c].material.color.copy(newCol);
          }
        }
      }
    }

    // ── Mettre à jour et dessiner les impulsions (pulses) ──
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.age += dt;
      const t = Math.min(1, pulse.age / pulse.duration);
      
      // Interpolation linéaire le long du segment
      pulse.mesh.position.lerpVectors(pulse.startPos, pulse.endPos, t);
      
      // Dégradation de l'opacité
      if (t >= 0.8) {
        pulse.mesh.material.opacity = (1 - t) * 5;
      }
      
      if (t >= 1) {
        this.scene.remove(pulse.mesh);
        this.pulsePool.push(pulse.mesh); // Recycler
        this.pulses.splice(i, 1);
      }
    }

    // Rendu final
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  /* ── Déclencher des impulsions (likes/partages) ── */
  BelNews3D.prototype.triggerNetworkPulse = function (intensity = 1) {
    if (!this.scene) return;
    
    const count = Math.min(15, Math.max(1, Math.round(intensity * 3.5)));
    
    for (let c = 0; c < count; c++) {
      // Choisir un nœud de départ au hasard possédant des arêtes
      const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      if (!startNode || startNode.connectedIndices.length === 0) continue;
      
      // Choisir une cible connectée
      const targetIndex = startNode.connectedIndices[Math.floor(Math.random() * startNode.connectedIndices.length)];
      const endNode = this.nodes[targetIndex];
      
      // Recycler ou instancier une sphère d'impulsion
      let pulseMesh;
      if (this.pulsePool.length > 0) {
        pulseMesh = this.pulsePool.pop();
        pulseMesh.material.opacity = 1;
      } else {
        const pulseGeo = new THREE.SphereGeometry(0.16, 8, 8);
        pulseMesh = new THREE.Mesh(pulseGeo, this.pulseMaterial);
      }
      
      pulseMesh.position.copy(startNode.position);
      pulseMesh.material.color.setRGB(1, 1, 1);
      this.scene.add(pulseMesh);
      
      this.pulses.push({
        mesh: pulseMesh,
        startPos: startNode.position,
        endPos: endNode.position,
        duration: rand(0.3, 0.8) / Math.max(1, intensity * 0.4),
        age: 0
      });
      
      // Faire vibrer/grossir brièvement le nœud
      const mesh = this.nodeMeshes[startNode.index];
      mesh.scale.setScalar(1.6);
    }
  };

  /* ── Mettre à jour le thème visuel selon la crédibilité ── */
  BelNews3D.prototype.updateTheme = function (credibility, hasFakeNews) {
    if (hasFakeNews) {
      // Thème Rouge / Rose Fluo (Scandale/Fake News)
      this.targetColor = { r: 1.0, g: 0.15, b: 0.35 };
    } else if (credibility >= 75) {
      // Thème Cyan (Stable, crédible)
      this.targetColor = { r: 0.1, g: 0.75, b: 0.85 };
    } else if (credibility < 35) {
      // Thème Orange
      this.targetColor = { r: 0.95, g: 0.45, b: 0.1 };
    } else {
      // Thème Par défaut (Belgogram Rose/Violet)
      this.targetColor = { r: 0.9, g: 0.25, b: 0.7 };
    }
  };

  /* ── Resize et Event listener ── */
  BelNews3D.prototype.setSize = function () {
    const container = document.querySelector(this.containerId);
    if (!container || !this.renderer) return;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  };

  BelNews3D.prototype.handleResize = function () {
    const container = document.querySelector(this.containerId);
    if (!container || !this.camera || !this.renderer) return;
    
    this.setSize();
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
  };

  BelNews3D.prototype._onMouseMove = function (e) {
    const container = document.querySelector(this.containerId);
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
  };

  BelNews3D.prototype._onCanvasClick = function () {
    this.triggerNetworkPulse(3);
  };

  // Objet de secours pour éviter les erreurs en cas de chargement Three.js en retard
  function Vector2Dummy() { this.x = 0; this.y = 0; }

  // Initialisation et exposition globale
  window.BelNews3D = new BelNews3D();
  
  // Attendre le chargement complet pour initialiser
  window.addEventListener("load", () => {
    // Un délai pour s'assurer que Three.js est bien chargé
    setTimeout(() => {
      if (window.THREE) {
        window.BelNews3D._init();
      } else {
        console.error("Three.js n'a pas pu être chargé via le CDN.");
      }
    }, 100);
  });
})();