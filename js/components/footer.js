// معالجات الفلاتر
class FiltersManager {
    constructor() {
        this.currentFilter = {
            type: '',
            location: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
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

    filterPosts() {
        const searchInput = document.querySelector('.search-input');
        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const posts = document.querySelectorAll('.post-card');
        
        let visibleCount = 0;
        
        posts.forEach(post => {
            const title = post.querySelector('.post-title')?.textContent.toLowerCase() || '';
            const description = post.querySelector('.post-description')?.textContent.toLowerCase() || '';
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
        
        this.showNoResultsMessage(visibleCount, posts.length);
    }

    showNoResultsMessage(visibleCount, totalPosts) {
        const postsContainer = document.getElementById('posts-container');
        let noResults = document.getElementById('no-results');
        
        if (visibleCount === 0 && totalPosts > 0) {
            if (!noResults) {
                noResults = document.createElement('p');
                noResults.id = 'no-results';
                noResults.className = 'no-posts';
                noResults.textContent = 'لا توجد نتائج تطابق بحثك';
                postsContainer.appendChild(noResults);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }
}

// تصدير الكلاس للاستخدام في الملفات الأخرى
export { FiltersManager };