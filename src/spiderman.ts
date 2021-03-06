const spiderman = {
    name: "Peter Parket",
    actor: "Tom Holland",
    films: ["Homecomming", "Far from home", "No way home"],
};

interface ISpiderman {
    name: string,
    actor: string,
    films: string[]
}

type Spiderman = {
    actor: string,
    name?: string,
    films?: string[]  
}

const tom: Spiderman = {
    actor: "Tom Holland"
}

const andrew: Spiderman = {
    actor: "Andrew Garfield"
}

const tobie: Spiderman = {
    actor: "Tobie Maguire"
}

type Names = "A" | "B" | "C";

type SpidermanBase = {
    name: Names;
}

type FirstSpiderMan = SpidermanBase & {name: "B"}

const spider: SpidermanBase = {name: "C"};
const firstSpider: FirstSpiderMan = {name: "B"};




