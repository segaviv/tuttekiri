export class CurveEditor {
  constructor(state, requestDraw) {
    this.state = state;
    this.requestDraw = requestDraw;
    this.selectedStyleIndex = -1;
    this.editingPoints = [];
    this.backupPoints = null; // For cancel
    this.isEditing = false;
    this.canvas = document.getElementById('curve-editor-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.modal = document.getElementById('curve-editor-modal');

    // Canvas interaction state
    this.selectedPointIndex = -1; // Selection for handles
    this.draggingPointIndex = -1;
    this.draggingHandleType = null; // 'in' or 'out'
    this.hoverPointIndex = -1;
    this.hoverHandleType = null;

    // View transform
    this.padding = 40;
    this.drawWidth = this.canvas.width - 2 * this.padding;
    this.drawHeight = this.canvas.height - 2 * this.padding;
    this.scaleX = this.drawWidth;

    this.initEvents();
    this.renderList();
  }

  initEvents() {
    // UI Buttons
    document.getElementById('btn-add-edge-curve').addEventListener('click', () => this.startNew());
    document.getElementById('btn-edit-edge-curve').addEventListener('click', () => this.startEdit());

    document.getElementById('btn-curve-cancel').addEventListener('click', () => this.close());
    document.getElementById('btn-curve-save').addEventListener('click', () => this.save());

    // Canvas Events
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('dblclick', (e) => this.onDoubleClick(e));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // --- Logic ---

  ensureHandles(inputPoints) {
    // Upgrade points to have handles if missing
    const points = JSON.parse(JSON.stringify(inputPoints));

    points.forEach((pt, i) => {
      if (!pt.hIn) {
        // Default In: Look at previous point
        if (i > 0) {
          const prev = points[i - 1];
          const dx = pt.x - prev.x;
          pt.hIn = { x: pt.x - dx * 0.25, y: pt.y };
        } else {
          pt.hIn = { x: pt.x - 0.1, y: pt.y };
        }
      }
      if (!pt.hOut) {
        // Default Out
        if (i < points.length - 1) {
          const next = points[i + 1];
          const dx = next.x - pt.x;
          pt.hOut = { x: pt.x + dx * 0.25, y: pt.y };
        } else {
          pt.hOut = { x: pt.x + 0.1, y: pt.y };
        }
      }
    });

    return points;
  }

  startNew() {
    this.editingPoints = [
      { x: 0, y: 0, hIn: { x: -0.1, y: 0 }, hOut: { x: 0.1, y: 0 } },
      { x: 1, y: 0, hIn: { x: 0.9, y: 0 }, hOut: { x: 1.1, y: 0 } }
    ];

    // Push new style temporarily
    const newStyle = {
      name: `Style ${this.state.edgeStyles.length + 1}`,
      points: this.editingPoints
    };
    this.state.edgeStyles.push(newStyle);
    this.selectedStyleIndex = this.state.edgeStyles.length - 1;
    this.editIndex = this.selectedStyleIndex;

    this.backupPoints = "DELETE"; // Marker to delete on cancel

    this.selectedPointIndex = -1;
    this.openModal();
    this.updateState(); // Trigger initial render of new style
  }

  startEdit() {
    if (this.selectedStyleIndex < 0 || this.selectedStyleIndex >= this.state.edgeStyles.length) return;

    // Backup current points to restore if cancelled
    this.backupPoints = JSON.parse(JSON.stringify(this.state.edgeStyles[this.selectedStyleIndex].points));

    // Load for editing (using ensureHandles to upgrade if needed)
    this.editingPoints = this.ensureHandles(this.state.edgeStyles[this.selectedStyleIndex].points);
    this.editIndex = this.selectedStyleIndex;
    this.selectedPointIndex = -1;
    this.openModal();
    this.updateState();
  }

  openModal() {
    this.modal.style.display = 'flex';
    this.isEditing = true;
    this.draw();
  }

  close() {
    // Cancel logic
    if (this.backupPoints === "DELETE") {
      // Remove the style we added
      this.state.edgeStyles.splice(this.editIndex, 1);
      this.selectedStyleIndex = -1;
      this.state.selectedStyleIndex = -1;
    } else if (this.backupPoints) {
      // Restore
      this.state.edgeStyles[this.editIndex].points = this.backupPoints;
    }

    this.backupPoints = null;
    this.modal.style.display = 'none';
    this.isEditing = false;

    this.renderList();
    if (this.requestDraw) this.requestDraw();
  }

  save() {
    // this.editingPoints.sort((a, b) => a.x - b.x);
    // Enforce endpoints
    if (this.editingPoints[0].x !== 0) this.editingPoints.unshift({ x: 0, y: 0, hIn: { x: -0.1, y: 0 }, hOut: { x: 0.1, y: 0 } });
    if (this.editingPoints[this.editingPoints.length - 1].x !== 1) this.editingPoints.push({ x: 1, y: 0, hIn: { x: 0.9, y: 0 }, hOut: { x: 1.1, y: 0 } });

    this.editingPoints[0].x = 0;
    this.editingPoints[0].y = 0;
    this.editingPoints[this.editingPoints.length - 1].x = 1;
    this.editingPoints[this.editingPoints.length - 1].y = 0;

    // Apply to state (already applied by updateState, but sort might have changed things slightly)
    this.state.edgeStyles[this.editIndex].points = this.editingPoints;

    // Clear backup so close() doesn't revert
    this.backupPoints = null;

    this.renderList();
    this.modal.style.display = 'none'; // Close without reverting
    this.isEditing = false;
    if (this.requestDraw) this.requestDraw();
  }

  updateState() {
    // Sync editing points to state for live render
    if (this.editIndex !== -1 && this.state.edgeStyles[this.editIndex]) {
      this.state.edgeStyles[this.editIndex].points = this.editingPoints;
      if (this.requestDraw) this.requestDraw();
    }
  }

  renderList() {
    const list = document.getElementById('edge-curves-list');
    list.innerHTML = '';
    this.state.edgeStyles.forEach((style, idx) => {
      const div = document.createElement('div');
      div.style.padding = '4px 8px';
      div.style.background = (idx === this.selectedStyleIndex) ? 'rgba(100, 108, 255, 0.3)' : 'rgba(255,255,255,0.05)';
      div.style.border = '1px solid rgba(255,255,255,0.1)';
      div.style.borderRadius = '4px';
      div.style.cursor = 'pointer';
      div.style.fontSize = '0.8rem';
      div.textContent = style.name;
      div.onclick = () => {
        this.selectedStyleIndex = idx;
        this.state.selectedStyleIndex = idx;
        document.getElementById('btn-edit-edge-curve').disabled = false;
        document.getElementById('btn-pick-edge-style').disabled = false;
        this.renderList();
      };
      list.appendChild(div);
    });

    if (this.selectedStyleIndex === -1) {
      document.getElementById('btn-edit-edge-curve').disabled = true;
      document.getElementById('btn-pick-edge-style').disabled = true;
    }
  }

  // --- Canvas Coordinate Utils ---
  toCanvas(pt) {
    const x = this.padding + pt.x * this.drawWidth;
    const centerY = this.canvas.height / 2;
    const y = centerY - pt.y * this.scaleX;
    return { x, y };
  }

  fromCanvas(pt) {
    const x = (pt.x - this.padding) / this.drawWidth;
    const centerY = this.canvas.height / 2;
    const y = (centerY - pt.y) / this.drawWidth;
    return { x, y };
  }

  // --- Drawing ---
  draw() {
    if (!this.isEditing) return;
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grid / Axis
    this.ctx.strokeStyle = '#555';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    const pStart = this.toCanvas({ x: 0, y: 0 });
    const pEnd = this.toCanvas({ x: 1, y: 0 });
    this.ctx.moveTo(pStart.x, pStart.y);
    this.ctx.lineTo(pEnd.x, pEnd.y);
    this.ctx.stroke();

    // Endpoints
    this.ctx.fillStyle = '#888';
    this.drawDot(pStart, 4);
    this.drawDot(pEnd, 4);

    // The Curve (Bezier)
    this.ctx.strokeStyle = '#646cff'; // Accent color
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    if (this.editingPoints.length >= 2) {
      const p0 = this.toCanvas(this.editingPoints[0]);
      this.ctx.moveTo(p0.x, p0.y);

      for (let i = 0; i < this.editingPoints.length - 1; i++) {
        const pt1 = this.editingPoints[i];
        const pt2 = this.editingPoints[i + 1];

        const cp1 = this.toCanvas(pt1.hOut);
        const cp2 = this.toCanvas(pt2.hIn);
        const p2 = this.toCanvas(pt2);

        this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
      }
      this.ctx.stroke();
    }

    // Control Points and Handles
    this.editingPoints.forEach((pt, idx) => {
      const pCanvas = this.toCanvas(pt);

      // Draw Handles if selected
      if (idx === this.selectedPointIndex) {
        const hIn = this.toCanvas(pt.hIn);
        const hOut = this.toCanvas(pt.hOut);

        // Draw lines
        this.ctx.strokeStyle = '#888';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(hIn.x, hIn.y);
        this.ctx.lineTo(pCanvas.x, pCanvas.y);
        this.ctx.lineTo(hOut.x, hOut.y);
        this.ctx.stroke();

        // Draw handle dots
        this.ctx.fillStyle = '#f0f';
        this.drawDot(hIn, 4);
        this.ctx.fillStyle = '#0ff';
        this.drawDot(hOut, 4);
      }

      // Draw Main Point
      const isHover = (idx === this.hoverPointIndex);
      const isSelected = (idx === this.selectedPointIndex);
      this.ctx.fillStyle = isSelected ? '#ff4' : (isHover ? '#fff' : '#aaa');
      if (idx === 0 || idx === this.editingPoints.length - 1) this.ctx.fillStyle = isSelected ? '#cc4' : '#555';
      this.drawDot(pCanvas, isHover || isSelected ? 6 : 4);
    });
  }

  drawDot(pt, r) {
    this.ctx.beginPath();
    this.ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // --- Interaction ---
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  findPoint(pos) {
    const thresh = 10;
    // Check handles of selected point first
    if (this.selectedPointIndex !== -1) {
      const pt = this.editingPoints[this.selectedPointIndex];
      const hIn = this.toCanvas(pt.hIn);
      const hOut = this.toCanvas(pt.hOut);

      if (Math.hypot(hIn.x - pos.x, hIn.y - pos.y) < thresh) return { idx: this.selectedPointIndex, type: 'in' };
      if (Math.hypot(hOut.x - pos.x, hOut.y - pos.y) < thresh) return { idx: this.selectedPointIndex, type: 'out' };
    }

    for (let i = 0; i < this.editingPoints.length; i++) {
      const cp = this.toCanvas(this.editingPoints[i]);
      if (Math.hypot(cp.x - pos.x, cp.y - pos.y) < thresh) return { idx: i, type: 'point' };
    }
    return null;
  }

  onMouseDown(e) {
    const pos = this.getMousePos(e);
    const hit = this.findPoint(pos);

    // Right Click Delete
    if (e.button === 2) {
      if (hit && hit.type === 'point') {
        const idx = hit.idx;
        if (idx !== 0 && idx !== this.editingPoints.length - 1) {
          this.editingPoints.splice(idx, 1);
          if (this.selectedPointIndex === idx) this.selectedPointIndex = -1;
          else if (this.selectedPointIndex > idx) this.selectedPointIndex--;
          this.draw();
          this.updateState();
        }
      }
      return;
    }

    if (hit) {
      this.selectedPointIndex = hit.idx; // Select logic
      this.draggingPointIndex = hit.idx;
      this.draggingHandleType = hit.type === 'point' ? null : hit.type;
      this.draw();
    } else {
      // Add point
      const logicPt = this.fromCanvas(pos);
      if (logicPt.x > 0 && logicPt.x < 1) {
        // Default handles
        const newPt = {
          x: logicPt.x,
          y: logicPt.y,
          hIn: { x: logicPt.x - 0.05, y: logicPt.y },
          hOut: { x: logicPt.x + 0.05, y: logicPt.y }
        };
        this.editingPoints.push(newPt);
        this.editingPoints.sort((a, b) => a.x - b.x);
        const idx = this.editingPoints.indexOf(newPt);
        this.selectedPointIndex = idx;
        this.draggingPointIndex = idx;
        this.draggingHandleType = null;
        this.draw();
        this.updateState();
      } else {
        // Deselect if clicked outside?
        this.selectedPointIndex = -1;
        this.draw();
      }
    }
  }

  onMouseMove(e) {
    const pos = this.getMousePos(e);
    const hit = this.findPoint(pos);
    this.hoverPointIndex = (hit && hit.type === 'point') ? hit.idx : -1;

    if (this.draggingPointIndex !== -1) {
      const pt = this.editingPoints[this.draggingPointIndex];
      const logicPos = this.fromCanvas(pos);

      if (this.draggingHandleType === 'in') {
        pt.hIn.x = logicPos.x;
        pt.hIn.y = logicPos.y;
      } else if (this.draggingHandleType === 'out') {
        pt.hOut.x = logicPos.x;
        pt.hOut.y = logicPos.y;
      } else {
        // Drag Point - Move handles with it
        const dx = logicPos.x - pt.x;
        const dy = logicPos.y - pt.y;

        // Constrain X to neighbors if strictly ordered (optional)
        // Let's constrain x to [0,1]
        let newX = Math.max(0, Math.min(1, logicPos.x));
        if (this.draggingPointIndex !== 0 && this.draggingPointIndex !== this.editingPoints.length - 1) {
          // Update pos
          pt.x = newX;
          pt.y = logicPos.y;

          pt.hIn.x += dx; pt.hIn.y += dy;
          pt.hOut.x += dx; pt.hOut.y += dy;
        }
      }
      this.draw();
      this.updateState();
    } else {
      // Cursor update
      this.canvas.style.cursor = hit ? 'pointer' : 'default';
      this.draw();
    }
  }

  onMouseUp(e) {
    this.draggingPointIndex = -1;
    this.draggingHandleType = null;
  }

  onDoubleClick(e) {
    const pos = this.getMousePos(e);
    const hit = this.findPoint(pos);
    if (hit && hit.type === 'point') {
      if (hit.idx !== 0 && hit.idx !== this.editingPoints.length - 1) {
        this.editingPoints.splice(hit.idx, 1);
        this.selectedPointIndex = -1;
        this.draw();
        this.updateState();
      }
    }
  }
}
