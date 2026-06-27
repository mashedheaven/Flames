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
    
    if (remainingCount === 0) return 'E';

    let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    let currentIndex = 0;
    while (flames.length > 1) {
        currentIndex = (currentIndex + remainingCount - 1) % flames.length;
        flames.splice(currentIndex, 1);
    }
    return flames[0];
}

console.log("Rahul + Anjali (math) ->", testFlames("Rahul", "Anjali"));
