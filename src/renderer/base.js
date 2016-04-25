/**
 * This is what a Renderer has to look like
 * 
 * @interface
 */
class BaseRenderer {
    constructor(model, illustration, options) {};
    render(target) {};
}

module.exports = BaseRenderer;
