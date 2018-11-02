/* global AFRAME */

AFRAME.registerTemplate('frame1', `  
        <a-route-assets>
            <img id="pug" src="../assets/pug.jpg">
            <a-asset-item id="horse-mtl" src="assets/monkey.js"></a-asset-item>
        </a-route-assets>

        <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
        <a-box position="-1 0.5 -1" rotation="0 45 0" color="#ccaavv"></a-box>

        <a-sky id="sky" src="#pug"></a-sky>
`);

AFRAME.registerTemplate('frame2', `
    <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
`);

AFRAME.registerTemplate('frame3', `
    <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
`);
