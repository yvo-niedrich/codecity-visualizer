class TreeNode {
    constructor(identifier) {
        this._id       = identifier;
        this._children = [];
        this._parent   = null;
    }

    add(child) {
        if (typeof child !== 'function') {
            child = new TreeNode(child);
        }

        child.parent = this;
        this._children.push(child);
    }

    find(identifier) {
        if (this._id == identifier) {
            return this;
        }

        for (var child of this._children) {
            var result = child.find(identifier);
            if (result) {
                return result;
            }
        }

        return false;
    }

    get children() {
        return this._children;
    }

    get parent() {
        return this._parent;
    }

    set parent(node) {
        this._parent = node;
    }
}

module.exports = TreeNode;
