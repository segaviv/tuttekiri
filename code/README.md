# Code for "Uniformly Deployable Kirigami on Arbitrary Planar Graphs"

This folder contains the web-based implementation of our paper "Uniformly Deployable Kirigami on Arbitrary Planar Graphs".

## Run

Install the JavaScript dependencies, then start the local development server:

```bash
npm install
npx vite
```

## Compile the WebAssembly part

If you change anything in the cpp files, you'll have to recompile the c++ code into WebAssembly.
To build the `cpp/` WebAssembly component, install Emscripten and run:

```bash
cd cpp/
mkdir build
cd build
emcmake cmake -DCMAKE_BUILD_TYPE=Release ..
emmake make -j
```

The compilation will generate kirigami_cpp.js & kirigami_cpp.wasm in the build directory and copy these files into the src/ direcory.

## Usage

### Loading & Deploying

Load a pattern from the list, or drop an `.obj` / `.ukp` file for a 2D mesh. The `z` coordinate can be `0`.
Scroll to zoom in/out, hold shift and drag left mouse button to pan the view.

Click on the unit pattern faces to change their orientation.

Click `Deployize` to project the pattern to the nearest deployable pattern. 
After making the pattern deployable a section named "Kernel Controls" will be added.
The section allows adjusting the coefficients of the kernel vectors (which will be added
to the initial solution) to explore the uniformly-deployable space.


Use the `Deploy` slider to change the deployment angle and deploy the pattern.

### Optimizing Pattern

`Fully Closed` attempts to optimize the pattern to be fully closed at the maximum deployment angle.

`Conformalize` projects the pattern to a deployable pattern with conformal deployment.

`Prevent intersections` attempts to prevent intersections during deployment. Its parameters are:

1. `Barrier` - how strongly to push split edges away from each other.
2. `Barrier strength` - the strength of the soft barrier function.
3. `Close to original` - weight for the energy term that keeps the optimization close to the original pattern.

### Export and State

Export includes options to export the pattern as:

1. `.OBJ` with an `.mtl` file indicating the face orientations.
2. `.UKP`, which exports the unit pattern with the face orientation and the translation symmetry.
3. laser-cut `.SVG`, which exports the displayed pattern for laser cutting and leaves a small part of the material uncut to act as a hinge.

`Save state` and `Load state` can be used to save and load the current state.

### .UKP File Format

The `.UKP` format is essentially the same as an `.OBJ` file for the 2D mesh of the unit pattern, plus the following:

1. Translation symmetry, given by the two edges of the unit parallelogram:

```text
px x y
py x y
```

These can be set to `[0 0]` to indicate that the pattern is not periodic.

2. Face orientation lines of the form:

```text
fc 0
fc 1
```

These indicate the orientation of each face. If they are not specified, a face orientation will be calculated when the pattern is loaded. If they are specified, the number of `fc` lines should match the number of faces in the unit pattern.

## Inverse Design

1. Drop a target `.obj` file as the target surface.
2. Either:
	1. Click `mesh to pattern` to generate a 2D pattern based on the mesh topology. This can use the mesh UVs, parameterize the mesh, or map the boundary to the unit disk if the corresponding checkbox is checked.
	2. Choose a pattern for tiling the mesh, then click `lift` to lift the pattern to the disk-topology mesh. Use the scale and rotation sliders to adjust the tiling. When using this option, the 2D pattern can be deployed to any angle before lifting it to the target mesh.
3. Deploy the pattern to a different configuration than the one lifted to the target mesh by changing the deployment angle.
4. Initialize the optimization. The current errors, face rigidity and face planarity, will be shown.
5. Start the optimization. When the errors are small enough, depending on the size of fabrication and the fabrication tool resolution, stop the optimization. The optimization process can be restarted by re-initializing it, and different optimization parameters, that is, weights of the different energy terms, can be chosen from the corresponding panel.
6. Export the laser-cutting pattern, with parameters chosen in the export section in the left panel, or export the optimized 2D and 3D configurations.