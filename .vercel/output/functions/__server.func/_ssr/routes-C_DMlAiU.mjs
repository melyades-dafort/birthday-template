import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as require_lz_string } from "../_libs/lz-string.mjs";
import { n as memories, t as birthdayConfig } from "./memories-Bd6OCkB1.mjs";
import { a as CanvasTexture, c as SRGBColorSpace, i as useThree, n as Canvas, o as Color, r as useFrame, s as MathUtils, t as useGLTF } from "../_libs/@react-three/drei+[...].mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { n as Volume2, r as Sparkles, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C_DMlAiU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lz_string = /* @__PURE__ */ __toESM(require_lz_string());
function CakeModel() {
	const gltf = useGLTF("/models/strawberry_cake.glb");
	const clonedScene = (0, import_react.useMemo)(() => {
		const clone = gltf.scene.clone();
		console.log("=== Cake Model Meshes ===");
		clone.traverse((child) => {
			if (child.isMesh) console.log("Mesh name:", child.name, "Material:", child.material?.name);
		});
		clone.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
				if (child.material) {
					child.material = child.material.clone();
					const meshName = child.name.toLowerCase();
					const materialName = child.material.name?.toLowerCase() || "";
					if (!(meshName.includes("strawberry") || meshName.includes("red_strawberry") || meshName.includes("cupcake") || materialName.includes("strawberry") || materialName.includes("red"))) child.material.color = new Color("#FFC0D9");
					child.material.needsUpdate = true;
				}
			}
		});
		return clone;
	}, [gltf.scene]);
	console.log("GLB loaded:", gltf);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
		object: clonedScene,
		scale: 50,
		position: [
			0,
			-.8,
			0
		],
		rotation: [
			.3,
			0,
			0
		]
	});
}
function BirthdayCake({ litCandles, flicker = 1, hover = 0 }) {
	const group = (0, import_react.useRef)(null);
	useFrame((state) => {
		if (!group.current) return;
		const t = state.clock.elapsedTime;
		group.current.rotation.y = t * .08;
		group.current.position.y = Math.sin(t * .9) * .08 - .4;
		group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, hover * .15, .05);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: group,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CakeModel, {})
	});
}
useGLTF.preload("/models/strawberry_cake.glb");
function PhotoCard({ memory, reveal, focusMode, explored, onClick }) {
	const group = (0, import_react.useRef)(null);
	const inner = (0, import_react.useRef)(null);
	const [hovered, setHovered] = (0, import_react.useState)(false);
	const [texture, setTexture] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const imageUrl = memory.image;
		console.log("Loading image:", imageUrl, "for memory", memory.id);
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			if (!mounted) return;
			console.log("Image loaded successfully:", imageUrl);
			const canvas = document.createElement("canvas");
			canvas.width = 800;
			canvas.height = 1e3;
			const ctx = canvas.getContext("2d", { willReadFrequently: false });
			if (ctx) {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				const canvasTexture = new CanvasTexture(canvas);
				canvasTexture.colorSpace = SRGBColorSpace;
				canvasTexture.needsUpdate = true;
				if (mounted) {
					console.log("Texture created for memory", memory.id);
					setTexture(canvasTexture);
				}
			}
		};
		img.onerror = (error) => {
			console.error("Could not load texture for memory", memory.id, imageUrl, error);
		};
		img.src = imageUrl;
		return () => {
			mounted = false;
			if (texture) texture.dispose();
		};
	}, [memory.image]);
	useFrame((state) => {
		if (!group.current || !inner.current) return;
		const t = state.clock.elapsedTime;
		const [tx, ty, tz] = memory.position;
		const ox = MathUtils.lerp(0, tx, reveal);
		const oy = MathUtils.lerp(.3, ty, reveal);
		const oz = MathUtils.lerp(0, tz, reveal);
		const bob = Math.sin(t * memory.floatSpeed + memory.id) * memory.floatIntensity * reveal;
		group.current.position.x = ox;
		group.current.position.y = oy + bob;
		group.current.position.z = oz;
		const [rx, ry, rz] = memory.rotation;
		const targetRx = MathUtils.lerp(rx, 0, hovered ? .7 : 0);
		const targetRy = MathUtils.lerp(ry, 0, hovered ? .7 : 0);
		inner.current.rotation.x = MathUtils.lerp(inner.current.rotation.x, targetRx * reveal, .1);
		inner.current.rotation.y = MathUtils.lerp(inner.current.rotation.y, targetRy * reveal, .1);
		inner.current.rotation.z = MathUtils.lerp(inner.current.rotation.z, rz * reveal, .1);
		const baseScale = memory.scale * reveal;
		const targetScale = focusMode === "dimmed" ? baseScale * .85 : hovered ? baseScale * 1.15 : baseScale;
		const s = MathUtils.lerp(inner.current.scale.x, targetScale, .12);
		inner.current.scale.set(s, s, s);
	});
	const opacity = focusMode === "dimmed" ? .25 : 1;
	const zOffset = focusMode === "dimmed" ? -3 : 0;
	const handleClick = (e) => {
		e.stopPropagation();
		onClick(memory.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: group,
		"position-z": zOffset,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: inner,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						0,
						-.02
					],
					onClick: handleClick,
					onPointerOver: (e) => {
						e.stopPropagation();
						setHovered(true);
						document.body.style.cursor = "pointer";
					},
					onPointerOut: () => {
						setHovered(false);
						document.body.style.cursor = "";
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.2,
						1.5,
						.04
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#FFFDFB",
						roughness: .9,
						transparent: true,
						opacity
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					onClick: handleClick,
					onPointerOver: (e) => {
						e.stopPropagation();
						setHovered(true);
						document.body.style.cursor = "pointer";
					},
					onPointerOut: () => {
						setHovered(false);
						document.body.style.cursor = "";
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.2, 1.5] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#FFF8F0",
						roughness: .7,
						transparent: true,
						opacity
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.05,
						.02
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.02, 1.24] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
						map: texture,
						color: texture ? "#ffffff" : "#FFD1E1",
						transparent: true,
						opacity,
						toneMapped: false
					}, texture ? "with-texture" : "no-texture")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.5,
						.65,
						.05
					],
					visible: explored,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.07, 16] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
						color: "#C8A96B",
						transparent: true,
						opacity
					})]
				}),
				!explored && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					position: [
						0,
						0,
						.3
					],
					color: "#FFD1E1",
					intensity: .3,
					distance: 2
				})
			]
		})
	});
}
function MemoryPhoto3D(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoCard, { ...props });
}
function FloatingParticles() {
	const particlesRef = (0, import_react.useRef)(null);
	const particles = (0, import_react.useMemo)(() => {
		const count = 50;
		const positions = new Float32Array(count * 3);
		const velocities = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			positions[i * 3] = (Math.random() - .5) * 20;
			positions[i * 3 + 1] = (Math.random() - .5) * 15;
			positions[i * 3 + 2] = (Math.random() - .5) * 10;
			velocities[i * 3] = (Math.random() - .5) * .02;
			velocities[i * 3 + 1] = Math.random() * .01 + .01;
			velocities[i * 3 + 2] = (Math.random() - .5) * .02;
		}
		return {
			positions,
			velocities,
			count
		};
	}, []);
	useFrame(() => {
		if (!particlesRef.current) return;
		const positions = particlesRef.current.geometry.attributes.position.array;
		for (let i = 0; i < particles.count; i++) {
			positions[i * 3] += particles.velocities[i * 3];
			positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
			positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
			if (positions[i * 3 + 1] > 8) positions[i * 3 + 1] = -8;
			if (Math.abs(positions[i * 3]) > 10) positions[i * 3] *= -.5;
			if (Math.abs(positions[i * 3 + 2]) > 8) positions[i * 3 + 2] *= -.5;
		}
		particlesRef.current.geometry.attributes.position.needsUpdate = true;
		particlesRef.current.rotation.y += 2e-4;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("points", {
		ref: particlesRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("bufferGeometry", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("bufferAttribute", {
			attach: "attributes-position",
			count: particles.count,
			array: particles.positions,
			itemSize: 3
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
			size: .08,
			color: "#FFB5D8",
			transparent: true,
			opacity: .6,
			sizeAttenuation: true,
			blending: 2
		})]
	});
}
function encodeDataForURL(data) {
	return import_lz_string.default.compressToBase64(JSON.stringify(data));
}
function decodeDataFromURL(encoded) {
	try {
		const json = import_lz_string.default.decompressFromBase64(encoded);
		if (json) return JSON.parse(json);
		const json2 = import_lz_string.default.decompressFromEncodedURIComponent(encoded);
		if (json2) return JSON.parse(json2);
		return null;
	} catch {
		return null;
	}
}
var STATIC_INTRO = {
	message: "A little birthday surprise is waiting for you 🎀",
	subtitle: "Ready to open your gift?"
};
function useBirthdayData() {
	const [data, setData] = (0, import_react.useState)({
		celebrantName: birthdayConfig.celebrantName,
		backgroundMusic: void 0,
		memories: memories.map((m) => ({
			id: m.id,
			image: m.image,
			title: m.title,
			message: m.message
		})),
		finalMessage: birthdayConfig.finalMessage
	});
	(0, import_react.useEffect)(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const compressedData = urlParams.get("d");
		const oldData = urlParams.get("data");
		if (compressedData) {
			const decoded = decodeDataFromURL(decodeURIComponent(compressedData));
			if (decoded) {
				setData(decoded);
				return;
			}
		}
		if (oldData) try {
			const json = decodeURIComponent(atob(oldData));
			const parsed = JSON.parse(json);
			setData(parsed);
			return;
		} catch {}
		const saved = localStorage.getItem("birthdayData");
		if (saved) try {
			const parsed = JSON.parse(saved);
			if (parsed.memories && parsed.memories.length > 0) {
				const firstMemory = parsed.memories[0];
				if (firstMemory.caption !== void 0 && firstMemory.title === void 0) {
					console.log("Migrating old birthday data structure...");
					const migratedMemories = memories.map((defaultMem, index) => {
						const oldMem = parsed.memories[index];
						return {
							id: defaultMem.id,
							image: oldMem?.image || defaultMem.image,
							title: defaultMem.title,
							message: defaultMem.message
						};
					});
					setData({
						celebrantName: parsed.celebrantName || birthdayConfig.celebrantName,
						memories: migratedMemories,
						finalMessage: parsed.finalMessage || birthdayConfig.finalMessage
					});
					return;
				}
			}
			setData(parsed);
		} catch (error) {
			console.error("Failed to parse birthday data:", error);
		}
	}, []);
	const fullMemories = memories.map((defaultMemory) => {
		const customMemory = data.memories.find((m) => m.id === defaultMemory.id);
		if (customMemory) {
			const title = customMemory.title || defaultMemory.title;
			const message = customMemory.message || defaultMemory.message;
			return {
				...defaultMemory,
				image: customMemory.image,
				title,
				message,
				shortTitle: title.split(" ").slice(0, 2).join(" ")
			};
		}
		return defaultMemory;
	});
	return {
		celebrantName: data.celebrantName,
		introMessage: STATIC_INTRO.message,
		introSubtitle: STATIC_INTRO.subtitle,
		memories: fullMemories,
		finalMessage: data.finalMessage,
		backgroundMusic: data.backgroundMusic || "/audio/birthday-ambient.mp3",
		generateShareableLink: () => {
			const encoded = encodeDataForURL(data);
			return `${window.location.origin}/?data=${encoded}`;
		}
	};
}
var state = {
	phase: "intro",
	selectedId: null,
	explored: /* @__PURE__ */ new Set(),
	muted: true,
	scroll: 0
};
var listeners = /* @__PURE__ */ new Set();
var notify = () => listeners.forEach((l) => l());
var actions = {
	setPhase: (p) => {
		state = {
			...state,
			phase: p
		};
		notify();
	},
	setScroll: (n) => {
		if (state.scroll === n) return;
		state = {
			...state,
			scroll: n
		};
		notify();
	},
	selectMemory: (id) => {
		state = {
			...state,
			selectedId: id
		};
		notify();
	},
	markExplored: (id) => {
		if (state.explored.has(id)) return;
		const next = new Set(state.explored);
		next.add(id);
		state = {
			...state,
			explored: next
		};
		notify();
	},
	toggleMute: () => {
		state = {
			...state,
			muted: !state.muted
		};
		notify();
	},
	reset: () => {
		state = {
			phase: "intro",
			selectedId: null,
			explored: /* @__PURE__ */ new Set(),
			muted: state.muted,
			scroll: 0
		};
		notify();
	}
};
function getExperience() {
	return state;
}
function subscribeExperience(cb) {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
}
function useExperience() {
	const [snap, setSnap] = (0, import_react.useState)(state);
	(0, import_react.useEffect)(() => subscribeExperience(() => setSnap(state)), []);
	return {
		...snap,
		...actions
	};
}
var experienceActions = actions;
function Rig() {
	const { camera, size } = useThree();
	const target = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		const onMove = (e) => {
			target.current.x = (e.clientX / size.width - .5) * 2;
			target.current.y = (e.clientY / size.height - .5) * 2;
		};
		window.addEventListener("pointermove", onMove);
		return () => window.removeEventListener("pointermove", onMove);
	}, [size]);
	useFrame(() => {
		camera.position.x = MathUtils.lerp(camera.position.x, target.current.x * .4, .05);
		camera.position.y = MathUtils.lerp(camera.position.y, -target.current.y * .25 + .2, .05);
		camera.lookAt(0, .3, 0);
	});
	return null;
}
function CakeGroup({ phase, scroll }) {
	const group = (0, import_react.useRef)(null);
	useFrame(() => {
		if (!group.current) return;
		const heroX = 1.6;
		const memX = 0;
		const s = phase === "intro" || phase === "hero" ? scroll : 1;
		const x = MathUtils.lerp(heroX, memX, s);
		const scale = MathUtils.lerp(.9, 1.05, s);
		group.current.position.x = MathUtils.lerp(group.current.position.x, x, .08);
		group.current.scale.setScalar(MathUtils.lerp(group.current.scale.x, scale, .08));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: group,
		position: [
			1.6,
			0,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirthdayCake, {
			litCandles: phase === "finalIntro" || phase === "wish",
			flicker: 1
		})
	});
}
function MemoriesGroup({ phase, scroll, selectedId, explored }) {
	const { memories } = useBirthdayData();
	const dragGroup = (0, import_react.useRef)(null);
	const dragging = (0, import_react.useRef)(false);
	const last = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const velocity = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const rotation = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		const el = document.querySelector("canvas.experience-canvas");
		if (!el) return;
		const down = (e) => {
			if (getExperience().phase !== "memories") return;
			dragging.current = true;
			last.current = {
				x: e.clientX,
				y: e.clientY
			};
		};
		const move = (e) => {
			if (!dragging.current) return;
			const dx = e.clientX - last.current.x;
			const dy = e.clientY - last.current.y;
			velocity.current.x = dx * .005;
			velocity.current.y = dy * .003;
			last.current = {
				x: e.clientX,
				y: e.clientY
			};
		};
		const up = () => dragging.current = false;
		el.addEventListener("pointerdown", down);
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		return () => {
			el.removeEventListener("pointerdown", down);
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
		};
	}, []);
	useFrame((state) => {
		if (!dragGroup.current) return;
		const maxYRotation = Math.PI / 4;
		if (getExperience().phase === "memories" && !dragging.current) {
			const time = state.clock.elapsedTime;
			rotation.current.y = Math.sin(time * .2) * (maxYRotation * .8);
		} else rotation.current.y = MathUtils.clamp(rotation.current.y + velocity.current.x, -maxYRotation, maxYRotation);
		rotation.current.x = MathUtils.clamp(rotation.current.x + velocity.current.y, -.35, .35);
		velocity.current.x *= .92;
		velocity.current.y *= .92;
		dragGroup.current.rotation.y = MathUtils.lerp(dragGroup.current.rotation.y, rotation.current.y, .15);
		dragGroup.current.rotation.x = MathUtils.lerp(dragGroup.current.rotation.x, rotation.current.x, .15);
	});
	const reveal = phase === "intro" || phase === "hero" ? MathUtils.clamp(scroll, 0, 1) : 1;
	const handleClick = (id) => {
		if (getExperience().phase !== "memories") return;
		experienceActions.markExplored(id);
		experienceActions.selectMemory(id);
		experienceActions.setPhase("memoryFocus");
		setTimeout(() => experienceActions.setPhase("scrapbook"), 900);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: dragGroup,
		children: memories.map((m) => {
			const isSelected = selectedId === m.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryPhoto3D, {
				memory: m,
				reveal,
				focusMode: phase === "memoryFocus" || phase === "scrapbook" ? isSelected ? "selected" : "dimmed" : "idle",
				explored: explored.has(m.id),
				onClick: handleClick
			}, m.id);
		})
	});
}
function Environment3D({ phase }) {
	const bgRef = (0, import_react.useRef)(null);
	const flowersRef = (0, import_react.useRef)(null);
	const [texture, setTexture] = (0, import_react.useState)(null);
	const [flowersTexture, setFlowersTexture] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.drawImage(img, 0, 0);
				const canvasTexture = new CanvasTexture(canvas);
				canvasTexture.colorSpace = SRGBColorSpace;
				canvasTexture.needsUpdate = true;
				setTexture(canvasTexture);
			}
		};
		img.onerror = (error) => {
			console.error("Failed to load background3.jpg:", error);
		};
		img.src = "/background3.jpg";
	}, []);
	(0, import_react.useEffect)(() => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.drawImage(img, 0, 0);
				const canvasTexture = new CanvasTexture(canvas);
				canvasTexture.colorSpace = SRGBColorSpace;
				canvasTexture.needsUpdate = true;
				setFlowersTexture(canvasTexture);
			}
		};
		img.onerror = (error) => {
			console.error("Failed to load background-flowers.png:", error);
		};
		img.src = "/background-flowers.png";
	}, []);
	useFrame(() => {
		if (!bgRef.current || !flowersRef.current || !texture || !flowersTexture) return;
		const bgMat = bgRef.current.material;
		const flowersMat = flowersRef.current.material;
		const useFlowers = phase === "memories" || phase === "memoryFocus" || phase === "scrapbook";
		const bgTargetOpacity = useFlowers ? 0 : 1;
		const flowersTargetOpacity = useFlowers ? 1 : 0;
		bgMat.opacity = MathUtils.lerp(bgMat.opacity, bgTargetOpacity, .05);
		flowersMat.opacity = MathUtils.lerp(flowersMat.opacity, flowersTargetOpacity, .05);
		if (phase === "intro" || phase === "hero" || phase === "memories" || phase === "memoryFocus") {
			bgMat.color.lerp(new Color("#ffffff"), .05);
			flowersMat.color.lerp(new Color("#ffffff"), .05);
		} else {
			const targetOpacity = phase === "wish" || phase === "finalIntro" ? .3 : phase === "scrapbook" ? .6 : .7;
			if (bgMat.opacity > .1) bgMat.opacity = MathUtils.lerp(bgMat.opacity, Math.min(bgTargetOpacity, targetOpacity), .05);
			if (flowersMat.opacity > .1) flowersMat.opacity = MathUtils.lerp(flowersMat.opacity, Math.min(flowersTargetOpacity, targetOpacity), .05);
			const target = new Color(phase === "wish" || phase === "finalIntro" ? "#4a2f3e" : phase === "scrapbook" ? "#f5e6d3" : "#ffe6ef");
			bgMat.color.lerp(target, .03);
			flowersMat.color.lerp(target, .03);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: bgRef,
		position: [
			0,
			0,
			-15
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [60, 40] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			map: texture,
			color: "#ffffff",
			transparent: true,
			opacity: 1,
			toneMapped: false,
			side: 0
		}, texture ? "with-bg" : "no-bg")]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: flowersRef,
		position: [
			0,
			0,
			-14.9
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [60, 40] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			map: flowersTexture,
			color: "#ffffff",
			transparent: true,
			opacity: 0,
			toneMapped: false,
			side: 0
		}, flowersTexture ? "with-flowers" : "no-flowers")]
	})] });
}
function Scene3D(props) {
	const { memories } = useBirthdayData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		className: "experience-canvas",
		camera: {
			position: [
				0,
				.4,
				8
			],
			fov: 50
		},
		dpr: [1, 2],
		gl: {
			antialias: true,
			alpha: false
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
				fallback: null,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment3D, { phase: props.phase }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingParticles, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CakeGroup, {
						phase: props.phase,
						scroll: props.scroll
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoriesGroup, { ...props })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .7 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					3,
					5,
					3
				],
				intensity: 1,
				castShadow: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				position: [
					-3,
					2,
					2
				],
				color: "#FFB5D8",
				intensity: .8
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				position: [
					3,
					-2,
					3
				],
				color: "#FFD1E1",
				intensity: .6
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				position: [
					0,
					4,
					0
				],
				color: "#FFF8F0",
				intensity: .4
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rig, {})
		]
	});
}
function GiftIntro({ onOpen }) {
	const { phase } = useExperience();
	const { celebrantName, introMessage, introSubtitle } = useBirthdayData();
	if (phase !== "intro") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: { opacity: 1 },
		exit: { opacity: 0 },
		className: "fixed inset-0 z-40 flex items-center justify-center px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 backdrop-blur-2xl bg-gradient-blush/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: {
				scale: .92,
				opacity: 0,
				y: 20
			},
			animate: {
				scale: 1,
				opacity: 1,
				y: 0
			},
			transition: {
				duration: 1,
				ease: [
					.2,
					.9,
					.3,
					1
				]
			},
			className: "relative max-w-lg text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-cream/40 bg-cream/30 px-10 py-12 backdrop-blur-xl shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 font-hand text-2xl text-berry/70",
						children: ["for ", celebrantName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl leading-tight text-berry sm:text-4xl",
						children: introMessage
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 font-serif italic text-berry/80 sm:text-lg",
						children: introSubtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onOpen,
							className: "group relative overflow-hidden rounded-full bg-rose px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream shadow-soft transition-transform hover:scale-[1.03]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "relative z-10",
								children: "Open My Gift"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 -z-0 bg-gradient-to-r from-rose via-blush to-rose opacity-0 transition-opacity group-hover:opacity-100" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-full px-6 py-3 font-sans text-sm text-berry/70 transition hover:text-berry",
							children: "Not yet"
						})]
					})
				]
			})
		})]
	});
}
function HeroOverlay() {
	const { phase, scroll } = useExperience();
	const { celebrantName } = useBirthdayData();
	const showHero = phase === "hero";
	const t = showHero ? 1 - scroll : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 z-20 overflow-hidden",
		"aria-hidden": !showHero,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute -left-24 -top-24 h-[70vh] w-[70vh] rounded-full bg-gradient-blush blur-3xl",
				animate: {
					x: [
						0,
						30,
						0
					],
					y: [
						0,
						40,
						0
					]
				},
				transition: {
					duration: 22,
					repeat: Infinity,
					ease: "easeInOut"
				},
				style: { opacity: .7 * t + .2 }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute -bottom-32 -right-20 h-[80vh] w-[80vh] rounded-full bg-gradient-dream blur-3xl",
				animate: {
					x: [
						0,
						-40,
						0
					],
					y: [
						0,
						-30,
						0
					]
				},
				transition: {
					duration: 26,
					repeat: Infinity,
					ease: "easeInOut"
				},
				style: { opacity: .6 * t + .15 }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute left-1/3 top-1/2 h-[40vh] w-[40vh] rounded-full bg-pastel blur-3xl",
				animate: { scale: [
					1,
					1.15,
					1
				] },
				transition: {
					duration: 14,
					repeat: Infinity,
					ease: "easeInOut"
				},
				style: { opacity: .4 * t }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-full w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
						className: "absolute left-4 top-[8vh] font-serif text-[22vw] font-light leading-[0.85] tracking-tight text-berry sm:left-10 sm:text-[16vw]",
						style: {
							opacity: t,
							transform: `translateX(${-scroll * 40}vw)`
						},
						children: "Happy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
						className: "absolute right-4 top-[26vh] font-serif text-[22vw] font-light leading-[0.85] tracking-tight text-rose sm:right-10 sm:top-[22vh] sm:text-[16vw]",
						style: {
							opacity: t,
							transform: `translateX(${scroll * 40}vw)`
						},
						children: "Birthday"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
						className: "absolute bottom-[18vh] left-6 font-serif italic text-[14vw] font-normal leading-none text-berry/90 sm:bottom-[14vh] sm:left-16 sm:text-[10vw]",
						style: {
							opacity: t,
							transform: `translateY(${scroll * 40}vh) scale(${1 - scroll * .4})`
						},
						children: celebrantName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						className: "absolute bottom-[10vh] right-6 max-w-xs text-right font-serif text-sm italic text-berry/70 sm:right-16 sm:text-base",
						style: { opacity: t },
						children: birthdayConfig.openingMessage
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						className: "absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-berry/60",
						animate: { y: [
							0,
							8,
							0
						] },
						transition: {
							duration: 2.2,
							repeat: Infinity,
							ease: "easeInOut"
						},
						style: { opacity: t },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-lg",
							children: "Scroll to unwrap your memories"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							children: "↓"
						})]
					})
				]
			})
		]
	});
}
/** DOM image with elegant blush placeholder fallback */
function MemoryImage({ src, alt, className }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	if (failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full w-full items-center justify-center bg-gradient-blush " + (className ?? ""),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center text-berry/70",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-2 h-8 w-8 rounded-full bg-cream/70 leading-8",
				children: "♡"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-hand text-lg",
				children: "Your Memory Here"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		draggable: false,
		onError: () => setFailed(true),
		className: "h-full w-full object-cover " + (className ?? "")
	});
}
function Scrapbook() {
	const { phase, selectedId, setPhase, selectMemory, explored, markExplored } = useExperience();
	const { memories } = useBirthdayData();
	const [turning, setTurning] = (0, import_react.useState)("idle");
	const [displayId, setDisplayId] = (0, import_react.useState)(selectedId);
	const open = phase === "scrapbook";
	if (open && displayId !== selectedId && turning === "idle") setDisplayId(selectedId);
	const idx = memories.findIndex((m) => m.id === displayId);
	const memory = idx >= 0 ? memories[idx] : null;
	const go = (dir) => {
		if (turning !== "idle" || idx < 0) return;
		const nextIdx = (idx + (dir === "next" ? 1 : -1) + memories.length) % memories.length;
		setTurning(dir);
		setTimeout(() => {
			const nextMemory = memories[nextIdx];
			setDisplayId(nextMemory.id);
			selectMemory(nextMemory.id);
			markExplored(nextMemory.id);
		}, 450);
		setTimeout(() => setTurning("idle"), 900);
	};
	const close = () => {
		setPhase("memories");
		setTimeout(() => selectMemory(null), 800);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && memory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .6 },
		className: "fixed inset-0 z-30 flex items-center justify-center px-4 py-10 sm:px-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.98_0.02_75)_0%,oklch(0.9_0.05_60)_70%,oklch(0.75_0.09_40)_100%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				scale: .6,
				rotateX: 40,
				opacity: 0
			},
			animate: {
				scale: 1,
				rotateX: 0,
				opacity: 1
			},
			exit: {
				scale: .7,
				opacity: 0
			},
			transition: {
				duration: .9,
				ease: [
					.2,
					.9,
					.3,
					1
				]
			},
			className: "book-perspective relative w-full max-w-5xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "book-3d relative mx-auto grid aspect-[3/2] w-full grid-cols-1 overflow-hidden rounded-2xl shadow-paper md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-1/2 hidden w-3 -translate-x-1/2 bg-gradient-to-r from-[oklch(0.7_0.06_40)] via-[oklch(0.55_0.08_35)] to-[oklch(0.7_0.06_40)] md:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "paper-texture relative flex items-center justify-center overflow-hidden p-6 sm:p-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "wait",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagePhoto, {
									memoryId: memory.id,
									src: memory.image,
									title: memory.title
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "paper-texture relative overflow-hidden p-6 sm:p-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "wait",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageMessage, {
									index: idx,
									total: memories.length,
									title: memory.title,
									message: memory.message,
									date: memory.date
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: turning !== "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { rotateY: turning === "next" ? 0 : -180 },
								animate: { rotateY: turning === "next" ? -180 : 0 },
								exit: { opacity: 0 },
								transition: {
									duration: .9,
									ease: [
										.6,
										.05,
										.3,
										1
									]
								},
								className: "page-turn absolute inset-0 bg-cream shadow-paper",
								style: { transformOrigin: turning === "next" ? "left center" : "right center" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "paper-texture h-full w-full" })
							}, turning) })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center justify-between gap-4 text-berry",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: close,
						className: "rounded-full border border-berry/30 px-5 py-2 font-sans text-sm transition hover:bg-berry hover:text-cream",
						children: "← Back to memories"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 font-serif italic text-berry/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => go("prev"),
								disabled: turning !== "idle",
								className: "px-3 py-1 disabled:opacity-40",
								children: "‹ previous"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm",
								children: [
									String(idx + 1).padStart(2, "0"),
									" / ",
									String(memories.length).padStart(2, "0")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => go("next"),
								disabled: turning !== "idle",
								className: "px-3 py-1 disabled:opacity-40",
								children: "next ›"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 text-center font-hand text-berry/60",
					children: [
						explored.size,
						" of ",
						memories.length,
						" memories opened · from ",
						birthdayConfig.senderName
					]
				})
			]
		})]
	}) });
}
function PagePhoto({ memoryId, src, title }) {
	const tilt = memoryId % 2 === 0 ? -3 : 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			scale: .9,
			y: 20,
			rotate: tilt
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0,
			rotate: tilt
		},
		exit: {
			opacity: 0,
			scale: .9,
			y: -20,
			rotate: tilt
		},
		transition: {
			duration: .6,
			ease: [
				.4,
				0,
				.2,
				1
			]
		},
		className: "relative aspect-[3/4] w-4/5 max-w-sm rounded-sm bg-cream p-3 pb-14 shadow-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-4deg] rounded-sm bg-blush/60 opacity-80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-full w-full overflow-hidden bg-pastel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryImage, {
					src,
					alt: title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-3 left-0 right-0 text-center font-hand text-lg text-berry",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-rose text-cream shadow-soft",
				children: "♡"
			})
		]
	}, memoryId);
}
function PageMessage({ index, total, title, message, date }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			x: 30
		},
		animate: {
			opacity: 1,
			x: 0
		},
		exit: {
			opacity: 0,
			x: -30
		},
		transition: {
			duration: .6,
			ease: [
				.4,
				0,
				.2,
				1
			]
		},
		className: "relative flex h-full flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-sans text-xs uppercase tracking-[0.3em] text-berry/50",
				children: [
					"Memory ",
					String(index + 1).padStart(2, "0"),
					" / ",
					String(total).padStart(2, "0")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-3xl leading-tight text-berry sm:text-4xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-serif text-base leading-relaxed text-berry/85 sm:text-lg",
					children: message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-hand text-xl text-rose",
					children: "Keep this memory close. ♡"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-hand text-lg text-berry/60",
					children: date
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					width: "42",
					height: "42",
					viewBox: "0 0 42 42",
					className: "text-gold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M21 4l4 12h12l-10 7 4 12-10-7-10 7 4-12L5 16h12z",
						fill: "currentColor",
						opacity: "0.6"
					})
				})]
			})
		]
	}, index);
}
var WISH_LINES = [
	"Before this day ends...",
	"Close your eyes.",
	"Think of your biggest dream.",
	"And make a wish. ✨"
];
function WishScene() {
	const { phase, setPhase } = useExperience();
	const { celebrantName } = useBirthdayData();
	const [line, setLine] = (0, import_react.useState)(0);
	const [wished, setWished] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (phase !== "finalIntro" && phase !== "wish") return;
		if (phase === "finalIntro") {
			setLine(0);
			setWished(false);
			const t1 = setTimeout(() => setLine(1), 2200);
			const t2 = setTimeout(() => setLine(2), 4400);
			const t3 = setTimeout(() => setLine(3), 6600);
			const t4 = setTimeout(() => setPhase("wish"), 9e3);
			return () => [
				t1,
				t2,
				t3,
				t4
			].forEach(clearTimeout);
		}
	}, [phase, setPhase]);
	const makeWish = () => {
		if (wished) return;
		setWished(true);
		setTimeout(() => setPhase("celebration"), 2200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: (phase === "finalIntro" || phase === "wish") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 1.2 },
		className: "fixed inset-0 z-30 flex items-end justify-center pb-24 sm:pb-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-wish" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
					mode: "wait",
					children: [
						phase === "finalIntro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								y: -20
							},
							transition: { duration: 1 },
							className: "font-serif text-2xl italic text-cream/90 sm:text-4xl",
							children: WISH_LINES[line]
						}, line),
						phase === "wish" && !wished && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
							initial: {
								opacity: 0,
								scale: .8
							},
							animate: {
								opacity: 1,
								scale: 1
							},
							exit: { opacity: 0 },
							onClick: makeWish,
							className: "rounded-full bg-cream px-10 py-4 font-serif text-lg tracking-[0.3em] text-berry shadow-soft transition hover:scale-105",
							children: "MAKE A WISH"
						}, "wish-btn"),
						phase === "wish" && wished && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							className: "font-hand text-3xl text-cream/90",
							children: "🌬️  ..."
						}, "blowing")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 font-hand text-cream/60",
					children: ["for ", celebrantName]
				})]
			})
		]
	}) });
}
function TypingText({ text, delay = 0 }) {
	const [displayedText, setDisplayedText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let timeout;
		let currentIndex = 0;
		const startTyping = () => {
			if (currentIndex < text.length) {
				setDisplayedText(text.slice(0, currentIndex + 1));
				currentIndex++;
				timeout = setTimeout(startTyping, 30);
			}
		};
		timeout = setTimeout(startTyping, delay);
		return () => clearTimeout(timeout);
	}, [text, delay]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: displayedText });
}
function Confetti() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		children: (0, import_react.useMemo)(() => Array.from({ length: 60 }).map((_, i) => ({
			id: i,
			left: Math.random() * 100,
			delay: Math.random() * 2,
			duration: 4 + Math.random() * 4,
			color: [
				"#F7A8C4",
				"#E875A5",
				"#FFF8F0",
				"#C8A96B",
				"#FFD1E1"
			][i % 5],
			size: 6 + Math.random() * 8,
			rotate: Math.random() * 360
		})), []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
			initial: {
				y: "-10vh",
				rotate: p.rotate,
				opacity: 0
			},
			animate: {
				y: "110vh",
				rotate: p.rotate + 720,
				opacity: [
					0,
					1,
					1,
					0
				]
			},
			transition: {
				duration: p.duration,
				delay: p.delay,
				repeat: Infinity,
				ease: "linear"
			},
			className: "absolute block rounded-sm",
			style: {
				left: `${p.left}%`,
				width: p.size,
				height: p.size * .4,
				background: p.color
			}
		}, p.id))
	});
}
function Celebration() {
	const { phase, setPhase, selectMemory } = useExperience();
	const { celebrantName, finalMessage } = useBirthdayData();
	if (phase !== "celebration") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		transition: { duration: 1.4 },
		className: "pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-celebrate" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto relative max-w-3xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: 1 },
						className: "font-sans text-xs uppercase tracking-[0.5em] text-berry/60",
						children: birthdayConfig.senderName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
						initial: {
							opacity: 0,
							scale: .9
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						transition: {
							duration: 1.2,
							delay: .3
						},
						className: "mt-4 font-serif text-[14vw] leading-[0.9] text-berry sm:text-8xl",
						children: "Happy Birthday"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h2, {
						initial: {
							opacity: 0,
							y: 30
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: 1.4,
							delay: .9
						},
						className: "font-serif italic text-[18vw] leading-none text-rose sm:text-9xl",
						children: celebrantName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							duration: .5,
							delay: 1.5
						},
						className: "mx-auto mt-8 max-w-xl font-serif text-base leading-relaxed text-berry/85 sm:text-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypingText, {
							text: finalMessage,
							delay: 1500
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							duration: 1,
							delay: 2.2
						},
						className: "mt-6 font-hand text-2xl text-rose",
						children: ["With love, ", birthdayConfig.senderName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							duration: 1,
							delay: 2.8
						},
						onClick: () => {
							selectMemory(null);
							setPhase("memories");
						},
						className: "mt-10 rounded-full border border-berry/30 bg-cream/60 px-6 py-3 font-sans text-sm text-berry backdrop-blur transition hover:bg-berry hover:text-cream",
						children: "Relive the memories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							duration: 1,
							delay: 3.2
						},
						className: "mt-4 font-hand text-sm text-berry/60",
						children: "or scroll up to go back to the beginning"
					})
				]
			})
		]
	}) });
}
function MusicToggle({ audioRef }) {
	const { muted, toggleMute } = useExperience();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed right-5 top-5 z-50 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-full border border-berry/20 bg-cream/70 backdrop-blur-md px-4 py-2 max-w-[200px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				animate: { x: [0, -100] },
				transition: {
					duration: 10,
					repeat: Infinity,
					ease: "linear"
				},
				className: "whitespace-nowrap font-serif text-xs italic text-berry/80",
				children: "♪ Kabisado - IV OF SPADES ♪ Kabisado - IV OF SPADES"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => {
				toggleMute();
				const a = audioRef.current;
				if (!a) return;
				if (muted) {
					a.play().catch(() => void 0);
					a.volume = .3;
				} else a.pause();
			},
			className: "flex h-11 w-11 items-center justify-center rounded-full border border-berry/20 bg-cream/70 text-berry backdrop-blur-md transition hover:bg-cream",
			"aria-label": muted ? "Unmute music" : "Mute music",
			children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
		})]
	});
}
function ProgressPill() {
	const { phase, explored, setPhase } = useExperience();
	const canFinal = explored.size >= 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: phase === "memories" && canFinal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: { opacity: 0 },
		onClick: () => setPhase("finalIntro"),
		className: "fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-berry px-5 py-2.5 font-serif text-sm italic text-cream shadow-soft hover:bg-rose",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-gold" }), "One Last Surprise 🎀"]
	}) });
}
function ExplorationHint() {
	const { phase, explored } = useExperience();
	if (phase !== "memories") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed left-1/2 top-6 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-cream/60 px-4 py-1.5 font-serif text-xs italic tracking-wide text-berry/80 backdrop-blur",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "drag to explore" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "opacity-40",
				children: "·"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "click a photo to open" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "opacity-40",
				children: "·"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [explored.size, " / 12 opened"] })
		]
	});
}
function BirthdayExperience() {
	const { phase, setPhase, setScroll, scroll, toggleMute, selectedId, explored } = useExperience();
	const { backgroundMusic } = useBirthdayData();
	const audioRef = (0, import_react.useRef)(null);
	const scrollHostRef = (0, import_react.useRef)(null);
	const openGift = () => {
		const el = document.documentElement;
		if (el.requestFullscreen) el.requestFullscreen().catch(() => void 0);
		setPhase("hero");
		const a = audioRef.current;
		if (a) {
			a.volume = 0;
			a.play().then(() => {
				const target = .3;
				const start = performance.now();
				const fade = (t) => {
					const p = Math.min(1, (t - start) / 2e3);
					a.volume = target * p;
					if (p < 1) requestAnimationFrame(fade);
				};
				requestAnimationFrame(fade);
				toggleMute();
			}).catch(() => {
				console.log("Background music not available - continuing without audio");
			});
		}
	};
	(0, import_react.useEffect)(() => {
		const el = scrollHostRef.current;
		if (!el) return;
		let scrollTimeout;
		const onScroll = () => {
			const max = el.scrollHeight - window.innerHeight;
			const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
			setScroll(p);
			clearTimeout(scrollTimeout);
			if (phase === "hero" && p > .15 && p < .85) scrollTimeout = setTimeout(() => {
				if (p < .5) el.scrollTo({
					top: 0,
					behavior: "smooth"
				});
				else el.scrollTo({
					top: max,
					behavior: "smooth"
				});
			}, 300);
			else if (phase === "memories" && p < .85 && p > .15) scrollTimeout = setTimeout(() => {
				if (p < .5) el.scrollTo({
					top: 0,
					behavior: "smooth"
				});
				else el.scrollTo({
					top: max,
					behavior: "smooth"
				});
			}, 300);
			if (phase === "hero" && p > .85) setPhase("memories");
			else if (phase === "memories" && p < .3) setPhase("hero");
			else if (phase === "celebration" && p < .7) setPhase("memories");
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			el.removeEventListener("scroll", onScroll);
			clearTimeout(scrollTimeout);
		};
	}, [
		phase,
		setScroll,
		setPhase
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape" && phase === "scrapbook") setPhase("memories");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [phase, setPhase]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-[100svh] w-full overflow-hidden bg-warm-white text-berry",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene3D, {
					phase,
					scroll,
					selectedId,
					explored
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroOverlay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplorationHint, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressPill, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrapbook, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishScene, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Celebration, {}),
			(phase === "hero" || phase === "memories" || phase === "celebration" || phase === "scrapbook" || phase === "memoryFocus") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scrollHostRef,
				className: "fixed inset-0 overflow-y-auto",
				style: {
					zIndex: phase === "memories" ? 5 : 20,
					pointerEvents: phase === "scrapbook" || phase === "memoryFocus" ? "none" : "auto"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "260vh" } })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicToggle, { audioRef }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audioRef,
				loop: true,
				preload: "none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
					src: backgroundMusic,
					type: "audio/mpeg"
				})
			}, backgroundMusic),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: phase === "intro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftIntro, { onOpen: openGift }) })
		]
	});
}
function Index() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-[100svh] w-full items-center justify-center bg-gradient-blush",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-serif italic text-berry/70",
			children: "preparing your gift…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirthdayExperience, {});
}
//#endregion
export { Index as component };
