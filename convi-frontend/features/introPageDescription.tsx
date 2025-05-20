'use client'
import {SiteHeader} from "@/components/site-header";
import {SidebarInset} from "@/components/ui/sidebar";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {CopyBlock, monokai} from "react-code-blocks";
import RunnerTable from '@/features/RunnerTable'
import parse from 'html-react-parser';
import EnvVarTable from "@/features/EnvVarTable";
import GitlabCI from "@/features/GitlabCI";
import SettingTable from "@/features/SettingTable";
import ReviewModelTable from "@/features/ReviewModelTable";
import DockerImageTable from "@/features/DockerImageTable";
import RagFlagTable from "@/features/RagFlagTable";
import Custom1 from "@/features/Custom1";
import Custom2 from "@/features/Custom2";

type IntroPageDescription = {
  pageTitle: string,
  projectName: string,
  projectNameDescription: string,
  descriptions: {
    Desc: {
      Title: string,
      Description: string[]
      Image?: string
    }[]
  }
}

const IntroPageDescription = ({
  pageTitle,
  projectName,
  projectNameDescription,
  descriptions
} : IntroPageDescription) => {
  const installRunnerCmd = "# Download the binary for your system\nsudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64\n\n# Give it permission to execute\nsudo chmod +x /usr/local/bin/gitlab-runner\n\n# Create a GitLab Runner user\nsudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash\n\n# Install and run as a service\nsudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner\nsudo gitlab-runner start"
  const runnerCmd1 = "docker run -d --name gitlab-runner --restart always \
  -v /opt/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest "

  const runnerCmd2 = "docker exec -i gitlab-runner gitlab-runner register \
  --non-interactive \
  --url               \"https://lab.ssafy.com\" \
  --registration-token ${gitlab_runner_token} \
  --executor          \"docker\" \
  --docker-image      \"docker:latest\" \
  --description       \"ci-docker-runner\" \
  --tag-list          \"docker,ci\" \
  --run-untagged=true \
  --locked=false"
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
                <div className={"items-center mt-5"}>
                  <hr className={"mb-5"}/>
                  {descriptions.Desc.map((item, key) =>
                      <div key={key} className={"mt-10"}>
                        <h2 className="text-xl font-semibold mx-3 mb-2">
                          {parse(item.Title)}
                        </h2>
                        {item.Image &&
                            <Image className={"border-black border-2"} src={item.Image} alt={item.Title} height={200}
                                   width={600}/>}
                        {item.Description.map((item, key2) => {
                              if (item === "intellij plugin download") {
                                return <Button className={"mx-5"} key={key2}>
                                  <a href={"https://docs.google.com/uc?export=download&id=1hPe-lywjfgb3U4TgztaPFbacBUIekhJF&confirm=t"}>intellij
                                    플러그인 다운로드
                                  </a>
                                </Button>
                              } else if (item === "runner-cmd-1") {
                                return <CopyBlock theme={monokai} codeBlock={true} text={runnerCmd1} language={"sh"} key={key2}/>
                              } else if (item === "runner-cmd-2") {
                                return <CopyBlock theme={monokai}  codeBlock={true} text={runnerCmd2} language={"sh"} key={key2}/>
                              } else if (item === "ci") {
                                return <Button className={"mx-2 my-2"} key={key2}>
                                  <a href={"https://docs.google.com/uc?export=download&id=1jmVsdccAYA7o10lfPCCBBv3QJ9S9pH-O&confirm=t"}>
                                    ci 파일 다운로드
                                  </a>
                                </Button>
                              } else if (item === "ollama download") {
                                return  <Button className={"mx-2 my-2"} key={key2}>
                                  <a href={"https://ollama.com/download"}>
                                    ollama 다운로드
                                  </a>
                                </Button>
                              } else if (item === "runnerTable") {
                                return <div key={ key}>
                                  <RunnerTable />
                                </div>
                              } else if (item === "runnerTable2") {
                                return <div key={key}>
                                  <EnvVarTable/>
                                </div>
                              } else if (item === "gitlabcicode") {
                                return <div key={key}>
                                  <GitlabCI />
                                </div>
                              } else if (item === "SettingTable") {
                                return <div key={key}>
                                  <SettingTable />
                                </div>
                              } else if (item === "ReviewModelTable") {
                                return <div key={key}>
                                  <ReviewModelTable />
                                </div>
                              } else if (item === "DockerImageTable") {
                                return <div key = {key}>
                                  <DockerImageTable />
                                </div>
                              } else if(item === "RagFlagTable") {
                                return <div key = {key}>
                                  <RagFlagTable />
                                </div>
                              } else if(item === "Custom1") {
                                return <div key={key}>
                                  <Custom1 />
                                </div>
                              } else if (item === "Custom2") {
                                return <div key={key}>
                                  <Custom2 />
                                </div>
                              }
                              return <div key={key2} className={"mx-5"}>
                                <div className={"p-1"}> {parse(item)} </div>
                              </div>
                            }
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