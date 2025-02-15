'use client'

import {AppSidebar} from "@/components/app-sidebar"
import {Separator} from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {ModeToggle} from "@/app/customcomponents/modetoggle";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {User} from "@/app/types/userType";
import {getUser, logout} from "@/app/login/actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {createClient} from "@/supabase/client";
import {Activity} from "lucide-react";

export default function AdminDashboardPage({ children }: { children: React.ReactNode}) {

    const [user, setUser] = useState<User | null>(null)

    // const [fallData, setFallData] = useState<Tables<'falldetection'>[] | null>(null)

    async function handleLogout() {
        const loggedOut = await logout()
        if (loggedOut) {
            router.push("/login") // Uncomment this line to redirect to the login page
            toast("Logged out successfully") // Uncomment this line to show a toast message on successful logout
        } else {
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
                const {
                    data: userData,
                    error
                } = await supabase.from('users').select('*').eq('id', authResponse.data.user.id).single()

                if (error) {
                    console.error('Error fetching user data:', error)
                    toast("Error fetching user data")
                    return
                }

                if (mounted && userData) {
                    setUser(userData as unknown as User)
                }

                // console.log()

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
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className={'flex flex-col'}>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>

                    <div className='flex justify-between items-center gap-5 border-b py-3 w-full'>
                        <div className="flex justify-center items-center space-x-2">
                            <Activity className="w-8 h-8 text-blue-600"/>
                            <p className="text-blue-600 font-semibold text-2xl">
                                ECCMS
                            </p>
                        </div>
                        <div className="flex justify-between gap-2 px-2">
                            <p>Hi, {user?.name}</p>
                        </div>
                        <div className="flex justify-between gap-2 px-2">
                            <ModeToggle/>
                            <form action={handleLogout}>
                                <Button type="submit">Logout</Button>
                            </form>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
