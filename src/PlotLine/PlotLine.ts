import {
  Color,
  Geometry,
  Mesh,
  OGLRenderingContext,
  Plane,
  Polyline,
  Program,
  Transform,
  Vec3,
} from "ogl";

import FRAG from "./PlotLine.frag";
import VERT from "./PlotLine.vert";
import DEFAULT_VERT from "../default.vert";
import GLOW_MESH_FRAG from "./PlotLineGlow.frag";

import { createNoise2D } from "simplex-noise";

const noise2D = createNoise2D();

export class PlotLine {
  private line: Polyline;
  private scene: Transform;

  private noiseOffset = Math.random() * 100;

  // private shiftVelocity = 0.001 + 0.001 * Math.random();
  private shiftVelocity = 0.002;
  private graphOffset = 0;
  constructor({
    gl,
    scene,
    position,
  }: {
    position?: Vec3;
    gl: OGLRenderingContext;
    scene: Transform;
  }) {
    this.scene = scene;

    const nodes = this.createPlotPoints({
      getValue: (i) => noise2D(i * 0.19, this.noiseOffset) * 0.1,
    });

    const line = new Polyline(gl, {
      points: nodes,
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uColor: { value: new Color("#F00") },
        uThickness: { value: 2 },
      },
    });
    this.line = line;
    line.mesh.position = position || new Vec3();
    const glowMeshProgram = new Program(gl, {
      fragment: GLOW_MESH_FRAG,
      vertex: DEFAULT_VERT,
      // depthTest: false,
      // transparent: true,
    });

    const glowMeshGeom = new Geometry(gl);
    Object.assign(glowMeshGeom.attributes, line.geometry.attributes);

    const glowMesh = new Mesh(gl, {
      geometry: glowMeshGeom,
      program: glowMeshProgram,
    });

    // glowMesh.position.z += 0.2;
    // scene.addChild(glowMesh);

    scene.addChild(line.mesh);
  }

  update() {
    const line = this.line;

    // shift every point on the line
    const shouldSwap = line.points[0].x <= 0;
    if (shouldSwap) this.graphOffset++;

    for (let i = 0; i < line.points.length; i++) {
      const isLast = i === line.points.length - 1;

      if (shouldSwap && !isLast) {
        line.points[i].y = line.points[i + 1].y;
        line.points[i].x = line.points[i + 1].x;
      }

      if (shouldSwap && isLast) {
        const value = noise2D(this.graphOffset * 0.19, this.noiseOffset) * 0.1;
        line.points[i].y = value;
        line.points[i].x = line.points.length * 0.1;
      }

      // shift horizontally
      const pt = line.points[i];
      pt.x -= this.shiftVelocity;
    }

    line.updateGeometry();
  }

  destroy() {
    this.scene.removeChild(this.line.mesh);
  }

  private createPlotPoints({
    counts = 32,
    interval = 0.1,
    getValue = (i) => 0,
  }) {
    const lineNodes = [];
    for (let i = 0; i < counts; i++) {
      lineNodes.push(new Vec3(interval * i, getValue(i), 0));
    }
    return lineNodes;
  }
}
