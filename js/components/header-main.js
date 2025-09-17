// js/components/header-main.js - معالجات هيدر الرئيسية
import { authManager } from '../auth.js';
import { router } from '../router.js';

export function initHeader() {
    // إعداد مستمعي الأحداث للهيدر
    const notificationsIcon = document.getElementById('notifications-icon');
    const profileHeaderIcon = document.getElementById('profile-header-icon');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const filters = document.querySelectorAll('.filter-select');
    
    // أيقونة الإشعارات
    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', () => {
            alert('صفحة الإشعارات قيد التطوير');
        });
    }

    // أيقونة الملف الشخصي في الهيدر
    if (profileHeaderIcon) {
        profileHeaderIcon.addEventListener('click', () => {
            const user = authManager.currentUser;
            if (user) {
                router.navigate('/dashboard');
            } else {
                router.navigate('/login');
            }
        });
    }

    // أيقونة القائمة الجانبية
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            alert('القائمة الجانبية قيد التطوير');
        });
    }
    
    // إعداد البحث والفلاتر
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const event = new Event('filterPosts');
            window.dispatchEvent(event);
        });
        
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const event = new Event('filterPosts');
                window.dispatchEvent(event);
            }
        });
    }

    if (filters) {
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                const event = new Event('filterPosts');
                window.dispatchEvent(event);
            });
        });
    }
    
    console.log('تم تهيئة هيدر الصفحة الرئيسية');
                                           }
