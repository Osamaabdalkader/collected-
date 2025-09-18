// js/pages/home.js - منطق الصفحة الرئيسية
import { 
  auth, database, storage,
  onAuthStateChanged, signOut,
  ref, onValue, serverTimestamp, push, set, update, remove
} from '../firebase.js';

class HomePage {
  constructor() {
    this.init();
  }

  async init() {
    this.postsContainer = document.getElementById('posts-container');
    this.setupEventListeners();
    this.loadPosts();
  }

  setupEventListeners() {
    // البحث
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => this.filterPosts());
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          this.filterPosts();
        }
      });
    }
    
    // الفلاتر
    const typeFilter = document.querySelector('.filter-category select');
    const locationFilter = document.querySelector('.filter-location select');
    
    if (typeFilter) {
      typeFilter.addEventListener('change', () => {
        this.currentFilter.type = typeFilter.value;
        this.filterPosts();
      });
    }
    
    if (locationFilter) {
      locationFilter.addEventListener('change', () => {
        this.currentFilter.location = locationFilter.value;
        this.filterPosts();
      });
    }
  }

  loadPosts() {
    const postsRef = ref(database, 'posts');
    onValue(postsRef, (snapshot) => {
      this.postsContainer.innerHTML = '';
      this.currentPosts = [];
      
      if (snapshot.exists()) {
        const posts = snapshot.val();
        const postsArray = [];
        
        for (const postId in posts) {
          postsArray.push({ id: postId, ...posts[postId] });
        }
        
        // ترتيب المنشورات حسب التاريخ (الأحدث أولاً)
        postsArray.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        this.currentPosts = postsArray;
        
        // عرض المنشورات
        postsArray.forEach(post => {
          const postCard = this.createPostCard(post);
          this.postsContainer.appendChild(postCard);
        });
      } else {
        this.postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات بعد</p>';
      }
    });
  }

  createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.type = post.category || '';
    postCard.dataset.location = post.location || '';
    
    // تقييد الوصف إلى سطرين
    const shortDescription = post.description && post.description.length > 100 ? 
        post.description.substring(0, 100) + '...' : post.description;
    
    // حساب المدة المنقضية منذ النشر
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
      // حفظ المنشور في localStorage والانتقال إلى صفحة التفاصيل
      localStorage.setItem('currentPost', JSON.stringify(post));
      window.location.hash = '#post-detail';
    });
    
    return postCard;
  }

  filterPosts() {
    const searchInput = document.querySelector('.search-input');
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';
    const posts = document.querySelectorAll('.post-card');
    
    let visibleCount = 0;
    
    posts.forEach(post => {
      const title = post.querySelector('.post-title').textContent.toLowerCase();
      const description = post.querySelector('.post-description').textContent.toLowerCase();
      const type = post.dataset.type || '';
      const location = post.dataset.location || '';
      
      const matchesSearch = !searchText || 
                           title.includes(searchText) || 
                           description.includes(searchText);
      
      const matchesType = !this.currentFilter.type || type === this.currentFilter.type;
      const matchesLocation = !this.currentFilter.location || location === this.currentFilter.location;
      
      if (matchesSearch && matchesType && matchesLocation) {
        post.style.display = 'block';
        visibleCount++;
      } else {
        post.style.display = 'none';
      }
    });
    
    // إظهار رسالة إذا لم توجد نتائج
    const noResults = document.getElementById('no-results');
    if (visibleCount === 0 && posts.length > 0) {
      if (!noResults) {
        const noResultsMsg = document.createElement('p');
        noResultsMsg.id = 'no-results';
        noResultsMsg.className = 'no-posts';
        noResultsMsg.textContent = 'لا توجد نتائج تطابق بحثك';
        this.postsContainer.appendChild(noResultsMsg);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  formatTimeAgo(timestamp) {
    if (!timestamp) return 'غير معروف';
    
    const now = new Date();
    let postDate;
    
    // معالجة تنسيقات التاريخ المختلفة
    if (typeof timestamp === 'object' && timestamp.seconds) {
      // إذا كان timestamp من Firebase
      postDate = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === 'number') {
      // إذا كان timestamp رقمي
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
}

// تهيئة الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', () => {
  new HomePage();
});
