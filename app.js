let score = 0;
const cat = document.getElementById('cat');
const scoreDisplay = document.getElementById('score');
const shareBtn = document.getElementById('share-btn');
const nameForm = document.getElementById('name-form');
const playerNameInput = document.getElementById('player-name');
const leaderboard = document.getElementById('leaderboard');
const popSound = new Audio('pop.mp3');

// โหลด Leaderboard จาก LocalStorage
let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

// แสดง Leaderboard (แค่ 5 อันดับแรก)
function renderLeaderboard() {
    leaderboard.innerHTML = ''; // ล้างข้อมูลเดิม
    leaderboardData
        .sort((a, b) => b.score - a.score) // เรียงคะแนนจากมากไปน้อย
        .slice(0, 5) // เลือกเฉพาะ 5 อันดับแรก
        .forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name}: ${entry.score}`;
            leaderboard.appendChild(listItem);
        });
}
renderLeaderboard();

// ฟังก์ชันเพิ่มคะแนน
cat.addEventListener('mousedown', () => {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    popSound.play();
    cat.src = 'cat-pop.png';
});

cat.addEventListener('mouseup', () => {
    cat.src = 'cat-normal.png';
});

// ฟังก์ชันบันทึกคะแนน
nameForm.addEventListener('submit', (e) => {
    e.preventDefault(); // หยุดการรีเฟรชหน้า
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        // ค้นหาชื่อใน Leaderboard
        const existingPlayer = leaderboardData.find(entry => entry.name === playerName);
        if (existingPlayer) {
            // ถ้าพบชื่อเดิม ให้อัปเดตคะแนน
            existingPlayer.score += score;
        } else {
            // ถ้าไม่พบชื่อเดิม ให้เพิ่มชื่อใหม่
            leaderboardData.push({ name: playerName, score });
        }
        // บันทึกใน LocalStorage
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
        renderLeaderboard(); // อัปเดต Leaderboard
        playerNameInput.value = ''; // ล้างช่องกรอกชื่อ
        score = 0; // รีเซ็ตคะแนน
        scoreDisplay.textContent = `Score: 0`;
    }
});

// แชร์คะแนนพร้อมชื่อ
shareBtn.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim() || 'Anonymous';
    const shareMessage = `${playerName} scored ${score} points on PopSom! Can you beat that?`;
    if (navigator.share) {
        navigator.share({
            title: 'PopSom Game',
            text: shareMessage,
            url: window.location.href,
        }).catch(err => console.error('Error sharing:', err));
    } else {
        alert('Sharing not supported on this browser.');
    }
});