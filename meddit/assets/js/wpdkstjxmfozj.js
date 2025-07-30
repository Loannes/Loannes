// 리다이렉트 로그 스크립트
(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sourceUrl = urlParams.get('source_url');
    
    if (sourceUrl) {
        const apiEndpoint = 'https://imgs.loannes.com/api/redirect-log';
        const destinationUrl = window.location.href.split('?')[0];
        
        const logRedirect = async () => {
            const data = {
                source_url: sourceUrl,
                destination_url: destinationUrl
            };
            
            try {
                await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data)
                });
            } catch (error) {
                
            }
        };

        await logRedirect();
    }
})(); 