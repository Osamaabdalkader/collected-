// js/router.js
class Router {
    constructor() {
        this.routes = {};
        this.currentPath = '';
        this.init();
    }

    init() {
        // تعريف المسارات
        this.addRoute('/', 'pages/home.html');
        this.addRoute('/dashboard', 'pages/dashboard.html');
        this.addRoute('/login', 'pages/login.html');
        this.addRoute('/register', 'pages/register.html');
        this.addRoute('/network', 'pages/network.html');
        this.addRoute('/reports', 'pages/reports.html');
        this.addRoute('/management', 'pages/management.html');
        this.addRoute('/messages', 'pages/messages.html');
        this.addRoute('/add-post', 'pages/add-post.html');

        // معالجة التوجيه الأولي
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // منع التنقل الافتراضي للروابط
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.getAttribute('data-route') !== 'false') {
                e.preventDefault();
                const path = link.getAttribute('href');
                this.navigate(path);
            }
        });

        // التوجيه الأولي
        this.handleRoute();
    }

    addRoute(path, template) {
        this.routes[path] = template;
    }

    async navigate(path) {
        if (path.startsWith('http')) return;
        
        window.history.pushState({}, '', path);
        await this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        this.currentPath = path;

        console.log('التوجيه إلى:', path);

        const template = this.routes[path] || this.routes['/'];
        
        try {
            await this.loadPage(template);
        } catch (error) {
            console.error('خطأ في تحميل الصفحة:', error);
            await this.loadPage('pages/home.html');
        }
    }

    async loadPage(templatePath) {
        try {
            console.log('جاري تحميل:', templatePath);
            
            // تحميل الهيدر المناسب
            await this.loadHeader(templatePath);

            // تحميل محتوى الصفحة
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error('لم يتم العثور على الصفحة');
            
            const html = await response.text();
            document.getElementById('main-content').innerHTML = html;

            // تحميل الـ CSS الخاص بالصفحة
            await this.loadPageStyles(templatePath);

            // تحميل الـ JS الخاص بالصفحة
            await this.loadPageScript(templatePath);

        } catch (error) {
            console.error('خطأ في تحميل الصفحة:', error);
            document.getElementById('main-content').innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h2>⚠️ خطأ في تحميل الصفحة</h2>
                    <p>${error.message}</p>
                    <button onclick="window.router.navigate('/')">العودة للصفحة الرئيسية</button>
                </div>
            `;
        }
    }

    async loadHeader(templatePath) {
        try {
            const isAuthPage = templatePath.includes('login') || templatePath.includes('register');
            const headerType = isAuthPage ? '' : templatePath.includes('home') ? 'header-main' : 'header-common';
            
            if (!headerType) {
                document.getElementById('header-container').innerHTML = '';
                return;
            }

            const response = await fetch(`components/${headerType}.html`);
            const headerHtml = await response.text();
            document.getElementById('header-container').innerHTML = headerHtml;

            // تحميل JS الخاص بالهيدر
            if (headerType) {
                await this.loadScript(`js/components/${headerType}.js`);
            }

        } catch (error) {
            console.error('خطأ في تحميل الهيدر:', error);
        }
    }

    async loadPageStyles(templatePath) {
        const pageName = templatePath.split('/').pop().replace('.html', '');
        const stylePath = `css/pages/${pageName}.css`;
        
        // إزالة أنماط الصفحات السابقة
        document.querySelectorAll('link[data-page-style]').forEach(link => link.remove());
        
        try {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = stylePath;
            link.setAttribute('data-page-style', 'true');
            document.head.appendChild(link);
        } catch (error) {
            console.warn('لم يتم العثور على أنماط الصفحة:', stylePath);
        }
    }

    async loadPageScript(templatePath) {
        const pageName = templatePath.split('/').pop().replace('.html', '');
        const scriptPath = `js/pages/${pageName}.js`;
        
        // إزالة سكريبتات الصفحات السابقة
        document.querySelectorAll('script[data-page-script]').forEach(script => script.remove());
        
        try {
            await this.loadScript(scriptPath, true);
        } catch (error) {
            console.warn('لم يتم العثور على سكريبت الصفحة:', scriptPath);
        }
    }

    async loadScript(src, isModule = false) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            if (isModule) script.type = 'module';
            script.setAttribute('data-page-script', 'true');
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
}

// إنشاء Router全局
window.router = new Router();
