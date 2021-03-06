const array: number[] = [1, 2, 3, 4];

array.flatMap ((value, index, array) => {
    array[index+1] = -1;
    console.log(value);
   
})

console.log(array);




