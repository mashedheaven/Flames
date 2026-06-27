let remainingCount = 7;
let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
let letters = [
    { classList: { contains: () => false, add: ()=>{}, remove: ()=>{} }, dataset: { letter: 'F' } },
    { classList: { contains: () => false, add: ()=>{}, remove: ()=>{} }, dataset: { letter: 'L' } },
    { classList: { contains: () => false, add: ()=>{}, remove: ()=>{} }, dataset: { letter: 'A' } },
    { classList: { contains: () => false, add: ()=>{}, remove: ()=>{} }, dataset: { letter: 'M' } },
    { classList: { contains: () => false, add: ()=>{}, remove: ()=>{} }, dataset: { letter: 'E' } },
    { classList: { contains: () => false, add: ()=>{}, remove: ()=>{} }, dataset: { letter: 'S' } }
];

let currentIndex = 0;

while (flames.length > 1) {
    for (let step = 1; step <= remainingCount; step++) {
        let pointer = currentIndex % 6;
        while (letters[pointer].classList.contains('eliminated')) {
            currentIndex++;
            pointer = currentIndex % 6;
        }

        if (step === remainingCount) {
            letters[pointer].classList.contains = (cls) => cls === 'eliminated'; // mock eliminated
            const charToRemove = letters[pointer].dataset.letter;
            flames = flames.filter(f => f !== charToRemove);
            console.log('Crossed out: ' + charToRemove + '. Remaining: ' + flames.join('-'));
        }
        
        currentIndex++;
    }
}
console.log('Final: ' + flames[0]);
