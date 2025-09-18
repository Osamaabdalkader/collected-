// js/components/footer-common.js
import { authManager } from '../auth.js';
import { router } from '../router.js';

class FooterCommon {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUIForAuthState(authManager.getCurrentUser() !== null);
    }

    setupEventListeners() {
        // الروابط في الفوتر
        const footerLinks = document.querySelectorAll('footer .icon[data-route]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                router.navigate(route);
            });
        });

        // أيقونة السلة
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                alert('صفحة السلة قيد التطوير');
            });
        }

        // الاستماع لتغير حالة المصادقة
        authManager.addAuthStateListener((isLoggedIn) => {
            this.updateUIForAuthState(isLoggedIn);
        });
    }

    updateUIForAuthState(isLoggedIn) {
        const authElements = document.querySelectorAll('footer .auth-only');
        const unauthElements = document.querySelectorAll('footer .unauth-only');

        if (isLoggedIn) {
            authElements.forEach(el => el.style.display = 'flex');
            unauthElements.forEach(el => el.style.display = 'none');
        } else {
            authElements.forEach(el => el.style.display = 'none');
            unauthElements.forEach(el => el.style.display = 'flex');
        }
    }
}

// تهيئة الفوتر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new FooterCommon();
});
