import {
  Mesh,
  OGLRenderingContext,
  Plane,
  Program,
  Texture,
  Transform,
} from "ogl";
import fragment from "./Grid.frag";
import vertex from "./Grid.vert";

export class Grid {
  private mesh: Mesh;
  private scene: Transform;
  private offset = 0;

  constructor({
    gl,
    scene,
    image,
  }: {
    image: HTMLImageElement;
    gl: OGLRenderingContext;
    scene: Transform;
  }) {
    const texture = new Texture(gl, { image });
    const plane = new Plane(gl);
    const program = new Program(gl, {
      fragment,
      vertex,
      uniforms: {
        uTexture: { value: texture },
        uOffset: { value: 0 },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry: plane, program });
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.rotation.y = -Math.PI * 0.5;

    mesh.position.y = -0.2;
    mesh.position.x = -0.4;
    mesh.position.z = -0.25;

    mesh.scale.x = 2.0;
    mesh.scale.y = 2.5;

    this.mesh = mesh;
    scene.addChild(mesh);
    this.scene = scene;
  }

  update() {
    this.mesh.program.uniforms.uOffset.value = this.offset;
    this.offset += 0.0015;
  }

  destroy() {
    this.scene.removeChild(this.mesh);
  }
}
