// // ====== Cosas de CSS que vienen por defecto =======

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/**
  Ver los docs https://ionicframework.com/docs/theming/dark-mode
/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

import './theme/variables.css';
// /*========================================*/

import React, { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ManagePage from "./pages/ManagePage";
import ControlPage from "./pages/ControlPage";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";

import { IonApp, IonRouterOutlet, setupIonicReact  } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";

setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated, initializing, rehydrate } = useAuthStore();

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  if (initializing) return <div>Loading...</div>;

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>

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

          <Route path="/profile">
            {isAuthenticated ? <Profile /> : <Redirect to="/" />}
          </Route>
        

          {/* Rutas protegidas */}
          <ProtectedRoute
            exact
            path="/control"
            component={ControlPage}
            allowedRoles={["owner", "family"]}
          />
          <ProtectedRoute
            exact
            path="/manage"
            component={ManagePage}
            allowedRoles={["owner"]}
          />


        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};
export default App;