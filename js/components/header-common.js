// معالجات الهيدر المشترك
import { authManager } from '../../auth.js';

class HeaderCommon {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // أيقونة العودة للصفحة الرئيسية
        const homeIcon = document.querySelector('.home-icon');
        if (homeIcon) {
            homeIcon.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../pages/home.html';
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
export { HeaderCommon };