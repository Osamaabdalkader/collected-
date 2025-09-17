// js/pages/login.js (محدث)
import { auth, signInWithEmailAndPassword } from '../firebase.js';
import { authManager } from '../auth.js';
import { router } from '../router.js';

export async function initLoginPage() {
    // تحميل وتضمين محتوى صفحة تسجيل الدخول
    const response = await fetch('pages/login.html');
    const html = await response.text();
    document.getElementById('main-content').innerHTML = html;
    
    // تهيئة معالجات الأحداث
    setupEventListeners();
}

function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    // إعداد إظهار/إخفاء كلمة المرور
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const alert = document.getElementById('login-alert');
    
    if (!email || !password) {
        authManager.showAlert(alert, 'error', 'يرجى ملء جميع الحقول');
        return;
    }
    
    try {
        authManager.showAlert(alert, 'info', 'جاري تسجيل الدخول...');
        await signInWithEmailAndPassword(auth, email, password);
        authManager.showAlert(alert, 'success', 'تم تسجيل الدخول بنجاح');
        
        // التوجيه إلى لوحة التحكم بعد تسجيل الدخول
        setTimeout(() => {
            router.navigate('/dashboard');
        }, 1000);
        
    } catch (error) {
        authManager.showAlert(alert, 'error', error.message);
    }
        }
