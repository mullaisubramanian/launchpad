import React from "react";
import { useApp } from "./context/AppContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { ToastContainer } from "./components/common/Toast";
import { Modal } from "./components/common/Modal";

import { HomeView } from "./views/HomeView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { ApplyView } from "./views/ApplyView";
import { ApplicationFormView } from "./views/ApplicationFormView";
import { StatusView } from "./views/StatusView";
import { AddSchemeView } from "./views/AddSchemeView";
import { ApplicantsView } from "./views/ApplicantsView";
import { ProfileView } from "./views/ProfileView";

export const App = () => {
  const { currentRoute, currentUser, navigate } = useApp();

  // Parse hash route
  // Examples: "#/home", "#/register/investor", "#/form/s_inv_1", ""
  const cleanHash = (currentRoute || "").replace(/^#\/?/, "");
  const segments = cleanHash.split("/").filter(Boolean);
  const root = segments[0] || "home";

  let content = null;

  if (root === "register") {
    content = <RegisterView initialRole={segments[1] || "startup"} />;
  } else if (root === "login") {
    content = <LoginView />;
  } else if (root === "home" || root === "about" || root === "services") {
    content = <HomeView />;
  } else if (!currentUser) {
    // If not logged in and accessing protected routes, show login
    content = <LoginView />;
  } else {
    // Authenticated user
    if (currentUser.role === "startup") {
      if (root === "apply") {
        content = <ApplyView />;
      } else if (root === "form") {
        content = <ApplicationFormView schemeId={segments[1]} />;
      } else if (root === "status") {
        content = <StatusView />;
      } else if (root === "profile") {
        content = <ProfileView />;
      } else {
        content = <ApplyView />;
      }
    } else {
      // Partner roles: investor, pilot, grant
      if (root === "applicants") {
        content = <ApplicantsView />;
      } else if (root === "add") {
        content = <AddSchemeView />;
      } else if (root === "profile") {
        content = <ProfileView />;
      } else {
        content = <ApplicantsView />;
      }
    }
  }

  return (
    <>
      <Navbar />
      <main id="main-content">{content}</main>
      <Footer />
      <ToastContainer />
      <Modal />
    </>
  );
};

export default App;
