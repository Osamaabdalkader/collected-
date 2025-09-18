// js/main.js
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
    // تحميل الهيدر الرئيسي للصفحة الرئيسية
    const headerContainer = document.getElementById('header-container');
    try {
      const headerResponse = await fetch('components/header-main.html');
      headerContainer.innerHTML = await headerResponse.text();
    } catch (error) {
      console.error('Failed to load header:', error);
    }
    
    // تحميل الفوتر المشترك
    const footerContainer = document.getElementById('footer-container');
    try {
      const footerResponse = await fetch('components/footer-common.html');
      footerContainer.innerHTML = await footerResponse.text();
    } catch (error) {
      console.error('Failed to load footer:', error);
    }
    
    // تحميل البرامج النصية للمكونات
    try {
      await import('./components/header-main.js');
      await import('./components/footer-common.js');
    } catch (error) {
      console.error('Failed to load component scripts:', error);
    }
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
