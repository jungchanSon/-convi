import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {CardWithData} from "@/features/card";

type SectionCardsFullLineProps = {
  gap?: string,
  cardDatas: {
    Title: string,
    Description: string[],
    Tags?: string[]
  }[],
}

export function SectionCardsFullLine({gap = "4", cardDatas} : SectionCardsFullLineProps) {
  return (
    <div className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-${gap} px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-1`}>
      {
        cardDatas.map( (item, key) =>
        <div key={ key}>
          <CardWithData cardTitle={item.Title} rightBadges={item.Tags} cardDescription={item.Description}></CardWithData>
        </div>
        )
      }
    </div>
  )
}
