const calculateBtn = document.getElementById('calculate-btn');
const name1Input = document.getElementById('name1');
const name2Input = document.getElementById('name2');
const animationStage = document.getElementById('animation-stage');
const name1Display = document.getElementById('name1-display');
const name2Display = document.getElementById('name2-display');
const flamesDisplay = document.getElementById('flames-display');
const resultDialog = document.getElementById('result-dialog');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const closeDialogBtn = document.getElementById('close-dialog-btn');
const infoSummary = document.getElementById('info-summary');
const gameDescription = document.getElementById('game-description');

// Toggle 'How it works' section
if (infoSummary && gameDescription) {
    infoSummary.addEventListener('click', () => {
        gameDescription.classList.toggle('open');
    });
}

const FLAMES_MEANINGS = {
    'F': { title: 'Friends', color: '#3b82f6', message: 'You are meant to be good friends!' },
    'L': { title: 'Lovers', color: '#ec4899', message: 'True love is in the air!' },
    'A': { title: 'Affection', color: '#f43f5e', message: 'There is deep affection between you two.' },
    'M': { title: 'Marriage', color: '#eab308', message: 'Wedding bells are ringing!' },
    'E': { title: 'Enemies', color: '#ef4444', message: 'Uh oh, watch out for each other!' },
    'S': { title: 'Siblings', color: '#10b981', message: 'You share a bond like siblings.' }
};

calculateBtn.addEventListener('click', async () => {
    const name1 = name1Input.value.toLowerCase().replace(/[^a-z]/g, '');
    const name2 = name2Input.value.toLowerCase().replace(/[^a-z]/g, '');

    if (!name1 || !name2) {
        alert("Please enter valid names with letters.");
        return;
    }

    // Disable inputs during animation
    name1Input.disabled = true;
    name2Input.disabled = true;
    calculateBtn.classList.add('hidden'); // Hide the button during calculation
    document.getElementById('game-description').classList.add('hidden');

    // Reset Stage
    name1Display.innerHTML = '';
    name2Display.innerHTML = '';
    flamesDisplay.classList.add('hidden');
    document.querySelectorAll('.flames-letter').forEach(el => {
        el.className = 'flames-letter'; // reset classes
    });

    animationStage.classList.remove('hidden');

    // 1. Render names
    const arr1 = name1.split('');
    const arr2 = name2.split('');
    
    arr1.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        span.dataset.index = i;
        name1Display.appendChild(span);
    });

    arr2.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        span.dataset.index = i;
        name2Display.appendChild(span);
    });

    await sleep(500);

    // 2. Strike out common letters
    let count1 = [...arr1];
    let count2 = [...arr2];

    for (let i = 0; i < count1.length; i++) {
        for (let j = 0; j < count2.length; j++) {
            if (count1[i] === count2[j] && count1[i] !== null) {
                // Mark for striking
                const span1 = name1Display.children[i];
                const span2 = name2Display.children[j];
                
                span1.classList.add('strike');
                span2.classList.add('strike');
                
                // Trigger CSS width transition via 'struck' class after a tiny delay
                await sleep(300);
                span1.classList.add('struck');
                span2.classList.add('struck');
                
                count1[i] = null;
                count2[j] = null;
                break;
            }
        }
    }

    await sleep(800);

    // 3. Count remaining letters
    const remainingCount = count1.filter(c => c !== null).length + count2.filter(c => c !== null).length;
    
    if (remainingCount === 0) {
        showResult('E'); // If same name, they become Enemies by default game logic!
        return;
    }

    // 4. Animate FLAMES calculation
    flamesDisplay.classList.remove('hidden');
    await sleep(800);

    let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    const letters = Array.from(document.querySelectorAll('.flames-letter'));
    
    let currentIndex = 0;

    while (flames.length > 1) {
        // Count to N
        for (let step = 1; step <= remainingCount; step++) {
            // Find next available letter in DOM
            let pointer = currentIndex % 6;
            while (letters[pointer].classList.contains('eliminated')) {
                currentIndex++;
                pointer = currentIndex % 6;
            }

            // Glow current letter
            letters[pointer].classList.add('glow');
            await sleep(200);
            
            if (step === remainingCount) {
                // Strike it out!
                letters[pointer].classList.remove('glow');
                letters[pointer].classList.add('eliminated');
                
                // Remove from active array
                const charToRemove = letters[pointer].dataset.letter;
                flames = flames.filter(f => f !== charToRemove);
            } else {
                letters[pointer].classList.remove('glow');
            }
            
            currentIndex++;
        }
        await sleep(400);
    }

    // 5. Show Final Result
    const finalLetter = flames[0];
    await sleep(500);
    showResult(finalLetter);
});

function showResult(letter) {
    const result = FLAMES_MEANINGS[letter];
    
    resultTitle.textContent = result.title;
    resultTitle.style.background = `linear-gradient(to right, ${result.color}, #fff)`;
    resultTitle.style.webkitBackgroundClip = 'text';
    resultMessage.textContent = result.message;
    
    resultDialog.className = ''; // Reset classes
    if (letter === 'E') resultDialog.classList.add('enemies-theme');
    if (letter === 'L') resultDialog.classList.add('lovers-theme');
    if (letter === 'M') resultDialog.classList.add('marriage-theme');

    resultDialog.showModal();
    
    triggerConfetti(letter);
}

closeDialogBtn.addEventListener('click', () => {
    // Add close animation class if desired, but native dialog close will handle it instantly if we don't delay it.
    // To utilize allow-discrete for exit, we should add a hidden attribute or just close it.
    resultDialog.close();
    
    // Reset state
    name1Input.disabled = false;
    name2Input.disabled = false;
    calculateBtn.classList.remove('hidden'); // Show button again
    document.getElementById('game-description').classList.remove('hidden');
    animationStage.classList.add('hidden');
    name1Input.value = '';
    name2Input.value = '';
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function triggerConfetti(letter) {
    const duration = 3000;
    const end = Date.now() + duration;

    // Different animation strategies based on the letter
    if (letter === 'L') {
        // Lovers: Gentle falling hearts from the top
        (function frame() {
            const emojis = ['❤️', '💖', '💕'];
            confetti({
                particleCount: 3,
                angle: 270,
                spread: 90,
                origin: { x: Math.random(), y: -0.1 },
                shapes: ['text'],
                shapeOptions: { text: { value: emojis[Math.floor(Math.random() * emojis.length)] } },
                scalar: 3,
                ticks: 300,
                zIndex: 9999
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    } else if (letter === 'E') {
        // Enemies: Violent explosions from the bottom (volcano effect)
        (function frame() {
            const emojis = ['🔥', '😈', '💀', '💢'];
            confetti({
                particleCount: 10,
                startVelocity: 50,
                angle: 90 + (Math.random() * 60 - 30),
                spread: 80,
                origin: { x: 0.5, y: 1 },
                shapes: ['text'],
                shapeOptions: { text: { value: emojis[Math.floor(Math.random() * emojis.length)] } },
                scalar: 3,
                zIndex: 9999
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    } else if (letter === 'M') {
        // Marriage: Golden rings and white confetti exploding from center
        (function frame() {
            const emojis = ['💍', '🥂'];
            confetti({
                particleCount: 8,
                spread: 360,
                origin: { x: 0.5, y: 0.5 },
                colors: ['#ffffff', '#fbbf24', '#fcd34d'],
                shapes: ['text', 'circle'],
                shapeOptions: { text: { value: emojis[Math.floor(Math.random() * emojis.length)] } },
                scalar: 2,
                zIndex: 9999
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    } else if (letter === 'A') {
        // Affection: Cute stars and pink circles bursting gently randomly
        (function frame() {
            confetti({
                particleCount: 5,
                spread: 120,
                origin: { x: Math.random(), y: Math.random() },
                colors: ['#f472b6', '#fb7185', '#fde047'],
                shapes: ['star', 'circle'],
                scalar: 1.5,
                zIndex: 9999
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    } else if (letter === 'F') {
        // Friends: Standard colorful confetti from both sides
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#3b82f6', '#10b981', '#f59e0b'], zIndex: 9999 });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3b82f6', '#10b981', '#f59e0b'], zIndex: 9999 });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    } else if (letter === 'S') {
        // Siblings: Fun emojis popping up randomly from the bottom
        (function frame() {
            const emojis = ['😜', '👫', '🥊'];
            confetti({
                particleCount: 4,
                angle: 90,
                spread: 100,
                origin: { x: Math.random(), y: 0.8 },
                shapes: ['text'],
                shapeOptions: { text: { value: emojis[Math.floor(Math.random() * emojis.length)] } },
                scalar: 2.5,
                zIndex: 9999
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }
}
