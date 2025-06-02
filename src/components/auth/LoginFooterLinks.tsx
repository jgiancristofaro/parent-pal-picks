
import { Link } from "react-router-dom";

const LoginFooterLinks = () => {
  return (
    <>
      <div className="mt-6 text-center">
        <Link 
          to="/forgot-password" 
          className="text-purple-500 hover:text-purple-600 underline"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link 
            to="/login" 
            className="text-purple-500 font-semibold hover:text-purple-600 underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginFooterLinks;
