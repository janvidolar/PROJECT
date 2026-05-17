import { useState } from "react";
import { User, ShieldCheck, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../Services/ApiService";
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await ApiService.post("/users/login", { ...form, role });
      if (res?.code === 200) {
        localStorage.setItem("authDetail-tickethub", JSON.stringify(res.data));
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.description || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background Overlay for Theater Feel */}
      <div className="theater-overlay"></div>
      
      <div className="login-container">
        <div className="login-logo">
          <img src="/src/assets/img2.jpg" alt="logo" />
        </div>

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your theater account</p>

        <div className="role-toggle">
          <button
            onClick={() => setRole("user")}
            className={`role-btn ${role === "user" ? "active" : ""}`}
          >
            <User size={16} /> User
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`role-btn ${role === "admin" ? "active" : ""}`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email Address</label>
          <div className="input-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}

          <label className="mt">Password</label>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          {/* Color changed to Dashboard Purple Gradient */}
          <button type="submit" className="login-btn-gradient" disabled={isLoading}>
            {isLoading ? "Processing..." : role === "admin" ? "Admin Login" : "Sign In"}
          </button>
        </form>

        {role === "user" && (
          <p className="login-footer">
            New to MovieZone? 
            <button onClick={() => navigate("/register")}>Sign Up here</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;