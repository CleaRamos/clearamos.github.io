//worked on the logic of making the circle with Jackson Rubiano
import Standard2DPGAPosedVertexColorObject from "./Standard2DPGAPosedVertexColorObject.js"
export default class rocketship extends Standard2DPGAPosedVertexColorObject {


    constructor(device, canvasFormat, pose) {


        let vertices1 = new Float32Array([
            //white body
            0, 0, 1, 1, 1, 1,
            0.15, 0, 1, 1, 1, 1,
            0.15, 0.3, 1, 1, 1, 1,

            0.15, 0.3, 1, 1, 1, 1,
            0, 0, 1, 1, 1, 1,
            0, 0.3, 1, 1, 1, 1,

            //red tip
            0, 0.3, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.075, 0.4, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.15, 0.3, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,

            //pink wings
            0, 0.3, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            -0.075, 0.05, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.0, 0.05, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,

            //pink wings
            0.15, 0.3, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.22, 0.05, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.15, 0.05, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,

            //trapezoid
            0, 0, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            -0.075, -0.075, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.0, -0.075, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,


            0.15, 0.0, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.15, -0.075, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.22, -0.075, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,

            //rectangle
            0, -0.075, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.15, -0.075, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0, 0, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,

            0.15, -0.075, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0.15, 0, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,
            0, 0, 227.0 / 255, 2.0 / 255, 92.0 / 255, 1,







        ]);

        super(device, canvasFormat, vertices1, pose);
        this._interval = 100;
        this._t = 0;
        this._step = 2;
        this._pose0 = [-1, 0, 0.5, 0.5, 0.5, 0.5];
        this._pose1 = [0, 1, -0.5, 0.5, 0.5, 0.5];
        this._pose2 = [1, -1, -0.5, 0.5, 0.5, 0.5];

    }

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

