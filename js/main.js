// js/main.js - الملف الرئيسي للتطبيق
import { authManager } from './auth.js';
import { initHeader } from './components/header-main.js';
import { initFooter } from './components/footer-common.js';

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // تهيئة مدير المصادقة
        await authManager.init();
        
        // تهيئة المكونات
        initHeader();
        initFooter();
        
        console.log('تم تهيئة التطبيق بنجاح');
    } catch (error) {
        console.error('خطأ في تهيئة التطبيق:', error);
    }
});

// تصدير كائنات عامة للاستخدام في الملفات الأخرى
window.authManager = authManager;
