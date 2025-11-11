import React from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonImg,
} from "@ionic/react";
import "./welcome.css";

const Welcome: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="ion-text-center">
        <div className="above">
          <div className="top-section">
            <IonImg src="/assets/welcome-image.svg" alt="Welcome" />
          </div>
          <div className="curve"></div>
        </div>
        <div className="bottom-section">
          <IonText className="welcome-text" color="primary">
            <h1>Aura Cognito</h1>
          </IonText>
          <IonText className="welcome-text" color="medium">
            <h2>El pulso de tu hogar</h2>
          </IonText>

          <div style={{ marginTop: "2rem" }}>
            <IonButton
              color="primary"
              expand="block"
              onClick={() => (window.location.href = "/login")}
            >
              Iniciar Sesión
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              color="secondary"
              onClick={() => (window.location.href = "/register")}
            >
              Regístrate
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
