import React, { useState } from "react";
import { useNotification } from "@components/context/NotificationContext";
import { CopyButton } from "@components/common/CopyButton";

interface UrlParametersProps {
  originalUrl: string;
}

interface UrlParameter {
  key: string;
  value: string;
}

const parseParameters = (originalUrl: string): UrlParameter[] => {
  try {
    const url = new URL(originalUrl);
    const existingParams: UrlParameter[] = [];

    url.searchParams.forEach((value, key) => {
      existingParams.push({ key, value });
    });

    return existingParams.length > 0 ? existingParams : [{ key: "", value: "" }];
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
    return [{ key: "", value: "" }];
  }
};

export const UrlParameters = ({ originalUrl }: UrlParametersProps) => {
  const [parameters, setParameters] = useState<UrlParameter[]>(() => parseParameters(originalUrl));
  const { showNotification } = useNotification();

  const addParameter = () => {
    setParameters([...parameters, { key: "", value: "" }]);
  };

  const updateParameter = (index: number, field: "key" | "value", value: string) => {
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    setParameters(newParameters);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const generateUrlWithParams = () => {
    const validParams = parameters.filter((p) => p.key && p.value);
    if (validParams.length === 0) return originalUrl;

    try {
      const url = new URL(originalUrl);
      // Clear existing parameters
      url.search = "";
      // Add new parameters
      validParams.forEach((param) => {
        url.searchParams.append(param.key, param.value);
      });
      return url.toString();
    } catch (error) {
      console.error("Error generating URL with parameters:", error);
      return originalUrl;
    }
  };

  const urlWithParams = generateUrlWithParams();

  return (
    <section className="band">
      <div className="frame py-8 sm:py-10">
        <h2 className="display text-5xl sm:text-6xl">Add parameters</h2>
        <p className="mt-3 max-w-2xl leading-6">
          Build a version of the original link with query parameters, like utm_source, before you
          share it.
        </p>
        <div className="mt-6 space-y-3">
          {parameters.map((param, index) => (
            <div key={index} className="flex flex-col gap-2 md:flex-row">
              <input
                type="text"
                value={param.key}
                onChange={(e) => updateParameter(index, "key", e.target.value)}
                placeholder="Name"
                aria-label={`Parameter ${index + 1} name`}
                className="field url flex-1"
              />
              <input
                type="text"
                value={param.value}
                onChange={(e) => updateParameter(index, "value", e.target.value)}
                placeholder="Value"
                aria-label={`Parameter ${index + 1} value`}
                className="field url flex-1"
              />
              <button type="button" onClick={() => removeParameter(index)} className="btn">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addParameter} className="btn">
            Add parameter
          </button>
        </div>

        <label htmlFor="url-with-params" className="field-label mt-8">
          Original link with parameters
        </label>
        <div className="flex flex-col sm:flex-row">
          <input
            id="url-with-params"
            type="text"
            value={urlWithParams}
            readOnly
            className="field url flex-1 bg-smoke"
          />
          <CopyButton
            value={urlWithParams}
            onCopied={() => showNotification("Link with parameters copied", "success")}
            className="btn btn-signal -mt-[3px] sm:-ml-[3px] sm:mt-0"
          >
            Copy
          </CopyButton>
        </div>
      </div>
    </section>
  );
};
