import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Heart, Map, Activity, Bell, LineChart } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Elderly Care System",
      url: "#",
      items: [
        {
          title: "Heart rate and Oxygen",
          url: "/systeminfo/heartrateoxygen",
          icon: Heart,
        },
        {
          title: "Realtime Location",
          url: "/systeminfo/googlemap",
          icon: Map,
        },
        {
          title: "Motion Charts",
          url: "/systeminfo/motion",
          icon: LineChart,
        },
        {
          title: "Alerts",
          url: "/systeminfo/alerts",
          icon: Bell,
        },
      ],
    },
  ],
}


const dataSettings = {
  navMain: [
    {
      items: [
        {
          title: "Profile",
          url: "/systeminfo/myprofile",
          icon: Heart,
        },
        {
          title: "Realtime Location",
          url: "/systeminfo/googlemap",
          icon: Map,
        },
        {
          title: "Motion Charts",
          url: "/systeminfo/motion",
          icon: LineChart,
        },
        {
          title: "Alerts",
          url: "/systeminfo/alerts",
          icon: Bell,
        },
      ],
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const path = usePathname()

  return (
    <>
      <Sidebar {...props} className="bg-white w-64">
        <SidebarHeader className="py-4 px-4">
          <div className="flex justify-center items-center space-x-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <p className="text-blue-600 font-semibold text-2xl">
              ECCMS
            </p>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupContent>
                <SidebarHeader>
                  <div className="flex items-center space-x-2">
                    <p className="text-blue-600 font-semibold text-lg">
                      Analytics
                    </p>
                  </div>
                </SidebarHeader>

                <SidebarMenu>
                  {item.items.map((menuItem) => {
                    const Icon = menuItem.icon
                    return (
                      <SidebarMenuItem key={menuItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={path === menuItem.url}
                        >
                          <Link
                            href={menuItem.url}

                            className={`flex items-center px-4 py-2 space-x-3 hover:bg-gray-50 ${path === menuItem.url
                              ? "text-blue-600"
                              : "text-gray-600"
                              }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {menuItem.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
                <SidebarHeader>
                  <div className="flex items-center space-x-2">
                    <p className="text-blue-600 font-semibold text-lg">
                      Settings
                    </p>
                  </div>
                </SidebarHeader>
                <SidebarMenu>
                  {item.items.map((menuItem) => {
                    const Icon = menuItem.icon
                    return (
                      <SidebarMenuItem key={menuItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={path === menuItem.url}
                        >
                          <Link
                            href={menuItem.url}

                            className={`flex items-center px-4 py-2 space-x-3 hover:bg-gray-50 ${path === menuItem.url
                              ? "text-blue-600"
                              : "text-gray-600"
                              }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {menuItem.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* <SidebarRail /> */}
      </Sidebar>

    </>
  )
}































// import * as React from "react"

// import { SearchForm } from "@/components/search-form"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar"
// import { usePathname } from "next/navigation";
// import Link from "next/link";

// // This is sample data.
// const data = {
//   versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
//   navMain: [
//     {
//       title: "Elderly Care System",
//       url: "#",
//       items: [
//         {
//           title: "Heart rate and Oxygen",
//           url: "/systeminfo/heartrateoxygen",
//         },
//         {
//           title: "Realtime Location",
//           url: "/systeminfo/googlemap",
//         },
//         {
//           title: "Motion Charts",
//           url: "/systeminfo/motion",
//         },
//         // {
//         //   title: "Falling",
//         //   url: "/systeminfo/falldetection",
//         // },
//         {
//           title: "Alerts",
//           url: "/systeminfo/alerts",
//         },
//         // {
//         //   title: "Medication",
//         //   url: "#",
//         // },
//       ],
//     },
//   ],
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

//   // const path = useSearchParams().toString()
//   const path = usePathname()

//   return (
//     <Sidebar {...props}>
//       <SidebarHeader className="mt-4">
//         <p className="text-center text-xl text-blue-600 font-extrabold">Elderly Care System</p>
//       </SidebarHeader>
//       <SidebarContent>
//         {/* We create a SidebarGroup for each parent. */}
//         {data.navMain.map((item) => (
//           <SidebarGroup key={item.title}>
//             {/*<SidebarGroupLabel>{item.title}</SidebarGroupLabel>*/}
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {item.items.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild isActive={path === item.url}>
//                       <Link href={item.url}>{item.title}</Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         ))}
//       </SidebarContent>
//       <SidebarRail />
//     </Sidebar>
//   )
// }
