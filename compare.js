function mathFlames(N) {
    if (N === 0) return 'E';
    let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    let currentIndex = 0;
    while (flames.length > 1) {
        currentIndex = (currentIndex + N - 1) % flames.length;
        flames.splice(currentIndex, 1);
    }
    return flames[0];
}

function simFlames(N) {
    if (N === 0) return 'E';
    let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    let letters = flames.map(f => ({ letter: f, eliminated: false }));
    let currentIndex = 0;
    while (flames.length > 1) {
        for (let step = 1; step <= N; step++) {
            let pointer = currentIndex % 6;
            while (letters[pointer].eliminated) {
                currentIndex++;
                pointer = currentIndex % 6;
            }
            if (step === N) {
                letters[pointer].eliminated = true;
                const charToRemove = letters[pointer].letter;
                flames = flames.filter(f => f !== charToRemove);
            }
            currentIndex++;
        }
    }
    return flames[0];
}

let mismatch = false;
for (let i = 1; i <= 100; i++) {
    let m = mathFlames(i);
    let s = simFlames(i);
    if (m !== s) {
        console.log(`Mismatch at N=${i}: Math=${m}, Sim=${s}`);
        mismatch = true;
    }
}
if (!mismatch) console.log("All matched 1 to 100.");
