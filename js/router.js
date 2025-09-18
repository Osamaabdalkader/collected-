// js/router.js - نظام التوجيه البسيط
import { authManager } from './auth.js';

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = '';
    this.init();
  }

  init() {
    // تعريف المسارات
    this.addRoute('', 'js/pages/home.js', 'css/pages/home.css');
    this.addRoute('login', 'js/pages/login.js', 'css/pages/login.css');
    this.addRoute('register', 'js/pages/register.js', 'css/pages/register.css');
    this.addRoute('dashboard', 'js/pages/dashboard.js', 'css/pages/dashboard.css');
    this.addRoute('management', 'js/pages/management.js', 'css/pages/management.css');
    this.addRoute('network', 'js/pages/network.js', 'css/pages/network.css');
    this.addRoute('reports', 'js/pages/reports.js', 'css/pages/reports.css');
    this.addRoute('messages', 'js/pages/messages.js', 'css/pages/messages.css');
    this.addRoute('add-post', 'js/pages/add-post.js', 'css/pages/add-post.css');

    // الاستماع لتغير العنوان
    window.addEventListener('popstate', () => {
      this.navigate(window.location.hash.slice(1) || '', false);
    });

    // التعامل مع النقر على الروابط
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        this.navigate(route);
      }
    });

    // التوجيه الأولي
    const initialRoute = window.location.hash.slice(1) || '';
    this.navigate(initialRoute);
  }

  addRoute(path, script, style) {
    this.routes[path] = { script, style };
  }

  async navigate(path, addToHistory = true) {
    const route = this.routes[path] || this.routes[''];
    
    if (addToHistory) {
      window.history.pushState(null, null, `#${path}`);
    }
    
    this.currentRoute = path;
    
    // تحميل الأنماط
    this.loadStyle(route.style);
    
    // تحميل البرنامج النصي
    await this.loadScript(route.script);
    
    // تحديث حالة التنقل
    this.updateNavigation();
  }

  loadStyle(href) {
    // إزالة أنماط الصفحة السابقة
    const existingStyle = document.getElementById('page-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // إضافة أنماط الصفحة الجديدة
    if (href) {
      const link = document.createElement('link');
      link.id = 'page-style';
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  async loadScript(src) {
    // إزالة برنامج الصفحة السابق
    const existingScript = document.getElementById('page-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // تحميل برنامج الصفحة الجديدة
    if (src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'page-script';
        script.type = 'module';
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
  }

  updateNavigation() {
    // تحديث حالة الروابط النشطة
    const links = document.querySelectorAll('a[data-route]');
    links.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === this.currentRoute) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // التحقق من الصلاحية قبل التوجيه
  async checkAuthAndNavigate(path) {
    const requiresAuth = ['dashboard', 'management', 'network', 'reports', 'messages', 'add-post'].includes(path);
    
    if (requiresAuth && !authManager.getCurrentUser()) {
      this.navigate('login');
      return false;
    }
    
    this.navigate(path);
    return true;
  }
}

export const router = new Router();
