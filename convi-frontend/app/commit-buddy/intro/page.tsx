import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import IntroPageDescription from "@/features/introPageDescription";
import descriptions from "@/store/pageData/commitBuddy/intro/pageDescription.json";

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
        projectName={descriptions.Title}
        projectNameDescription={descriptions.NameDesc}
        descriptions={descriptions} />
    </SidebarProvider>
  )
}
