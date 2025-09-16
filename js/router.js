// router.js - نظام التوجيه لتطبيق صفحة واحدة (SPA)
class Router {
    constructor() {
        this.routes = {};
        this.currentPath = '';
        this.init();
    }

    init() {
        // التعامل مع تغيير المسار
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });

        // التعامل مع النقر على الروابط
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });

        // معالجة المسار الأولي
        this.handleRoute(window.location.pathname);
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }

    async handleRoute(path) {
        this.currentPath = path;
        
        // البحث عن المسار المطابق
        let matchedRoute = null;
        for (const route in this.routes) {
            if (this.matchRoute(route, path)) {
                matchedRoute = route;
                break;
            }
        }

        if (matchedRoute) {
            // إخفاء جميع المحتويات
            this.hideAllPages();
            
            // تحميل وتشغيل المسار المطابق
            await this.routes[matchedRoute]();
        } else {
            // إذا لم يتم العثور على المسار، التوجيه إلى الصفحة الرئيسية
            this.navigate('/');
        }
    }

    matchRoute(route, path) {
        const routeParts = route.split('/').filter(part => part);
        const pathParts = path.split('/').filter(part => part);

        if (routeParts.length !== pathParts.length) {
            return false;
        }

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i] !== pathParts[i] && !routeParts[i].startsWith(':')) {
                return false;
            }
        }

        return true;
    }

    hideAllPages() {
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(page => {
            page.style.display = 'none';
        });
    }

    showPage(pageId) {
        const page = document.getElementById(pageId);
        if (page) {
            page.style.display = 'block';
            window.scrollTo(0, 0);
        }
    }

    // تحميل مكون HTML ديناميكياً
    async loadComponent(componentPath, containerId) {
        try {
            const response = await fetch(componentPath);
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
            return true;
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
            return false;
        }
    }
}

// إنشاء مثول Router وتصديره
export const router = new Router();