import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const SummaryCard = ({
  buttonClick,
  color,
  description,
  issues,
  title,
}: {
  buttonClick(): void;
  color: string;
  description: string;
  issues: number;
  title: string;
}) => (
  <Card
    className={cn(
      `flex-1 flex flex-col border-${color}/50 bg-${color}/10 max-w-[50%]`
    )}
  >
    <CardHeader className={cn("flex-grow")}>
      <CardTitle className={cn(`mb-2 text-${color}`)}>{title}</CardTitle>
      <CardDescription className={cn(`text-${color} opacity-80`)}>
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent className={cn("flex items-center justify-between")}>
      <div className="text-xl font-medium">
        {issues} Issue{(issues === 0 || issues > 1) && "s"}
      </div>
      {issues > 0 && (
        <Button
          className={cn(`border-${color}/90`)}
          onClick={buttonClick}
          size="sm"
        >
          Explore
        </Button>
      )}
    </CardContent>
  </Card>
);

export default SummaryCard;
