// js/components/header-main.js
import { authManager } from '../auth.js';
import { router } from '../router.js';

class HeaderMain {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUIForAuthState(authManager.getCurrentUser() !== null);
    }

    setupEventListeners() {
        // أيقونة الملف الشخصي
        const profileIcon = document.getElementById('profile-header-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', () => {
                router.navigate(profileIcon.getAttribute('data-route'));
            });
        }

        // الشعار للعودة إلى الرئيسية
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.addEventListener('click', () => {
                router.navigate(logoContainer.getAttribute('data-route'));
            });
        }

        // أيقونة الإشعارات
        const notificationsIcon = document.getElementById('notifications-icon');
        if (notificationsIcon) {
            notificationsIcon.addEventListener('click', () => {
                alert('صفحة الإشعارات قيد التطوير');
            });
        }

        // أيقونة تسجيل الدخول للزوار
        const loginIcon = document.getElementById('login-icon');
        if (loginIcon) {
            loginIcon.addEventListener('click', () => {
                router.navigate(loginIcon.getAttribute('data-route'));
            });
        }

        // أيقونة القائمة الجانبية
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', this.toggleSidebar);
        }

        // البحث
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.handleSearch(searchInput.value));
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(searchInput.value);
                }
            });
        }

        // الفلاتر
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', () => this.handleFilterChange());
        });

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

    handleSearch(searchTerm) {
        console.log('بحث عن:', searchTerm);
        // يمكنك هنا تنفيذ البحث أو تنبيه المستخدم بأن البحث قيد التطوير
        alert('نظام البحث قيد التطوير. سيتم تفعيله قريباً!');
    }

    handleFilterChange() {
        const categoryFilter = document.querySelector('.filter-category select').value;
        const locationFilter = document.querySelector('.filter-location select').value;
        console.log('تم تغيير الفلاتر - الفئة:', categoryFilter, 'المدينة:', locationFilter);
        // يمكنك هنا تنفيذ الفلترة أو تنبيه المستخدم بأن الفلترة قيد التطوير
        alert('نظام الفلترة قيد التطوير. سيتم تفعيله قريباً!');
    }

    toggleSidebar() {
        console.log('تم النقر على أيقونة القائمة الجانبية');
        // يمكنك هنا تنفيذ فتح وإغلاق القائمة الجانبية
        alert('القائمة الجانبية قيد التطوير. سيتم تفعيلها قريباً!');
    }
}

// تهيئة الهيدر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new HeaderMain();
});
