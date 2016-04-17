# A Model for Evolving Software Systems
For the independent representation of the Attributes and Structure of the Software, the '_Model for Evolving Software Systems_' is used.
It was introduced in "Consistent Software Cities" by Frank Steinbrückner in 2012. [Source][consitentCitiesPaper]

## Short Explanation
The Model consists of the 5-tuple _(G, T, R, fe, A)_.
 * G  = Directed Graph (representing the dependencies/relationship between classes)
 * T  = Hierarchy Tree (representing the containment hierarchy of Packages and Classes)
 * R  = Ordered List of available Software-Versions
 * fe = A function, confirming the existence of a node in a version (or its absence)
 * A  = Property function (Maps the properties of a node to a version)


# Representation in CCV
Since this academic Model is still quite abstract, it needs to be augment for it's usage.

## Directed Graph (G)
A List of the graphs edges (Software Dependencies).
```JS
[
  {
    source : 'node1key',
    target : 'node2key'
  },
  {
    source : 'node1key',
    target : 'node3key'
  }
]
```
> Please note: Every node (target or source) has to be a leaf node in the Tree (T)

## Hierarchy Tree (T)
A Tree, consisting of TreeNode-Objects. The Elements of the software are only represented by their identifiers (or keys).

 * The Root-Node embodies the complete Software
 * Subsequent (non-leaf) Nodes represent Packages of the Software
 * Leaf-Nodes represent Classes

## List of Software-Versions (R)
An ordered List of all Versions. A Version consists of a `key` and it's `label`.
```JS
[
  { key : 'hashV1key', label : 'v0.1' },
  { key : 'hashV2key', label : 'v0.2' }
]
```

## Existence Function (fe)
A Function, taking node-key and version-key as parameters. It will return a boolean value:
```JS
model.exists('node2key', 'version1key'); // returns false
model.exists('node2key', 'version2key'); // returns true 
                                      (because node as added in Version 2)
```

## Property function (A)
A Function, mapping the node-key and the version-key to the nodes attributes in the version.
```JS
model.attributes('node2key', 'version1key'); // returns false
model.attributes('node2key', 'version2key'); // Returns an Attribute Object
```


# Model Extension in CCV
```
@TODO
 * Liste für Messungen/Attribute + Label
 * Welche Messungen/Attribute sind Pflicht?
 * Prüfen: Kann die Visualisierung "unabhängig" mit den restlichen Attributen arbeiten?
```

[//]: #
   [consitentCitiesPaper]: <https://opus4.kobv.de/opus4-btu/frontdoor/index/index/docId/1681>
