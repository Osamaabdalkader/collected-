class Router {
    constructor() {
        this.routes = {
            '/': 'pages/home.html',
            '/dashboard': 'pages/dashboard.html',
            '/management': 'pages/management.html',
            '/network': 'pages/network.html',
            '/reports': 'pages/reports.html',
            '/messages': 'pages/messages.html',
            '/add-post': 'pages/add-post.html',
            '/post-detail': 'pages/post-detail.html',
            '/login': 'pages/login.html',
            '/register': 'pages/register.html'
        };

        this.init();
    }

    init() {
        window.addEventListener('popstate', () => {
            this.loadRoute(window.location.pathname);
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.href);
            }
        });

        this.loadRoute(window.location.pathname);
    }

    async loadRoute(path) {
        const route = this.routes[path] || this.routes['/'];
        
        try {
            const response = await fetch(route);
            const html = await response.text();
            
            document.getElementById('main-content').innerHTML = html;
            
            this.loadPageScript(path);
            this.updateActiveNav(path);
        } catch (error) {
            console.error('خطأ في تحميل الصفحة:', error);
        }
    }

    loadPageScript(path) {
        const oldScript = document.getElementById('page-script');
        if (oldScript) oldScript.remove();
        
        const scriptPath = `js/pages${path}.js`;
        const script = document.createElement('script');
        script.id = 'page-script';
        script.src = scriptPath;
        script.type = 'module';
        
        script.onerror = () => {
            console.log(`لا يوجد script للصفحة: ${scriptPath}`);
        };
        
        document.head.appendChild(script);
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.loadRoute(path);
    }

    updateActiveNav(path) {
        document.querySelectorAll('[data-link]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }
}

export default Router;
