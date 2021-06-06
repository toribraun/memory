function renderLeaderboard() {
    const container = document.getElementById('leaderBoardWrapper');
    container.innerHTML = '';
    for (const key in localStorage) {
        const row = document.createElement('tr');
        const username = document.createElement('td');
        const score = document.createElement('td');
        username.textContent = key;
        row.appendChild(username);
        score.textContent = localStorage.getItem('score');
        row.appendChild(username);
        container.appendChild(row);
    }
}

renderLeaderboard();