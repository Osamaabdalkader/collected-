// تهيئة جهاز التوجيه
function initRouter() {
    // الاستماع لتغييرات الـ hash
    window.addEventListener('hashchange', handleRouteChange);
}

// التعامل مع تغيير المسار
async function handleRouteChange() {
    const path = window.location.hash.substr(1) || '/';
    const user = await checkAuth();
    
    // إذا كان المستخدم غير مسجل والدخول إلى صفحة محمية
    if (!user && path !== '/login' && path !== '/register') {
        navigateTo('/login');
        return;
    }
    
    // إذا كان المستخدم مسجلًا وحاول الدخول إلى صفحة تسجيل/دخول
    if (user && (path === '/login' || path === '/register')) {
        navigateTo('/');
        return;
    }
    
    // تحميل الصفحة المناسبة
    loadPage(path);
}

// التنقل إلى صفحة معينة
function navigateTo(path) {
    window.location.hash = path;
}

// تحميل الصفحة
async function loadPage(path) {
    let pagePath;
    
    switch (path) {
        case '/':
            pagePath = 'pages/home.html';
            break;
        case '/profile':
            pagePath = 'pages/profile.html';
            break;
        case '/groups':
            pagePath = 'pages/groups.html';
            break;
        case '/support':
            pagePath = 'pages/support.html';
            break;
        case '/more':
            pagePath = 'pages/more.html';
            break;
        case '/login':
            pagePath = 'pages/login.html';
            break;
        case '/register':
            pagePath = 'pages/register.html';
            break;
        default:
            pagePath = 'pages/home.html';
    }
    
    try {
        const response = await fetch(pagePath);
        const html = await response.text();
        document.getElementById('main-content').innerHTML = html;
        
        // تحميل أنماط الصفحة المحددة
        loadPageStyles(path);
        
        // تحميل الـ JavaScript الخاص بالصفحة إذا كان موجودًا
        const scriptPath = pagePath.replace('.html', '.js').replace('pages/', 'js/pages/');
        try {
            const scriptResponse = await fetch(scriptPath);
            if (scriptResponse.ok) {
                const script = document.createElement('script');
                script.src = scriptPath;
                document.body.appendChild(script);
            }
        } catch (e) {
            console.log(`No script found for ${pagePath}`);
        }
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('main-content').innerHTML = `
            <div class="error-page">
                <h2>حدث خطأ في تحميل الصفحة</h2>
                <p>تعذر تحميل الصفحة المطلوبة. يرجى المحاولة مرة أخرى.</p>
            </div>
        `;
    }
}

// تحميل أنماط الصفحة المحددة
function loadPageStyles(path) {
    // إزالة أي أنماط صفحة سابقة
    const existingPageStyle = document.getElementById('page-styles');
    if (existingPageStyle) {
        existingPageStyle.remove();
    }
    
    let stylePath;
    
    switch (path) {
        case '/':
            stylePath = 'css/pages/home.css';
            break;
        case '/profile':
            stylePath = 'css/pages/profile.css';
            break;
        case '/groups':
            stylePath = 'css/pages/groups.css';
            break;
        case '/support':
            stylePath = 'css/pages/support.css';
            break;
        case '/more':
            stylePath = 'css/pages/more.css';
            break;
        case '/login':
            stylePath = 'css/pages/login.css';
            break;
        case '/register':
            stylePath = 'css/pages/register.css';
            break;
        default:
            stylePath = 'css/pages/home.css';
    }
    
    // إضافة رابط الأنماط الجديدة
    const link = document.createElement('link');
    link.id = 'page-styles';
    link.rel = 'stylesheet';
    link.href = stylePath;
    document.head.appendChild(link);
}
