import {Badge} from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CardWithDataProps = {
  cardShortDescription?: string,
  cardTitle: string,
  rightBadges?: string[],
  cardDescription: string[]
  cardFooter?: string
}

export function CardWithData(
  {cardDescription, cardTitle, rightBadges, cardShortDescription, cardFooter}: CardWithDataProps
) {
  return (
    <Card className="@container/card">
      <CardHeader>
        {
          cardShortDescription && <CardDescription>{cardShortDescription}</CardDescription>
        }
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {cardTitle}
        </CardTitle>
        <CardAction>
          {
            rightBadges && rightBadges.map((item, key) =>
              <Badge key={key} variant="outline">
                {item}
              </Badge>
            )
          }
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex flex-col gap-2 font-medium">
          {cardDescription && cardDescription.map((item, key) =>
            <p key={key}>
              {item}
            </p>
          )}
        </div>
        <div className="text-muted-foreground">
          {cardFooter}
        </div>
      </CardFooter>
    </Card>
  )
}
