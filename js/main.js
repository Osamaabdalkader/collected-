// js/main.js - الملف الرئيسي للتطبيق (محدث)
import { loadComponent } from './utils/componentLoader.js';
import { initHeader } from './components/header-main.js';
import { initFooter } from './components/footer-common.js';
import { initHomePage } from './pages/home.js';
import { router } from './router.js';
import { authManager } from './auth.js';

// تعريف المسارات
router.addRoute('/', async () => {
    await initHomePage();
});

router.addRoute('/dashboard', async () => {
    // التحقق من تسجيل الدخول أولاً
    const user = await authManager.checkAuth();
    if (!user) {
        router.navigate('/login');
        return;
    }
    
    // تحميل لوحة التحكم
    const { initDashboard } = await import('./pages/dashboard.js');
    await initDashboard();
});

router.addRoute('/login', async () => {
    // إذا كان المستخدم مسجلاً بالفعل، توجيه إلى لوحة التحكم
    const user = await authManager.checkAuth();
    if (user) {
        router.navigate('/dashboard');
        return;
    }
    
    // تحميل صفحة تسجيل الدخول
    const { initLoginPage } = await import('./pages/login.js');
    await initLoginPage();
});

router.addRoute('/register', async () => {
    // إذا كان المستخدم مسجلاً بالفعل، توجيه إلى لوحة التحكم
    const user = await authManager.checkAuth();
    if (user) {
        router.navigate('/dashboard');
        return;
    }
    
    // تحميل صفحة التسجيل
    const { initRegisterPage } = await import('./pages/register.js');
    await initRegisterPage();
});

// صفحة 404
router.addRoute('/404', async () => {
    document.getElementById('main-content').innerHTML = `
        <div class="container">
            <div style="text-align: center; padding: 50px;">
                <h1>404 - الصفحة غير موجودة</h1>
                <p>عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
                <a href="/" class="btn primary">العودة إلى الصفحة الرئيسية</a>
            </div>
        </div>
    `;
});

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // تحميل الهيدر
        await loadComponent('header-container', 'components/header-main.html');
        initHeader();
        
        // تحميل الفوتر
        await loadComponent('footer-container', 'components/footer-common.html');
        initFooter();
        
        // بدء نظام التوجيه
        console.log('تم تحميل المكونات بنجاح');
    } catch (error) {
        console.error('خطأ في تحميل المكونات:', error);
    }
});
