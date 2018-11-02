# A-FRAME ROUTER

Example:  

    <a-scene id="scene" router>
        <a-route id="frame1">
            <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
        </a-route>
    
        <a-route id="frame2">
            <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
        </a-route>
    
        <a-route id="frame3">
            <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
        </a-route>
    
        <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
        <a-sky color="#ECECEC"></a-sky>
    </a-scene>
    
Change route: 

    var router = document.getElementById('scene').systems['router'];
    router.changeRoute('frame1');
