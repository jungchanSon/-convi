'use client'
import {SiteHeader} from "@/components/site-header";
import {SidebarInset} from "@/components/ui/sidebar";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import descriptions from "@/store/pageData/reviewBuddy/intro/pageDescription.json"

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

const ReviewBuddyIntroPageDescription = ({
  pageTitle,
  projectName,
  projectNameDescription,
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
                <div className={"items-center mt-5"}>
                  <hr className={"mb-5"}/>
                  <h2 className="text-xl font-semibold mx-3 mb-2">
                    🚀 Review Buddy?
                  </h2>
                  <hr className={'mt-5 mb-6'}/>
                  <div className={'ml-10'}>
                    <ul className={"list-disc"}>
                      <li>
                        <p className={"p-1"}> Review Buddy는 Gitlab MergerRequest 요청 시 Gitlab Request API, AI(Ollama,
                          GPT) 기반으로 자동 코드 리뷰를 작성하는 서비스입니다.
                        </p>
                        <div>
                          <p className={"p-1"}> ◦ 해당 서비스를 적용하기 위해 Gitlab Runner 사전 작업이 필요하며, .gitlab-ci.yml를 프로젝트 루트에
                            위치시켜야 합니다.</p>
                        </div>
                      </li>
                      <li>
                        <p className={"p-1"}>
                          Gitlab Runner를 로컬 혹은 운영환경에서 동작시키고, 이후 .gitlab-ci.yml이 존재하는 Branch에서 MR 요청 시 Gitlab Pipeline을
                          통해 Docker Image를 실행시키며, 해당 Docker Image는 RAG 기반 AI 코드 리뷰를 제공합니다.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <h2 className="text-xl font-semibold mx-3 mb-2 mt-5">
                    🎛 Review Buddy 구성 요소
                  </h2>
                  <hr className={'mt-5 mb-6'}/>
                  <div className={'ml-5'}>
                    <details className={'mb-2'}>
                      <summary className={'text-xl'}>1. Gitlab Runner</summary>
                      <ul className={"list-disc ml-13 mt-3"}>
                        <li>Gitlab Runner는 Gitlab Pipeline에서 동작이 필요한 작업을 자동으로 실행하고, 해당 정보를 Gitlab으로 보내주는 역할을 합니다.
                          <ul className={"list-disc ml-10"}>
                            <li>
                              Gitlab Runner가 로컬 환경에서 실행되는 경우, 현재 로컬 환경이 실행되고 있지 않고 팀원이 MR 요청을 한다면 Gitlab Runner가 실행되는
                              로컬
                              환경이 제공되지 않아 실행되지 않아 운영 환경에서 실행하는 것을 권장합니다.
                            </li>
                          </ul>
                        </li>
                        <li>자동으로 AI 코드 리뷰를 하기 위해서는 작업을 진행할 Gitlab Runner가 로컬 환경 혹은 운영 환경에서 실행 중이어야 합니다.</li>
                        <li>지속적인 코드 리뷰를 원한다면 특정 환경에서 Gitlab Runner를 지속적으로 실행되어야 합니다.</li>
                      </ul>
                    </details>
                    <details className={'mb-2'}>
                      <summary className={'text-xl'}>2. .gitlab-ci.yml</summary>
                      <ul className={"list-disc ml-13 mt-3"}>
                        <li>해당 파일은 파이프라인 설계도로서 GitLab CI/CD가 '어떤 작업(Job)을 언제, 어떤 Runner에서 실행할지'를 정의합니다.</li>
                        <li>Gitlab CI 발생 시 자동으로 참조하며, Gitlab CI/CD Variables 환경 변수 정보를 주입할 수 있습니다.</li>
                        <li>
                          Gitlab에서 자동으로 '.gitlab-ci.yml'를 파싱하여 사전에 Gitlab CI/CD Variables에 등록한 GITLAB_TOKEN,
                          OPEN_AI_KEY, REVIEW_BUDDY 환경 변수 정보들을 받아와 Public Docker Image를 실행시켜 코드 리뷰 정보를 응답받습니다.
                        </li>
                        <li>약간의 설정 수정을 통해 LLM 모델을 Ollama 혹은 GPT를 사용하도록 선택하거나, RAG 사용 여부를 선택할 수 있습니다.</li>
                      </ul>
                    </details>
                    <details className={'mb-2'}>
                      <summary className={'text-xl'}>3. Review Buddy Docker Image</summary>
                      <ul className={"list-disc ml-13 mt-3"}>
                        <li>LangChain 환경의 RAG 기반으로 코드 리뷰 환경을 쉽게 구축하고, 실행하기 위해 Review Buddy는 Public Docker Image를 사용하여 AI
                          코드 리뷰를 진행합니다.
                        </li>
                        <li>
                          제공되는 Docker Image는 Gpt-4o Image, Ollama 3.2 + Gpt-4o Image를 선택할 수 있습니다.
                          <ul className={"list-disc ml-10"}>
                            <li>
                              os2864/review-buddy:v0.1.3 : 중량급 LLM인 Ollama 3.2 + Gpt-4o 코드 리뷰 이미지 (3.76GB)
                            </li>
                            <li>
                              os2864/review-buddy-gpt:v0.1.1 : Gpt-4o 경량 코드 리뷰 이미지 (226MB)
                            </li>
                          </ul>
                        </li>
                        <div>
                        </div>
                        <li>
                          이미지 실행 시 각각 6 ~ 8GB, 300 ~ 500MB 으로 사용 시, Runner 실행 환경에서 처음 Pull시 해당 용량 만큼의 공간을 확보해야합니다.
                        </li>
                        <li>RAG는 chromadb 라이브러리를 사용하며, 저장된 임베딩 파일 중 코사인 유사도 상위 5개의 파일을 참조합니다.</li>
                      </ul>
                    </details>
                  </div>
                  <h2 className="text-xl font-semibold mx-3 mb-2 mt-5">
                    🧩 동작 순서
                  </h2>
                  <hr className={'mt-5 mb-6'}/>
                  <div className={'ml-10'}>
                    <ul className={"list-decimal"}>
                      <li>
                        <p className={"p-1"}>
                          Gitlab Runner를 로컬 환경 혹은 운영 환경에서 실행시킵니다.
                        </p>
                      </li>
                      <li>
                        <p className={"p-1"}>
                          프로젝트 루트에 'gitlab-ci.yml'를 추가합니다.
                        </p>
                      </li>
                      <li>
                        <p className={"p-1"}>
                          Gitlab에서 CI 발생시 자동으로 '.gitlab-ci.yml'을 파싱하여 Pipeline 객체를 생성하며, 해당 객체 생성시 GitLab이 자동으로 객체 안에
                          Job N개를 ‘pending’ 상태로 'Pending-Job 대기열'에 집어넣습니다.
                        </p>
                      </li>
                      <li>
                        <p className={"p-1"}>
                          Gitlab Runner가 지속적인 Polling을 통해 Gitlab 대기열의 작업이 있다고 판단하면, 작업을 가져오고 상태를 'Running' 상태로 변경합니다.
                        </p>
                      </li>
                      <li>
                        <p className={"p-1"}>
                          '.gitlab-ci.yml' 설정에 맞게 Review Buddy Docker Image를 실행시키며 완료 시 응답을 반환합니다.
                        </p>
                      </li>
                      <li>
                        <p className={"p-1"}>
                          Gitlab Pipeline 성공시, 해당 MR에 리뷰가 성공적으로 작성됩니다.
                        </p>
                      </li>
                    </ul>
                  </div>

                  {descriptions.Desc.map((item, key) =>
                      <div key={key} className={"mt-10"}>
                        <h2 className="text-xl font-semibold mx-3 mb-2">
                          {item.Title}
                        </h2>
                        <hr className={'my-3'}/>
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
                              } else if (item === "ci") {
                                return <Button className={"mx-2 my-2"} key={key2}>
                                  <a href={"https://docs.google.com/uc?export=download&id=1jmVsdccAYA7o10lfPCCBBv3QJ9S9pH-O&confirm=t"}>
                                    ci 파일 다운로드
                                  </a>
                                </Button>
                              } else if (item === "ollama download") {
                                return <Button className={"mx-2 my-2"} key={key2}>
                                  <a href={"https://ollama.com/download"}>
                                    ollama 다운로드
                                  </a>
                                </Button>
                              }
                              return <div key={key2} className={"mx-5"}>
                                <p className={"p-1"}> {item} </p>
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

export default ReviewBuddyIntroPageDescription