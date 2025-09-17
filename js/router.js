// js/router.js - نظام التوجيه للصفحات
class Router {
    constructor() {
        this.routes = {};
        this.currentPath = '';
        this.init();
    }

    init() {
        // التعامل مع زر الرجوع في المتصفح
        window.addEventListener('popstate', (e) => {
            this.navigate(window.location.pathname, false);
        });

        // اعتراض النقر على الروابط
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')?.startsWith('/')) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });

        // التوجيه الأولي عند تحميل الصفحة
        this.navigate(window.location.pathname, false);
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    async navigate(path, addToHistory = true) {
        // تجاهل الروابط الخارجية أو التي تبدأ بـ http
        if (path.startsWith('http')) return;

        // تنظيف المسار
        const cleanPath = path.split('?')[0];
        
        if (this.currentPath === cleanPath) return;
        
        this.currentPath = cleanPath;
        
        if (addToHistory) {
            window.history.pushState({}, '', path);
        }

        // إظهار مؤشر التحميل
        this.showLoading();

        try {
            // البحث عن المسار في القائمة
            const routeHandler = this.routes[cleanPath] || this.routes['/404'];
            
            if (routeHandler) {
                await routeHandler();
            } else {
                console.error('No route found for:', cleanPath);
                this.navigate('/404');
            }
        } catch (error) {
            console.error('Navigation error:', error);
            this.navigate('/500');
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        // إنشاء عنصر التحميل إذا لم يكن موجوداً
        let loader = document.getElementById('router-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'router-loader';
            loader.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                background: rgba(0, 0, 0, 0.7);
                padding: 20px;
                border-radius: 10px;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
            `;
            loader.innerHTML = `
                <div class="spinner"></div>
                <p>جاري التحميل...</p>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    hideLoading() {
        const loader = document.getElementById('router-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

export const router = new Router();
