/* global AFRAME */

AFRAME.templates = {};

AFRAME.registerTemplate = function(name, HTML) {
    if(!name) {
        throw new Error('Name of template cannot be empty');
    }
    if(AFRAME.templates[name]) {
        throw new Error('Template "'+ name +'" already registered');
    }

    var template = document.createElement('template');
    template.innerHTML = HTML;

    AFRAME.templates[name] = template;
};


AFRAME.registerSystem('router', {
    schema: {
        current: {
            type: 'string',
            default: ''
        },
        previous: {
            type: 'string',
            default: ''
        },
        routes: {
            default: {}
        }
    },

    init: function () {
        this.collectRoutes();
        this.setupInitialRoute();
    },

    collectRoutes: function () {
        var routes = [].slice.call(this.el.querySelectorAll('a-route'));
        routes.forEach(this.registerRoute.bind(this));
    },

    registerRoute: function (route) {
        if (!route.id) {
            throw new Error('a-route must have id attribute');
        }
        if (this.data.routes[route.id]) {
            throw new Error('Route with following id: ' + route.id + ' is already registered.');
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
            throw new Error('Route with following id: ' + route.id + ' is not registred.');
        }
        this.data.previous = this.data.current;
        this.data.routes[this.data.previous].detach();

        this.data.current = routeId;
        this.data.routes[this.data.current].attach();
    }
});

var commonPrototype = {
    closestScene: {
        value: function closest() {
            var element = this;
            while (element) {
                if (element.isScene) {
                    break;
                }
                element = element.parentElement;
            }
            return element;
        }
    },

    attachNodes: {
        value: function (nodes) {
            var self = this;
            [].forEach.call(nodes, function (child) {
                if (child.tagName.toLowerCase() === 'a-sub-assets') {
                    if (child.isAttached) {
                        return false;
                    }
                    return child.attach && child.attach();
                }
                var childClone = child.cloneNode(true);
                childClone.dataset.routeId = self.id;
                self.scene.appendChild(childClone);
            });
        }
    }
}

AFRAME.registerElement('a-route', {
    prototype: Object.create(window.HTMLElement.prototype, Object.assign({
        createdCallback: {
            value: function () {
                this.isRoute = true;
                this.scene = this.closestScene();
                this.router = this.scene.getAttribute('router');
            }
        },

        attachedCallback: {
            value: function () {
                if (this.id === this.router.current) {
                    this.attach();
                }
            }
        },

        detachedCallback: {
            value: function () {
                if (this.id === this.router.current) {
                    this.detach();
                }
            }
        },

        attach: {
            value: function () {
                if (this.children.length) {
                    this.attachNodes(this.children);
                }
                var templateName = this.getAttribute('template');

                if (!templateName) {
                    return false;
                }

                if(!AFRAME.templates) {
                    throw new Error('Include aframe-templates.js');
                }

                if (!AFRAME.templates[templateName]) {
                    throw new Error('Cannot find "' + this.data.name + '" template');
                }

                const template = AFRAME.templates[templateName];
                var clone = document.importNode(template.content, true);
                this.attachNodes(clone.children);
            }
        },

        detach: {
            value: function () {
                var self = this;
                const nodes = [].slice.call(this.scene.querySelectorAll('*[data-route-id=' + this.id + ']'));
                nodes.forEach(function (node) {
                    self.scene.removeChild(node);
                });
            }
        }
    }, commonPrototype))
});

/**
 * So how assets should be represented as child of a-scene
 * we have to handle it separately
 */

AFRAME.registerElement('a-sub-assets', {
    prototype: Object.create(window.HTMLElement.prototype, {
        createdCallback: {
            value: function () {
                this.isAttached = false;
            }
        },
        attach: {
            value: function () {
                var self = this;
                this.isAttached = true;
                this.scene = document.querySelector('a-scene');
                if (!this.scene) {
                    throw new Error('a-route-assets cannot find a-scene.');
                }
                this.assets = this.scene.querySelector('a-assets') || this.createSceneAssets();
                [].forEach.call(this.children, function (child) {
                    var childClone = child.cloneNode(true);
                    self.assets.appendChild(childClone);
                });
            }
        },

        createSceneAssets: {
            value: function () {
                var assets = document.createElement('a-assets');
                this.scene.appendChild(assets);
                return assets;
            }
        }
    })
});

AFRAME.registerElement('a-template', Object.assign({
    prototype: Object.create(window.HTMLElement.prototype, Object.assign({
        createdCallback: {
            value: function () {
                this.scene = this.closestScene();
            }
        },

        attachedCallback: {
            value: function () {
                this.attach();
            }
        },

        attach: {
            value: function () {
                var templateName = this.id;

                if (!templateName) {
                    return false;
                }

                if (!AFRAME.templates[templateName]) {
                    throw new Error('Cannot find "' + templateName + '" template');
                }

                const template = AFRAME.templates[templateName];
                var clone = document.importNode(template.content, true);
                this.attachNodes(clone.children);
            }
        }
    }, commonPrototype))
}));
