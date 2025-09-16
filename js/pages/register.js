// register.js - منطق صفحة إنشاء حساب
import { auth, createUserWithEmailAndPassword } from '../firebase.js';
import { database, ref, set, get } from '../firebase.js';
import { authManager } from '../auth.js';

class RegisterPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // رابط الانتقال إلى صفحة تسجيل الدخول
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/login';
            });
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const address = document.getElementById('register-address').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const referralCode = document.getElementById('register-referral').value;
        const alert = document.getElementById('register-alert');
        
        // التحقق من صحة البيانات
        if (!name || !email || !password || !confirmPassword) {
            authManager.showAlert(alert, 'error', 'يرجى ملء جميع الحقول الإلزامية');
            return;
        }
        
        if (password !== confirmPassword) {
            authManager.showAlert(alert, 'error', 'كلمة المرور غير متطابقة');
            return;
        }
        
        if (password.length < 6) {
            authManager.showAlert(alert, 'error', 'كلمة المرور يجب أن تكون至少 6 أحرف');
            return;
        }
        
        try {
            authManager.showAlert(alert, 'info', 'جاري إنشاء الحساب...');
            
            // إنشاء المستخدم في Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // إنشاء كود إحالة فريد
            const referralCode = this.generateReferralCode();
            
            // حفظ بيانات المستخدم في Realtime Database
            const userData = {
                name: name,
                email: email,
                phone: phone || '',
                address: address || '',
                referralCode: referralCode,
                points: 0,
                rank: 0,
                joinDate: new Date().toISOString(),
                isAdmin: false
            };
            
            // إذا كان هناك كود إحالة، حفظه
            if (referralCode) {
                userData.referredBy = referralCode;
            }
            
            await set(ref(database, 'users/' + user.uid), userData);
            
            // حفظ كود الإحالة في جدول منفصل للبحث السريع
            await set(ref(database, 'referralCodes/' + referralCode), user.uid);
            
            authManager.showAlert(alert, 'success', 'تم إنشاء الحساب بنجاح');
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
            
        } catch (error) {
            let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'هذا البريد الإلكتروني مستخدم بالفعل';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صحيح';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'عملية التسجيل غير مسموحة حالياً';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'كلمة المرور ضعيفة جداً';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            authManager.showAlert(alert, 'error', errorMessage);
        }
    }

    generateReferralCode() {
        // إنشاء كود إحالة فريد مكون من 8 أحرف
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return code;
    }

    async validateReferralCode(code) {
        if (!code) return true;
        
        try {
            const snapshot = await get(ref(database, 'referralCodes/' + code));
            return snapshot.exists();
        } catch (error) {
            console.error("Error validating referral code:", error);
            return false;
        }
    }
}

// تهيئة الصفحة عند تحميلها
export function init() {
    new RegisterPage();
}

export default RegisterPage;