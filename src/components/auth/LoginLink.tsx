
import { Link } from "react-router-dom";

const LoginLink = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-gray-600">
        Already have an account?{" "}
        <Link 
          to="/login-existing" 
          className="text-purple-500 font-semibold hover:text-purple-600 underline"
        >
          Log In
        </Link>
      </p>
    </div>
  );
};

export default LoginLink;
