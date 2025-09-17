// js/components/footer-common.js - معالجات الفوتر المشترك
import { authManager } from '../auth.js';

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
                window.location.href = 'pages/dashboard.html';
            } else {
                window.location.href = 'pages/login.html';
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
                window.location.href = 'pages/login.html';
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
                window.location.href = 'pages/login.html';
            }
        });
    }

    // أيقونة الدعم
    if (supportIcon) {
        supportIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const user = authManager.currentUser;
            if (user) {
                window.location.href = 'pages/messages.html';
            } else {
                alert('يجب تسجيل الدخول أولاً للوصول إلى الرسائل');
                window.location.href = 'pages/login.html';
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
                window.location.href = 'pages/login.html';
            }
        });
    }
    
    console.log('تم تهيئة الفوتر المشترك');
                                  }
