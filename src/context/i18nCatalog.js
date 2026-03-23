export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "travel_memory_language";

const SUPPORTED_LANGUAGES = new Set([DEFAULT_LANGUAGE, "tr"]);

const translationEntries = `
appName	Travel Memory Map	Travel Memory Map
platformTagline	Your personal travel platform	Ki\u015fisel seyahat platformun
languageTr	TR	TR
languageEn	EN	EN
navHome	Home	Ana Sayfa
navMyTravels	My Travels	Seyahatlerim
navMapExplorer	Map Explorer	Harita Ke\u015ffi
navAddMemory	Add Memory	An\u0131 Ekle
profileMenu	Profile menu	Profil men\u00fcs\u00fc
editProfile	Edit Profile	Profili D\u00fczenle
profilePhoto	Profile Photo	Profil Foto\u011fraf\u0131
profileName	Profile Name	Kullan\u0131c\u0131 Ad\u0131
profileSave	Save Changes	De\u011fi\u015fiklikleri Kaydet
profileCancel	Cancel	\u0130ptal
logout	Logout	\u00c7\u0131k\u0131\u015f Yap
logoutConfirm	Are you sure you want to log out?	\u00c7\u0131k\u0131\u015f yapmak istedi\u011finize emin misiniz?
landingLogin	Login	Giri\u015f Yap
landingSignUp	Sign Up	Kay\u0131t Ol
landingTitle	Capture Your World, One Memory at a Time.	D\u00fcnyan\u0131, bir an\u0131da yakala.
landingSubtitle	Collect your memories on a map and make every journey unforgettable.	An\u0131lar\u0131n\u0131 harita \u00fczerinde biriktir, her yolculu\u011fu unutulmaz k\u0131l.
landingGetStarted	Get Started	Ba\u015fla
landingExploreMap	Explore Map	Haritay\u0131 Ke\u015ffet
landingFooter	Built for modern travelers.	Modern gezginler i\u00e7in tasarland\u0131.
dashboardWelcomeBack	Welcome Back	Tekrar Ho\u015f Geldin
dashboardOperationsCenter	Your travel memory operations center.	Seyahat an\u0131lar\u0131n i\u00e7in kontrol merkezi.
dashboardTotalMemories	Total Memories	Toplam An\u0131
dashboardAverageRating	Average Rating	Ortalama Puan
dashboardLatestPlace	Latest Place	Son Mekan
dashboardNoMemoriesYet	No memories yet	Hen\u00fcz an\u0131 yok
dashboardQuickActions	Quick Actions	H\u0131zl\u0131 \u0130\u015flemler
dashboardAddNewMemory	Add New Memory	Yeni An\u0131 Ekle
dashboardOpenMapExplorer	Open Map Explorer	Harita Ke\u015ffini A\u00e7
dashboardBrowseTravels	Browse My Travels	Seyahatlerimi G\u00f6r
mapExplorerTitle	Map Explorer	Harita Ke\u015ffi
mapExplorerSubtitle	Select a memory to fly to its location on map.	Haritada konuma gitmek i\u00e7in bir an\u0131 se\u00e7.
memoryListEmpty	No memories yet. Add your first trip.	Hen\u00fcz an\u0131 yok. \u0130lk yolculu\u011funu ekle.
memoryRating	Rating: {{rating}}/5	Puan: {{rating}}/5
memoryVisited	Visited: {{date}}	Ziyaret: {{date}}
myTravelsTitle	My Travels	Seyahatlerim
myTravelsSubtitle	All your saved travel memories in one place.	Kaydetti\u011fin t\u00fcm seyahat an\u0131lar\u0131n\u0131 tek yerde.
myTravelsEmpty	No memories yet. Add your first journey from Add Memory.	Hen\u00fcz an\u0131 yok. \u0130lk yolculu\u011funu An\u0131 Ekle ekran\u0131ndan ekle.
noNotes	No notes	Not yok
noPhoto	No Photo	Foto\u011fraf Yok
noNotesProvided	No notes provided.	Not eklenmemi\u015f.
openImageGallery	Open image gallery	G\u00f6rsel galeriyi a\u00e7
previousPhoto	Previous photo	\u00d6nceki foto\u011fraf
nextPhoto	Next photo	Sonraki foto\u011fraf
photoGallery	Photo gallery	Foto\u011fraf galerisi
photoItem	Photo {{index}}	Foto\u011fraf {{index}}
viewOnMap	View on Map	Haritada G\u00f6r
edit	Edit	D\u00fczenle
delete	Delete	Sil
addMemoryTitle	Add Memory	An\u0131 Ekle
editMemoryTitle	Edit Memory	An\u0131y\u0131 D\u00fczenle
addMemorySubtitle	Save a destination with address search, rating and notes.	Adres arama, puan ve notlarla destinasyon kaydet.
formPlaceName	Place Name	Mekan Ad\u0131
formPlacePlaceholder	Enter a place name	Bir mekan ad\u0131 gir
formAddress	Address	Adres
formAddressPlaceholder	Enter a location or address	Konum veya adres gir
formSearchingAddress	Searching addresses...	Adresler aran\u0131yor...
formDateOfVisit	Date of Visit	Ziyaret Tarihi
formRating	Rating	Puan
formNotes	Notes	Notlar
formNotesPlaceholder	Write your trip notes...	Yolculuk notlar\u0131n\u0131 yaz...
formPhoto	Photo	Foto\u011fraf
formPhotoHelp	You can select multiple photos. Each selection is added to the gallery.	Birden fazla foto\u011fraf se\u00e7ebilirsin. Her se\u00e7im galeriye eklenir.
formSelectedMemoryImage	Selected memory {{index}}	Se\u00e7ilen an\u0131 {{index}}
formSaveMemory	Save Memory	An\u0131y\u0131 Kaydet
formUpdateMemory	Update Memory	An\u0131y\u0131 G\u00fcncelle
formSaving	Saving...	Kaydediliyor...
formCancel	Cancel	\u0130ptal
rating5	5 - Excellent	5 - M\u00fckemmel
rating4	4 - Great	4 - Harika
rating3	3 - Good	3 - \u0130yi
rating2	2 - Fair	2 - Orta
rating1	1 - Poor	1 - Zay\u0131f
loginWelcomeBack	Welcome Back	Tekrar Ho\u015f Geldin
loginSubtitle	Login to continue your travel journey.	Seyahat yolculu\u011funa devam etmek i\u00e7in giri\u015f yap.
loginEmail	Email	E-posta
emailPlaceholder	you@example.com	\u00f6rnek@eposta.com
loginPassword	Password	\u015eifre
passwordPlaceholder	Enter your password	\u015eifrenizi girin
loginButton	Login	Giri\u015f Yap
signupButton	Sign Up	Kay\u0131t Ol
signupTitle	Create Account	Hesap Olu\u015ftur
signupSubtitle	Join us to start mapping your memories.	An\u0131lar\u0131n\u0131 haritalamaya ba\u015flamak i\u00e7in kat\u0131l.
signupFullName	Full Name	Ad Soyad
fullNamePlaceholder	John Doe	Ad\u0131 Soyad\u0131
signupBackToHome	Back to Home	Ana Sayfaya D\u00f6n
signupSuccess	Account created! Please log in.	Hesap olu\u015fturuldu! L\u00fctfen giri\u015f yap.
invalidEmailPassword	Invalid email or password.	E-posta veya \u015fifre hatal\u0131.
requiredFieldsError	Place name, address, and date are required.	Mekan ad\u0131, adres ve tarih zorunludur.
saveMemoryError	Something went wrong while saving memory.	An\u0131 kaydedilirken bir hata olu\u015ftu.
imageProcessError	Image could not be processed.	Foto\u011fraf i\u015flenemedi.
imageProcessSelectedError	Selected photos could not be processed.	Se\u00e7ilen foto\u011fraflar i\u015flenemedi.
imageStorageLimitError	Please choose fewer or smaller photos. Storage is limited.	L\u00fctfen daha az veya daha k\u00fc\u00e7\u00fck foto\u011fraflar se\u00e7in. Depolama s\u0131n\u0131rl\u0131.
`
  .trim()
  .split("\n")
  .map((line) => line.split("\t"));

export const translations = translationEntries.reduce(
  (dictionary, [key, englishValue, turkishValue]) => {
    dictionary.en[key] = englishValue;
    dictionary.tr[key] = turkishValue;
    return dictionary;
  },
  { en: {}, tr: {} },
);

export function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.has(language);
}

export function resolveInitialLanguage() {
  if (typeof localStorage === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
}

export function interpolate(template, variables) {
  return Object.entries(variables || {}).reduce(
    (result, [name, value]) => result.replaceAll(`{{${name}}}`, String(value)),
    template,
  );
}
