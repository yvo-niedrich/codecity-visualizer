class TreeNode {
    constructor(identifier) {
        this._id       = identifier;
        this._children = [];
        this._parent   = null;
    }

    add(child) {
        console.log(typeof child)
        if (typeof child !== 'function') {
            child = new TreeNode(child);
        }

        child.parent = this;
        this._children.push(child);
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
