import { useEffect, useState } from "react";
import { ResultsDisplay } from "@/components/ResultsDisplay";

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const storedResults = localStorage.getItem("generatedProfessors");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black p-4">
      <div className="max-w-7xl mx-auto pt-12">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Generated Emails
        </h1>
        <ResultsDisplay results={results} />
      </div>
    </div>
  );
};

export default Results;