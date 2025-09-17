// js/main.js - الملف الرئيسي للتطبيق
import { loadComponent } from './utils/componentLoader.js';

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // تحميل الهيدر
        await loadComponent('header-container', 'components/header-main.html');
        
        // تحميل الفوتر
        await loadComponent('footer-container', 'components/footer-common.html');
        
        console.log('تم تحميل المكونات بنجاح');
    } catch (error) {
        console.error('خطأ في تحميل المكونات:', error);
    }
});
