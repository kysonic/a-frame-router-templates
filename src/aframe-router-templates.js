AFRAME.templates = {};

AFRAME.registerTemplate = function (name, HTML) {
  if (!name) {
    throw new Error('Name of template cannot be empty');
  }

  if (AFRAME.templates[name]) {
    throw new Error('Template "' + name + '" already registered');
  }

  AFRAME.templates[name] = new ATemplateContainer(HTML);
};

class ATemplateContainer {
  constructor(HTML) {
    this.HTML = HTML;
  }

  template(options) {
    const template = document.createElement('template');

    if (typeof this.HTML === 'string') {
      template.innerHTML = this.HTML;
    }
    if (typeof this.HTML === 'function') {
      template.innerHTML = this.HTML(options);
    }
    return template;
  }

  instance(options) {
    this.scene = document.querySelector('a-scene');
    if (!this.scene) {
      throw new Error('Scene is not found');
    }
    var clone = document.importNode(this.template(options).content, true);
    var child = clone.children[0];
    this.scene.appendChild(child);

    return child;
  }
}

class ARouterTemplateNode extends AFRAME.ANode {
  constructor() {
    super();

    this.isAttached = false;
  }

  doConnectedCallback() {
    super.doConnectedCallback();
    this.attach();
  }

  getTemplateOptions() {
    const optionsString = this.getAttribute('options');

    if (!optionsString) {
      return {};
    }

    const options = {};
    const optionsArray = optionsString.split(';');

    optionsArray.forEach(function (item) {
      const itemSplit = item.split(':');
      options[itemSplit[0].trim()] = itemSplit[1].trim();
    });

    return options;
  }

  attachNodes(nodes, idName) {
    // Attach template nodes
    nodes.forEach((child) => {
      if (child.tagName.toLowerCase() === 'a-template') {
        if (child.isAttached) {
          return false;
        }
        const templateNodes = child.getNodes();
        nodes = nodes.concat(templateNodes);
      }
    });

    nodes.forEach((child) => {
      if (child.tagName.toLowerCase() === 'a-sub-assets') {
        if (child.isAttached) {
          return false;
        }

        return child.attach && child.attach();
      }

      if (child.tagName.toLowerCase() === 'a-template') {
        return false;
      }

      const childClone = child.cloneNode(true);
      childClone.dataset[idName] = this.id;
      this.sceneEl.appendChild(childClone);
    });
  }

  attach() {
    console.error('Not implemented');
  }
}

class ATemplate extends ARouterTemplateNode {
  constructor() {
    super();
  }

  attach() {
    const templateName = this.getAttribute('name');

    if (!templateName) {
      return false;
    }

    if (!AFRAME.templates[templateName]) {
      throw new Error('Cannot find "' + templateName + '" template');
    }

    this.options = this.getTemplateOptions();

    const templateContainer = AFRAME.templates[templateName];
    const clone = document.importNode(
      templateContainer.template(this.options).content,
      true,
    );
    this.attachNodes(Array.from(clone.children), 'templateId');
    // Loaded from AFRAME.ANode
    this.load();
    this.isAttached = true;
  }

  getNodes() {
    const templateName = this.getAttribute('name');

    if (!templateName) {
      return false;
    }

    if (!AFRAME.templates[templateName]) {
      throw new Error(`Cannot find template - ${templateName}`);
    }

    this.options = this.getTemplateOptions();

    const templateContainer = AFRAME.templates[templateName];
    const clone = document.importNode(
      templateContainer.template(this.options).content,
      true,
    );

    this.isAttached = true;

    return Array.from(clone.children);
  }
}

customElements.define('a-template', ATemplate);

class ASubAssets extends ARouterTemplateNode {
  constructor() {
    super();
  }

  attach() {
    this.sceneEl = document.querySelector('a-scene');

    if (!this.sceneEl) {
      throw new Error('a-sub-assets cannot find a-scene.');
    }

    this.assets =
      this.sceneEl.querySelector('a-assets') || this.createSceneAssets();

    Array.from(this.children).forEach((child) => {
      const childClone = child.cloneNode(true);
      this.assets.appendChild(childClone);
    });

    this.load();
  }

  createSceneAssets() {
    const assets = document.createElement('a-assets');
    this.sceneEl.appendChild(assets);

    return assets;
  }
}

customElements.define('a-sub-assets', ASubAssets);


AFRAME.registerSystem('router', {
  schema: {
    current: {
      type: 'string',
      default: '',
    },
    previous: {
      type: 'string',
      default: '',
    },
    routes: {
      default: {},
    },
  },

  init() {
    this.collectRoutes();
    this.setupInitialRoute();
  },

  collectRoutes() {
    const routes = Array.from(this.el.querySelectorAll('a-route'));
    routes.forEach(this.registerRoute.bind(this));
  },

  registerRoute(route) {
    if (!route.id) {
      throw new Error('a-route must have id attribute');
    }

    if (this.data.routes[route.id]) {
      throw new Error(
        'Route with following id: ' + route.id + ' is already registered.',
      );
    }

    this.data.routes[route.id] = route;
  },

  setupInitialRoute: function () {
    this.data.current = this.data.current || Object.keys(this.data.routes)[0];
  },

  changeRoute: function (routeId) {
    if (this.data.current === routeId) {
      return false;
    }

    if (!this.data.routes[routeId]) {
      throw new Error(
        'Route with following id: ' + routeId + ' is not registered.',
      );
    }

    this.data.previous = this.data.current;
    this.data.routes[this.data.previous].detach();

    this.data.current = routeId;
    this.data.routes[this.data.current].attach();

    this.el.emit('route-changed', routeId);
  },
});

class ARoute extends ARouterTemplateNode {
  constructor() {
    super();

    this.isRoute = true;
  }

  attach() {
    this.router = this.sceneEl.getAttribute('router');

    if (this.id === this.router.current) {
      this.attachHandler();
    } else {
      this.load();
    }
  }

  attachHandler() {
    if (this.children.length) {
      this.attachNodes(this.children, 'routeId');
    }

    var templateName = this.getAttribute('template');

    if (!templateName) {
      return false;
    }

    if (!AFRAME.templates) {
      throw new Error('Include aframe-templates.js');
    }

    if (!AFRAME.templates[templateName]) {
      throw new Error('Cannot find "' + this.data.name + '" template');
    }
    this.options = this.getTemplateOptions();

    this.aTemplate = AFRAME.templates[templateName];
    const clone = document.importNode(
      this.aTemplate.template(this.options).content,
      true,
    );

    this.attachNodes(Array.from(clone.children), 'routeId');

    this.load();
  }

  disconnectedCallback() {
    if (this.id === this.router.current) {
      this.detach();
    }
  }

  detach() {
    const nodes = Array.from(
      this.sceneEl.querySelectorAll('*[data-route-id=' + this.id + ']'),
    );

    nodes.forEach((node) => {
      this.sceneEl.removeChild(node);
    });
  }
}

customElements.define('a-route', ARoute);
