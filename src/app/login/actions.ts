'use server'

import { createClient } from '@/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'


// export async function login(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signInWithPassword(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }

// export async function signup(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }


export const authenticate =async (email:string, password:string):Promise<boolean> => {
    // TODO: Implement authentication logic
    // Return true if authentication is successful, otherwise return false
    console.log(email, password)

    try {
        const supabase = createClient()

        const {error} = await (await supabase).auth.signInWithPassword({email, password})

        if (error) {
            throw error
        }
        console.log('Authentication successful')
        return true
    } catch (error) {
        console.log(error)
        return false
    }

}