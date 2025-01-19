import { useLocation, useNavigate } from "react-router-dom";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { TopBar } from "@/components/TopBar";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto pt-20 px-4">
        <ResultsDisplay results={results} />
      </main>
    </div>
  );
};

export default Results;