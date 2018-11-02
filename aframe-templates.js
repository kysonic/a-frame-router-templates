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

AFRAME.registerComponent('template', {
    schema: {
        name: {
            type: 'string',
            default: ''
        }
    },

    init: function() {
        if(!this.data.name) {
            throw new Error('Name of template cannot be empty');
        }
        if(!AFRAME.templates[this.data.name]) {
            throw new Error('Cannot find "'+ this.data.name +'" template');
        }

        const template = AFRAME.templates[this.data.name];
        var clone = document.importNode(template.content, true);
        this.el.appendChild(clone);
    }
});
