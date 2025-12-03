// 전역 변수
let trainingTime = 10; // 기본 10초
let restTime = 5; // 기본 5초
let currentRound = 0;
let timerInterval = null;
let currentTimeLeft = 0;
let isTrainingPhase = true;
let currentTrainingName = '';
let currentTrainingLevel = 0;
let currentLanguage = 'ko'; // 기본 언어: 한국어
let isLegendMode = false; // 최강자 모드

// 다국어 번역 데이터
const translations = {
    ko: {
        'training-type': '트레이닝 종류',
        'level': 'Level',
        'start': '시작',
        'hanging': '철봉 양손 매달리기',
        'hangboard-4f-2joint': '행보드 4손가락 2마디',
        'hangboard-4f-1joint': '행보드 4손가락 1마디',
        'hangboard-4f-half': '행보드 4손가락 반마디',
        'hangboard-3f-2joint': '행보드 3손가락 2마디',
        'hangboard-3f-1joint': '행보드 3손가락 1마디',
        'hangboard-3f-half': '행보드 3손가락 반마디',
        'hangboard-2f-2joint': '행보드 2손가락 2마디',
        'hangboard-2f-1joint': '행보드 2손가락 1마디',
        'hangboard-2f-half': '행보드 2손가락 반마디',
        'hangboard-1f-2joint': '행보드 1손가락 2마디',
        'hangboard-1f-1joint': '행보드 1손가락 1마디',
        'hangboard-1f-half': '행보드 1손가락 반마디',
        'round': '라운드',
        'training': '트레이닝',
        'rest': '휴식',
        'stop': '종료',
        'complete': '완료!',
        'great-job': 'Great Job!',
        'todays-training': '오늘의 트레이닝',
        'total-rounds': '총 라운드',
        'restart': '다시 시작',
        'level-format': 'Level',
        'level-detail': '트레이닝 {training}초 / 휴식 {rest}초'
    },
    en: {
        'training-type': 'Training Type',
        'level': 'Level',
        'start': 'Start',
        'hanging': 'Dead Hang',
        'hangboard-4f-2joint': 'hangboard 4finger, 2joint grip',
        'hangboard-4f-1joint': 'hangboard 4finger, 1joint grip',
        'hangboard-4f-half': 'hangboard 4finger, half joint grip',
        'hangboard-3f-2joint': 'hangboard 3finger, 2joint grip',
        'hangboard-3f-1joint': 'hangboard 3finger, 1joint grip',
        'hangboard-3f-half': 'hangboard 3finger, half joint grip',
        'hangboard-2f-2joint': 'hangboard 2finger, 2joint grip',
        'hangboard-2f-1joint': 'hangboard 2finger, 1joint grip',
        'hangboard-2f-half': 'hangboard 2finger, half joint grip',
        'hangboard-1f-2joint': 'hangboard 1finger, 2joint grip',
        'hangboard-1f-1joint': 'hangboard 1finger, 1joint grip',
        'hangboard-1f-half': 'hangboard 1finger, half joint grip',
        'round': 'Round',
        'training': 'Training',
        'rest': 'Rest',
        'stop': 'Stop',
        'complete': 'Complete!',
        'great-job': 'Great Job!',
        'todays-training': "Today's Training",
        'total-rounds': 'Total Rounds',
        'restart': 'Restart',
        'level-format': 'Level',
        'level-detail': 'Training {training}s / Rest {rest}s'
    }
};

// 비프음 오디오 요소
let beepSound = null;
let transitionSound = null;
let audioInitialized = false;

// 언어 전환 함수
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ko' ? 'en' : 'ko';
    updateLanguage();
}

// 언어 업데이트 함수
function updateLanguage() {
    // 국기 변경
    const flag = document.getElementById('language-flag');
    flag.textContent = currentLanguage === 'ko' ? '🇰🇷' : '🇺🇸';
    
    // 모든 번역 가능한 요소 업데이트
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // 단계 셀렉트 박스 다시 생성
    const trainingType = document.getElementById('training-type').value;
    createLevelSelect(trainingType);
}

// 오디오 초기화 함수 (사용자 상호작용 시 호출)
function initializeAudio() {
    if (audioInitialized) return;
    
    beepSound = document.getElementById('beep-sound');
    transitionSound = document.getElementById('transition-sound');
    
    // muted 속성 제거 (사용자 상호작용 후)
    if (beepSound) beepSound.muted = false;
    if (transitionSound) transitionSound.muted = false;
    
    audioInitialized = true;
}

// 비프음 재생 함수
function playBeep() {
    if (!beepSound) {
        beepSound = document.getElementById('beep-sound');
    }
    
    // 오디오를 처음부터 재생
    beepSound.currentTime = 0;
    beepSound.play().catch(err => {
        console.log('비프음 재생 오류:', err);
    });
}

// 전환 효과음 재생 함수
function playTransitionSound() {
    if (!transitionSound) {
        transitionSound = document.getElementById('transition-sound');
    }
    
    // 오디오를 처음부터 재생
    transitionSound.currentTime = 0;
    transitionSound.play().catch(err => {
        console.log('전환음 재생 오류:', err);
    });
}

// DOM 요소
const setupScreen = document.getElementById('setup-screen');
const trainingScreen = document.getElementById('training-screen');
const restScreen = document.getElementById('rest-screen');
const finishScreen = document.getElementById('finish-screen');

const startBtn = document.getElementById('start-btn');
const stopTrainingBtn = document.getElementById('stop-training-btn');
const stopRestBtn = document.getElementById('stop-rest-btn');
const restartBtn = document.getElementById('restart-btn');

const trainingTimer = document.getElementById('training-timer');
const restTimer = document.getElementById('rest-timer');
const trainingRoundDisplay = document.getElementById('training-round');
const restRoundDisplay = document.getElementById('rest-round');
const totalRoundsDisplay = document.getElementById('total-rounds');

const trainingTypeSelect = document.getElementById('training-type');
const trainingLevelSelect = document.getElementById('training-level');

// 트레이닝 이름 가져오기 함수
function getTrainingName(type) {
    return translations[currentLanguage][type] || type;
}

// 특수 모드 활성화/비활성화 (단계 기반)
function toggleSpecialModeByLevel(level) {
    const screens = [setupScreen, trainingScreen, restScreen, finishScreen];
    
    // 모든 특수 모드 클래스 제거
    screens.forEach(screen => {
        screen.classList.remove('legend-mode', 'intermediate-mode');
    });
    
    // 단계에 따른 특수 모드 적용
    if (level >= 5 && level <= 7) {
        // 레벨 5, 6, 7: 최강자 모드 (기존 1손가락 모드)
        screens.forEach(screen => {
            screen.classList.add('legend-mode');
        });
        isLegendMode = true;
    } else if (level >= 3 && level <= 4) {
        // 레벨 3, 4: 중급자 모드 (기존 2손가락 모드)
        screens.forEach(screen => {
            screen.classList.add('intermediate-mode');
        });
        isLegendMode = false;
    } else {
        // 레벨 1, 2: 일반 모드
        isLegendMode = false;
    }
}

// 공통 단계 설정
const commonLevels = [
    { level: 1, training: 10, rest: 10 },
    { level: 2, training: 10, rest: 7 },
    { level: 3, training: 10, rest: 5 },
    { level: 4, training: 10, rest: 3 },
    { level: 5, training: 12, rest: 3 },
    { level: 6, training: 15, rest: 3 },
    { level: 7, training: 15, rest: 1 }
];

// 트레이닝 설정 데이터
const trainingConfigs = {
    'hanging': commonLevels,
    'hangboard-4f-2joint': commonLevels,
    'hangboard-4f-1joint': commonLevels,
    'hangboard-4f-half': commonLevels,
    'hangboard-3f-2joint': commonLevels,
    'hangboard-3f-1joint': commonLevels,
    'hangboard-3f-half': commonLevels,
    'hangboard-2f-2joint': commonLevels,
    'hangboard-2f-1joint': commonLevels,
    'hangboard-2f-half': commonLevels,
    'hangboard-1f-2joint': commonLevels,
    'hangboard-1f-1joint': commonLevels,
    'hangboard-1f-half': commonLevels
};

// 단계 셀렉트 박스 생성
function createLevelSelect(trainingType) {
    const levelSelect = document.getElementById('training-level');
    levelSelect.innerHTML = ''; // 기존 옵션 제거
    
    const configs = trainingConfigs[trainingType];
    const levelFormat = translations[currentLanguage]['level-format'];
    const levelDetail = translations[currentLanguage]['level-detail'];
    
    configs.forEach(config => {
        const option = document.createElement('option');
        option.value = config.level;
        const detail = levelDetail
            .replace('{training}', config.training)
            .replace('{rest}', config.rest);
        option.textContent = `${config.level}${levelFormat} (${detail})`;
        levelSelect.appendChild(option);
    });
}

// 선택된 트레이닝 설정 가져오기
function getTrainingConfig() {
    const trainingType = document.getElementById('training-type').value;
    const level = parseInt(document.getElementById('training-level').value);
    const configs = trainingConfigs[trainingType];
    return configs.find(config => config.level === level);
}

// 화면 전환 함수
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// 타이머 시작
function startTimer() {
    if (isTrainingPhase) {
        currentTimeLeft = trainingTime;
        currentRound++;
        updateRoundDisplays();
        trainingTimer.textContent = currentTimeLeft;
        showScreen(trainingScreen);
    } else {
        currentTimeLeft = restTime;
        restTimer.textContent = currentTimeLeft;
        showScreen(restScreen);
    }
    
    timerInterval = setInterval(() => {
        currentTimeLeft--;
        
        if (isTrainingPhase) {
            trainingTimer.textContent = currentTimeLeft;
        } else {
            restTimer.textContent = currentTimeLeft;
        }
        
        // 매 초마다 비프음 재생
        if (currentTimeLeft > 0) {
            playBeep();
        }
        
        if (currentTimeLeft <= 0) {
            clearInterval(timerInterval);
            // 전환 효과음 재생
            playTransitionSound();
            // 트레이닝 <-> 휴식 전환
            isTrainingPhase = !isTrainingPhase;
            // 다음 타이머 시작
            setTimeout(() => {
                startTimer();
            }, 500);
        }
    }, 1000);
}

// 라운드 표시 업데이트
function updateRoundDisplays() {
    trainingRoundDisplay.textContent = currentRound;
    restRoundDisplay.textContent = currentRound;
}

// 트레이닝 정보 표시 업데이트
function updateTrainingInfo() {
    const levelFormat = translations[currentLanguage]['level-format'];
    const infoText = `${currentTrainingName} ${currentTrainingLevel}${levelFormat}`;
    document.getElementById('training-info-1').textContent = infoText;
    document.getElementById('training-info-2').textContent = infoText;
}

// 타이머 정지
function stopTimer() {
    clearInterval(timerInterval);
    totalRoundsDisplay.textContent = currentRound;
    
    // 완료 화면에 트레이닝 정보 표시
    const levelFormat = translations[currentLanguage]['level-format'];
    document.getElementById('finish-training-name').textContent = currentTrainingName;
    document.getElementById('finish-training-level').textContent = `${currentTrainingLevel}${levelFormat}`;
    
    showScreen(finishScreen);
}

// 초기화
function reset() {
    clearInterval(timerInterval);
    currentRound = 0;
    isTrainingPhase = true;
}

// 이벤트 리스너
// 언어 전환 버튼
document.getElementById('language-toggle').addEventListener('click', toggleLanguage);

// 시작 버튼
startBtn.addEventListener('click', () => {
    // 오디오 초기화 (사용자 상호작용 시)
    initializeAudio();
    
    const trainingType = document.getElementById('training-type').value;
    const config = getTrainingConfig();
    
    // 단계에 따른 특수 모드 적용
    toggleSpecialModeByLevel(config.level);
    
    // 트레이닝 정보 저장
    currentTrainingName = getTrainingName(trainingType);
    currentTrainingLevel = config.level;
    trainingTime = config.training;
    restTime = config.rest;
    currentRound = 0;
    isTrainingPhase = true;
    
    // 트레이닝 정보 표시
    updateTrainingInfo();
    
    startTimer();
});

stopTrainingBtn.addEventListener('click', () => {
    stopTimer();
});

stopRestBtn.addEventListener('click', () => {
    stopTimer();
});

restartBtn.addEventListener('click', () => {
    reset();
    showScreen(setupScreen);
    
    // 모든 특수 모드 해제
    const screens = [setupScreen, trainingScreen, restScreen, finishScreen];
    screens.forEach(screen => {
        screen.classList.remove('legend-mode', 'intermediate-mode');
    });
    
    isLegendMode = false;
    
    // 현재 선택된 레벨에 따른 특수 모드 다시 적용
    const currentLevel = parseInt(trainingLevelSelect.value);
    if (currentLevel) {
        toggleSpecialModeByLevel(currentLevel);
    }
});

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    // 초기 단계 목록 생성 (현재 선택된 트레이닝 종류로)
    const initialTrainingType = trainingTypeSelect.value;
    createLevelSelect(initialTrainingType);
    
    // 트레이닝 종류 변경 시 단계 목록 업데이트
    trainingTypeSelect.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        createLevelSelect(selectedType);
        
        // 트레이닝 종류 변경 시 특수 모드 해제
        setupScreen.classList.remove('legend-mode', 'intermediate-mode');
    });
    
    // 단계 변경 시 특수 모드 즉시 적용
    trainingLevelSelect.addEventListener('change', (e) => {
        const selectedLevel = parseInt(e.target.value);
        toggleSpecialModeByLevel(selectedLevel);
    });
});
