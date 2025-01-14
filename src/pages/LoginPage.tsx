import { Login } from '@/components/Login';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black font-sans">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20">
            <button 
              onClick={() => navigate('/')}
              className="text-white text-xl font-medium hover:text-blue-400 transition-colors"
            >
              Professor Linker
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto px-4">
          <h2 className="text-4xl font-semibold text-white mb-8 text-center">Join Professor Linker</h2>
          <Login />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;