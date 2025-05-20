import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import descriptions from "@/store/pageData/reviewBuddy/intro/pageDescription.json"
import ReviewBuddyIntroPageDescription from "@/features/ReviewBuddyIntroPageDescription";

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
      <ReviewBuddyIntroPageDescription
        pageTitle={descriptions.PageTitle}
        projectName={descriptions.Title}
        projectNameDescription={descriptions.NameDesc}
        descriptions={descriptions} />
    </SidebarProvider>
  )
}
