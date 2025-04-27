'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import ConventionTypes from "@/features/lint-buddy/customizing/commitConventionButtons/ConventionContainer";
import ConventionCustomizeBoard from "@/features/lint-buddy/customizing/board/ConventionCustomizeBoard";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";


export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
        <SidebarInset>
            <SiteHeader siteTitle={"Git Convention 커스터마이징"}/>
            <div className={"flex flex-row h-full w-full"}>
                <div className={"border-1 border-black h-full p-3"}>
                    <ConventionTypes />
                </div>

                <DndProvider backend={HTML5Backend}>
                    <div className={"border-1 border-black h-full w-full"}>
                        <ConventionCustomizeBoard/>
                    </div>
                </DndProvider>
            </div>
        </SidebarInset>

    </SidebarProvider>
  )
}
