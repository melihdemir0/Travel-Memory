import {
  ChevronDown,
  Globe,
  House,
  LogOut,
  MapPin,
  MapPinned,
  PlusCircle,
  Route,
  UserCircle,
} from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import {
  clearAuthState,
  clearUser,
  loadUser,
  loadUsers,
  saveUser,
  saveUsers,
} from "../../utils/auth";
import { IMAGE_MODAL_OPEN_EVENT } from "../../utils/imageModal";
import ImageModal from "../common/ImageModal";

function readCurrentUser() {
  return loadUser();
}

function getInitialProfile() {
  const user = readCurrentUser();
  return {
    fullName: user?.fullName?.trim() || "User",
    avatar: user?.avatar || "",
  };
}

function buildAvatarFallbackName(nameValue) {
  const normalizedName = nameValue?.trim() || "K";
  const parts = normalizedName.split(" ").filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "K";
}

function DashboardNavItem({ to, label, end, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `dashboard-nav-item ${isActive ? "is-active" : ""}`}
    >
      <Icon className="dashboard-nav-icon" size={18} strokeWidth={2} />
      <span>{label}</span>
    </NavLink>
  );
}

DashboardNavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  end: PropTypes.bool,
  icon: PropTypes.elementType.isRequired,
};

DashboardNavItem.defaultProps = {
  end: false,
};

function DashboardLayout({ onLogout }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const [profile, setProfile] = useState(getInitialProfile);
  const [profileForm, setProfileForm] = useState(getInitialProfile);
  const [modalImageData, setModalImageData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const navigationItems = useMemo(
    () => [
      { to: "/dashboard", label: t("navHome"), end: true, icon: House },
      { to: "/dashboard/travels", label: t("navMyTravels"), icon: Route },
      { to: "/dashboard/map", label: t("navMapExplorer"), icon: MapPinned },
      { to: "/dashboard/add", label: t("navAddMemory"), icon: PlusCircle },
    ],
    [t],
  );

  const avatarInitials = useMemo(
    () => buildAvatarFallbackName(profile.fullName),
    [profile.fullName],
  );

  useEffect(() => {
    const initialProfile = getInitialProfile();
    setProfile(initialProfile);
    setProfileForm(initialProfile);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleOpenImageModal(event) {
      const images = event.detail?.images;
      if (!Array.isArray(images) || images.length === 0) {
        return;
      }

      setModalImageData({
        images,
        initialIndex: Number(event.detail?.initialIndex || 0),
      });
    }

    globalThis.addEventListener(IMAGE_MODAL_OPEN_EVENT, handleOpenImageModal);
    return () => {
      globalThis.removeEventListener(IMAGE_MODAL_OPEN_EVENT, handleOpenImageModal);
    };
  }, []);

  function handleCloseImageModal() {
    setModalImageData(null);
  }

  function handleToggleMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function handleOpenProfileModal() {
    setProfileForm(profile);
    setIsProfileModalOpen(true);
    setIsMenuOpen(false);
  }

  function handleCloseProfileModal() {
    setIsProfileModalOpen(false);
  }

  function handleProfileNameChange(event) {
    const value = event.target.value;
    setProfileForm((currentValue) => ({
      ...currentValue,
      fullName: value,
    }));
  }

  function handleProfilePhotoChange(event) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setProfileForm((currentValue) => ({
        ...currentValue,
        avatar: typeof fileReader.result === "string" ? fileReader.result : "",
      }));
      event.target.value = "";
    };
    fileReader.readAsDataURL(selectedFile);
  }

  function handleSubmitProfile(event) {
    event.preventDefault();
    const normalizedName = profileForm.fullName.trim() || profile.fullName;
    const nextProfile = {
      fullName: normalizedName,
      avatar: profileForm.avatar || "",
    };

    const currentUser = readCurrentUser() || {};
    const updatedCurrentUser = {
      ...currentUser,
      fullName: nextProfile.fullName,
      avatar: nextProfile.avatar,
    };

    saveUser(updatedCurrentUser);

    if (updatedCurrentUser.email) {
      const updatedUsers = loadUsers().map((user) =>
        user.email === updatedCurrentUser.email
          ? {
              ...user,
              fullName: nextProfile.fullName,
              avatar: nextProfile.avatar,
            }
          : user,
      );
      saveUsers(updatedUsers);
    }

    setProfile(nextProfile);
    setIsProfileModalOpen(false);
  }

  function handleLogoutClick() {
    const confirmed = globalThis.confirm(t("logoutConfirm"));
    if (!confirmed) {
      return;
    }

    localStorage.removeItem("user");
    clearAuthState();
    clearUser();
    navigate("/", { replace: true });
    onLogout();
  }

  return (
    <div className="journal-page min-h-screen overflow-x-hidden bg-gray-50">
      <div className="journal-shell mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 p-4 md:h-[calc(100vh-3rem)] md:min-h-0 md:flex-row md:overflow-hidden md:p-6">
        <aside className="journal-sidebar dashboard-sidebar w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-md md:h-full md:w-80">
          <div className="flex h-full flex-col gap-6">
            <div className="journal-brand-block space-y-2">
              <div className="dashboard-brand-row">
                <MapPin className="dashboard-brand-icon" size={22} strokeWidth={2} />
                <h1 className="journal-brand dashboard-brand text-gray-900">{t("appName")}</h1>
              </div>
              <p className="text-sm text-gray-600">{t("platformTagline")}</p>
            </div>

            <nav className="dashboard-nav flex flex-col gap-2">
              {navigationItems.map((item) => (
                <DashboardNavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  end={item.end}
                  icon={item.icon}
                />
              ))}
            </nav>
          </div>
        </aside>

        <main className="journal-main min-w-0 flex flex-1 flex-col rounded-2xl border border-gray-200 bg-gray-50 p-4 md:h-full md:overflow-hidden md:p-6">
          <div className="dashboard-profile-header-wrap">
            <div className="dashboard-header-controls">
              <fieldset className="dashboard-language-switch" aria-label={t("profileMenu")}>
                <Globe size={15} strokeWidth={2} />
                <button
                  type="button"
                  className={`dashboard-lang-btn ${language === "tr" ? "is-active" : ""}`}
                  onClick={() => setLanguage("tr")}
                >
                  {t("languageTr")}
                </button>
                <button
                  type="button"
                  className={`dashboard-lang-btn ${language === "en" ? "is-active" : ""}`}
                  onClick={() => setLanguage("en")}
                >
                  {t("languageEn")}
                </button>
              </fieldset>

              <div className="dashboard-profile-menu" ref={profileMenuRef}>
                <button
                  type="button"
                  className="dashboard-profile-trigger"
                  onClick={handleToggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="dashboard-profile-avatar" aria-hidden="true">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        className="dashboard-profile-avatar-image"
                      />
                    ) : (
                      <span className="dashboard-profile-avatar-fallback">{avatarInitials}</span>
                    )}
                  </span>
                  <span className="dashboard-profile-name">{profile.fullName}</span>
                  <ChevronDown size={16} strokeWidth={2} className="dashboard-profile-caret" />
                </button>

                {isMenuOpen && (
                  <div className="dashboard-profile-dropdown" role="menu">
                    <button
                      type="button"
                      className="dashboard-dropdown-item"
                      onClick={handleOpenProfileModal}
                    >
                      <UserCircle size={16} strokeWidth={2} />
                      <span>{t("editProfile")}</span>
                    </button>
                    <button
                      type="button"
                      className="dashboard-dropdown-item dashboard-dropdown-item--danger"
                      onClick={handleLogoutClick}
                    >
                      <LogOut size={16} strokeWidth={2} />
                      <span>{t("logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-main-content min-h-0 flex-1 overflow-x-hidden md:overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {isProfileModalOpen && (
        <dialog
          open
          className="dashboard-modal-overlay"
          aria-labelledby="dashboard-profile-modal-title"
        >
          <div className="dashboard-profile-modal">
            <h3 id="dashboard-profile-modal-title" className="dashboard-profile-modal-title">
              {t("editProfile")}
            </h3>

            <form onSubmit={handleSubmitProfile} className="dashboard-profile-form">
              <label className="dashboard-profile-form-label" htmlFor="profile-name">
                {t("profileName")}
              </label>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                value={profileForm.fullName}
                onChange={handleProfileNameChange}
                required
              />

              <label className="dashboard-profile-form-label" htmlFor="profile-photo">
                {t("profilePhoto")}
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                className="form-input"
                onChange={handleProfilePhotoChange}
              />

              <div className="dashboard-profile-preview">
                {profileForm.avatar ? (
                  <img
                    src={profileForm.avatar}
                    alt={profileForm.fullName}
                    className="dashboard-profile-preview-image"
                  />
                ) : (
                  <div className="dashboard-profile-preview-fallback">{avatarInitials}</div>
                )}
              </div>

              <div className="dashboard-profile-modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseProfileModal}>
                  {t("profileCancel")}
                </button>
                <button type="submit" className="btn-primary">
                  {t("profileSave")}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      <ImageModal imageData={modalImageData} onClose={handleCloseImageModal} />
    </div>
  );
}

DashboardLayout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default DashboardLayout;
