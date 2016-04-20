/**
 * All shapes occupy a square area.
 * It's dimensions described by the vector `dimensions`.
 * It can be placed on and rotated around the shapes centroid.
 * 
 * @interface
 */
class BaseShape {
    constructor(key) {
        if (new.target === BaseShape) {
            throw new TypeError("Cannot construct instances of this class directly");
        }

        this._key = String(key);
    }

    get key() {
        return this._key;
    }

    get centroid () {
        return {
            x: this.dimensions.x / 2,
            y: this.dimensions.y / 2
        }
    }

    /**
     * Get the vector for the Shape's qubic size
     * @return {Object}
     */
    get dimensions() {};

    /**
     * //@TODO: Bessere Definition
     * Set the Size of the Shape
     * @param  {int} val
     */
    set size(val) {};

    /**
     * Set absolute X-Coordinates for this shapes centroid, to place it in the scene
     * @param  {int} coordinates
     */
    set absoluteX(x) {};

    /**
     * Set absolute Y-Coordinates for this shapes centroid, to place it in the scene
     * @param  {int} coordinates
     */
    set absoluteY(y) {};

    /**
     * Set the rotation around the shapes centroid.
     * @param  {int} degrees clockwise rotation
     */
    set rotation(degrees){};

    draw() {};
}

module.exports = BaseShape;
