// js/main.js
import { authManager } from './auth.js';

class MainApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            console.log('جاري تهيئة التطبيق...');
            
            // تهيئة إدارة المصادقة
            await authManager.init();
            
            // تهيئة الراوتر
            await this.initRouter();
            
            // إعداد مستمعي الأحداث العامة
            this.setupGlobalEventListeners();
            
            console.log('تم تهيئة التطبيق بنجاح');

        } catch (error) {
            console.error('خطأ في تهيئة التطبيق:', error);
            this.showErrorScreen(error);
        }
    }

    async initRouter() {
        // التأكد من أن الراوتر قد تم تحميله
        if (!window.router) {
            await import('./router.js');
        }
    }

    setupGlobalEventListeners() {
        // مستمعي الأحداث العالمية
        document.addEventListener('DOMContentLoaded', () => {
            console.log('تم تحميل DOM');
        });

        // معالجة الأخطاء العالمية
        window.addEventListener('error', (event) => {
            console.error('خطأ全局:', event.error);
        });
    }

    showErrorScreen(error) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: 'Tajawal', sans-serif;">
                <h1>⚠️ خطأ في تحميل التطبيق</h1>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin: 10px;">
                    إعادة تحميل الصفحة
                </button>
                <button onclick="window.router.navigate('/')" style="padding: 10px 20px;">
                    الصفحة الرئيسية
                </button>
            </div>
        `;
    }
}

// بدء التطبيق
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});
