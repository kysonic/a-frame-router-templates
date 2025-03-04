import 'aframe';
import './aframe-router-templates';
import './templates';

document.addEventListener('aframeready', () => {
  const router = document.getElementById('scene').systems['router'];

  window.changeRoute = function changeRoute(routeId) {
    router.changeRoute(routeId);
  };

  window.instance = function instance() {
    AFRAME.templates['box'].instance({
      position: `0 2 -${Math.floor(Math.random() * 3)}`,
    });
  };
});
