import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
} from "@/components/ui/sidebar"

import descriptions from "@/store/pageData/introduce/intro/pageDescription.json"
import commonData from "@/store/pageData/common/commonData.json"
import IntroPageDescription from "@/features/introPageDescription";

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
      <IntroPageDescription
        pageTitle={descriptions.PageTitle}
        projectName={commonData.ProjectName}
        projectNameDescription={descriptions.NameDesc}
        descriptions={descriptions} />
    </SidebarProvider>
  )
}
