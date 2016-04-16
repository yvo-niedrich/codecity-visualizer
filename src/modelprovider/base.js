// This BaseModelPriver cannot be Instantiated
// It specifies the contract between ModelProvider and Visualizer.

class BaseModelProvider {
    constructor() {
        if (new.target === BaseModelProvider) {
            throw new TypeError("Cannot construct instances of this class directly");
        }
    }
}

module.exports = BaseModelProvider;
