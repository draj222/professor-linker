import { Login } from '@/components/Login';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">Join Professor Linker</h2>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;