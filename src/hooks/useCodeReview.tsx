import { useEffect, useMemo, useState } from "react";

import useApi from "@/hooks/useApi";

const CODE_BUFFER = 4;
const CATEGORIES: Category[] = [
  {
    color: "pink",
    description:
      "Ensures code follows best practice guidelines that are set for the specific language.",
    name: "Best Practices",
  },
  {
    color: "purple",
    description:
      "Identifies patterns that may lead to security vulnerabilities.",
    name: "Security",
  },
  {
    color: "blue",
    description:
      "Suggestions on how to refactor code for better performance and maintainability.",
    name: "Optimisation",
  },
];

const filterIssuesByCategory = (
  issues: Issue[],
  categoryName: CategoryName
) => {
  return issues.filter((issue) => issue.category === categoryName);
};

const filterIssuesByLineAndCategory = (
  issues: Issue[],
  line: number,
  categoryName: CategoryName
) => {
  return issues.filter(
    (issue) => issue.lines[0] === line && issue.category === categoryName
  );
};

const numberLines = (code: string) => {
  const lines = code.split("\n");
  const numberedLines = lines.map((line, index) => {
    return line + " //" + (index + 1);
  });
  return numberedLines.join("\n");
};

export default function useCodeReview() {
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedCategoryIdsForReview, setSelectedCategoryIdsForReview] =
    useState<number[]>(CATEGORIES.map((_, i) => i));
  const [code, setCode] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [line, setLine] = useState<number | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  //   const [userCode, setUserCode] = useState(`import React from 'react';

  // function Button({ onClick, children }) {
  //   return (
  //     <button onclick={onClick} className="btn btn-primary">
  //       {children}
  //     </button>
  //   );
  // }

  // export default button;`);
  const [userCode, setUserCode] = useState("");
  const { clearData, data, fetchData, isFetching } = useApi();
  const { fetchData: fetchExtraData } = useApi();

  // Effects and Data Fetching
  useEffect(() => {
    if (data === null || data === undefined) {
      return setIssues([]);
    }
    let issues: Issue[] = JSON.parse(data?.choices[0].message.content).issues;
    issues = issues.map((issue, i) => ({
      ...issue,
      extra: "",
      id: i,
      loadingExtra: false,
    }));
    setIssues(issues);
    setIsComplete(true);
  }, [data]);

  // Fetches data when code changes
  useEffect(() => {
    if (code.length === 0) return;

    const _messages: Message[] = [
      {
        role: "system",
        content: `Please review any JavaScript code. Look for issues related to ${selectedCategoriesString}. Provide the response in a JSON file, with an array of issues with title, description, category, and an array of line numbers where the issue exists in the code. The line number can be referenced from the comment at the end of each line. The properties of each issues should be title, description, category, lines. Use backticks in the description when referencing code. If asked for additional information, return the response as text.`,
      },
      {
        role: "user",
        content: numberLines(code),
      },
    ];

    const getData = async () => {
      const newData = await fetchData(_messages, true);
      _messages.push(newData.choices[0].message as Message);
      setMessages(_messages);
    };

    getData();
  }, [code]);

  // Sets selected issues
  useEffect(() => {
    if (!issues) return;
    if (category && line) {
      const filteredIssues = filterIssuesByLineAndCategory(
        issues,
        line,
        category.name
      );
      setSelectedIssues(filteredIssues);
      return;
    }
    if (category) {
      const issuesByCategory = filterIssuesByCategory(issues, category.name);
      setSelectedIssues(issuesByCategory);
      return;
    }
    setSelectedIssues([]);
  }, [category, issues, line]);

  // Event Handlers
  const handleSelectCategoriesForReview = (index: number, checked: boolean) => {
    setSelectedCategoryIdsForReview((prevCheckedItems) =>
      checked
        ? [...prevCheckedItems, index]
        : prevCheckedItems.filter((id) => id !== index)
    );
  };

  const handleSelectCategoryAndLine = (
    category: Category,
    line: number
  ): void => {
    setCategory(category);
    setLine(line);
  };

  const handleCategorySelect = (category: Category) => {
    setCategory(category);
  };

  const handleCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCode(userCode);
  };

  const handleClear = () => {
    setCategory(null);
    setLine(null);
  };

  const handleRestart = () => {
    handleClear();
    setCode("");
    setIsComplete(false);
    clearData();
  };

  const handleLearnMore = (issue: Issue) => {
    setIssues((issues) =>
      issues.map((_issue) => {
        if (_issue.id === issue.id) {
          return {
            ..._issue,
            loadingExtra: true,
          };
        }
        return _issue;
      })
    );

    const getData = async () => {
      const _messages: Message[] = [
        ...messages,
        {
          role: "user",
          content: `Provide more information on ${issue.title}`,
        },
      ];

      const newData = await fetchExtraData(_messages, false);
      const newMessage = newData.choices[newData.choices.length - 1].message;

      setIssues((issues) =>
        issues.map((_issue) => {
          if (_issue.id === issue.id) {
            return {
              ..._issue,
              extra: newMessage.content,
              loadingExtra: false,
            };
          }
          return _issue;
        })
      );
    };

    getData();
  };

  // Utility functions
  const categoryCount = (category: Category) => {
    return filterIssuesByCategory(issues, category.name).length;
  };

  const getLines = (code: string, issue: Issue): string => {
    const lines = code.split("\n");
    const start = Math.max(issue.lines[0] - 1 - CODE_BUFFER, 0);
    const end = Math.min(
      lines.length,
      issue.lines[issue.lines.length - 1] + CODE_BUFFER
    );
    return lines.slice(start, end).join("\n");
  };

  const getLineStartNumber = (issue: Issue): number => {
    return Math.max(issue.lines[0] - 1 - CODE_BUFFER, 0);
  };

  const getHighlighted = (issue: Issue, lineNumber: number) => {
    const startLineNumber = getLineStartNumber(issue) + 1;
    lineNumber += startLineNumber;
    if (issue.lines.includes(lineNumber)) {
      return "before:content-['] before:bg-white/10 before:absolute before:-left-6 before:-right-6 before:top-0 before:h-6 before:pointer-events-none";
    }
    return "";
  };

  const selectedCategories = useMemo<Category[]>(() => {
    return CATEGORIES.filter((category, i) => {
      if (selectedCategoryIdsForReview.includes(i)) return category;
    });
  }, [selectedCategoryIdsForReview]);

  const selectedCategoriesString = useMemo<string>(() => {
    if (!selectedCategories.length) return "";
    if (selectedCategories.length === 1) return selectedCategories[0].name;
    return `${selectedCategories
      .map((category) => category.name)
      .slice(0, -1)
      .join(", ")} and ${
      selectedCategories[selectedCategories.length - 1].name
    }`;
  }, [selectedCategories]);

  return {
    allCategories: CATEGORIES,
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
  };
}
