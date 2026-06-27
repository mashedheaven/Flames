function testFlames(name1, name2) {
    name1 = name1.toLowerCase().replace(/[^a-z]/g, '');
    name2 = name2.toLowerCase().replace(/[^a-z]/g, '');

    const arr1 = name1.split('');
    const arr2 = name2.split('');

    let count1 = [...arr1];
    let count2 = [...arr2];

    for (let i = 0; i < count1.length; i++) {
        for (let j = 0; j < count2.length; j++) {
            if (count1[i] === count2[j] && count1[i] !== null) {
                count1[i] = null;
                count2[j] = null;
                break;
            }
        }
    }

    const remainingCount = count1.filter(c => c !== null).length + count2.filter(c => c !== null).length;
    console.log("N is:", remainingCount);

    if (remainingCount === 0) return 'E';

    let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    let letters = flames.map(f => ({ letter: f, eliminated: false }));
    
    let currentIndex = 0;

    while (flames.length > 1) {
        for (let step = 1; step <= remainingCount; step++) {
            let pointer = currentIndex % 6;
            while (letters[pointer].eliminated) {
                currentIndex++;
                pointer = currentIndex % 6;
            }

            if (step === remainingCount) {
                letters[pointer].eliminated = true;
                const charToRemove = letters[pointer].letter;
                flames = flames.filter(f => f !== charToRemove);
            }
            
            currentIndex++;
        }
    }
    return flames[0];
}

console.log("Rahul + Anjali ->", testFlames("Rahul", "Anjali"));
