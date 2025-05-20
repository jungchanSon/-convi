'use client'

import * as React from "react"
import { ChevronRight } from "lucide-react"

// import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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

import navigation from "@/store/pageData/navigation";
import Link from "next/link";
import { gtag } from 'ga-gtag';

// This is sample data.
const data = {
  versions: ["1.0.0", ],
  navMain:  navigation
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const clickNav = (name: string) => {
    gtag('event', 'click', {
      'event_category': 'nav-button',
      'nav-button': name
    });
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        {/*<SearchForm />*/}
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground font-semibold text-sm px-3 py-2 tracking-wide 
                        bg-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <CollapsibleTrigger className="flex items-center w-full">
                {item.title}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          onClick={() => clickNav(item.title)}
                          className="text-sm hover:text-foreground pl-6 pr-3"
                        >
                          {item.url && <Link href={item.url}>{item.title}</Link>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
