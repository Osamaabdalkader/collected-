import supabase from './supbase.js'

class AuthManager {
  constructor() {
    this.currentUser = null
    this.init()
  }

  async init() {
    const { data: { session } } = await supabase.auth.getSession()
    this.currentUser = session?.user ?? null

    supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser = session?.user ?? null
    })
  }

  async signUp(email, password, name, referralCode) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // حفظ بيانات المستخدم في جدول users
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email,
          name,
          referral_code: this.generateReferralCode(),
          points: 0,
          rank: 0,
          join_date: new Date(),
          referred_by: referralCode || null,
        },
      ])

    if (dbError) throw dbError

    return data
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  generateReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }
}

export const authManager = new AuthManager()
