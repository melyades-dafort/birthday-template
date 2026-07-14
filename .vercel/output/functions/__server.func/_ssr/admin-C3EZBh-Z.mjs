import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { t as require_lz_string } from "../_libs/lz-string.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C3EZBh-Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lz_string = /* @__PURE__ */ __toESM(require_lz_string());
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function AdminPage() {
	const [data, setData] = (0, import_react.useState)({
		celebrantName: "Amelia",
		backgroundMusic: void 0,
		memories: [],
		finalMessage: "May this new chapter of your life be filled with beautiful memories, exciting adventures, peaceful days, and dreams slowly becoming reality. Never forget how special you are and how much happiness you bring into the lives of the people around you."
	});
	const [previewImages, setPreviewImages] = (0, import_react.useState)({});
	const [musicPreview, setMusicPreview] = (0, import_react.useState)();
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("birthdayData");
		if (saved) {
			const parsed = JSON.parse(saved);
			setData(parsed);
			const savedPreviews = localStorage.getItem("birthdayPreviews");
			if (savedPreviews) setPreviewImages(JSON.parse(savedPreviews));
			if (parsed.backgroundMusic) setMusicPreview(parsed.backgroundMusic);
		} else import("./memories-Bd6OCkB1.mjs").then((n) => n.r).then(({ memories, birthdayConfig }) => {
			const defaultMemories = memories.map((m) => ({
				id: m.id,
				image: m.image,
				title: m.title,
				message: m.message
			}));
			setData({
				celebrantName: birthdayConfig.celebrantName,
				memories: defaultMemories,
				finalMessage: birthdayConfig.finalMessage
			});
		});
	}, []);
	const handleSave = () => {
		localStorage.setItem("birthdayData", JSON.stringify(data));
		localStorage.setItem("birthdayPreviews", JSON.stringify(previewImages));
		alert("Changes saved successfully! Refresh the main page to see updates.");
	};
	const handleGenerateLink = async () => {
		localStorage.setItem("birthdayData", JSON.stringify(data));
		localStorage.setItem("birthdayPreviews", JSON.stringify(previewImages));
		const compressed = import_lz_string.default.compressToBase64(JSON.stringify(data));
		const baseUrl = window.location.origin;
		try {
			const { createShortUrl, isSupabaseConfigured } = await import("./supabase-CGWz2djZ.mjs");
			if (isSupabaseConfigured()) {
				const result = await createShortUrl(compressed, baseUrl);
				if (result.shortId && !result.fallback) {
					await navigator.clipboard.writeText(result.shortUrl);
					const originalUrl = `${baseUrl}/?data=${encodeURIComponent(JSON.stringify(data))}`;
					const reduction = Math.round((1 - result.shortUrl.length / originalUrl.length) * 100);
					alert(`✅ Super Short Link Copied!\n\n📏 URL reduced by ${reduction}%\n🔗 ${result.shortUrl}\n📊 Only ${result.shortUrl.length} characters!\n\n✨ Works with uploaded photos!\n⏰ Valid for 1 year\n\n📱 Paste and send via:\n• WhatsApp\n• Messenger\n• SMS\n• Email\n\nThe recipient will see your customized birthday greeting!`);
					return;
				}
			}
		} catch (error) {
			console.error("Database shortening failed, using fallback:", error);
		}
		const shareableLink = `${baseUrl}/?d=${encodeURIComponent(compressed)}`;
		try {
			await navigator.clipboard.writeText(shareableLink);
			const originalSize = JSON.stringify(data).length;
			const compressedSize = compressed.length;
			const reduction = Math.round((1 - compressedSize / originalSize) * 100);
			const urlLength = shareableLink.length;
			const urlLengthText = urlLength > 1e3 ? `${Math.round(urlLength / 1e3)}k chars` : `${urlLength} chars`;
			alert(`✅ Link Copied! (Compressed)\n\n📏 Data compressed by ${reduction}%\n📊 URL length: ${urlLengthText}\n\n💡 For super short URLs (95% reduction):\n   Set up Supabase database\n   See SUPABASE-SETUP.md for instructions\n\n📱 Paste and send via:\n• WhatsApp\n• Messenger\n• SMS\n• Email\n\nThe recipient will see your customized birthday greeting!`);
		} catch (error) {
			prompt("Copy this shareable link:", shareableLink);
		}
	};
	const handleImageUpload = (memoryId, file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result;
			setPreviewImages((prev) => ({
				...prev,
				[memoryId]: result
			}));
			setData((prev) => ({
				...prev,
				memories: prev.memories.map((m) => m.id === memoryId ? {
					...m,
					image: result
				} : m)
			}));
		};
		reader.readAsDataURL(file);
	};
	const handleMusicUpload = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result;
			setMusicPreview(result);
			setData((prev) => ({
				...prev,
				backgroundMusic: result
			}));
		};
		reader.readAsDataURL(file);
	};
	const clearCustomMusic = () => {
		setMusicPreview(void 0);
		setData((prev) => ({
			...prev,
			backgroundMusic: void 0
		}));
	};
	const updateMemory = (memoryId, field, value) => {
		setData((prev) => ({
			...prev,
			memories: prev.memories.map((m) => m.id === memoryId ? {
				...m,
				[field]: value
			} : m)
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-serif font-bold text-berry mb-2",
						children: "Birthday Template Admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-600",
						children: "Customize your birthday experience"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "general",
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid w-full grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "general",
									children: "General"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "photos",
									children: "Photos & Captions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "messages",
									children: "Messages"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "general",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Birthday Person's Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Customize who this birthday gift is for" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "name",
												children: "Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "name",
												value: data.celebrantName,
												onChange: (e) => setData((prev) => ({
													...prev,
													celebrantName: e.target.value
												})),
												placeholder: "Enter name",
												className: "text-lg"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-gray-500",
												children: "This appears as \"for [name]\" on the intro screen and throughout the experience"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-4 border-t space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "music",
											children: "Background Music (Optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [musicPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-medium text-green-800",
														children: "Custom music uploaded"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-green-600",
														children: "Your custom audio will play instead of the default"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													onClick: clearCustomMusic,
													variant: "outline",
													size: "sm",
													className: "text-red-600 border-red-200 hover:bg-red-50",
													children: "Remove"
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-blue-50 border border-blue-200 rounded-lg",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-sm text-blue-800",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Default:" }), " Kabisado - IV OF SPADES"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-blue-600 mt-1",
													children: "Upload an MP3 file to use your own music"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "music",
												type: "file",
												accept: "audio/mp3,audio/mpeg",
												onChange: (e) => {
													const file = e.target.files?.[0];
													if (file) handleMusicUpload(file);
												},
												className: "text-sm"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-4 border-t",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium mb-3",
											children: "Intro Screen Preview:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-gradient-to-br from-pink-100 via-purple-100 to-pink-100 p-8 rounded-2xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-pink-200/50 text-center",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm text-pink-600 mb-3",
														children: ["for ", data.celebrantName]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "text-2xl font-serif text-gray-800 mb-3 leading-tight",
														children: "A little birthday surprise is waiting for you 🎀"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-base text-gray-600 italic",
														children: "Ready to open your gift?"
													})
												]
											})
										})]
									})
								]
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "photos",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Memory Photos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Upload photos and add both a title and detailed message for each memory in the scrapbook" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: data.memories.map((memory) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 border rounded-lg p-4 bg-white shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative",
										children: previewImages[memory.id] || memory.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: previewImages[memory.id] || memory.image,
											alt: `Memory ${memory.id}`,
											className: "w-full h-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-full flex items-center justify-center text-gray-400",
											children: "No image"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
													htmlFor: `photo-${memory.id}`,
													className: "text-sm font-semibold",
													children: ["Photo ", memory.id]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: `photo-${memory.id}`,
													type: "file",
													accept: "image/*",
													onChange: (e) => {
														const file = e.target.files?.[0];
														if (file) handleImageUpload(memory.id, file);
													},
													className: "text-sm mt-1"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-amber-600 mt-1",
													children: "⚠️ Uploading files makes URLs very long. For shorter links, use image URLs instead."
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: `url-${memory.id}`,
													className: "text-sm font-semibold",
													children: "Or Paste Image URL (Recommended)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: `url-${memory.id}`,
													type: "url",
													value: memory.image.startsWith("data:") ? "" : memory.image,
													onChange: (e) => {
														const url = e.target.value;
														setData((prev) => ({
															...prev,
															memories: prev.memories.map((m) => m.id === memory.id ? {
																...m,
																image: url
															} : m)
														}));
														if (url) setPreviewImages((prev) => ({
															...prev,
															[memory.id]: url
														}));
													},
													placeholder: "https://i.ibb.co/abc123/photo.jpg",
													className: "text-sm mt-1"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-green-600 mt-1",
													children: "✅ Image URLs keep shareable links short! Use ImgBB, Imgur, or Cloudinary."
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: `title-${memory.id}`,
													className: "text-sm font-semibold",
													children: "Title"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: `title-${memory.id}`,
													value: memory.title,
													onChange: (e) => updateMemory(memory.id, "title", e.target.value),
													placeholder: "Short title for photo...",
													className: "text-sm mt-1"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-gray-500 mt-1",
													children: "Appears at the bottom of the photo"
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: `message-${memory.id}`,
													className: "text-sm font-semibold",
													children: "Message"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													id: `message-${memory.id}`,
													value: memory.message,
													onChange: (e) => updateMemory(memory.id, "message", e.target.value),
													placeholder: "Write a longer memory message...",
													className: "text-sm mt-1 min-h-[80px]"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-gray-500 mt-1",
													children: "Appears on the right page in the scrapbook"
												})
											] })
										]
									})]
								}, memory.id))
							}) })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "messages",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Final Greeting Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Customize the birthday message at the end of the experience" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "finalMessage",
											children: "Birthday Greeting"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "finalMessage",
											value: data.finalMessage,
											onChange: (e) => setData((prev) => ({
												...prev,
												finalMessage: e.target.value
											})),
											placeholder: "Enter your birthday message...",
											className: "min-h-[200px] text-base"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-gray-500",
											children: "This heartfelt message appears after the wish scene at the end of the celebration. Edit the text above to personalize your birthday wishes."
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-4 border-t",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium mb-3",
										children: "Message Preview:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6 rounded-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-gray-700 italic leading-relaxed",
											children: data.finalMessage
										})
									})]
								})]
							})] })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "text-berry hover:underline",
						children: "← Back to Birthday Experience"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleSave,
							size: "lg",
							className: "bg-berry hover:bg-berry/90 text-white",
							children: "Save Changes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleGenerateLink,
							size: "lg",
							className: "bg-green-600 hover:bg-green-700 text-white",
							children: "🔗 Generate Shareable Link"
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminPage as component };
