// معالجات الهيدر الرئيسي
import { authManager } from '../../auth.js';

class HeaderMain {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // أيقونة الملف الشخصي
        const profileIcon = document.getElementById('profile-header-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', () => {
                const user = authManager.currentUser;
                if (user) {
                    window.location.href = '../pages/profile.html';
                } else {
                    window.location.href = '../pages/login.html';
                }
            });
        }

        // أيقونة الإشعارات
        const notificationsIcon = document.getElementById('notifications-icon');
        if (notificationsIcon) {
            notificationsIcon.addEventListener('click', () => {
                alert('صفحة الإشعارات قيد التطوير');
            });
        }

        // أيقونة القائمة الجانبية
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
    }

    toggleSidebar() {
        // سيتم تنفيذ هذه الوظيفة لاحقاً
        console.log('فتح/إغلاق القائمة الجانبية');
    }
}

// تصدير الكلاس للاستخدام في الملفات الأخرى
export { HeaderMain };