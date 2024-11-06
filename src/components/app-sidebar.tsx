import * as React from "react"

import { SearchForm } from "@/components/search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation";
import Link from "next/link";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Elderly Care System",
      url: "#",
      items: [
        {
          title: "Heart rate and Oxygen",
          url: "/systeminfo/heartrateoxygen",
        },
        {
          title: "Realtime Location",
          url: "/systeminfo/googlemap",
        },
        // {
        //   title: "Motion",
        //   url: "#",
        // },
        {
          title: "Falling",
          url: "/systeminfo/falldetection",
        },
        {
          title: "Alerts",
          url: "/systeminfo/alerts",
        },
        // {
        //   title: "Medication",
        //   url: "#",
        // },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  // const path = useSearchParams().toString()
  const path = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <p>Elderly Care System</p>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            {/*<SidebarGroupLabel>{item.title}</SidebarGroupLabel>*/}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={path === item.url}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
