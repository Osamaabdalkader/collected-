// js/components/footer-common.js - معالجات الفوتر المشترك
import { authManager } from '../auth.js';
import { router } from '../router.js';

export function initFooter() {
    // إعداد مستمعي الأحداث للفوتر
    const groupsIcon = document.getElementById('groups-icon');
    const cartIcon = document.getElementById('cart-icon');
    const addButton = document.getElementById('add-button');
    const supportIcon = document.getElementById('support-icon');
    const moreIcon = document.getElementById('more-icon');

    // أيقونة مجموعتك
    if (groupsIcon) {
        groupsIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const user = authManager.currentUser;
            if (user) {
                router.navigate('/dashboard');
            } else {
                router.navigate('/login');
            }
        });
    }

    // أيقونة السلة
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const user = authManager.currentUser;
            if (user) {
                alert('صفحة السلة قيد التطوير');
            } else {
                router.navigate('/login');
            }
        });
    }

    // أيقونة الإضافة
    if (addButton) {
        addButton.addEventListener('click', (e) => {
            const user = authManager.currentUser;
            if (!user) {
                e.preventDefault();
                alert('يجب تسجيل الدخول أولاً');
                router.navigate('/login');
            }
        });
    }

    // أيقونة الدعم
    if (supportIcon) {
        supportIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const user = authManager.currentUser;
            if (user) {
                router.navigate('/messages');
            } else {
                alert('يجب تسجيل الدخول أولاً للوصول إلى الرسائل');
                router.navigate('/login');
            }
        });
    }

    // أيقونة المزيد
    if (moreIcon) {
        moreIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const user = authManager.currentUser;
            if (user) {
                alert('صفحة المزيد قيد التطوير');
            } else {
                router.navigate('/login');
            }
        });
    }
    
    console.log('تم تهيئة الفوتر المشترك');
        }
