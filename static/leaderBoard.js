function renderLeaderboard() {
    const container = document.getElementById('leaderBoardWrapper');
    container.innerHTML = '';
    for (const val of getSortedScores()) {
        const row = document.createElement('tr');
        const username = document.createElement('td');
        const score = document.createElement('td');
        username.textContent = val.username;
        row.appendChild(username);
        score.textContent = val.score;
        row.appendChild(score);
        container.appendChild(row);
    }
}

function getSortedScores() {
    const scores = [];
    for (const key in localStorage) {
        const value = localStorage.getItem(key);
        if (value) {
            scores.push({username: key, score: value});
        }
    }
    scores.sort((a, b) => b.score - a.score);
    return scores;
}

localStorage.setItem('Bob', '300')
localStorage.setItem('ALice', '700')
localStorage.setItem('Test', '300')
renderLeaderboard();