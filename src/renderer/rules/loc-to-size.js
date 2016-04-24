rule = function (shape, version, model) {
    // Applies only to classes
    if (model.tree.find(shape.key).children.length) {
        return;
    }


    // Model has Attribute LOC?
    // get LOC for Version/Node (shape.key)
    // 
    return 1;
};

module.exports = rule;