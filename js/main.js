// js/main.js - الملف الرئيسي للتطبيق
import { authManager } from './auth.js';
import { router } from './router.js';

class App {
  constructor() {
    this.init();
  }

  async init() {
    // تهيئة إدارة المصادقة
    await authManager.init();
    
    // تحميل المكونات
    await this.loadComponents();
    
    // إعداد مستمعي الأحداث
    this.setupEventListeners();
    
    // التوجيه الأولي
    const initialRoute = window.location.hash.slice(1) || '';
    router.navigate(initialRoute);
  }

  async loadComponents() {
    // تحميل الهيدر
    const headerContainer = document.getElementById('header-container');
    const headerResponse = await fetch('components/header-main.html');
    headerContainer.innerHTML = await headerResponse.text();
    
    // تحميل الفوتر
    const footerContainer = document.getElementById('footer-container');
    const footerResponse = await fetch('components/footer-common.html');
    footerContainer.innerHTML = await footerResponse.text();
    
    // تحميل البرامج النصية للمكونات
    await this.loadComponentScript('js/components/header-main.js');
    await this.loadComponentScript('js/components/footer-common.js');
  }

  async loadComponentScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  setupEventListeners() {
    // الاستماع لتغير حالة المصادقة
    authManager.addAuthStateListener((isLoggedIn) => {
      this.onAuthStateChange(isLoggedIn);
    });
  }

  onAuthStateChange(isLoggedIn) {
    console.log('حالة المصادقة تغيرت:', isLoggedIn);
    
    // تحديث واجهة المستخدم بناءً على حالة المصادقة
    this.updateUIForAuthState(isLoggedIn);
    
    // إذا كان المستخدم مسجلاً دخولاً وطلب صفحة تسجيل الدخول، توجيه إلى لوحة التحكم
    if (isLoggedIn && router.currentRoute === 'login') {
      router.navigate('dashboard');
    }
    
    // إذا لم يكن المستخدم مسجلاً دخولاً وطلب صفحة محمية، توجيه إلى تسجيل الدخول
    if (!isLoggedIn && ['dashboard', 'management', 'network', 'reports', 'messages', 'add-post'].includes(router.currentRoute)) {
      router.navigate('login');
    }
  }

  updateUIForAuthState(isLoggedIn) {
    const authElements = document.querySelectorAll('.auth-only');
    const unauthElements = document.querySelectorAll('.unauth-only');
    
    if (isLoggedIn) {
      authElements.forEach(el => el.style.display = 'block');
      unauthElements.forEach(el => el.style.display = 'none');
    } else {
      authElements.forEach(el => el.style.display = 'none');
      unauthElements.forEach(el => el.style.display = 'block');
    }
  }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
