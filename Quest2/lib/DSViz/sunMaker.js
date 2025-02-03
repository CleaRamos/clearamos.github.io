//worked on the logic of making the circle with Jackson Rubiano



export default function sunMaker(radius, centerx, centery) {


    let i = 0;
    let idx = 0;
    let triangles = 100;
    let vertices = new Float32Array(3 * triangles * 6);


    while (i < 360) {
        //first point of the triangle
        vertices[idx * 18] = (radius * Math.cos((Math.PI / 180.0) * (i))) + centerx;
        vertices[idx * 18 + 1] = (radius * Math.sin((Math.PI / 180.0) * (i))) + centery;
        vertices[idx * 18 + 2] = (250.0 / 255);
        vertices[idx * 18 + 3] = (231.0 / 255);
        vertices[idx * 18 + 4] = (25.0 / 255);
        vertices[idx * 18 + 5] = (1);

        //second point of the triangle
        vertices[idx * 18 + 6] = (radius * Math.cos((Math.PI / 180.0) * ((i + 360.0 / triangles)))) + centerx;
        vertices[idx * 18 + 7] = (radius * Math.sin((Math.PI / 180.0) * ((i + 360.0 / triangles)))) + centery;
        vertices[idx * 18 + 8] = (250.0 / 255);
        vertices[idx * 18 + 9] = (231.0 / 255);
        vertices[idx * 18 + 10] = (25.0 / 255);
        vertices[idx * 18 + 11] = (1);

        //third point of the triangle
        vertices[idx * 18 + 12] = (centerx);
        vertices[idx * 18 + 13] = (centery);
        vertices[idx * 18 + 14] = (250.0 / 255);
        vertices[idx * 18 + 15] = (141.0 / 255);
        vertices[idx * 18 + 16] = (25.0 / 255);
        vertices[idx * 18 + 17] = (1);

        i += 360.0 / 100
        idx = idx + 1;

    }


    return vertices;


}