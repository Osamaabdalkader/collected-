import supabase from '../supbase.js'

class HomeManager {
  constructor() {
    this.posts = []
    this.init()
  }

  async init() {
    await this.loadPosts()
    this.setupEventListeners()
  }

  async loadPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      this.posts = data
      this.renderPosts()
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }

  renderPosts() {
    const container = document.getElementById('posts-container')
    if (!container) return

    if (this.posts.length === 0) {
      container.innerHTML = '<p class="no-posts">لا توجد منشورات بعد</p>'
      return
    }

    container.innerHTML = this.posts.map(post => `
      <div class="post-card" data-id="${post.id}">
        <div class="post-image">
          ${post.image_url ? 
            `<img src="${post.image_url}" alt="${post.title}" loading="lazy">` : 
            `<div class="no-image"><i class="fas fa-image"></i></div>`
          }
        </div>
        <div class="post-content">
          <h3 class="post-title">${post.title}</h3>
          <p class="post-description">${post.description}</p>
          <div class="post-details">
            <div class="detail-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${post.location}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-tag"></i>
              <span>${post.category}</span>
            </div>
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
              <span>${this.formatTime(post.created_at)}</span>
            </div>
            <div class="post-author">
              <i class="fas fa-user-circle"></i>
              <span>${post.author_name}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('')

    // إضافة event listeners للبطاقات
    document.querySelectorAll('.post-card').forEach(card => {
      card.addEventListener('click', () => {
        const postId = card.dataset.id
        this.viewPostDetail(postId)
      })
    })
  }

  formatTime(timestamp) {
    const now = new Date()
    const postDate = new Date(timestamp)
    const diff = now - postDate

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'الآن'
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    if (hours < 24) return `منذ ${hours} ساعة`
    if (days < 7) return `منذ ${days} يوم`
    
    return postDate.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  viewPostDetail(postId) {
    const post = this.posts.find(p => p.id === postId)
    if (post) {
      localStorage.setItem('currentPost', JSON.stringify(post))
      window.location.href = '/post-detail'
    }
  }

  setupEventListeners() {
    // يمكن إضافة أي event listeners إضافية هنا
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HomeManager()
})
