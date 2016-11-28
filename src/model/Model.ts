import {Dependency} from "../components/Dependency";
import {TreeNode} from "../components/TreeNode";
import {Version} from "../components/Version";

export abstract class Model implements SoftwareModel {
    public abstract getGraph(): Dependency[];
    public abstract getTree(): TreeNode;
    public abstract getVersions(): Version[];
    public abstract exists(node: TreeNode, version: Version): Boolean;
    public abstract getAttributes(node: TreeNode, version: Version): AttributeContainer;
}

interface NodeAttributes { [index: string]: AttributeContainer; }
interface AttributeHistory { [index: string]: NodeAttributes; }

export class DummyModel extends Model {
    private pGraph: Dependency[];
    private pTree: TreeNode;
    private pVersions: Version[];
    private pAttributes: AttributeHistory;

    constructor() {
        super ();

        // Prepare
        let marmoset = new TreeNode("marmoset");
        let tortoise = new TreeNode("tortoise");

        /* Step 1: Create Tree */
        this.pTree = new TreeNode("zoo");
        this.pTree.add("mammals");
        (this.pTree.find("mammals") as TreeNode).add("armadillo");
        (this.pTree.find("mammals") as TreeNode).add("bentaltiger");
        (this.pTree.find("mammals") as TreeNode).add("zebra");
        (this.pTree.find("mammals") as TreeNode).add("elephant");
        (this.pTree.find("mammals") as TreeNode).add("monkeys");
        (this.pTree.find("monkeys") as TreeNode).add("callitrichidae");
        (this.pTree.find("callitrichidae") as TreeNode).add(marmoset);
        (this.pTree.find("callitrichidae") as TreeNode).add("tamarin");
        (this.pTree.find("monkeys") as TreeNode).add("cebidae ");
        (this.pTree.find("cebidae ") as TreeNode).add("squirrelmonkey");
        (this.pTree.find("cebidae ") as TreeNode).add("capuchin");
        (this.pTree.find("monkeys") as TreeNode).add("chimp");
        (this.pTree.find("monkeys") as TreeNode).add("macaque");
        (this.pTree.find("monkeys") as TreeNode).add("orangutan");
        (this.pTree.find("monkeys") as TreeNode).add("gorilla");
        (this.pTree.find("monkeys") as TreeNode).add("langur");
        (this.pTree.find("monkeys") as TreeNode).add("baboon");
        (this.pTree.find("monkeys") as TreeNode).add("douc");
        (this.pTree.find("mammals") as TreeNode).add("cats");
        (this.pTree.find("cats") as TreeNode).add("lynx");
        (this.pTree.find("cats") as TreeNode).add("silvestris");
        (this.pTree.find("cats") as TreeNode).add("cafra");
        (this.pTree.find("cats") as TreeNode).add("caucasica");
        (this.pTree.find("cats") as TreeNode).add("caudata");
        (this.pTree.find("cats") as TreeNode).add("chutuchta");
        (this.pTree.find("cats") as TreeNode).add("cretensis");
        (this.pTree.find("cats") as TreeNode).add("gordoni");
        (this.pTree.find("cats") as TreeNode).add("grampia");
        (this.pTree.find("cats") as TreeNode).add("griselda");
        (this.pTree.find("cats") as TreeNode).add("hausa");
        (this.pTree.find("cats") as TreeNode).add("jordansi");
        (this.pTree.find("cats") as TreeNode).add("lybica");
        (this.pTree.find("cats") as TreeNode).add("nesterovi");
        (this.pTree.find("cats") as TreeNode).add("ornata");
        (this.pTree.find("cats") as TreeNode).add("reyi");
        (this.pTree.find("cats") as TreeNode).add("rubida");
        (this.pTree.find("cats") as TreeNode).add("tristrami");
        (this.pTree.find("cats") as TreeNode).add("ugandae");
        (this.pTree.find("mammals") as TreeNode).add("marsupials");
        (this.pTree.find("marsupials") as TreeNode).add("opossum");
        (this.pTree.find("marsupials") as TreeNode).add("mole");
        (this.pTree.find("marsupials") as TreeNode).add("kowari");
        (this.pTree.find("marsupials") as TreeNode).add("kaluta");
        (this.pTree.find("marsupials") as TreeNode).add("quoll");
        (this.pTree.find("mammals") as TreeNode).add("fox");
        (this.pTree.find("fox") as TreeNode).add("cerdocyon");
        (this.pTree.find("fox") as TreeNode).add("otocyon");
        (this.pTree.find("fox") as TreeNode).add("grayfox");
        (this.pTree.find("fox") as TreeNode).add("fennecfox");
        (this.pTree.find("fox") as TreeNode).add("arcticfox");
        (this.pTree.find("fox") as TreeNode).add("redfox");
        (this.pTree.find("mammals") as TreeNode).add("marine");
        (this.pTree.find("marine") as TreeNode).add("dolphin");
        (this.pTree.find("marine") as TreeNode).add("seal");
        (this.pTree.find("marine") as TreeNode).add("manatee");
        (this.pTree.find("marine") as TreeNode).add("sealion");
        (this.pTree.find("marine") as TreeNode).add("otter");
        (this.pTree.find("mammals") as TreeNode).add("hyena");
        (this.pTree.find("hyena") as TreeNode).add("hyena1");
        (this.pTree.find("hyena1") as TreeNode).add("hyena2");
        (this.pTree.find("hyena2") as TreeNode).add("spottedhyena");
        this.pTree.add("reptiles");
        (this.pTree.find("reptiles") as TreeNode).add("gecko");
        (this.pTree.find("reptiles") as TreeNode).add(tortoise);

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
        this.pVersions.sort((a: any, b: any) => {
            return parseInt(a, 10) - parseInt(b, 10);
        });

        /* Step 4: Create AttributeContainer */
        this.pAttributes = <AttributeHistory> {};
        for (const v of this.pVersions) {
            this.pAttributes[String(v)] = {} as NodeAttributes;
            this.createAttributes(this.pTree, v);
        }
    }

    public getGraph(): Dependency[] {
        return this.pGraph;
    }

    public getTree(): TreeNode {
        return this.pTree;
    }

    public getVersions(): Version[] {
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
            return !!(mammals && mammals.find(node));
        }

        return !!this.pTree.find(node);
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
                    name: t,
                    loc : this.hashString("loc" + t + v) % 687,
                    editors : 1 + this.hashString("edit" + t + v) % 14
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
