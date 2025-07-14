import * as THREE from "three";

export default class ToolbarManager {
  constructor(camera, rendererDomElement) {
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.targets = []; // array of { object, content }

    this.toolbarEl = this._createToolbar();

    rendererDomElement.addEventListener("click", this._handleClick.bind(this));
  }

  _createToolbar() {
    let el = document.getElementById("toolbar");
    if (!el) {
      el = document.createElement("div");
      el.id = "toolbar";
      el.style.cssText = `
        position: absolute;
        top: 50px;
        right: 50%;
        translate: 50% 0;
        background: rgba(255, 254, 254, 0.8);
        color: rgb(100, 91, 91);
        border-radius: 10px;
        margin: auto;
        font-family: sans-serif;
        z-index: 1000;
        max-width: 90vw;
        
      font-size: clamp(14px, 2.5vw, 18px);
  padding: 10px 15px;
      `;
      document.body.appendChild(el);
    }
    return el;
  }

  registerObject(object3D, contentString) {
    this.targets.push({ object: object3D, content: contentString });
  }

  _handleClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersectables = this.targets.map((t) => t.object);
    const intersects = this.raycaster.intersectObjects(intersectables, true);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      const target = this.targets.find(
        (t) => t.object === clicked || t.object.children.includes(clicked)
      );
      if (target) {
        this._showToolbar(target.content);
      }
    }
  }

  _showToolbar(content) {
    this.toolbarEl.innerHTML = content;
    this.toolbarEl.style.display = "block";
  }

  hideToolbar() {
    this.toolbarEl.style.display = "none";
  }
}
