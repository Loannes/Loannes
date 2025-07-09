document.addEventListener('DOMContentLoaded', () => {
    // Audio functionality (only if elements exist)
    const audio = document.getElementById('bg-music');
    const audioIcon = document.getElementById('audio-icon');
    
    if (audio && audioIcon) {
        let isPlaying = false;

        const volumeOnIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
        const volumeOffIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;

        function toggleAudio() {
            if (isPlaying) {
                audio.pause();
                audioIcon.innerHTML = volumeOffIcon;
            } else {
                audio.play().catch(error => {
                    console.log("Audio playback failed:", error);
                    // Autoplay was prevented. We can't do much here without user interaction.
                });
                audioIcon.innerHTML = volumeOnIcon;
            }
            isPlaying = !isPlaying;
        }

        audioIcon.addEventListener('click', toggleAudio);

        // Try to autoplay, but be ready to catch errors.
        // Many browsers block autoplay without user interaction.
        audio.play().then(() => {
            isPlaying = true;
            audioIcon.innerHTML = volumeOnIcon;
        }).catch(() => {
            isPlaying = false;
            audioIcon.innerHTML = volumeOffIcon;
        });
    }

    // 모달 전용 확대 방지 함수들
    function preventTouch(e) {
        if (e.touches && e.touches.length > 1) {
            e.preventDefault();
            e.stopPropagation(); // 이벤트 전파를 막아 다른 리스너에 영향 X
        }
    }
    
    function preventGesture(e) {
        e.preventDefault();
        e.stopPropagation(); // 이벤트 전파를 막아 다른 리스너에 영향 X
    }

    // Gallery modal functionality
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    let currentImageIndex = 0; // 현재 표시된 이미지의 인덱스
    
    // 갤러리 이미지를 클릭하면 모달 열기
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentImageIndex = index; // 클릭된 이미지의 인덱스를 저장
            modal.classList.add('show');
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            document.body.style.overflow = 'hidden';
            
            // 모달이 열렸을 때 추가적인 확대 방지 이벤트 리스너 추가
            modal.addEventListener('touchstart', preventTouch, { passive: false });
            modal.addEventListener('touchmove', preventTouch, { passive: false });
            modal.addEventListener('gesturestart', preventGesture, { passive: false });
        });
    });

    // 다음 이미지를 보여주는 함수
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length; // 다음 인덱스로, 마지막이면 처음으로
        const nextImage = galleryImages[currentImageIndex];
        modalImage.src = nextImage.src;
        modalImage.alt = nextImage.alt;
    }

    // 이전 이미지를 보여주는 함수
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length; // 이전 인덱스로, 처음이면 마지막으로
        const prevImage = galleryImages[currentImageIndex];
        modalImage.src = prevImage.src;
        modalImage.alt = prevImage.alt;
    }

    // 모달 안의 이미지를 클릭하면 다음 이미지 표시 (기능 제거 또는 주석 처리)
    /*
    if (modalImage) {
        modalImage.addEventListener('click', (event) => {
            event.stopPropagation(); // 모달 배경 클릭으로 이벤트가 전파되는 것을 막음
            showNextImage();
        });
    }
    */

    // 네비게이션 버튼 이벤트 리스너
    if (prevButton) {
        prevButton.addEventListener('click', (event) => {
            event.stopPropagation();
            showPrevImage();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (event) => {
            event.stopPropagation();
            showNextImage();
        });
    }
    
    // 모달 닫기 관련 기능
    function closeImageModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // 모달이 닫힐 때 이벤트 리스너 제거
        modal.removeEventListener('touchstart', preventTouch);
        modal.removeEventListener('touchmove', preventTouch);
        modal.removeEventListener('gesturestart', preventGesture);
    }
    
    // 닫기 버튼(X)을 클릭하면 모달 닫기
    if (closeModal) {
        closeModal.addEventListener('click', closeImageModal);
    }
    
    // 모달 바깥 영역을 클릭하면 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Escape 키를 누르면 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeImageModal();
        }
    });

    // Map image click functionality
    const mapImage = document.getElementById('map-image-link');
    if (mapImage) {
        mapImage.addEventListener('click', function() {
            const naverMapUrl = 'https://naver.me/502MVbqj';
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                // On mobile, the OS will handle opening the Naver Map app if it's installed.
                window.location.href = naverMapUrl;
            } else {
                // On desktop, open in a popup window.
                window.open(naverMapUrl, 'mapPopup', 'width=800,height=700');
            }
        });
    }
}); 