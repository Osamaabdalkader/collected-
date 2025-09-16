// auth.js - نظام المصادقة الموحد
import { auth, onAuthStateChanged, signOut } from './firebase.js';
import { checkAdminStatus, onValue, ref, database } from './firebase.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.isAdmin = false;
        this.adminListeners = [];
        this.authStateListeners = [];
    }

    async init() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                this.currentUser = user;
                
                if (user) {
                    console.log("تم تسجيل دخول المستخدم:", user.uid);
                    await this.loadUserData(user.uid);
                    await this.checkAndUpdateAdminStatus(user.uid);
                    this.setupAdminStatusListener(user.uid);
                } else {
                    console.log("لا يوجد مستخدم مسجل دخول");
                    this.isAdmin = false;
                    this.userData = null;
                }
                
                this.notifyAuthStateChange(!!user);
                this.updateAuthUI(!!user);
                resolve(user);
            });
        });
    }

    async loadUserData(userId) {
        try {
            const userRef = ref(database, 'users/' + userId);
            const unsubscribe = onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    this.userData = snapshot.val();
                    this.userData.uid = userId;
                    console.log("تم تحميل بيانات المستخدم:", this.userData);
                }
            });
            
            // تخزين دالة إلغاء الاشتراك للتنظيف لاحقاً
            this.adminListeners.push(unsubscribe);
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    async checkAndUpdateAdminStatus(userId) {
        try {
            console.log("جاري التحقق من صلاحية المشرف للمستخدم:", userId);
            this.isAdmin = await checkAdminStatus(userId);
            console.log("صلاحية المشرف:", this.isAdmin);
            return this.isAdmin;
        } catch (error) {
            console.error("Error checking admin status:", error);
            this.isAdmin = false;
            return false;
        }
    }

    setupAdminStatusListener(userId) {
        // التوقف عن أي مستمعين سابقين
        this.removeAdminListeners();
        
        // الاستماع لتغيرات حالة المشرف في الوقت الحقيقي
        const adminStatusRef = ref(database, 'users/' + userId + '/isAdmin');
        
        const unsubscribe = onValue(adminStatusRef, (snapshot) => {
            if (snapshot.exists()) {
                this.isAdmin = snapshot.val();
                console.log("تم تحديث حالة المشرف:", this.isAdmin);
                this.updateAuthUI(true);
                this.notifyAdminStatusChange(this.isAdmin);
            }
        });
        
        this.adminListeners.push(unsubscribe);
    }

    removeAdminListeners() {
        // إزالة جميع المستمعين السابقين
        this.adminListeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.adminListeners = [];
    }

    addAdminStatusListener(callback) {
        this.adminListeners.push(callback);
    }

    addAuthStateListener(callback) {
        this.authStateListeners.push(callback);
    }

    notifyAdminStatusChange(isAdmin) {
        this.adminListeners.forEach(callback => {
            if (typeof callback === 'function') {
                callback(isAdmin);
            }
        });
    }

    notifyAuthStateChange(isLoggedIn) {
        this.authStateListeners.forEach(callback => {
            if (typeof callback === 'function') {
                callback(isLoggedIn);
            }
        });
    }

    async handleLogout() {
        try {
            this.removeAdminListeners();
            await signOut(auth);
            this.currentUser = null;
            this.userData = null;
            this.isAdmin = false;
            this.notifyAuthStateChange(false);
            window.location.href = '/';
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    updateAuthUI(isLoggedIn) {
        const authElements = document.querySelectorAll('.auth-only');
        const unauthElements = document.querySelectorAll('.unauth-only');
        const adminElements = document.querySelectorAll('.admin-only');
        
        if (isLoggedIn) {
            authElements.forEach(el => el.style.display = 'block');
            unauthElements.forEach(el => el.style.display = 'none');
            
            if (this.isAdmin) {
                adminElements.forEach(el => {
                    el.style.display = 'block';
                    console.log("تم عرض عنصر المشرفين:", el);
                });
            } else {
                adminElements.forEach(el => {
                    el.style.display = 'none';
                    console.log("تم إخفاء عنصر المشرفين:", el);
                });
            }
        } else {
            authElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = 'none');
            unauthElements.forEach(el => el.style.display = 'block');
        }
    }

    showAlert(element, type, message) {
        if (!element) return;
        
        element.textContent = message;
        element.className = `alert alert-${type}`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }

    async checkAdminAccess() {
        try {
            if (!this.currentUser) {
                console.log("لا يوجد مستخدم حالي");
                return false;
            }
            
            console.log("التحقق من صلاحية المشرف للمستخدم:", this.currentUser.uid);
            
            // التحقق مباشرة من قاعدة البيانات
            const isAdmin = await checkAdminStatus(this.currentUser.uid);
            console.log("نتيجة التحقق من الصلاحية:", isAdmin);
            
            if (!isAdmin) {
                console.log("ليست لديك صلاحية الوصول إلى هذه الصفحة");
                return false;
            }
            
            console.log("تم التحقق من الصلاحية بنجاح");
            return true;
        } catch (error) {
            console.error("خطأ في التحقق من صلاحية المشرف:", error);
            return false;
        }
    }

    // دالة مساعدة للتحقق من المصادقة قبل الوصول للصفحات
    requireAuth(redirectTo = '/login') {
        if (!this.currentUser) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    }

    // دالة مساعدة للتحقق من صلاحية المشرف
    requireAdmin(redirectTo = '/') {
        if (!this.currentUser || !this.isAdmin) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    }
}

export const authManager = new AuthManager();