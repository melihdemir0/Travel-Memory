import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import { loadAuthState, loadUsers, saveUser } from "../utils/auth";

function LoginPage({ isAuthenticated, onLogin }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const isAuthFromStorage = loadAuthState();
    if (isAuthenticated || isAuthFromStorage) {
      if (!isAuthenticated && isAuthFromStorage) {
        onLogin();
      }
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate, onLogin]);

  function handleLogin(event) {
    event.preventDefault();
    setErrorMsg("");
    const safeUsers = loadUsers();

    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = safeUsers.find(
      (user) => user.email === normalizedEmail && user.password === password,
    );

    if (!foundUser) {
      setErrorMsg(t("invalidEmailPassword"));
      return;
    }

    saveUser(foundUser);
    onLogin();
    navigate("/dashboard", { replace: true });
  }

  function handleSignUpRedirect() {
    navigate("/signup");
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left" aria-hidden="true">
          <div className="login-left-content">
            <h2 className="login-left-title">{t("appName")}</h2>
            <p className="login-left-subtitle">{t("platformTagline")}</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-right-content">
            <h1 className="login-title">{t("loginWelcomeBack")}</h1>
            <p className="login-subtitle">{t("loginSubtitle")}</p>

            <div className="login-form-shell">
              <form className="login-form" onSubmit={handleLogin}>
                {errorMsg && <p className="login-error-msg">{errorMsg}</p>}

                <div className="login-field">
                  <label htmlFor="email" className="login-label">
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

                <div className="login-field">
                  <label htmlFor="password" className="login-label">
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

                <div className="login-actions">
                  <button type="submit" className="btn-primary login-btn-primary">
                    {t("loginButton")}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary login-btn-secondary"
                    onClick={handleSignUpRedirect}
                  >
                    {t("signupButton")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
