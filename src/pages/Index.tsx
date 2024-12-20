import { MultiStepForm } from '@/components/MultiStepForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';

const Index = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Academic Outreach Assistant
          </h1>
          <p className="mt-3 text-xl text-blue-200 sm:mt-5">
            Connect with professors and researchers in your field of interest
          </p>
        </div>

        <MultiStepForm />
      </div>
    </div>
  );
};

export default Index;