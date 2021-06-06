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
    let scores = [];
    for (const key in localStorage) {
        const value = localStorage.getItem(key);
        if (value && key !== 'sound') {
            scores.push({username: key, score: value});
        }
    }
    scores = scores.sort((a, b) => b.score - a.score).slice(0, 200);
    return scores;
}

localStorage.setItem('Alice', '768');
localStorage.setItem('Bob', '768');
renderLeaderboard();