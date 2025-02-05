//worked on the logic of making the circle with Jackson Rubiano
import Standard2DPGAPosedVertexColorObject from "./Standard2DPGAPosedVertexColorObject.js"
export default class planetSaturn extends Standard2DPGAPosedVertexColorObject {


    constructor(device, canvasFormat, pose) {

        let i = 0;
        let idx = 0;
        let triangles = 100;
        let vertices = new Float32Array(3 * triangles * 6);
        let radius = 0.11;
        let centerx = 0.0;
        let centery = 0.0

        while (i < 360) {
            //first point of the triangle
            vertices[idx * 18] = (radius * Math.cos((Math.PI / 180.0) * (i))) + centerx;
            vertices[idx * 18 + 1] = (radius * Math.sin((Math.PI / 180.0) * (i))) + centery;
            vertices[idx * 18 + 2] = (230.0 / 255);
            vertices[idx * 18 + 3] = (222.0 / 255);
            vertices[idx * 18 + 4] = (87.0 / 255);
            vertices[idx * 18 + 5] = (1);

            //second point of the triangle
            vertices[idx * 18 + 6] = (radius * Math.cos((Math.PI / 180.0) * ((i + 360.0 / triangles)))) + centerx;
            vertices[idx * 18 + 7] = (radius * Math.sin((Math.PI / 180.0) * ((i + 360.0 / triangles)))) + centery;
            vertices[idx * 18 + 8] = (230.0 / 255);
            vertices[idx * 18 + 9] = (222.0 / 255);
            vertices[idx * 18 + 10] = (87.0 / 255);
            vertices[idx * 18 + 11] = (1);

            //third point of the triangle
            vertices[idx * 18 + 12] = (centerx);
            vertices[idx * 18 + 13] = (centery);
            vertices[idx * 18 + 14] = (230.0 / 255);
            vertices[idx * 18 + 15] = (222.0 / 255);
            vertices[idx * 18 + 16] = (87.0 / 255);
            vertices[idx * 18 + 17] = (1);

            i += 360.0 / 100
            idx = idx + 1;
        }

        super(device, canvasFormat, vertices, pose);
        this._interval = 100;
        this._t = 0;
        this._step = 0.9;
        this._pose0 = [-1.3, 0, 0.5, 0.5, 0.5, 0.5];
        this._pose1 = [-1.3, 0, 1, -0.5, 0.5, 0.5, 0.5];

    }
    s
    updateGeometry() {
        let angle = 2 * Math.PI * (this._t / this._interval)
        // linearly interpolate the motor
        this._pose[0] = this._pose0[0] * Math.cos(angle) - this._pose0[1] * Math.sin(angle);
        this._pose[1] = this._pose0[0] * Math.sin(angle) + this._pose0[1] * Math.cos(angle);

        this._pose[2] = this._pose0[2];
        this._pose[3] = this._pose0[3];


        this._t = this._t + this._step;
        super.updateGeometry();
    }
}

