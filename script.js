// Quiz Data (12 questions with 4 answers each)
const quizData = [
    {
        question: "What do I love about you?",
        answers: ["Your smile", "Your mind", "Your body", "Everything"],
        correct: 3
    },
    {
        question: "Who's better at brawlhalla?",
        answers: ["Bray", "Jen", "We're evenly matched"],
        correct: 1
    },
    {
        question: "What's my favorite way to show affection?",
        answers: ["Hugs", "Kisses", "Quality time", "All of the above"],
        correct: 3
    },
    {
        question: "Who do I love more than anything?",
        answers: ["Myself", "Rou", "Kai", "My Love [YOU]"],
        correct: 3
    },
    {
        question: "Who's better at fort?",
        answers: ["Bray [wayyyyyyy better]", "Jen", "We're evenly matched"],
        correct: 0
    },
    {
        question: "What's your favorite color?",
        answers: ["#8BAE9A", "weird green", "green", "Serene Sage"],
        correct: 1
    },
    {
        question: "What's my favorite holiday?",
        answers: ["Christmas", "Birthday", "Valentine's Day", "Anytime I get to see you"],
        correct: 3
    },
    {
        question: "What's my favorite color?",
        answers: ["Red", "Blue", "Pink", "Someone's eyes [not naming names]"],
        correct: 3
    },
    {
        question: "What are you?",
        answers: ["Beautiful", "Smart", "Sweet", "Smelly", "All of the above"],
        correct: 4
    },
    {
        question: "What's my favorite type of music?",
        answers: ["Pop", "Rock", "Love songs", "Jenna song"],
        correct: 3
    },
    {
        question: "What's my favorite thing to do?",
        answers: ["Annoy you", "fart", "Eat tuna", "Workout"],
        correct: 0
    },
    {
        question: "What would I rather?",
        answers: ["World peace", "End world hunger", "Be with you forever", "Kill myself"],
        correct: 2
    }
];

// Global Variables
let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];

// Audio elements
const wrongAudio = new Audio('sounds/WRONG.wav');
const rightAudio = new Audio('sounds/RIGHT.wav');
const notificationAudio = new Audio('sounds/NOTIFICATION.wav');
const scaryAudio = new Audio('sounds/freesound_community-tension01_loop-67896.mp3');
const loveAudio = new Audio('sounds/ILOVEYOU.wav');

const JENNA_PLAYING_SRC = 'funny-ads/jenna1.png';
const JENNA_STOPPED_SRC = 'funny-ads/jenna2.png';

// Popup notification system
const funnyAds = [
    { id: 1, image: 'funny-ads/ad1.png', title: 'Hot Singles in Your Area', text: 'Jenna, someone wants to meet you!' },
    { id: 2, image: 'funny-ads/ad2.png', title: 'You Won a Prize!', text: 'Claim your free boyfriend now!' },
    { id: 3, image: 'funny-ads/ad3.png', title: 'Dating Alert', text: 'Your perfect match is waiting!' },
    { id: 4, image: 'funny-ads/ad4.png', title: 'Love Connection', text: 'Someone thinks you\'re cute!' },
    { id: 5, image: 'funny-ads/ad5.png', title: 'Romance Available', text: 'Click here for love!' },
    { id: 6, image: 'funny-ads/ad6.png', title: 'Meet Someone New', text: 'Your soulmate is here!' },
    { id: 7, image: 'funny-ads/ad7.png', title: 'Love is Waiting', text: 'Don\'t miss this chance!' },
    { id: 8, image: 'funny-ads/ad8.png', title: 'Dating Service', text: 'Find your perfect match!' },
    { id: 9, image: 'funny-ads/ad9.png', title: 'Special Offer', text: 'You know you want this...' },
    { id: 10, image: 'funny-ads/ad10.png', title: 'Secret Content', text: 'Click if you dare...' }
];

let currentAdIndex = 0;
let notificationsActive = false;
let endSequenceStarted = false;

let virusCountdownIntervalId = null;

// DOM Elements
const namePage = document.getElementById('namePage');
const quizPage = document.getElementById('quizPage');
const resultsPage = document.getElementById('resultsPage');
const whatTheHellPage = document.getElementById('whatTheHellPage');
const yeahYouDoPage = document.getElementById('yeahYouDoPage');
const placeholderPage = document.getElementById('placeholderPage');
const secretPage = document.getElementById('secretPage');
const virusPage = document.getElementById('virusPage');
const notificationContainer = document.getElementById('notificationContainer');
const audioToggleBtn = document.getElementById('audioToggle');
const nameInput = document.getElementById('nameInput');
const submitNameBtn = document.getElementById('submitName');
const nameError = document.getElementById('nameError');
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answersContainer');
const nextQuestionBtn = document.getElementById('nextQuestion');
const questionNumber = document.getElementById('questionNumber');
const progressBar = document.getElementById('progress');
const scoreText = document.getElementById('scoreText');
const restartQuizBtn = document.getElementById('restartQuiz');

// Initialize floating hearts
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    const heartSymbols = ['💕', '💖', '💗', '💝', '💓', '💞'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 6 + 's';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            heartsContainer.appendChild(heart);
        }, i * 400);
    }
}

// Name validation
function validateName() {
    const name = nameInput.value.trim().toLowerCase();
    
    if (name === 'jen' || name === 'jenna') {
        nameError.classList.remove('show');
        transitionToQuiz();
    } else {
        nameError.classList.add('show');
        nameInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            nameInput.style.animation = '';
        }, 500);
    }
}

// Page transitions
function transitionToQuiz() {
    namePage.classList.remove('active');
    setTimeout(() => {
        quizPage.classList.add('active');
        loadQuestion();
    }, 600);
}

function transitionToResults() {
    quizPage.classList.remove('active');
    setTimeout(() => {
        resultsPage.classList.add('active');
        showResults();
    }, 600);
}

function transitionToName() {
    resultsPage.classList.remove('active');
    setTimeout(() => {
        namePage.classList.add('active');
        resetQuiz();
    }, 600);
}

// Quiz functions
function loadQuestion() {
    const question = quizData[currentQuestion];
    questionText.textContent = question.question;
    questionNumber.textContent = `Question ${currentQuestion + 1} of 12`;
    progressBar.style.width = `${((currentQuestion + 1) / 12) * 100}%`;
    
    // Clear previous answers
    answersContainer.innerHTML = '';
    nextQuestionBtn.disabled = true;
    
    // Create answer buttons
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index, button));
        answersContainer.appendChild(button);
        
        // Add fade-in animation
        setTimeout(() => {
            button.classList.add('fade-in');
        }, index * 100);
    });
}

function selectAnswer(answerIndex, buttonElement) {
    // Disable all buttons to prevent multiple selections
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    const correct = quizData[currentQuestion].correct;
    const isCorrect = answerIndex === correct;
    
    if (isCorrect) {
        // Correct answer
        rightAudio.play();
        buttonElement.style.background = 'linear-gradient(45deg, #90EE90, #7FFF00)';
        buttonElement.style.borderColor = '#90EE90';
        buttonElement.style.boxShadow = '0 0 20px rgba(144, 238, 144, 0.8)';
        buttonElement.classList.add('shake-correct');
        
        // Proceed to next question after animation
        setTimeout(() => {
            score++;
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                transitionToResults();
            }
        }, 1000);
    } else {
        // Wrong answer
        wrongAudio.play();
        buttonElement.style.background = 'linear-gradient(45deg, rgba(220, 53, 69, 0.3), rgba(220, 53, 69, 0.5))';
        buttonElement.style.borderColor = '#dc3545';
        buttonElement.classList.add('shake-incorrect');
        
        // Re-enable buttons after animation
        setTimeout(() => {
            document.querySelectorAll('.answer-btn').forEach(btn => {
                btn.disabled = false;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.boxShadow = '';
                btn.classList.remove('shake-incorrect');
            });
        }, 1000);
    }
}

function nextQuestion() {
    // This function is no longer needed - auto-proceeds on correct answers
}

function showResults() {
    scoreText.textContent = `You got ${score} out of 12!`;
    
    // Add celebration animation
    createCelebrationHearts();
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswers = [];
    nameInput.value = '';
    nameError.classList.remove('show');
}

function createCelebrationHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    const heartSymbols = ['💕', '💖', '💗', '💝', '💓', '💞', '🌹', '💐'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
            heartsContainer.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, i * 100);
    }
}

// Event listeners
submitNameBtn.addEventListener('click', validateName);
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        validateName();
    }
});

nextQuestionBtn.addEventListener('click', nextQuestion);

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Popup Notification System
function createNotification(ad) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <button class="notification-close">×</button>
        <img src="${ad.image}" alt="${ad.title}" onerror="this.style.display='none'; console.log('Failed to load: ${ad.image}');">
        <div class="notification-content">
            <div class="notification-title">${ad.title}</div>
            <div class="notification-text">${ad.text}</div>
            <button class="notification-action">Click Here!</button>
        </div>
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    const actionBtn = notification.querySelector('.notification-action');
    const img = notification.querySelector('img');
    
    // Log when image loads or fails
    img.onload = function() {
        console.log('Successfully loaded:', ad.image);
    };
    img.onerror = function() {
        console.log('Failed to load:', ad.image);
        // Show a placeholder if image fails
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = 'width: 100%; height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px;';
        placeholder.textContent = 'Ad Image Not Found';
        this.parentNode.insertBefore(placeholder, this.nextSibling);
    };
    
    closeBtn.addEventListener('click', () => closeNotification(notification));
    
    actionBtn.addEventListener('click', () => {
        handleAdClick(ad.id);
    });
    
    return notification;
}

function showNextNotification() {
    console.log('showNextNotification called, currentAdIndex:', currentAdIndex, 'total ads:', funnyAds.length);

    if (!notificationsActive) {
        return;
    }
    
    if (currentAdIndex >= funnyAds.length) {
        // All ads shown, show jenna.png or virus
        console.log('All ads shown, checking for jenna.png');
        showJennaOrVirus();
        return;
    }
    
    const ad = funnyAds[currentAdIndex];
    console.log('Creating notification for ad:', ad);
    const notification = createNotification(ad);
    
    notificationContainer.appendChild(notification);
    
    // Play sound when notification appears
    playNotificationSound();
    
    currentAdIndex++;
}

function playNotificationSound() {
    // Use the same audio approach that works for other sounds
    notificationAudio.currentTime = 0;
    notificationAudio.play().then(() => {
        console.log('Notification sound played successfully');
    }).catch(e => {
        console.log('Notification sound failed:', e);
    });
}

function closeNotification(notification) {
    // Don't play sound here - only when notification appears
    
    notification.style.animation = 'slideOutRight 0.5s ease-out';
    setTimeout(() => {
        notification.remove();
        showNextNotification();
    }, 500);
}

function handleAdClick(adId) {
    // Don't play sound here - only when closing to avoid double sounds
    
    if (adId === 9) {
        transitionToPage(yeahYouDoPage);
    } else if (adId === 10) {
        transitionToPage(placeholderPage);
    } else {
        transitionToPage(whatTheHellPage);
    }
}

function showJennaOrVirus() {
    if (endSequenceStarted) {
        return;
    }
    endSequenceStarted = true;
    notificationsActive = false;
    notificationContainer.innerHTML = '';

    // Always show virus page first (as intended)
    showVirusPage();
}

function showSecretPage() {
    if (virusCountdownIntervalId !== null) {
        clearInterval(virusCountdownIntervalId);
        virusCountdownIntervalId = null;
    }
    scaryAudio.pause();
    scaryAudio.currentTime = 0;

    const secretContent = document.querySelector('.secret-content');
    secretContent.innerHTML = `
        <p>Lovey Dovey page because I lovey wovey you</p>
        <svg class="heart-photo" viewBox="-1.5 -1.5 35 32.6" aria-hidden="true">
            <defs>
                <clipPath id="heartClip">
                    <path d="M23.6,0c-3.4,0-6.4,2.1-7.6,5.1C14.8,2.1,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,16,21.2,16,21.2S32,17.8,32,8.4C32,3.8,28.2,0,23.6,0z" />
                </clipPath>
            </defs>
            <image id="jennaImage" href="${JENNA_PLAYING_SRC}" xlink:href="${JENNA_PLAYING_SRC}" x="0" y="0" width="32" height="29.6" preserveAspectRatio="xMidYMid slice" clip-path="url(#heartClip)"></image>
            <path class="heart-photo-border" d="M23.6,0c-3.4,0-6.4,2.1-7.6,5.1C14.8,2.1,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,16,21.2,16,21.2S32,17.8,32,8.4C32,3.8,28.2,0,23.6,0z" />
        </svg>
        <div class="heart-animation">💕</div>
    `;
    
    // Start playing ILOVEYOU.wav on repeat
    loveAudio.loop = true;
    loveAudio.play().catch(e => console.log('Love sound failed:', e));
    
    // Reset audio state
    isAudioPlaying = true;
    
    // Reset toggle button text
    audioToggleBtn.textContent = 'Make it stop';
    
    transitionToPage(secretPage);
}

// Audio toggle functionality
let isAudioPlaying = true;

audioToggleBtn.addEventListener('click', () => {
    const jennaImg = document.getElementById('jennaImage');
    
    console.log('Audio toggle clicked, current state:', isAudioPlaying);
    
    if (isAudioPlaying) {
        loveAudio.pause();
        audioToggleBtn.textContent = 'Make it start';
        if (jennaImg) {
            jennaImg.setAttribute('href', JENNA_STOPPED_SRC);
            jennaImg.setAttribute('xlink:href', JENNA_STOPPED_SRC);
        }
        isAudioPlaying = false;
    } else {
        loveAudio.play().then(() => {
            audioToggleBtn.textContent = 'Make it stop';
            if (jennaImg) {
                jennaImg.setAttribute('href', JENNA_PLAYING_SRC);
                jennaImg.setAttribute('xlink:href', JENNA_PLAYING_SRC);
            }
            isAudioPlaying = true;
        }).catch(e => {
            console.log('Love sound failed to play:', e);
        });
    }
});

function showVirusPage() {
    startVirusCountdown();
    transitionToPage(virusPage);
    
    // Start playing scary sound
    scaryAudio.loop = true;
    scaryAudio.play().catch(e => console.log('Scary sound failed:', e));
}

function startVirusCountdown() {
    if (virusCountdownIntervalId !== null) {
        clearInterval(virusCountdownIntervalId);
        virusCountdownIntervalId = null;
    }

    let countdown = 15;
    const countdownElement = document.getElementById('virusCountdown');
    
    virusCountdownIntervalId = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        // Make it more intense as time runs out
        if (countdown <= 5) {
            countdownElement.style.color = '#ff0000';
            countdownElement.style.fontSize = '5em';
        }
        
        if (countdown <= 0) {
            clearInterval(virusCountdownIntervalId);
            virusCountdownIntervalId = null;
            scaryAudio.pause();
            scaryAudio.currentTime = 0;
            // Always go to secret page
            showSecretPage();
        }
    }, 1000);
}

function transitionToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show target page
    setTimeout(() => {
        page.classList.add('active');
    }, 300);
}

function startNotificationSequence() {
    if (notificationsActive) return;
    notificationsActive = true;
    currentAdIndex = 0;
    endSequenceStarted = false;
    
    // Start showing notifications after a delay
    setTimeout(() => {
        showNextNotification();
    }, 2000);
}

// Event listeners for special pages
document.getElementById('backToQuiz').addEventListener('click', () => {
    transitionToPage(resultsPage);
});

document.getElementById('backToQuiz2').addEventListener('click', () => {
    transitionToPage(resultsPage);
});

document.getElementById('backToQuiz4').addEventListener('click', () => {
    transitionToPage(resultsPage);
});

document.getElementById('backToQuiz3').addEventListener('click', () => {
    loveAudio.pause();
    loveAudio.currentTime = 0;
    transitionToPage(namePage);
    resetQuiz();
});

document.getElementById('virusCancel').addEventListener('click', () => {
    scaryAudio.pause();
    scaryAudio.currentTime = 0;
    showSecretPage();
});

document.getElementById('virusOK').addEventListener('click', () => {
    scaryAudio.pause();
    scaryAudio.currentTime = 0;
    showSecretPage();
});

// Modify showResults to start notifications
function showResults() {
    scoreText.textContent = `You got ${score} out of 12!`;
    
    // Add celebration animation
    createCelebrationHearts();
    
    // Start notification sequence after a delay
    setTimeout(() => {
        startNotificationSequence();
    }, 3000);
}

// Initialize
createFloatingHearts();

// Recreate floating hearts periodically
setInterval(createFloatingHearts, 20000);
