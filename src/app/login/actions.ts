'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}


export const authenticate = async (email: string, password: string) => {
  try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error) {
          return true;  // Indicate success
      }

      throw error;  // Authentication failed
  } catch (error) {
      console.log(error);  // Log the error for debugging
      return false;  // Indicate failure
  }
};

// logout function
export const logout = async () =>{
  try {
      const supabase = await createClient();
      await supabase.auth.signOut();
      return true;
  } catch (error) {
      return false;  // Log the error for debugging
  }
}

export async function getUser(){
  const supabase = await createClient();
  return await supabase.auth.getUser();
}