'use server'

import type { NextApiRequest, NextApiResponse } from 'next';

import { createClient } from "@/supabase/server"

export default async function signup(email:string, password: string, name:string) {

    const supabase = await createClient()

  // Step 1: Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    throw authError
    // console.error(authError)
    // return false
   };

  // Step 2: Insert additional user details in the `users` table
  const { user } = authData;
  const { data: userData, error: userError } = await supabase.from('users').insert([{
        id: user?.id, // Use the auth user id as the primary key in `users` table
        email,
        password,
        name,
        role:"user",
      },

    ]);

//   if (userError) console.log(userError);
  if (userError) {
    console.error(userError)
    return false
   };

  return true;
}
