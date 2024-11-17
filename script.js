// script.js

let users = [
    { name: 'Иван Петров', email: '1', password: '1', role: 'student', points: 0, badges: [], stickers: [], level: 1 },
    { name: 'Мария Иванова', email: '2', password: '2', role: 'teacher' },
    { name: 'Georgi Pangovski', email: '3', password: '3', role: 'student', points: 0, badges: [], stickers: [], level: 1 },
    { name: 'Chaning Tatum', email: '4', password: '4', role: 'student', points: 0, badges: [], stickers: [], level: 1 },
];

let currentUser = null;

let availableStickers = [
    '⭐ Златна звезда', 
    '🎖 Отличителен знак', 
    '🏆 Трофей за участие', 
    '📚 Книга за знания', 
    '💡 Идеен балон'
];

let levelNames = [
    { name: 'Beginner', minPoints: 0 },
    { name: 'Intermediate', minPoints: 50 },
    { name: 'Experienced', minPoints: 100 },
    { name: 'Expert', minPoints: 150 },
    { name: 'Master', minPoints: 200 }
];

let homeworks = [];
let submissions = [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    setTimeout(() => {
        document.getElementById(sectionId).classList.add('active');
    }, 50);
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        if (user.role === 'student') {
            if (document.getElementById('student-name')) {
                document.getElementById('student-name').innerText = user.name;
            }
            if (document.getElementById('student-points')) {
                document.getElementById('student-points').innerText = user.points;
            }
            if (document.getElementById('student-level')) {
                document.getElementById('student-level').innerText = getLevelName(user.points);
            }
            displayBadges(user.badges);
            displayStickers(user.stickers);
            showSection('student-dashboard');
        } else if (user.role === 'teacher') {
            if (document.getElementById('teacher-name')) {
                document.getElementById('teacher-name').innerText = user.name;
            }
            loadStudentsDropdown();
            loadLeaderboard();
            showSection('teacher-dashboard');
        }
    } else {
        alert('Грешни идентификационни данни. Моля, опитайте отново.');
    }
}

function showRegister() {
    showSection('register-section');
}

function showLogin() {
    showSection('login-section');
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const selectedClass = document.getElementById('register-class').value;

    if (users.some(user => user.email === email)) {
        alert('Потребител с този имейл вече съществува.');
        return;
    }

    const newUser = { name, email, password, role, class: selectedClass, points: 0, badges: [], stickers: [], level: 1 };
    users.push(newUser);
    alert('Регистрацията беше успешна! Моля, влезте в системата.');
    showSection('login-section');
}

function loadStudentsDropdown() {
    const studentDropdown = document.getElementById('select-student');
    if (!studentDropdown) {
        console.error("Element with id 'select-student' not found.");
        return;
    }

    studentDropdown.innerHTML = '<option value="">Изберете ученик</option>';

    users
        .filter(user => user.role === 'student')
        .forEach(student => {
            const option = document.createElement('option');
            option.value = student.email;
            option.textContent = student.name;
            studentDropdown.appendChild(option);
        });
}

function loadSelectedStudent() {
    const selectedEmail = document.getElementById('select-student').value;
    const studentsList = document.getElementById('students-list');
    if (!studentsList) {
        console.error("Element with id 'students-list' not found.");
        return;
    }

    studentsList.innerHTML = '';

    if (selectedEmail) {
        const student = users.find(user => user.email === selectedEmail);
        if (student) {
            const studentDiv = document.createElement('div');
            studentDiv.className = 'student-item';
            studentDiv.innerHTML = `
                <p>Име: ${student.name}</p>
                <p>Точки: ${student.points}</p>
                <p>Ниво: ${getLevelName(student.points)}</p>
                <button onclick="addPoints('${student.email}', 10)">Добави 10 точки</button>
                <select id="sticker-select-${student.email}">
                    ${availableStickers.map(sticker => `<option value="${sticker}">${sticker}</option>`).join('')}
                </select>
                <button onclick="addSticker('${student.email}')">Добави стикер</button>
            `;
            studentsList.appendChild(studentDiv);
        }
    }
}

function loadLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    if (!leaderboard) {
        console.error("Element with id 'leaderboard' not found.");
        return;
    }

    leaderboard.innerHTML = '';

    const sortedStudents = users.filter(user => user.role === 'student').sort((a, b) => b.points - a.points);
    sortedStudents.forEach((student, index) => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'leaderboard-item';
        studentDiv.innerHTML = `
            <p>${index + 1}. ${student.name} - Точки: ${student.points}</p>
        `;
        leaderboard.appendChild(studentDiv);
    });
}

function addPoints(email, points) {
    const student = users.find(u => u.email === email);
    if (student) {
        student.points += points;
        updateLevel(student);
        loadSelectedStudent(); // Обновяване на данните за избрания ученик
        loadLeaderboard(); // Обновяване на лидерборда
        alert(`Добавени са ${points} точки на ${student.name}`);
    }
}

function addSticker(email) {
    const student = users.find(u => u.email === email);
    if (student) {
        const selectElement = document.getElementById(`sticker-select-${email}`);
        const selectedSticker = selectElement.value;

        student.stickers.push(selectedSticker);
        loadSelectedStudent(); // Обновяване на данните за избрания ученик
        alert(`Добавен е стикер на ${student.name}: ${selectedSticker}`);
    }
}

function getLevelName(points) {
    let levelName = 'Beginner';
    levelNames.forEach(level => {
        if (points >= level.minPoints) {
            levelName = level.name;
        }
    });
    return levelName;
}

function displayBadges(badges) {
    const badgesContainer = document.getElementById('student-badges');
    if (!badgesContainer) {
        console.error("Badges container not found");
        return;
    }

    badgesContainer.innerHTML = '';
    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge-item';
        badgeElement.textContent = badge;
        badgesContainer.appendChild(badgeElement);
    });
}

function displayStickers(stickers) {
    const stickersContainer = document.getElementById('student-stickers');
    if (!stickersContainer) {
        console.error("Stickers container not found");
        return;
    }

    stickersContainer.innerHTML = '';
    stickers.forEach(sticker => {
        const stickerElement = document.createElement('div');
        stickerElement.className = 'sticker-item';
        stickerElement.textContent = sticker;
        stickersContainer.appendChild(stickerElement);
    });
}

function logout() {
    currentUser = null;
    showSection('login-section');
}

function updateLevel(student) {
    student.level = levelNames.filter(level => student.points >= level.minPoints).length;
}

function addHomework() {
    const title = document.getElementById('homework-title').value;
    const description = document.getElementById('homework-description').value;
    const newHomework = { title, description, submissions: [] };
    homeworks.push(newHomework);
    loadHomeworksForTeacher();
    alert('Домашното беше добавено успешно!');
}

function loadHomeworksForTeacher() {
    const homeworkList = document.getElementById('homework-list');
    homeworkList.innerHTML = '';

    homeworks.forEach((homework, index) => {
        const homeworkDiv = document.createElement('div');
        homeworkDiv.className = 'homework-item';
        homeworkDiv.innerHTML = `
            <h4>${homework.title}</h4>
            <p>${homework.description}</p>
            <button onclick="viewSubmissions(${index})">Преглед на предадените работи</button>
        `;
        homeworkList.appendChild(homeworkDiv);
    });
}

function loadHomeworksForStudents() {
    const studentHomeworkList = document.getElementById('student-homework-list');
    studentHomeworkList.innerHTML = '';

    homeworks.forEach((homework, index) => {
        const homeworkDiv = document.createElement('div');
        homeworkDiv.className = 'homework-item';
        homeworkDiv.innerHTML = `
            <h4>${homework.title}</h4>
            <p>${homework.description}</p>
            <button onclick="submitHomework(${index})">Предай домашно</button>
        `;
        studentHomeworkList.appendChild(homeworkDiv);
    });
}

function submitHomework(index) {
    const submission = prompt('Моля, въведете вашето решение:');
    if (submission) {
        homeworks[index].submissions.push({ student: currentUser.name, submission });
        alert('Домашното беше предадено успешно!');
    }
}

function viewSubmissions(index) {
    const submissionsList = document.getElementById('submissions-list');
    submissionsList.innerHTML = '';

    homeworks[index].submissions.forEach(submission => {
        const submissionDiv = document.createElement('div');
        submissionDiv.className = 'submission-item';
        submissionDiv.innerHTML = `
            <h4>${submission.student}</h4>
            <p>${submission.submission}</p>
        `;  
        submissionsList.appendChild(submissionDiv);
    });
}

// Започваме с показване на секцията за вход
showSection('login-section');

// Автоматично зареждане на избрания ученик при промяна на падащото меню
const studentDropdown = document.getElementById('select-student');
if (studentDropdown) {
    studentDropdown.addEventListener('change', loadSelectedStudent);
}
