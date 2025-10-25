// // ====== Cosas de CSS que vienen por defecto =======
// /* Core CSS required for Ionic components to work properly */
// import "@ionic/react/css/core.css";
// /* Basic CSS for apps built with Ionic */
// import "@ionic/react/css/normalize.css";
// import "@ionic/react/css/structure.css";
// import "@ionic/react/css/typography.css";
// /* Optional CSS utils that can be commented out */
// import "@ionic/react/css/padding.css";
// import "@ionic/react/css/float-elements.css";
// import "@ionic/react/css/text-alignment.css";
// import "@ionic/react/css/text-transformation.css";
// import "@ionic/react/css/flex-utils.css";
// import "@ionic/react/css/display.css";
// /**
//  * Ionic Dark Mode For more info, please see:
//  * https://ionicframework.com/docs/theming/dark-mode
//  */
// /* import '@ionic/react/css/palettes/dark.always.css'; */
// /* import '@ionic/react/css/palettes/dark.class.css'; */
// import "@ionic/react/css/palettes/dark.system.css";
// import "./theme/variables.css";
// /*========================================*/

import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ManagePage from "./pages/ManagePage";
import ControlPage from "./pages/ControlPage";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  const { isAuthenticated, initializing, rehydrate } = useAuthStore();

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  if (initializing) return <div>Loading...</div>;

  return (
    <Router>

      <Switch>
        {/* Rutas públicas */}
        <Route exact path="/">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <Welcome />}
        </Route>
        <Route path="/login">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
        </Route>
        <Route path="/register">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <RegisterPage />}
        </Route>
        <Route path="/dashboard">
        {isAuthenticated ? <Dashboard /> : <Redirect to="/" />}
        </Route>

        {/* Rutas protegidas */}
        <ProtectedRoute exact path="/control" component={ControlPage} allowedRoles={["owner", "family"]} />
        <ProtectedRoute exact path="/manage" component={ManagePage} allowedRoles={["owner"]} />
      </Switch>

    </Router>
  );
};

export default App;