/**
 * This is what a Renderer has to look like
 * 
 * @interface
 */
class BaseRenderer {
    constructor(model, illustration, options) {};
    addRule(rule) {};
    render(target) {};
}

module.exports = BaseRenderer;
