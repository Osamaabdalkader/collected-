// js/main.js - الملف الرئيسي للتطبيق
import { loadComponent } from './utils/componentLoader.js';
import { initHeader } from './components/header-main.js';
import { initFooter } from './components/footer-common.js';
import { initHomePage } from './pages/home.js';

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // تحميل الهيدر
        await loadComponent('header-container', 'components/header-main.html');
        initHeader();
        
        // تحميل الفوتر
        await loadComponent('footer-container', 'components/footer-common.html');
        initFooter();
        
        // تهيئة الصفحة الرئيسية
        initHomePage();
        
        console.log('تم تحميل المكونات بنجاح');
    } catch (error) {
        console.error('خطأ في تحميل المكونات:', error);
    }
});
