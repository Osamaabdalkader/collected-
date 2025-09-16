// main.js - الملف الرئيسي لتطبيق منصة تسريع
import { router } from './router.js';
import { authManager } from './auth.js';
import { HeaderMain } from './components/header-main.js';
import { HeaderCommon } from './components/header-common.js';
import { FiltersManager } from './components/filters.js';

class MainApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            // تهيئة مدير المصادقة
            await authManager.init();
            
            // إعداد نظام التوجيه
            this.setupRouter();
            
            // تحميل المكونات المشتركة
            await this.loadSharedComponents();
            
            // إعداد مستمعي الأحداث العامة
            this.setupGlobalEventListeners();
            
            console.log('تم تهيئة التطبيق بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة التطبيق:', error);
        }
    }

    setupRouter() {
        // تعريف المسارات
        router.addRoute('/', () => this.showPage('home-page'));
        router.addRoute('/home', () => this.showPage('home-page'));
        router.addRoute('/dashboard', () => this.showPage('dashboard-page'));
        router.addRoute('/network', () => this.showPage('network-page'));
        router.addRoute('/management', () => this.showPage('management-page'));
        router.addRoute('/reports', () => this.showPage('reports-page'));
        router.addRoute('/messages', () => this.showPage('messages-page'));
        router.addRoute('/add-post', () => this.showPage('add-post-page'));
        router.addRoute('/login', () => this.showPage('login-page'));
        router.addRoute('/register', () => this.showPage('register-page'));
        router.addRoute('/profile', () => this.showPage('profile-page'));
    }

    async loadSharedComponents() {
        // تحميل الهيدر المناسب بناءً على الصفحة
        const path = window.location.pathname;
        if (path === '/' || path === '/home') {
            await router.loadComponent('../components/header-main.html', 'header-container');
            new HeaderMain();
            await router.loadComponent('../components/filters.html', 'filters-container');
            new FiltersManager();
        } else {
            await router.loadComponent('../components/header-common.html', 'header-container');
            new HeaderCommon();
        }

        // تحميل الفوتر
        await router.loadComponent('../components/footer-common.html', 'footer-container');
    }

    showPage(pageId) {
        router.showPage(pageId);
        
        // تحميل الـ JavaScript الخاص بالصفحة إذا لزم الأمر
        this.loadPageScript(pageId);
        
        // تحديث حالة المصادقة في الواجهة
        authManager.updateAuthUI(!!authManager.currentUser);
    }

    loadPageScript(pageId) {
        const pageScripts = {
            'home-page': () => import('./pages/home.js'),
            'dashboard-page': () => import('./pages/dashboard.js'),
            'network-page': () => import('./pages/network.js'),
            'management-page': () => import('./pages/management.js'),
            'reports-page': () => import('./pages/reports.js'),
            'messages-page': () => import('./pages/messages.js'),
            'add-post-page': () => import('./pages/add-post.js'),
            'login-page': () => import('./pages/login.js'),
            'register-page': () => import('./pages/register.js'),
            'profile-page': () => import('./pages/profile.js')
        };

        if (pageScripts[pageId]) {
            pageScripts[pageId]().then(module => {
                if (module && typeof module.init === 'function') {
                    module.init();
                }
            }).catch(error => {
                console.error(`Error loading script for ${pageId}:`, error);
            });
        }
    }

    setupGlobalEventListeners() {
        // إدارة تسجيل الخروج
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                authManager.handleLogout();
            });
        }

        // إخفاء/إظهار العناصر بناءً على حالة المصادقة
        authManager.addAdminStatusListener((isAdmin) => {
            this.updateUIForAuthStatus(!!authManager.currentUser, isAdmin);
        });
    }

    updateUIForAuthStatus(isLoggedIn, isAdmin) {
        // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
        const authElements = document.querySelectorAll('.auth-only');
        const unauthElements = document.querySelectorAll('.unauth-only');
        const adminElements = document.querySelectorAll('.admin-only');

        if (isLoggedIn) {
            authElements.forEach(el => el.style.display = 'block');
            unauthElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = isAdmin ? 'block' : 'none');
        } else {
            authElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = 'none');
            unauthElements.forEach(el => el.style.display = 'block');
        }
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});

export default MainApp;