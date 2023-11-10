import { Badge, BadgeVariant } from "@/components/ui/badge";
import { Highlight, themes } from "prism-react-renderer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

const getIssuesByLineNumber = (issues: Issue[], lineNumber: number) => {
  return issues
    .filter((issue) => issue.lines?.[0] === lineNumber)
    .sort((a, b) => a.category.localeCompare(b.category));
};

const IssuesCount = ({
  categories,
  issues,
  line,
  onIssueClick,
}: {
  categories: Category[];
  issues: Issue[];
  line: number;
  onIssueClick: (category: Category, line: number) => void;
}) => {
  const lineIssues = getIssuesByLineNumber(issues, line);
  const colors = ["pink", "purple", "blue"];
  return (
    <div className={cn("flex gap-[2px]")}>
      {categories.map((category, i) => {
        const count = lineIssues.filter(
          (issue) => issue.category === category.name
        ).length;
        if (count === 0) return null;
        return (
          <TooltipProvider key={category.name}>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  className={cn("cursor-pointer")}
                  onClick={() => onIssueClick(category, line)}
                  variant={colors[i] as BadgeVariant}
                >
                  {count}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{category.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

const CodeBlock = ({
  categories,
  code,
  issues,
  onIssueClick,
  showIssueBadges,
}: {
  categories: Category[];
  code: string;
  issues: Issue[];
  onIssueClick: (category: Category, line: number) => void;
  showIssueBadges: boolean;
}) => (
  <Highlight code={code} theme={themes.dracula} language="tsx">
    {({ style, tokens, getTokenProps }) => (
      <div className={cn("flex relative")}>
        <pre
          style={style}
          className={cn("p-6 overflow-x-auto rounded-lg w-full")}
        >
          {tokens.map((line, i) => (
            <div className={cn("flex h-6")} key={i}>
              <div className={cn("flex pr-6")}>
                <div className={cn("opacity-30 w-4 mr-4 text-right flex-none")}>
                  {i + 1}
                </div>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            </div>
          ))}
        </pre>

        {showIssueBadges && (
          <div className={cn("absolute -right-20 w-20 py-6 pl-2")}>
            {tokens.map((line, i) => (
              <div className={cn("h-6")} key={i}>
                <div className={cn("flex")}>
                  <IssuesCount
                    categories={categories}
                    line={i + 1}
                    issues={issues}
                    onIssueClick={onIssueClick}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </Highlight>
);

export default CodeBlock;
