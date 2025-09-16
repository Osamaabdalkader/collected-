// login.js - منطق صفحة تسجيل الدخول
import { auth, signInWithEmailAndPassword } from '../firebase.js';
import { authManager } from '../auth.js';

class LoginPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // رابط الانتقال إلى صفحة التسجيل
        const registerLink = document.getElementById('register-link');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/register';
            });
        }
    }

    async handleLogin() {
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
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
            
        } catch (error) {
            let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صحيح';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'هذا المستخدم معطل';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'كلمة المرور غير صحيحة';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            authManager.showAlert(alert, 'error', errorMessage);
        }
    }
}

// تهيئة الصفحة عند تحميلها
export function init() {
    new LoginPage();
}

export default LoginPage;