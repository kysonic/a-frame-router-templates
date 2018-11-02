/* global AFRAME */


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

AFRAME.registerElement('a-route', {
    prototype: Object.create(window.HTMLElement.prototype, {
        createdCallback: {
            value: function () {
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

        attach: {
            value: function () {
                var self = this;
                [].forEach.call(this.children, function (child) {
                    var childClone = child.cloneNode(true);
                    childClone.dataset.routeId = self.id;
                    self.scene.appendChild(childClone);
                });
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
        },

        emit: {value: function (type, data) {}}
    })
});
