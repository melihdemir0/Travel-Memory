import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import { loadUsers, saveUsers } from "../utils/auth";

function SignUpPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignUp(event) {
    event.preventDefault();
    const safeUsers = loadUsers();

    const newUser = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    saveUsers([...safeUsers, newUser]);
    alert(t("signupSuccess"));
    navigate("/login");
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-left">
          <div className="signup-left-content">
            <h1 className="signup-title">{t("signupTitle")}</h1>
            <p className="signup-subtitle">{t("signupSubtitle")}</p>

            <div className="signup-form-shell">
              <form className="signup-form" onSubmit={handleSignUp}>
                <div className="signup-field">
                  <label htmlFor="fullName" className="signup-label">
                    {t("signupFullName")}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    placeholder={t("fullNamePlaceholder")}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>

                <div className="signup-field">
                  <label htmlFor="email" className="signup-label">
                    {t("loginEmail")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="signup-field">
                  <label htmlFor="password" className="signup-label">
                    {t("loginPassword")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                <div className="signup-actions">
                  <button type="submit" className="btn-primary signup-btn-primary">
                    {t("signupButton")}
                  </button>
                  <Link to="/" className="signup-back-link">
                    {t("signupBackToHome")}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="signup-right" aria-hidden="true" />
      </div>
    </div>
  );
}

export default SignUpPage;
