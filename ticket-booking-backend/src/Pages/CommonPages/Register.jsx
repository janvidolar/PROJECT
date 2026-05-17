import { useState } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../Services/ApiService";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  // useState used for value tracking in component
  // 1st variable - variable to show and store value
  // 2nd variable - state updating function (use to update value of state)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  // state to store errors
  const [errors, setErrors] = useState({});
  // state to show loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    console.log("event.target.value: ", e.target.value, e.target.name);

    // setFormData(new value)
    setFormData({
      ...formData, // store old values
      [e.target.name]: e.target.value,
    });
  };

  console.log({ formData });

  // function to validate form data (returns true if valid, false otherwise)
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Minimum 3 characters required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Enter 10 digit number";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // to prevent page refresh behaviour while form submit
    if (!validate()) return;
    // 200, 201, 400, 401, 404, 500
    setIsLoading(true);
    try {
      console.log({ formData });
      navigate("/user/dashboard");
      // API call to register user
      const res = await ApiService.post("/users/add", {
        ...formData, // copy all formData fields
        role: "user",
      });

      console.log({ res });
      // on successful registration
      if (res.code === 201) {
        localStorage.setItem("authDetail-tickethub", JSON.stringify(res.data));
        navigate("/user/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.description || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="logo-wrapper">
          <img src="/vite.svg" alt="logo" />
        </div>

        <h1 className="register-title">Register</h1>
        <p className="register-subtitle">Create an account to continue</p>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Mobile Number</label>
            <div className="input-wrapper">
              <Phone size={18} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="login-text">
          You already have an account?
          <button onClick={() => navigate("/login")}>Sign in here</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
