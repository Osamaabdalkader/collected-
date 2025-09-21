// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async function() {
    // تحميل المكونات
    await loadComponent('header-container', 'components/header-main.html');
    await loadComponent('footer-container', 'components/footer-common.html');
    
    // تهيئة Supabase
    initSupabase();
    
    // التحقق من حالة المصادقة
    const user = await checkAuth();
    
    // تهيئة جهاز التوجيه
    initRouter();
    
    // تحميل الصفحة المناسبة بناءً على حالة المصادقة والمسار
    handleInitialPageLoad(user);
});

// دالة لتحميل المكونات
async function loadComponent(containerId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
        
        // تحميل الـ JavaScript المرتبط بالمكون إذا كان موجودًا
        const scriptPath = componentPath.replace('.html', '.js').replace('components/', 'js/components/');
        try {
            const scriptResponse = await fetch(scriptPath);
            if (scriptResponse.ok) {
                const script = document.createElement('script');
                script.src = scriptPath;
                document.body.appendChild(script);
            }
        } catch (e) {
            console.log(`No script found for ${componentPath}`);
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// التعامل مع تحميل الصفحة الأولى
function handleInitialPageLoad(user) {
    const path = window.location.hash.substr(1) || '/';
    
    if (!user && path !== '/login' && path !== '/register') {
        navigateTo('/login');
    } else if (user && (path === '/login' || path === '/register')) {
        navigateTo('/');
    } else {
        navigateTo(path);
    }
    }
