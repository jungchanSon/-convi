import pageNavData from "@/store/pageData/pageNavTitle.json"

const navigation = [
  {
    title: pageNavData.Introduce.Title,
    url: process.env.NEXT_PUBLIC_INTRODUCE_INTRO_URL,
    items: [
      {
        title: pageNavData.Introduce.Intro,
        url: process.env.NEXT_PUBLIC_INTRODUCE_INTRO_URL
      },
      {
        title: pageNavData.Introduce.Tools,
        url: process.env.NEXT_PUBLIC_INTRODUCE_TOOLS_URL
      }
    ]
  },
  {
    title: pageNavData.LintBuddy.Title,
    url: process.env.NEXT_PUBLIC_LINT_BUDDY_URL,
    items: [
      {
        title: pageNavData.LintBuddy.Intro,
        url: process.env.NEXT_PUBLIC_LINT_BUDDY_INTRO_URL
      },
      {
        title: pageNavData.LintBuddy.Manual,
        url: process.env.NEXT_PUBLIC_LINT_BUDDY_MANUAL_URL,
      },
      {
        title: pageNavData.LintBuddy.Customizing,
        url: process.env.NEXT_PUBLIC_LINT_BUDDY_CUSTOMIZING_URL
      }
    ]
  },
  {
    title: pageNavData.CommitBuddy.Title,
    url: process.env.NEXT_PUBLIC_COMMIT_BUDDY_URL,
    items: [
      {
        title: pageNavData.CommitBuddy.Intro,
        url: process.env.NEXT_PUBLIC_COMMIT_BUDDY_INTRO_URL
      },
      {
        title: pageNavData.CommitBuddy.VSCode,
        url: process.env.NEXT_PUBLIC_COMMIT_BUDDY_VSCODE_URL
      },
      {
        title: pageNavData.CommitBuddy.Intellij,
        url: process.env.NEXT_PUBLIC_COMMIT_BUDDY_INTELLIJ_URL
      }
    ]
  },
  {
    title: pageNavData.ReviewBuddy.Title,
    url: process.env.NEXT_PUBLIC_REVIEW_BUDDY_URL,
    items: [
      {
        title: pageNavData.ReviewBuddy.Intro,
        url: process.env.NEXT_PUBLIC_REVIEW_BUDDY_INTRO_URL
      },
      {
        title: pageNavData.ReviewBuddy.HowToUse,
        url: process.env.NEXT_PUBLIC_REVIEW_BUDDY_HOWTOUSE_URL
      }
    ]
  },
  {
    title: pageNavData.Community.Title,
    url: process.env.NEXT_PUBLIC_COMMUNITY_URL,
    items: [
      {
        title: "문의하기",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSdC_suRrDbCePtcQikHbR0BGE3oGEXPi4froUwNMwej_tyGVg/viewform?usp=dialog"
      },
      {
        title: pageNavData.Community.ContributionGuide,
        url: process.env.NEXT_PUBLIC_COMMUNITY_CONTRIBUTE_GUIDE_URL
      },
      {
        title: pageNavData.Community.Github,
        url: process.env.NEXT_PUBLIC_COMMUNITY_GITHUB_URL
      },
      {
        title: pageNavData.Community.Gitlab,
        url: process.env.NEXT_PUBLIC_COMMUNITY_GITLAB_URL
      },
      {
        title: pageNavData.Community.version,
        url: process.env.NEXT_PUBLIC_COMMUNITY_VERSION_URL
      }
    ]
  }
]

export default navigation