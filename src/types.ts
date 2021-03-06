interface functional {
    nombre: string,
    f: (a: number) => string,
}

let f: functional = {
    nombre: "santiago",
    f: (a: number): string => {return a.toString()}
}

type DescribableFunction = {
    description: string,
    (someArg: number): boolean,
};
  
 function doSomething(fn: DescribableFunction) {
    console.log(fn.description + " returned " + fn(6));
 }

 const mydf: DescribableFunction = (arg: number) => {return arg > 0};

 mydf.description = "mi función";

 doSomething(mydf);



