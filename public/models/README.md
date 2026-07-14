# 3D Model for Birthday Cake

## How to Use a Custom Cake Model

1. **Place your GLB file here**:
   - File name: `strawberry_cake.glb`
   - Location: `public/models/strawberry_cake.glb`

2. **Requirements**:
   - Format: `.glb` or `.gltf`
   - Recommended size: Under 5MB for best performance
   - The model will be scaled automatically

3. **Where to Get 3D Models**:
   - [Sketchfab](https://sketchfab.com) - Search for "birthday cake"
   - [CGTrader](https://www.cgtrader.com)
   - [TurboSquid](https://www.turbosquid.com)
   - Or create your own in Blender!

4. **Fallback**:
   - If the GLB file is not found, the app will use the beautiful procedural cake
   - No errors will occur - it's completely optional!

## Adjusting the Model

If your cake appears too large/small or positioned incorrectly, you can adjust these values in `BirthdayCake.tsx`:

```tsx
<primitive 
  object={cakeModel.clone()} 
  scale={1.5}              // Adjust size (bigger/smaller)
  position={[0, 0, 0]}     // Adjust position [x, y, z]
/>
```

Enjoy your custom 3D birthday cake! 🎂✨
