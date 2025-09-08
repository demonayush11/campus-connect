import { SignUpPage } from "@/components/ui/sign-up";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign Up submitted:", data);
    alert(`Sign Up Submitted! Check the browser console for form data.`);
  };

  const handleGoogleSignUp = () => {
    console.log("Continue with Google clicked");
    alert("Continue with Google clicked");
  };
  
  const handleSignIn = () => {
    navigate("/login");
  }

  return (
    <div className="dark bg-[#030303] text-foreground">
      <SignUpPage
        onSignUp={handleSignUp}
        onGoogleSignUp={handleGoogleSignUp}
        onSignIn={handleSignIn}
      />
    </div>
  );
};

export default SignUp;
