/**
 * This is what a SoftwareModel has to look like
 * 
 * @interface
 */
class BaseRenderer {
    constructor(model, illustration, options) {};
    addShape(shape) {};
    addRule(rule) {};
    render(target) {};
}

module.exports = BaseRenderer;