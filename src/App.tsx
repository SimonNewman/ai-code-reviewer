import "./global.css";

import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Highlight, themes } from "prism-react-renderer";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CodeBlock from "./components/CodeBlock";
import Markdown from "react-markdown";
import SummaryCard from "@/components/SummaryCard";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import useCodeReview from "./hooks/useCodeReview";

function App() {
  const {
    allCategories,
    category,
    categoryCount,
    code,
    getHighlighted,
    getLineStartNumber,
    getLines,
    handleCategorySelect,
    handleClear,
    handleCodeSubmit,
    handleLearnMore,
    handleRestart,
    handleSelectCategoriesForReview,
    handleSelectCategoryAndLine,
    isComplete,
    isFetching,
    issues,
    line,
    selectedCategories,
    selectedCategoryIdsForReview,
    selectedIssues,
    setUserCode,
    userCode,
  } = useCodeReview();

  if (!isComplete) {
    return (
      <div className={cn("flex h-full items-center")}>
        <div className={cn("max-w-7xl mx-auto px-24 py-12")}>
          <div className={cn("mb-8 prose max-w-none")}>
            <h1
              className={cn(
                "inline-block bg-gradient-to-r from-pink via-purple to-blue text-transparent bg-clip-text mb-2"
              )}
            >
              AI Code Reviewer
            </h1>
            <h2 className={cn("text-lg font-medium mb-8 mt-0 opacity-80")}>
              Paste your code snippet below and hit 'Review My Code' to get
              instant, constructive feedback on your work.
            </h2>
            <form onSubmit={handleCodeSubmit}>
              <Textarea
                className={cn("bg-[#282a36] font-mono text-white")}
                disabled={isFetching}
                id="code"
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="Paste your code here."
                rows={20}
                value={userCode}
              />
              <div className={cn("flex gap-4 mt-6 not-prose")}>
                {allCategories.map((category, i) => (
                  <Card
                    className={cn(
                      `flex-1 flex flex-col border-${category.color}/50 bg-${
                        category.color
                      }/10 ${isFetching && "opacity-60"}`
                    )}
                    key={i}
                  >
                    <CardHeader className={cn("flex-grow")}>
                      <Checkbox
                        checked={selectedCategoryIdsForReview.includes(i)}
                        className={cn(
                          `mb-4 border-${category.color} data-[state=checked]:bg-${category.color}/80`
                        )}
                        disabled={isFetching}
                        onCheckedChange={(checked) =>
                          handleSelectCategoriesForReview(i, checked as boolean)
                        }
                      />
                      <CardTitle className={cn(`mb-2 text-${category.color}`)}>
                        {category.name}
                      </CardTitle>
                      <CardDescription
                        className={cn(`text-${category.color} opacity-70`)}
                      >
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <div className={cn("flex gap-4 items-center mt-6")}>
                <Button
                  type="submit"
                  className={cn("w-40")}
                  disabled={
                    isFetching ||
                    userCode.length === 0 ||
                    selectedCategories.length === 0
                  }
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Reviewing...
                    </>
                  ) : (
                    "Review My Code"
                  )}
                </Button>
                {selectedCategories.length === 0 && (
                  <span className={cn("text-sm font-medium")}>
                    Please select at least one category
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Explore Issues
  if (selectedIssues.length > 0 && category) {
    return (
      <div className={cn("max-w-[1540px] mx-auto px-24 py-12 ")}>
        <div className={cn("flex justify-between items-center")}>
          <Button variant="outline" onClick={() => handleClear()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Review
          </Button>
          <span className={cn("font-bold text-lg opacity-80")}>
            AI Code Reviewer
          </span>
        </div>
        <div className={cn("prose max-w-none")}>
          <h1 className={cn(`mt-8 text-${category.color}`)}>
            {category.name}
            {line && (
              <>
                :
                <span className={cn("opacity-40 font-normal")}>
                  {" "}
                  Line {line}
                </span>
              </>
            )}
          </h1>
          <p className={cn("text-lg opacity-70 -mt-6")}>
            {category.description}
          </p>
          {selectedIssues.map((issue, i) => (
            <div key={i}>
              <h2>
                {i + 1}. {issue.title}
              </h2>
              <Markdown>{issue.description}</Markdown>
              {issue.lines.length > 0 && (
                <div className={cn("rounded-lg overflow-hidden")}>
                  <div className={cn("overflow-x-auto")}>
                    <Highlight
                      code={getLines(code, issue)}
                      theme={themes.dracula}
                      language="tsx"
                    >
                      {({ style, tokens, getTokenProps }) => (
                        <div className={cn("flex")}>
                          <pre
                            style={style}
                            className={cn(
                              "p-6 my-0 flex flex-col overflow-x-visible flex-auto"
                            )}
                          >
                            {tokens.map((line, i) => (
                              <div
                                className={cn(
                                  ` h-6 relative ${getHighlighted(issue, i)}`
                                )}
                                key={i}
                              >
                                <div className={cn(`flex pr-6`)}>
                                  <div
                                    className={cn(
                                      "opacity-30 w-4 mr-4 text-right flex-none"
                                    )}
                                  >
                                    {i + 1 + getLineStartNumber(issue)}
                                  </div>
                                  {line.map((token, key) => (
                                    <span
                                      key={key}
                                      {...getTokenProps({ token })}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </pre>
                        </div>
                      )}
                    </Highlight>
                  </div>
                </div>
              )}
              {issue.extra.length === 0 ? (
                <p>
                  <Button
                    className={cn("w-32")}
                    disabled={!!issues.find((issue) => issue.loadingExtra)}
                    onClick={() => handleLearnMore(issue)}
                    variant="outline"
                  >
                    {issue.loadingExtra ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Loading...
                      </>
                    ) : (
                      "Learn More"
                    )}
                  </Button>
                </p>
              ) : (
                <Markdown>{issue.extra}</Markdown>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Review
  return (
    <div className={cn("max-w-[1540px] mx-auto px-24 py-12")}>
      <div className={cn("flex justify-between items-center")}>
        <Button variant="outline" onClick={() => handleRestart()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Edit Code
        </Button>
        <span className={cn("font-bold text-lg opacity-80")}>
          AI Code Reviewer
        </span>
      </div>
      <div className={cn("flex gap-4 my-8")}>
        {selectedCategories.map((category) => (
          <SummaryCard
            buttonClick={() => handleCategorySelect(category)}
            color={category.color}
            description={category.description}
            issues={categoryCount(category)}
            key={category.name}
            title={category.name}
          />
        ))}
      </div>
      <CodeBlock
        categories={selectedCategories}
        code={code}
        issues={issues}
        onIssueClick={(category: Category, line: number) =>
          handleSelectCategoryAndLine(category, line)
        }
        showIssueBadges
      />
    </div>
  );
}

export default App;
