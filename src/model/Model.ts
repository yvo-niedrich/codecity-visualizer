import {AttributeContainer, SoftwareModel} from "../components/Interfaces";
import {Dependency} from "../components/Dependency";
import {TreeNode} from "../components/TreeNode";
import {Version} from "../components/Version";

export abstract class Model implements SoftwareModel {
    public abstract getGraph(): Array<Dependency>;
    public abstract getTree(): TreeNode;
    public abstract getVersions(): Array<Version>;
    public abstract exists(node: TreeNode, version: Version): Boolean;
    public abstract getAttributes(node: TreeNode, version: Version): AttributeContainer;
}

interface NodeAttributes { [index: string]: AttributeContainer; }
interface AttributeHistory { [index: string]: NodeAttributes; }

export class DummyModel extends Model {
    private pGraph: Array<Dependency>;
    private pTree: TreeNode;
    private pVersions: Array<Version>;
    private pAttributes: AttributeHistory;

    constructor() {
        super ();

        // Prepare
        let marmoset = new TreeNode("marmoset");
        let tortoise = new TreeNode("tortoise");

        /* Step 1: Create Tree */
        this.pTree = new TreeNode("zoo");
        this.pTree.add("mammals");
        this.pTree.find("mammals").add("armadillo");
        this.pTree.find("mammals").add("bentaltiger");
        this.pTree.find("mammals").add("zebra");
        this.pTree.find("mammals").add("elephant");
        this.pTree.find("mammals").add("monkeys");
        this.pTree.find("monkeys").add("callitrichidae");
        this.pTree.find("callitrichidae").add(marmoset);
        this.pTree.find("callitrichidae").add("tamarin");
        this.pTree.find("monkeys").add("cebidae ");
        this.pTree.find("cebidae ").add("squirrelmonkey");
        this.pTree.find("cebidae ").add("capuchin");
        this.pTree.find("monkeys").add("chimp");
        this.pTree.find("monkeys").add("macaque");
        this.pTree.find("monkeys").add("orangutan");
        this.pTree.find("monkeys").add("gorilla");
        this.pTree.find("monkeys").add("langur");
        this.pTree.find("monkeys").add("baboon");
        this.pTree.find("monkeys").add("douc");
        this.pTree.find("mammals").add("cats");
        this.pTree.find("cats").add("lynx");
        this.pTree.find("cats").add("silvestris");
        this.pTree.find("cats").add("cafra");
        this.pTree.find("cats").add("caucasica");
        this.pTree.find("cats").add("caudata");
        this.pTree.find("cats").add("chutuchta");
        this.pTree.find("cats").add("cretensis");
        this.pTree.find("cats").add("gordoni");
        this.pTree.find("cats").add("grampia");
        this.pTree.find("cats").add("griselda");
        this.pTree.find("cats").add("hausa");
        this.pTree.find("cats").add("jordansi");
        this.pTree.find("cats").add("lybica");
        this.pTree.find("cats").add("nesterovi");
        this.pTree.find("cats").add("ornata");
        this.pTree.find("cats").add("reyi");
        this.pTree.find("cats").add("rubida");
        this.pTree.find("cats").add("tristrami");
        this.pTree.find("cats").add("ugandae");
        this.pTree.find("mammals").add("marsupials");
        this.pTree.find("marsupials").add("opossum");
        this.pTree.find("marsupials").add("mole");
        this.pTree.find("marsupials").add("kowari");
        this.pTree.find("marsupials").add("kaluta");
        this.pTree.find("marsupials").add("quoll");
        this.pTree.find("mammals").add("fox");
        this.pTree.find("fox").add("cerdocyon");
        this.pTree.find("fox").add("otocyon");
        this.pTree.find("fox").add("grayfox");
        this.pTree.find("fox").add("fennecfox");
        this.pTree.find("fox").add("arcticfox");
        this.pTree.find("fox").add("redfox");
        this.pTree.find("mammals").add("marine");
        this.pTree.find("marine").add("dolphin");
        this.pTree.find("marine").add("seal");
        this.pTree.find("marine").add("manatee");
        this.pTree.find("marine").add("sealion");
        this.pTree.find("marine").add("otter");
        this.pTree.find("mammals").add("hyena");
        this.pTree.find("hyena").add("hyena1");
        this.pTree.find("hyena1").add("hyena2");
        this.pTree.find("hyena2").add("spottedhyena");
        this.pTree.add("reptiles");
        this.pTree.find("reptiles").add("gecko");
        this.pTree.find("reptiles").add(tortoise);

        /* Step 2: Create Graph */
        this.pGraph = [
            new Dependency(tortoise, tortoise)
            // Because the marmoset likes to ride on a tortoise
        ];

        /* Step 3: Create versions */
        this.pVersions = [
            new Version("alpha", "Two Weeks before Opening", 1462060800),
            new Version("v1.0",  "Opening Day", 1463216400)
        ];

        // Ensure order
        this.pVersions.sort(function(a: any, b: any) {
            return parseInt(a, 10) - parseInt(b, 10);
        });

        /* Step 4: Create AttributeContainer */
        this.pAttributes = <AttributeHistory> {};
        for (const v of this.pVersions) {
            this.pAttributes[String(v)] = <NodeAttributes> {};
            this.createAttributes(this.pTree, v);
        }
    }

    /** @deprecated */
    public get graph() {
        return this.getGraph();
    }
    /** @deprecated */
    public get tree() {
        return this.getTree();
    }
    /** @deprecated */
    public get versions() {
        return this.getVersions();
    }
    /** @deprecated */
    public attributes(node: TreeNode, version: Version) {
        return this.getAttributes(node, version);
    }

    public getGraph(): Array<Dependency> {
        return this.pGraph;
    }

    public getTree(): TreeNode {
        return this.pTree;
    }

    public getVersions(): Array<Version> {
        return this.pVersions;
    }

    public exists(node: TreeNode, version: Version): Boolean {
        // In Alpha-Version, some animals were missing
        if (String(version) === "alpha") {

            // Only Cats, whose name began with "a-i" were available
            const cats = this.pTree.find("cats");
            if (cats && cats.find(node)) {
                return String(node)[0] <= "i";
            }

            // Since Reptiles were acquired later, they are first available on opening day
            const mammals = this.pTree.find("mammals");
            return mammals && mammals.find(node) ? true : false;
        }

        return true;
    }

    public getAttributes(node: TreeNode, version: Version): AttributeContainer {
        const n = String(node);
        const v = String(version);

        if (!this.pAttributes[v] || !this.pAttributes[v][n]) {
            return {};
        }

        return this.pAttributes[v][n];
    }

    private createAttributes(tree: TreeNode, version: Version): void {
        if (!tree.children.length) {
            if (this.exists(tree, version)) {
                const t = String(tree);
                const v = String(version);
                this.pAttributes[v][t] = {
                    "name": t,
                    "loc" : this.hashString("loc" + t + v) % 687,
                    "editors" : 1 + this.hashString("edit" + t + v) % 14
                };
            }
            return;
        }

        for (const c of tree.children) {
            this.createAttributes(c, version);
        }
    }

    private hashString(str: string): number {
        // https://github.com/darkskyapp/string-hash
        let hash = 17;
        let i = str.length;
        while (i) {
            hash = (hash * 11) ^ str.charCodeAt(--i);
        }
        return hash >>> 0;
    }
}
