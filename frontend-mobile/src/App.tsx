import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonContent,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

import "./theme/variables.css";
import { RegisterPage } from "./pages/Register";
import HomePage from "./pages/Home";
import { LoginPage } from "./pages/Login";

import { DebugAuth } from "./components/DebugAuth";

import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

const App: React.FC = () => {
  const { rehydrate, initializing } = useAuthStore();

  useEffect(() => {
    rehydrate(); // restaura sesión al iniciar la app
  }, []);

  if (initializing) {
    return <div style={{ padding: "2rem" }}>🔄 Cargando sesión...</div>;
  }
  return (
    <IonApp>
      <DebugAuth />
      <IonReactRouter>
        <IonContent>
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/home" component={HomePage} />
          <Redirect exact from="/" to="/login" />
        </IonContent>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
