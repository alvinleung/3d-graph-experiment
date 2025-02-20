import {
  Camera,
  Color,
  Euler,
  Mat4,
  Mesh,
  Orbit,
  Path,
  Plane,
  Polyline,
  Program,
  Raycast,
  Renderer,
  Transform,
  Vec2,
  Vec3,
} from "ogl";

import { loadAssets } from "./asset-loader";
import LINE_VERT from "./line.vert";
import DEFAULT_VERT from "./default.vert";
import DEFAULT_FRAG from "./default.frag";
import { PlotLine } from "./PlotLine/PlotLine";
import { Grid } from "./Grid/Grid";

const renderer = new Renderer();
const gl = renderer.gl;
document.body.appendChild(gl.canvas);

const camera = new Camera(gl);
camera.position.z = 2;

// ==================================================
// Canvas resize
// ==================================================
function resize() {
  renderer.dpr = window.devicePixelRatio;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.perspective({
    aspect: gl.canvas.width / gl.canvas.height,
  });
}
window.addEventListener("resize", resize, false);
resize();

// ==================================================

loadAssets({
  grid: new URL("assets/grid.png", import.meta.url),
  gridBlur: new URL("assets/grid-blur.png", import.meta.url),
}).then((assets) => {
  const scene = new Transform();

  // orbit
  const orbit = new Orbit(camera, {
    target: new Vec3(0, 0, 0),
    // enableZoom: false,
    enablePan: true,
    element: gl.canvas,
  });

  const grid = new Grid({ gl, scene, image: assets.grid });

  const plotLines: PlotLine[] = [];
  for (let i = 0; i < 3; i++) {
    const lineOffset = 0.5;
    plotLines.push(
      new PlotLine({
        gl,
        scene,
        position: new Vec3(-2.5, -0.1, -i * lineOffset + 0.2),
      }),
    );
  }

  function update(time: number) {
    renderer.gl.clearColor(254 / 255, 255 / 255, 250 / 255, 1.0);
    orbit.update();
    plotLines.forEach((line) => line.update());
    grid.update();

    // render to screen
    renderer.render({ scene, camera });
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
});
