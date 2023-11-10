import { useState } from "react";

const TEST_RESPONSE = false;

const useApi = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);

  const exampleResponse: ApiResponse = {
    id: "chatcmpl-8JHn2Lx4dlv7jWyN2cvKlLLFsObDs",
    object: "chat.completion",
    created: 1699607308,
    model: "gpt-4-1106-preview",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content:
            '{\n    "issues": [\n        {\n            "title": "Incorrect event handler naming",\n            "description": "In React, the event handler should be `onClick` instead of `onclick`. JavaScript is case-sensitive, and the React event handlers follow camelCase convention.",\n            "category": "Best Practices",\n            "lines": [5]\n        },\n        {\n            "title": "Default export name mismatch",\n            "description": "The default export is labeled `button`, which is not the same as the function name `Button`. Default export names should match the component name to maintain consistency and avoid confusion.",\n            "category": "Best Practices",\n            "lines": [11]\n        },\n        {\n            "title": "Missing \'propTypes\' definition",\n            "description": "It\'s a good practice to define `propTypes` for a React component to specify the types of the props it is expecting. This can help catch bugs by enforcing type checking.",\n            "category": "Best Practices",\n            "lines": [3]\n        },\n        {\n            "title": "Missing \'defaultProps\' definition",\n            "description": "Defining `defaultProps` ensures that your component has default values for props, which can prevent bugs if certain props aren\'t passed by the parent component.",\n            "category": "Best Practices",\n            "lines": [3]\n        },\n        {\n            "title": "Unused import",\n            "description": "The import statement for React is not necessary since we\'re using JSX syntax without directly referencing the `React` variable.",\n            "category": "Optimisation",\n            "lines": [1]\n        },\n        {\n            "title": "Anonymous function as a prop",\n            "description": "Passing anonymous functions (like `onClick`) as props can cause performance issues because the function is created anew on every render, leading to unnecessary re-renders of components that rely on those props for rendering.",\n            "category": "Optimisation",\n            "lines": [3]\n        },\n        {\n            "title": "Lack of key prop in list",\n            "description": "If `children` contains a list of elements, each element should have a unique `key` prop. This is a common pitfall when rendering lists of components in React and can cause inefficient updating of the component list.",\n            "category": "Best Practices",\n            "lines": [6]\n        }\n    ]\n}',
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 183,
      completion_tokens: 495,
      total_tokens: 678,
    },
    system_fingerprint: "fp_a24b4d720c",
  };

  const fetchData = async (
    messages: Message[],
    asJson: boolean
  ): Promise<ApiResponse> => {
    setIsFetching(true);
    if (TEST_RESPONSE) {
      setTimeout(() => {
        setData(exampleResponse);
        setIsFetching(false);
      }, 2000);
      return exampleResponse;
    }

    return fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        response_format: {
          type: asJson ? "json_object" : "text",
        },
        messages,
      }),
    })
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        setIsFetching(false);
        return response.json(); // Parse JSON data from the response
      })
      .then((data) => {
        // Use the JSON data here
        setData(data);
        setIsFetching(false);
        return data;
      })
      .catch((error) => {
        // Handle any errors here
        setIsFetching(false);
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const clearData = (): void => {
    setData(null);
  };

  return { clearData, data, fetchData, isFetching };
};

export default useApi;
