import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingProvider } from "./contexts/LoadingContext";
import { FirebaseAuthProvider } from "./contexts/FirebaseAuthContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { CookieNotification } from "./components/CookieNotification";

import { ViewTransition } from "./components/ViewTransition";
import { RootLayout } from "./layouts/RootLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { LandingPage } from "./pages/LandingPage";
import { WhoWeArePage } from "./pages/WhoWeArePage";
import { TeamPage } from "./pages/TeamPage";
import { MatchesPage } from "./pages/MatchesPage";
import { FacilityPage } from "./pages/FacilityPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SupportPage } from "./pages/SupportPage";
import { StorePage } from "./pages/StorePage";
import { ProductPage } from "./pages/ProductPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { TermsOfService } from "./pages/TermsOfService";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { useState, useEffect } from "react";
import { useLoading } from "./contexts/LoadingContext";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import SponsorshipPage from "./pages/SponsorshipPage";
import AdminDashboard from "./pages/AdminDashboard";

// Initialize i18next
import "./i18n";

// Styles
import "./styles/vendor/bootstrap.min.css";
import "./styles/vendor/fontawesome.min.css";
import "./styles/vendor/all.min.css";
import "./styles/components/animations.css";
import "./styles/typography.css";
import "./styles/global.css";
import "./styles/style.css";
import "./styles/view-transitions.css";

function App() {
  const [isDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const queryClient = new QueryClient();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);



  return (
    <FirebaseAuthProvider>
      <LoadingProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <LoadingScreen />
            <ViewTransition>
              <MainContent
                isDarkMode={isDarkMode}
              />
            </ViewTransition>
          </Router>
        </QueryClientProvider>
      </LoadingProvider>
    </FirebaseAuthProvider>
  );
}

// Separate component for main content that only renders after loading
const MainContent = ({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) => {
  const { isLoading } = useLoading();

  if (isLoading) return null;

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <CookieNotification />
      <Routes>
        {/* Auth routes without navigation */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Regular routes with navigation */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/who-we-are" element={<WhoWeArePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/facility" element={<FacilityPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/product/:productId" element={<ProductPage />} />
          <Route path="/sponsorship" element={<SponsorshipPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
