'use client'

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, logout } from "./login/actions";

import { toast } from "sonner"
import { ModeToggle } from "./customcomponents/modetoggle";
import { createClient } from "@/supabase/client";
import { User } from "./types/userType";

export default function Home() {
  const [user, setUser] = useState<User|null>(null)


  async function handleLogout(){
    const loggedOut = await logout()
    if(loggedOut){
      router.push("/login") // Uncomment this line to redirect to the login page
      toast("Logged out successfully") // Uncomment this line to show a toast message on successful logout
    }else{
      toast("Failed to log out")
    }
  }
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function obtainUser() {
      try {
        // setIsLoading(true)
        const authResponse = await getUser()

        if (!authResponse.data.user) {
          router.replace("/login")
          return
        }

        const supabase = createClient()
        const { data: userData, error } = await supabase.from('users').select('*').eq('id', authResponse.data.user.id).single()

        if (error) {
          console.error('Error fetching user data:', error)
          toast("Error fetching user data")
          return
        }

        if (mounted && userData) {
          setUser(userData as unknown as User)
        }
      } catch (error) {
        console.error('Error in obtainUser:', error)
        if (mounted) {
          router.replace("/login")
        }
      } finally {
        if (mounted) {
          // setIsLoading(false)
        }
      }
    }

    obtainUser()

    return () => {
      mounted = false
    }
  }, [router])


  return (
    <div className='flex-col py-5'>
        <div className='flex justify-between items-center gap-5 border-b py-3'>
            <div className="flex justify-between gap-2 px-2">
              <h1>BSE 25-07</h1>
               <p>Welcome, {user?.name}</p>
            </div>
            <div className="flex justify-between gap-2 px-2">
                <ModeToggle/>
                <form action={handleLogout}>
                  <Button type="submit">Logout</Button>
                </form>
            </div>
        </div>
        <div>
          <h1>CHRIST FOREVER!</h1>
          <p>Welcome to the BSE 25-07 website!</p>
        </div>
    </div>
    
  );
}
