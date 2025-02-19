'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { createAdminClient } from '@/app/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // ここではリダイレクトではなく、エラー内容を返す
    // 必要に応じてエラーメッセージをカスタマイズしてください
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/private')
}



//TODO:すでに登録されている場合にエラーーを返すようにする
export async function signup(formData: FormData) {
  const userData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  const supabaseAdmin = await createAdminClient()
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
  console.log(error)
  const userExists = users.some(user => user.email === userData.email);

  if (userExists) {
    console.log(`メールアドレス ${userData.email} は既に登録されています。`);
    return { error: 'そのメールアドレスはすでに登録されています。' }

  } else {
    console.log(`メールアドレス ${userData.email} は未登録です。`);
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp(userData)
    if (error) {
      console.error("サインアップ中のエラー:", error.message)
      return { error: '内部エラーが発生しました。' }
    }
    revalidatePath('/', 'layout')
    redirect('/signup/success')

  }
}


