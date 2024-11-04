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
import {useEffect, useState} from "react";
import {User} from "@/app/types/userType";
import {getUser, logout} from "@/app/login/actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {createClient} from "@/supabase/client";
import {Chart1} from "@/app/charts/twomodelchart";
import {Chart2} from "@/app/charts/chart2";
import {getFallDetection} from "@/app/actions/actions";
import {Tables} from "@/supabase/database.types";

export default function AdminDashboardPage() {

    const [user, setUser] = useState<User | null>(null)

    const [fallData, setFallData] = useState<Tables<'falldetection'>[] | null>(null)

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

            const falls = await getFallDetection()
            setFallData(falls)
            //
            console.log("INITIALISING............")
            console.log("INITIALISING............")
            console.log("INITIALISING............")
            console.log(falls)

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
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    {/*<Breadcrumb>*/}
                    {/*  <BreadcrumbList>*/}
                    {/*    <BreadcrumbItem className="hidden md:block">*/}
                    {/*      <BreadcrumbLink href="#">*/}
                    {/*        Building Your Application*/}
                    {/*      </BreadcrumbLink>*/}
                    {/*    </BreadcrumbItem>*/}
                    {/*    <BreadcrumbSeparator className="hidden md:block" />*/}
                    {/*    <BreadcrumbItem>*/}
                    {/*      <BreadcrumbPage>Data Fetching</BreadcrumbPage>*/}
                    {/*    </BreadcrumbItem>*/}
                    {/*  </BreadcrumbList>*/}
                    {/*</Breadcrumb>*/}
                    <div className='flex justify-between items-center gap-5 border-b py-3 w-full'>
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
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="aspect-video rounded-xl bg-muted/50">
                            <Chart1/>
                        </div>
                        <div className="aspect-video rounded-xl bg-muted/50">
                            <Chart2/>
                        </div>
                        {/*<div className="aspect-video rounded-xl bg-muted/50"/>*/}
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
