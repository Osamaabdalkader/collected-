// home.js - منطق الصفحة الرئيسية
import { 
    auth, database, storage,
    onAuthStateChanged, signOut,
    ref, onValue, serverTimestamp, push, set, update, remove
} from '../../firebase.js';
import { HeaderMain } from '../components/header-main.js';
import { FooterCommon } from '../components/footer-common.js';
import { FiltersManager } from '../components/filters.js';

class HomePage {
    constructor() {
        this.currentUserData = null;
        this.adminUsers = [];
        this.currentPosts = [];
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.showPostsLoading();
        this.loadPosts();
        this.checkAuthState();
        this.setupEventListeners();
    }

    async loadComponents() {
        // تحميل الهيدر الرئيسي
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            const response = await fetch('../components/header-main.html');
            headerContainer.innerHTML = await response.text();
            new HeaderMain();
        }

        // تحميل الفوتر
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            const response = await fetch('../components/footer-common.html');
            footerContainer.innerHTML = await response.text();
            new FooterCommon();
        }

        // تحميل الفلاتر
        const filtersContainer = document.getElementById('filters-container');
        if (filtersContainer) {
            const response = await fetch('../components/filters.html');
            filtersContainer.innerHTML = await response.text();
            new FiltersManager();
        }
    }

    // باقي الدوال (loadPosts, createPostCard, checkAuthState, etc.)
    // ... سيتم نقلها من app.js الحالي مع التعديلات اللازمة

    loadPosts() {
        const postsRef = ref(database, 'posts');
        onValue(postsRef, (snapshot) => {
            const postsContainer = document.getElementById('posts-container');
            postsContainer.innerHTML = '';
            this.currentPosts = [];
            
            if (snapshot.exists()) {
                const posts = snapshot.val();
                const postsArray = [];
                
                for (const postId in posts) {
                    postsArray.push({ id: postId, ...posts[postId] });
                }
                
                postsArray.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                this.currentPosts = postsArray;
                
                postsArray.forEach(post => {
                    const postCard = this.createPostCard(post);
                    postsContainer.appendChild(postCard);
                });
            } else {
                postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات بعد</p>';
            }
            this.hidePostsLoading();
        }, { onlyOnce: true });
    }

    createPostCard(post) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.dataset.type = post.category || '';
        postCard.dataset.location = post.location || '';
        
        const shortDescription = post.description && post.description.length > 100 ? 
            post.description.substring(0, 100) + '...' : post.description;
        
        const timeAgo = this.formatTimeAgo(post.createdAt);
        
        postCard.innerHTML = `
            <div class="post-image">
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" loading="lazy">` : 
                `<div class="no-image"><i class="fas fa-image"></i></div>`}
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-description">${shortDescription || 'لا يوجد وصف'}</p>
                
                <div class="post-details">
                    ${post.location ? `
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="detail-location">${post.location}</span>
                        </div>
                    ` : ''}
                    
                    ${post.category ? `
                        <div class="detail-item">
                            <i class="fas fa-tag"></i>
                            <span class="detail-category">${post.category}</span>
                        </div>
                    ` : ''}
                    
                    ${post.price ? `
                        <div class="detail-item">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>${post.price}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="post-meta">
                    <div class="post-time">
                        <i class="fas fa-clock"></i>
                        <span>${timeAgo}</span>
                    </div>
                    <div class="post-author">
                        <i class="fas fa-user-circle"></i>
                        <span>${post.authorName || 'مستخدم'}</span>
                    </div>
                </div>
            </div>
        `;
        
        postCard.addEventListener('click', () => {
            localStorage.setItem('currentPost', JSON.stringify(post));
            window.location.href = 'post-detail.html';
        });
        
        return postCard;
    }

    checkAuthState() {
        onAuthStateChanged(auth, user => {
            if (user) {
                const userRef = ref(database, 'users/' + user.uid);
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        this.currentUserData = snapshot.val();
                        this.currentUserData.uid = user.uid;
                    }
                });
            }
        });
    }

    setupEventListeners() {
        // إعداد مستمعي الأحداث للأيقونات في الفوتر
        this.setupFooterEventListeners();
    }

    setupFooterEventListeners() {
        // أيقونة مجموعتك
        const groupsIcon = document.getElementById('groups-icon');
        if (groupsIcon) {
            groupsIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleIconClick('groups-icon');
            });
        }
        
        // باقي الأيقونات...
    }

    handleIconClick(iconId) {
        const user = auth.currentUser;
        if (user) {
            switch(iconId) {
                case 'groups-icon':
                    window.location.href = '../pages/dashboard.html';
                    break;
                case 'support-icon':
                    window.location.href = '../pages/messages.html';
                    break;
                default:
                    alert('هذه الميزة قيد التطوير حالياً');
            }
        } else {
            window.location.href = '../pages/login.html';
        }
    }

    formatTimeAgo(timestamp) {
        // دالة تنسيق الوقت المنقضي
        if (!timestamp) return 'غير معروف';
        
        const now = new Date();
        let postDate;
        
        if (typeof timestamp === 'object' && timestamp.seconds) {
            postDate = new Date(timestamp.seconds * 1000);
        } else if (typeof timestamp === 'number') {
            postDate = new Date(timestamp);
        } else {
            return 'غير معروف';
        }
        
        const diff = now - postDate;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        
        if (minutes < 1) return 'الآن';
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        if (hours < 24) return `منذ ${hours} ساعة`;
        if (days < 7) return `منذ ${days} يوم`;
        if (weeks < 4) return `منذ ${weeks} أسبوع`;
        if (months < 12) return `منذ ${months} شهر`;
        
        return postDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showPostsLoading() {
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            postsContainer.innerHTML = `
                <div class="posts-loading">
                    <div class="spinner"></div>
                    <p>جاري تحميل المنشورات...</p>
                </div>
            `;
        }
    }

    hidePostsLoading() {
        const loadingElement = document.querySelector('.posts-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
}

// تهيئة الصفحة عند تحميل DOM
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});