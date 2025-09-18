// js/components/header-common.js
import { authManager } from '../auth.js';
import { router } from '../router.js';

class HeaderCommon {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUIForAuthState(authManager.getCurrentUser() !== null);
    }

    setupEventListeners() {
        // زر العودة
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.history.back();
            });
        }

        // الشعار للعودة إلى الرئيسية
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.addEventListener('click', () => {
                router.navigate(logoContainer.getAttribute('data-route'));
            });
        }

        // أيقونة الملف الشخصي
        const profileIcon = document.getElementById('profile-header-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', () => {
                router.navigate(profileIcon.getAttribute('data-route'));
            });
        }

        // أيقونة تسجيل الدخول للزوار
        const loginIcon = document.getElementById('login-icon');
        if (loginIcon) {
            loginIcon.addEventListener('click', () => {
                router.navigate(loginIcon.getAttribute('data-route'));
            });
        }

        // الاستماع لتغير حالة المصادقة
        authManager.addAuthStateListener((isLoggedIn) => {
            this.updateUIForAuthState(isLoggedIn);
        });
    }

    updateUIForAuthState(isLoggedIn) {
        const authElements = document.querySelectorAll('.auth-only');
        const unauthElements = document.querySelectorAll('.unauth-only');

        if (isLoggedIn) {
            authElements.forEach(el => el.style.display = 'flex');
            unauthElements.forEach(el => el.style.display = 'none');
        } else {
            authElements.forEach(el => el.style.display = 'none');
            unauthElements.forEach(el => el.style.display = 'flex');
        }
    }
}

// تهيئة الهيدر المشترك عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new HeaderCommon();
});
