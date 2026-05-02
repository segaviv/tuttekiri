# Uniformly Deployable Kirigami on Arbitrary Planar Graphs
<div align="center">
  <img src="./figs/teaser.gif" width="800">
</div>

This repository contains the implementation for our paper **"Uniformly Deployable Kirigami on Arbitrary Planar Graphs"**, *ACM Transactions on Graphics (Proc. SIGGRAPH) 2026*, by [Aviv Segall](https://segaviv.github.io/), [Jing Ren](https://ren-jing.com/), and [Olga Sorkine-Hornung](https://igl.ethz.ch/people/sorkine).

In this project, we introduce a general analytical framework for designing uniformly deployable kirigami structures from **arbitrary planar graphs**, going beyond traditional 2‑colorable or quadrilateral patterns. Our method characterizes the full space of deployable embeddings via linear constraints (which we refer to as ***Tutte auxetic embeddings***), supports **shape space exploration** for pattern optimization and enables **inverse design** for 3D shape approximation from flat sheets. 

More details about our paper can be found at:  [[web demo]]() | [[project page]]() | [[paper]]() | [[suppl. video]]()

## Methodology
| Figure 1: split cut | Figure 2: hinge cut |
|:--------------------------:|:--------------------------:|
| <img src="./figs/eg_split_cut.jpg" alt="split cut" width="500"/> | <img src="./figs/eg_hinge_cut.jpg" alt="hinge cut" width="500"/> |


## Implementation
We provide an interactive **web‑based user interface** with the following functionalities:


Key features:
- **Load & Orient** – Load any planar graph (3‑connected). Automatic face‑orientation assignment via dual‑graph max‑cut approximation (Sec. 4.2). Manual orientation flipping by clicking faces.
- **Tutte Auxetic Embedding** – Compute the closest uniformly deployable embedding from a non‑deployable input (Eq. 6). Visualize real‑time deployment simulation.
- **Shape Space Exploration** – Adjust sliders to navigate the full null‑space of deployable embeddings (Sec. 4.4). The pattern updates while remaining uniformly deployable.
- **Specialized Optimization** – 
  - *Isotropic patterns*: conformal deployment (Poisson ratio −1) via Eq. (13).
  - *Fully‑closed patterns*: two gap‑free configurations (initial + maximally deployed) via Eq. (14).
  - *Collision handling*: optimize within the shape space to avoid early self‑intersection (Sec. 4.5).
- **Curved Cuts** – Draw custom curves for hinge edges (monotonic distance condition, Sec. 4.6); pattern updates while preserving deployability.
- **Inverse Design** – Load a disk‑topology mesh; the system finds a uniformly deployable pattern whose deployment (at a given θ) approximates the target shape. *Preserves exact topology* of the input (no remeshing required, Sec. 5.3).

Please refer to our paper for technical details. Full implementation can be found in the folder `web_demo`.  
Pre‑optimized patterns for various shapes (hemisphere, half‑torus, bunny, etc.) are provided in `fabrication_patterns`. These patterns can be laser‑cut from paper, felt, or other sheet materials.

## Acknowledgements
The authors thank the anonymous reviewers for their valuable feedback.  Special thanks to **James MacCann** for insightful comments, and to **Ruben Wiersma**, **Marcel Padilla**, and **Peizhuo Li** for proofreading.  The authors thank all **IGL members** for their spiritual‑academic‑snacky support.  This work was supported in part by the **ERC Consolidator Grant No. 101003104 (MYCLOTH)**.

## Contact
Please let us know (`aviv.segall`, `jing.ren` @ `inf.ethz.ch`) if you have any questions regarding the algorithms/paper or if you find any bugs in the code (´；д；`)
This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/). For any commercial uses or derivatives, please contact us (`aviv.segall`, `jing.ren`, `sorkine` @ `inf.ethz.ch`).  
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
