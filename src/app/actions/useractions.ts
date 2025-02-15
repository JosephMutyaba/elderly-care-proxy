'use server'

import { Tables } from "@/supabase/database.types";
import { createClient } from "@/supabase/server";

// fetch the logged-n useraccount
export async function retrieveLoggedInUserAccount() : Promise<Tables<'users'> | null> {
    const supabase = await createClient();
    const loggedInUser = await supabase.auth.getUser()
    if(loggedInUser ){
        // fetchAssociated User Account
        const {data, error} = await supabase.from('users').select('*').eq('id', loggedInUser.data.user?.id).returns<Tables<'users'>>().single();
        if (error) {
            console.error("Error fetching user account:", error);
            return null;
        }
        return data;
    }
    return null;
}

export async function fetchPaginatedUsers(){

}