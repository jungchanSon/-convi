import {SiteHeader} from "@/components/site-header";
import {SidebarInset} from "@/components/ui/sidebar";

type IntroPageDescription = {
  pageTitle: string,
  projectName: string,
  projectNameDescription: string,
  descriptions: {
    Desc: {
      Title: string,
      Description: string[]
    }[]
  }
}

const IntroPageDescription = ({
  pageTitle,
  projectName,
  projectNameDescription,
  descriptions
} : IntroPageDescription) => {
  return (
      <SidebarInset>
        <SiteHeader siteTitle={pageTitle}/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className={"flex flex-row items-center mb-4"}>
                  <h2 className="text-2xl font-semibold mr-2">
                    {projectName}
                  </h2>
                  <h3 className={"font-semibold"}>
                    – {projectNameDescription}
                  </h3>
                </div>

                <div className={"items-center mt-5" }>
                  {descriptions.Desc.map( (item, key) =>
                    <div key={key}>
                      <h2 className="text-xl font-semibold mx-3 mb-2">
                        {item.Title}
                      </h2>
                      {item.Description.map((item, key2) =>
                        <div key={key2} className={"mx-5"}>
                          <p className={"p-1"}> {item} </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
  )
}

export default IntroPageDescription