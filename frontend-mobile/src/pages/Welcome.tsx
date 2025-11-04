import React from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
} from "@ionic/react";

const Welcome: React.FC = () => {
  return (
    <IonPage>
      <IonContent
        fullscreen
        className="ion-padding ion-text-center"
      >
        <IonText color="primary">
          <h1>Bienvenido</h1>
        </IonText>

        {/* <p>Please log in to continue.</p> */}

        <div style={{ marginTop: "2rem" }}>
          <IonButton
            expand="block"
            onClick={() => (window.location.href = "/login")}
          >
            Iniciar Sesión
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            color="medium"
            onClick={() => (window.location.href = "/register")}
          >
            Regístrate
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;

// import React from "react";
// import {
//   IonPage,
//   IonContent,
//   IonHeader,
//   IonTitle,
//   IonToolbar,
//   IonButton,
//   IonText,
// } from "@ionic/react";

// const Welcome: React.FC = () => {
//   return (
//     <IonPage>
//       <IonContent>
//         <h1>Welcome Page</h1>
//         <p>Please log in to continue.</p>
//         <button onClick={() => (window.location.href = "/login")}>
//           Iniciar Sesión
//         </button>
//         <button onClick={() => (window.location.href = "/register")}>
//           Regístrate
//         </button>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Welcome;
