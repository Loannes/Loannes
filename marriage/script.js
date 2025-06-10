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
    
    console.log('Gallery images found:', galleryImages.length);
    
    // Open modal when gallery image is clicked
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            console.log('Image clicked!');
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
    
    // Close modal functions
    function closeImageModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // 모달이 닫힐 때 이벤트 리스너 제거
        modal.removeEventListener('touchstart', preventTouch);
        modal.removeEventListener('touchmove', preventTouch);
        modal.removeEventListener('gesturestart', preventGesture);
    }
    
    // Close modal when X button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', closeImageModal);
    }
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Close modal when pressing Escape key
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