function renderLeaderboard() {
    const container = document.getElementById('leaderBoardWrapper');
    container.innerHTML = '';
    const sortedScores = getSortedScores();
    for (let i = 0; i < sortedScores.length; i++) {
        const row = document.createElement('tr');
        const username = document.createElement('td');
        const score = document.createElement('td');
        const place = document.createElement('td');
        place.textContent = (i + 1).toString();
        row.appendChild(place);
        username.textContent = sortedScores[i].username;
        row.appendChild(username);
        score.textContent = sortedScores[i].score;
        row.appendChild(score);
        container.appendChild(row);
    }
}

function getSortedScores() {
    const scores = [];
    for (const key in localStorage) {
        const value = localStorage.getItem(key);
        if (value && key !== 'sound') {
            scores.push({username: key, score: value});
        }
    }
    scores.sort((a, b) => b.score - a.score);
    return scores;
}

localStorage.setItem('Bob', '300')
localStorage.setItem('ALice', '700')
localStorage.setItem('Test', '300')
localStorage.setItem('a', '300')
localStorage.setItem('b', '700')
localStorage.setItem('c', '300')
localStorage.setItem('d', '300')
localStorage.setItem('e', '700')
localStorage.setItem('f', '300')
localStorage.setItem('h', '300')
localStorage.setItem('t', '700')
localStorage.setItem('k', '300')
localStorage.setItem('l', '300')
localStorage.setItem('m', '700')
localStorage.setItem('n', '300')
localStorage.setItem('t', '700')
localStorage.setItem('q', '300')
localStorage.setItem('w', '300')
localStorage.setItem('z', '700')
localStorage.setItem('zzz', '300')
localStorage.setItem('zz', '700')
localStorage.setItem('zzzz', '300')
renderLeaderboard();