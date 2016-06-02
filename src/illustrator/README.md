# Creating a City
As there are many different approaches to Code Citys, any of them can be implemented as long as the model supports all the required information.

<br />

# Illustrator

## Evostreets
The main focus of the [Evostreet][ConsitentCitiesPaper] approach is long term consistency. All features introduced in the paper are implemented, but as many of these also increase the complexity and impair the general view, they can be configured and disabled (in the StreetContainer).

 * `highway.length` _(Default: `40`)_ <br />
    Length of the main highway in pixels
 * `highway.color` _(Default: `0x156289`)_ <br />
    Color of the main highway in rgb
 * `street.length` _(Default: `20`)_ <br />
    Length of the the roads in pixels
 * `street.color` _(Default: `0x156289`)_ <br />
    Color of the the roads in rgb
 * `house.length` _(Default: `12`)_ <br />
    Length of the the houses in pixels
 * `house.width` _(Default: `12`)_ <br />
    Width of the the houses in pixels
 * `house.height` _(Default: `12`)_ <br />
    Height of the the houses in pixels
 * `house.margin` _(Default: `3`)_ <br />
    Margin around houses in pixels
 * `house.color` _(Default: `0x1A212E`)_ <br />
    Color of the the houses in rgb
 * `evostreet.container` _(Default: `StreetContainer`)_ <br />
    The container to be used. One container will be created for every level of the tree
 * `evostreet.options` _(Default: `{}`)_ <br />
    Every container instance will be initialised with these options


## Districts
Districts implements the original Code City Layout approach by [Richard Wettel][WettelCodeCitieIO]. A platform element will be created for every node of the models hierarchy tree. It will be inserted in the `district.container` on initialisation.

 * `house.length` _(Default: `12`)_ <br />
    Length of the the houses in pixels
 * `house.width` _(Default: `12`)_ <br />
    Width of the the houses in pixels
 * `house.height` _(Default: `12`)_ <br />
    Height of the the houses in pixels
 * `house.margin` _(Default: `3`)_ <br />
    Margin around houses in pixels
 * `house.color` _(Default: `0x1A212E`)_ <br />
    Color of the the houses in rgb
 * `platform.height` _(Default: `10`)_ <br />
    Height of the platform element
 * `platform.color` _(Default: `0x000000`)_ <br />
    Color of the the platform element in rgb
 * `district.container` _(Default: `DistrictContainer`)_ <br />
    The container to be used. One container will be created for every level of the tree
 * `district.options` _(Default: `{}`)_ <br />
    Every container instance will be initialised with these options

<br />

# Container
Groups of shape-elements (usually all elements of the same level in a software) are stored in containers until they are drawn by the illustrator. Containers extend the Shape-Class themselfs, so they can even store any other container. Once the `draw` command is called, the container and all underlying elements will be finalized before they are drawn.
Every container implements the `Configurable`-interface and some can be configured. Options can be set with `container.setOption('optionKey', newValue);`.

## Universal Container

### Row
Arranges every shape along the x-axis in the exact order, they were added to the row.
Can be mirrored along the x-axis, so the shapes are *below* the axis. If the container should be mirrored, the `mirrored` flag needs to be `true` on initialisation.

### Grid
Arranges the shapes in a rectangle with the as introduced in the [Strip Treemap Approach][StripTreemaps]. The input order is not changed, therefore it's use of available space can be subpar.
an be mirrored along the x-axis, so the shapes are *below* the axis. If the container should be mirrored, the `mirrored` flag needs to be `true` on initialisation.
 * `optimalAspectRatio` --  _(Default: `1.0`)_

### Lightmap
The Lightmap-Approach aims to create a small rectangle with the best aspect ratio, filled with all the shapes. It was introduced to code cities by [Richard Wettel][WettelPub]. These shapes will be sorted, so consistency can not be guaranteed.
Can be mirrored along the x-axis, so the shapes are *below* the axis. If the container should be mirrored, the `mirrored` flag needs to be `true` on initialisation.
 * `cutHorizontalFirst` --  _(Default: `true`)_

------------------------

## Layout specific container

### StreetContainer
Evostreet-Container accepts:
 * `Street`-Shape (only one street is accepted!)
 * `House`-Shapes
 * `StreetContainer`

<br />

A single container represents a non-leaf node of the models structure-tree: The node itself is represented by the street, it's children are the houses and container (or the other branching streets). Houses and branches can be configured similarly:
 * `house.container` / `branch.container` _(Default: `RowContainer`)_ <br />
   Houses and branches are not drawn directly, they are first stored in a container. This allows for a configurable positioning of every street-component.
 * `house.distribution` / `branch.distribution` _(Default: `'default'`)_ <br />
   House- and branches-container will be placed on either side of the road, but how the shapes are distributed to these can be configured:
    * `'default'`: Place the shapes alternating into the left and right container
    * `'left'`: Place all shapes in the left container
    * `'right'`: Place all shapes in the right container
    * `function(shape) { return shape.attribute; }`: Place the shapes into the left and right container, alternating by given attribute-order
 * `house.segmentation` / `branch.segmentation` _(Default: `null`)_ <br />
   You are not limited to one element-container on each side of the road. If you want to devide your branches or houses into different segments along the road, just give the desired shape-attribute and a new container will be created for every distinct value.
 * `house.segmentorder` / `branch.segmentorder` _(Default: `null`)_ <br />
   By default the segment-containers are sorted by the shapes value (beginning with the smallest). This can be changed by suppling an alternative [compareFunction][JSCompare].
 * `spacer`
   * `spacer.initial` _(Default: `15`)_ <br />
     Initial Space, before any element/container will be positioned.
   * `spacer.branches` _(Default: `10`)_ <br />
     Don't line branches together, but let them breath
   * `spacer.terranullius` _(Default: `20`)_ <br />
     Space between the last branch- and the first house-container
   * `spacer.conclusive` _(Default: `0`)_ <br />
     Space after the last drawn container at the end of the road


### DistrictContainer
District-Container accepts:
 * `Platform`-Shape (only one platform is accepted!)
 * `House`-Shapes
 * `BaseContainer`

 <br />

 A single container represents a non-leaf node of the models structure-tree: The node itself is represented by the platform, it's children are the houses and districts, placed on top of it. The container for houses and districts can be configured similarly:
* `house.container` / `district.container` _(Default: `LightmapContainer`)_ <br />
   Houses and Districts are not drawn directly, they are first stored in a container. This allows for a configurable positioning of every district-component.
* `district.options` / `houses.options`  _(Default: `false`)_ <br />
  Every container will be instantiated with the its `options` as second parameter. This means it's the `isMirrored`-Parameter for BaseContainer and the `options`-Parameter for `SpecificContainer`.
 * `spacer`
   * `spacer.margin` _(Default: `10`)_ <br />
     Creates a margin on the outside of the platform
   * `spacer.padding` _(Default: `5`)_ <br />
     Padding between houses and the edge of the platform

<br />

[//]: #
   [ConsitentCitiesPaper]: <https://opus4.kobv.de/opus4-btu/frontdoor/index/index/docId/1681>
   [WettelCodeCitieIO]: <http://wettel.github.io/codecity.html>
   [StripTreemaps]: <http://hcil2.cs.umd.edu/trs/2001-18/2001-18.html>
   [WettelPub]: <http://wettel.github.io/publications.html>
   [JSCompare]: <http://www.w3schools.com/jsref/jsref_sort.asp>
