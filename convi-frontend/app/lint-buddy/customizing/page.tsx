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
import LintHistory from "@/features/lint-buddy/customizing/LintHistory";


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
                <div className={"flex flex-col max-w-1/4 justify-between border-r-1 border-t-1 border-gray-200 h-full p-3"}>
                    <ConventionTypes />
                    <LintHistory />
                </div>

                <DndProvider backend={HTML5Backend}>
                    <div className={"h-full w-full"}>
                        <ConventionCustomizeBoard/>
                    </div>
                </DndProvider>
            </div>
        </SidebarInset>

    </SidebarProvider>
  )
}
