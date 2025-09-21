export async function loadHeader() {
    const path = window.location.pathname;
    const headerType = path === '/' ? 'header-main' : 'header-common';
    
    try {
        const response = await fetch(`components/${headerType}.html`);
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;
        
        // تحميل JS الخاص بالهيدر
        const script = document.createElement('script');
        script.src = `js/components/${headerType}.js`;
        script.type = 'module';
        document.head.appendChild(script);
    } catch (error) {
        console.error('خطأ في تحميل الهيدر:', error);
    }
}

export async function loadFooter() {
    try {
        const response = await fetch('components/footer-common.html');
        const html = await response.text();
        document.getElementById('footer-container').innerHTML = html;
        
        // تحميل JS الخاص بالفوتر
        const script = document.createElement('script');
        script.src = 'js/components/footer-common.js';
        script.type = 'module';
        document.head.appendChild(script);
    } catch (error) {
        console.error('خطأ في تحميل الفوتر:', error);
    }
}
