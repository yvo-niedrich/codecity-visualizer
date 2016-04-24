/**
 * This Renderer can create a City with ThreeJS
 * 
 * @implements BaseRenderer
 */
class BaseRenderer {
    constructor(model, illustration, options) {
        this._model = model;
        this._illustration = illustration;
        this._options = options;
        this._rules = [];
    };

    addRule(rule) {
        this._rules.push(rule);
    };

    render(target) {
        // TODO!
    };
}

module.exports = BaseRenderer;