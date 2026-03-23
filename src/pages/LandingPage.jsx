import PropTypes from "prop-types";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

function LandingPage({ isAuthenticated }) {
  const { t } = useI18n();
  const getStartedPath = isAuthenticated ? "/dashboard" : "/login";
  const explorePath = isAuthenticated ? "/dashboard/map" : "/login";

  return (
    <div className="landing-page min-h-screen">
      <header className="landing-header mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="landing-brand">
          <MapPin className="landing-brand-icon" size={20} strokeWidth={2} />
          <span>{t("appName")}</span>
        </div>

        <nav className="landing-header-links">
          <Link to="/login" className="landing-header-link">
            {t("landingLogin")}
          </Link>
          <Link to="/signup" className="landing-header-link landing-header-link--signup">
            {t("landingSignUp")}
          </Link>
        </nav>
      </header>

      <section className="landing-hero mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 md:items-center">
        <div className="landing-copy space-y-6">
          <h1 className="landing-title text-4xl leading-tight text-gray-900 md:text-5xl">
            {t("landingTitle")}
          </h1>
          <p className="landing-subtitle max-w-xl text-lg text-gray-600">{t("landingSubtitle")}</p>

          <div className="landing-cta-row">
            <Link to={getStartedPath} className="landing-cta landing-cta--primary">
              {t("landingGetStarted")}
            </Link>
            <Link to={explorePath} className="landing-cta landing-cta--secondary">
              {t("landingExploreMap")}
            </Link>
          </div>
        </div>

        <div className="landing-visual-wrap">
          <div className="landing-visual-card" aria-hidden="true">
            <div className="landing-visual-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="landing-visual-image" />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} {t("appName")}. {t("landingFooter")}
        </p>
      </footer>
    </div>
  );
}

LandingPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default LandingPage;
