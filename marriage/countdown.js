// 결혼식 날짜 설정 (2025년 8월 30일 오후 2시 50분)
const weddingDate = new Date('2025-08-30T14:50:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    // 시간 계산
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // DOM 업데이트
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const daysLeftElement = document.getElementById('days-left');

    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    if (daysLeftElement) daysLeftElement.textContent = `${days}일`;

    // 결혼식이 지났을 경우
    if (timeLeft < 0) {
        if (daysElement) daysElement.textContent = '000';
        if (hoursElement) hoursElement.textContent = '00';
        if (minutesElement) minutesElement.textContent = '00';
        if (secondsElement) secondsElement.textContent = '00';
        if (daysLeftElement) daysLeftElement.textContent = '0일';
        
        // 카운트다운 메시지 변경
        const messageElement = document.querySelector('.countdown-message p');
        if (messageElement) {
            messageElement.innerHTML = '도현 ❤ 하나의 결혼식이 <span class="highlight">이루어졌습니다!</span>';
        }
        
        return;
    }
}

// 탭 기능
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // 모든 탭 버튼과 패널에서 active 클래스 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // 클릭된 탭 버튼과 해당 패널에 active 클래스 추가
            button.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// 아코디언 기능
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const isActive = header.classList.contains('active');
            
            if (isActive) {
                // 현재 활성화된 아코디언을 닫기
                header.classList.remove('active');
                targetContent.classList.remove('active');
            } else {
                // 아코디언 열기
                header.classList.add('active');
                targetContent.classList.add('active');
            }
        });
    });
}

// 계좌번호 복사 기능
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const accountNumber = button.getAttribute('data-account');
            
            try {
                await navigator.clipboard.writeText(accountNumber);
                
                // 복사 성공 시 버튼 스타일 변경
                button.classList.add('copied');
                const originalText = button.innerHTML;
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    복사됨
                `;
                
                // 2초 후 원래 상태로 복원
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.innerHTML = originalText;
                }, 2000);
                
            } catch (err) {
                console.error('복사 실패:', err);
                
                // 복사 실패 시 폴백 - 선택 가능한 텍스트로 표시
                const textArea = document.createElement('textarea');
                textArea.value = accountNumber;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                alert('계좌번호가 복사되었습니다: ' + accountNumber);
            }
        });
    });
}

// 공유 기능
function initShareButtons() {
    // 링크 복사 기능
    const linkCopyButton = document.getElementById('link-copy');
    if (linkCopyButton) {
        linkCopyButton.addEventListener('click', async () => {
            const currentUrl = window.location.href;
            
            try {
                await navigator.clipboard.writeText(currentUrl);
                
                // 복사 성공 시 버튼 텍스트 변경
                const originalContent = linkCopyButton.innerHTML;
                linkCopyButton.innerHTML = `
                    <div class="share-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    링크가 복사되었습니다
                `;
                
                // 2초 후 원래 상태로 복원
                setTimeout(() => {
                    linkCopyButton.innerHTML = originalContent;
                }, 2000);
                
            } catch (err) {
                console.error('링크 복사 실패:', err);
                alert('링크가 복사되었습니다: ' + currentUrl);
            }
        });
    }

    // 카카오톡 공유 기능 (기본 웹 공유 API 사용)
    const kakaoShareButton = document.getElementById('kakao-share');
    if (kakaoShareButton) {
        kakaoShareButton.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: '도현 ❤ 하나의 결혼식에 초대합니다',
                    text: '2025년 10월 12일 일요일 오후 1시 30분\n아펠가모 광화문 B2 로스타뇨홀',
                    url: window.location.href
                }).catch(err => {
                    console.log('공유 실패:', err);
                });
            } else {
                // Web Share API를 지원하지 않는 경우 링크 복사
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('링크가 복사되었습니다. 카카오톡에서 공유해 주세요!');
                }).catch(() => {
                    alert('링크: ' + window.location.href);
                });
            }
        });
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    updateCountdown(); // 즉시 업데이트
    setInterval(updateCountdown, 1000); // 1초마다 업데이트
    initTabs(); // 탭 기능 초기화
    initAccordion(); // 아코디언 기능 초기화
    initCopyButtons(); // 복사 기능 초기화
    initShareButtons(); // 공유 기능 초기화
}); 