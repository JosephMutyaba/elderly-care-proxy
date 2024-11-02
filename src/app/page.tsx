'use client'

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, logout } from "./login/actions";

import { toast } from "sonner"

export default function Home() {
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

  useEffect(()=>{

    async function obtainUser(){
      const user = await getUser();

      if (user.data.user) {
        // If the user is already logged in, redirect to the dashboard
        router.push("/")
      } else {
        // If the user is not logged in, display the login form
        router.push("/login") // Uncomment this line to redirect to the login page
      }
    }

    obtainUser();

  },[router])


  return (
    <div>

      <form action={handleLogout}>
        <Button type="submit">Logout</Button>
      </form>

      <p>YOOOOOOOOOOOOOOOOOO!</p><br />
      <h1>CHRIST FOREVER!!!!!!!!!!!!!!!!</h1>
    </div>
  );
}
