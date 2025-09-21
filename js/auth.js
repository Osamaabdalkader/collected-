// التحقق من حالة المصادقة
async function checkAuth() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Error checking auth:', error);
            return null;
        }
        
        return session ? session.user : null;
    } catch (error) {
        console.error('Auth check failed:', error);
        return null;
    }
}

// تسجيل الدخول
async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// تسجيل الخروج
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            throw error;
        }
        
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// التسجيل
async function register(email, password, metadata = {}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: metadata
            }
        });
        
        if (error) {
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}
