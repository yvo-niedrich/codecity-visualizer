/**
 * All shapes occupy a qubic space with (0|0|0) as it's origin.
 * The qube's size is defined by the dimensions attribute.
 * 
 * @interface
 */
class BaseShape {
    construct() {
        if (new.target === BaseShape) {
            throw new TypeError("Cannot construct instances of this class directly");
        }
    }

    /**
     * Get the vector for the Shape's qubic size
     * @return {Coordinates}
     */
    get dimensions() {};

    /**
     * Get coordinates for the connector of this shape
     * @return {Coordinates}
     */
    get connector() {};

    /**
     * Set absolute Coordinates for this shapes origin, to place it in the scene
     * @param  {coordinates} coordinates
     */
    set absoluteOrigin(coordinates) {};

    draw() {};
}
