// js/components/header-common.js - معالجات الهيدر المشترك للصفحات الداخلية
import { authManager } from '../auth.js';

export function initHeaderCommon() {
    // إعداد مستمعي الأحداث للهيدر المشترك
    const notificationsIcon = document.getElementById('notifications-icon');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const homeIcon = document.querySelector('.home-icon');
    
    // أيقونة الإشعارات
    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', () => {
            alert('صفحة الإشعارات قيد التطوير');
        });
    }

    // أيقونة القائمة الجانبية
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            alert('القائمة الجانبية قيد التطوير');
        });
    }
    
    // أيقونة العودة للصفحة الرئيسية
    if (homeIcon) {
        homeIcon.addEventListener('click', (e) => {
            // السلوك الافتراضي يكفي للانتقال إلى index.html
        });
    }
    
    console.log('تم تهيئة الهيدر المشترك للصفحات الداخلية');
        }
