import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLoginPage = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError("");
      await login({ email, password });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri prijavi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img
          src="/Zepter-Careers images/zepter_logo_web 1.png"
          alt="Zepter"
          className="admin-login-card__logo"
        />
        <h1>Admin Login</h1>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </label>

        {error && <p className="admin-form-error">{error}</p>}

        <button className="admin-button admin-button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;