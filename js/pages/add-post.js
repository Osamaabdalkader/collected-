import supabase from '../supbase.js'
import { authManager } from '../auth.js'

class AddPostManager {
  constructor() {
    this.selectedFile = null
    this.init()
  }

  init() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    const form = document.getElementById('add-post-form')
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e))
    }

    document.getElementById('choose-image-btn').addEventListener('click', () => {
      document.getElementById('post-image').click()
    })

    document.getElementById('camera-btn').addEventListener('click', () => {
      document.getElementById('post-image').setAttribute('capture', 'environment')
      document.getElementById('post-image').click()
    })

    document.getElementById('post-image').addEventListener('change', (e) => {
      this.handleImageSelect(e)
    })

    document.getElementById('remove-image-btn').addEventListener('click', () => {
      this.removeSelectedImage()
    })
  }

  handleImageSelect(event) {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file
      document.getElementById('image-name').textContent = file.name

      const reader = new FileReader()
      reader.onload = (e) => {
        document.getElementById('preview-img').src = e.target.result
        document.getElementById('image-preview').classList.remove('hidden')
      }
      reader.readAsDataURL(file)
    }
  }

  removeSelectedImage() {
    this.selectedFile = null
    document.getElementById('post-image').value = ''
    document.getElementById('image-name').textContent = 'لم يتم اختيار صورة'
    document.getElementById('image-preview').classList.add('hidden')
  }

  async handleSubmit(event) {
    event.preventDefault()

    if (!authManager.currentUser) {
      alert('يجب تسجيل الدخول أولاً')
      window.location.href = '/login'
      return
    }

    const title = document.getElementById('post-title').value
    const description = document.getElementById('post-description').value
    const category = document.getElementById('post-category').value
    const price = document.getElementById('post-price').value
    const location = document.getElementById('post-location').value
    const phone = document.getElementById('post-phone').value

    if (!title || !description || !category || !location || !phone) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      let imageUrl = null
      if (this.selectedFile) {
        imageUrl = await this.uploadImage(this.selectedFile)
      }

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            description,
            category,
            price,
            location,
            phone,
            author_id: authManager.currentUser.id,
            author_name: authManager.currentUser.user_metadata.name || 'مستخدم',
            author_phone: phone,
            image_url: imageUrl,
            created_at: new Date()
          }
        ])

      if (error) throw error

      alert('تم نشر المنشور بنجاح!')
      window.location.href = '/'
    } catch (error) {
      console.error('Error adding post:', error)
      alert('حدث خطأ أثناء نشر المنشور: ' + error.message)
    }
  }

  async uploadImage(file) {
    const fileName = `${Date.now()}_${file.name}`
    const { data, error } = await supabase
      .storage
      .from('post-images')
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase
      .storage
      .from('post-images')
      .getPublicUrl(fileName)

    return publicUrl
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AddPostManager()
})
