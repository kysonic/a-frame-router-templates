# A-FRAME ROUTER AND TEMPLATES

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
    
#### Change route 

    var router = document.getElementById('scene').systems['router'];
    router.changeRoute('frame1');
    
#### Templates

##### Register one    

    AFRAME.registerTemplate('frame1', `  
            <a-sub-assets>
                <img id="pug" src="../assets/pug.jpg">
                <a-asset-item id="horse-mtl" src="assets/monkey.js"></a-asset-item>
            </a-sub-assets>
    
            <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
            <a-box position="-1 0.5 -1" rotation="0 45 0" color="#ccaavv"></a-box>
    
            <a-sky id="sky" src="#pug"></a-sky>
    `);
    
##### Add on scene via component 

    <a-template id="common"></a-template>
    
##### Add on scene via a-route     
     
    <a-route id="frame1" template="frame2"></a-route> 
    
Note: All assets added via template will be loaded dinamically.
 
Note2: Construction like: 

    <a-route id="frame1">
        <a-template id="frame1"></a-template>
    </a-route> 
    
not going to work properly, because there is no guarantee that a-template 
will be attached after a-route. So, use template attribute of a-route instead.    
    
