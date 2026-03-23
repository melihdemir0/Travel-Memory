import PropTypes from "prop-types";
import { ArrowUpRight, CalendarDays, MapPinned, PlusCircle, Route, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";

function DashboardHomePage({ memories }) {
  const { language, t } = useI18n();
  const averageRating =
    memories.length === 0
      ? 0
      : (memories.reduce((total, memory) => total + memory.rating, 0) / memories.length).toFixed(1);

  const todayLabel = new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const statCards = [
    {
      label: t("dashboardTotalMemories"),
      value: memories.length,
      icon: MapPinned,
      valueIcon: ArrowUpRight,
      accentClass: "dashboard-stat-icon--coral",
    },
    {
      label: t("dashboardAverageRating"),
      value: averageRating,
      icon: Star,
      valueIcon: ArrowUpRight,
      accentClass: "dashboard-stat-icon--gold",
    },
    {
      label: t("dashboardLatestPlace"),
      value: memories[0]?.place || t("dashboardNoMemoriesYet"),
      icon: CalendarDays,
      valueIcon: Route,
      accentClass: "dashboard-stat-icon--slate",
      compactValue: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="dashboard-header-block">
        <h2 className="dashboard-page-title text-2xl text-gray-900">{t("dashboardWelcomeBack")}</h2>
        <p className="dashboard-page-subtitle mt-1 text-sm text-gray-600">{todayLabel}</p>
        <p className="mt-2 text-sm text-gray-600">{t("dashboardOperationsCenter")}</p>
      </div>

      <div className="dashboard-stat-grid grid gap-6 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          const ValueIcon = card.valueIcon;

          return (
            <article
              key={card.label}
              className="dashboard-stat-card rounded-xl bg-white p-5 transition"
            >
              <div className={`dashboard-stat-icon ${card.accentClass}`}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <p className="dashboard-stat-label text-sm text-gray-500">{card.label}</p>
              <div className="dashboard-stat-value-row mt-2">
                <p
                  className={`dashboard-stat-value ${
                    card.compactValue ? "text-lg text-gray-900" : "text-3xl text-gray-900"
                  } ${card.label === t("dashboardAverageRating") ? "text-amber-600" : ""}`}
                >
                  {card.value}
                </p>
                <span className="dashboard-stat-trend">
                  <ValueIcon size={16} strokeWidth={2} />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="dashboard-surface-card rounded-xl bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900">{t("dashboardQuickActions")}</h3>
        <div className="dashboard-quick-actions mt-4">
          <Link
            to="/dashboard/add"
            className="btn-primary dashboard-action-btn dashboard-action-btn--primary"
          >
            <PlusCircle size={18} strokeWidth={2} />
            <span>{t("dashboardAddNewMemory")}</span>
          </Link>
          <Link
            to="/dashboard/map"
            className="btn-secondary dashboard-action-btn dashboard-action-btn--secondary"
          >
            <MapPinned size={18} strokeWidth={2} />
            <span>{t("dashboardOpenMapExplorer")}</span>
          </Link>
          <Link
            to="/dashboard/travels"
            className="btn-secondary dashboard-action-btn dashboard-action-btn--secondary"
          >
            <Route size={18} strokeWidth={2} />
            <span>{t("dashboardBrowseTravels")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

DashboardHomePage.propTypes = {
  memories: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DashboardHomePage;
