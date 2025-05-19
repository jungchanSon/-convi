import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import LoginComponent from "@/features/socialLogin/LoginComponent";

type SiteHeaderPropsType = {
  siteTitle: string
}

export function SiteHeader({siteTitle} : SiteHeaderPropsType) {
  return (
    <header className="flex justify-between h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1"/>
            <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
            />

            <h1 className="text-base font-medium">{siteTitle}</h1>
        </div>
        <div>
            <LoginComponent />
        </div>
    </header>
  )
}
