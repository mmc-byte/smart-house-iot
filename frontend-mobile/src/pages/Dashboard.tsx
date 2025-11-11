import React from "react";
import { useAuthStore } from "../store/authStore";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import StateCard from "../components/StateCard";

const Dashboard: React.FC = () => {
  const { logout, activeRole, user } = useAuthStore();
  const history = useHistory();

  console.log("House ID:", user.houses_link[0]?.house_id);
  const goToControl = () => history.push("/control");
  const goToManage = () => history.push("/manage");

  return (
    <IonPage>
      <AppHeader title={`¡Hola ${user?.username}!`} showMenu />
      <IonContent className="ion-padding ion-text-center">
        <div className="talk-with-ai-section">
          <IonButton color="primary" expand="block">
            Hablar con Auri
          </IonButton>
        </div>

        {activeRole === null && (
          <p>No estás asignado a ningún hogar por el momento.</p>
        )}
        
        
        {/* Comunes a todos los roles con hogar */}

        {activeRole === "guest" || activeRole === "family" || activeRole === "owner"&& (
        
          <StateCard></StateCard>
        
        )}


        {/* Solo para guest */}

        {activeRole === "guest" && (
          <p>Rol: guest (sin acceso a funciones restringidas)</p>
        )}
        
        {/* Comunes para family y owner */}
        {(activeRole === "family" || activeRole === "owner") && (
          <IonButton color="primary" expand="block" onClick={goToControl}>
            Controlar mi hogar
          </IonButton>
        )}

        {/* Botón solo para owner */}
        {activeRole === "owner" && (
          <IonButton color="secondary" expand="block" onClick={goToManage}>
            Gestionar
          </IonButton>
        )}

        <IonButton color="warning" expand="block" onClick={logout}>
          Cerrar Sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

// import React from "react";
// import { useAuthStore } from "../store/authStore";
// import {
//   IonPage,
//   IonContent,
//   IonInput,
//   IonButton,
//   IonItem,
//   IonLabel,
//   IonList,
// } from "@ionic/react";

// const Dashboard: React.FC = () => {
//   const { logout, activeRole, user } = useAuthStore();
//   console.log('House ID:', user.houses_link[0]?.house_id);
//   return (
//     <IonPage>
//       <IonContent
//         fullscreen
//         className="ion-padding ion-text-center"
//       >

//       <h1>Bienvenido/a</h1>
//       <button onClick={logout}>Logout</button>
//       <p>
//         <strong>Rol: </strong> {activeRole ?? "null"}
//       </p>

//       {activeRole === null && (
//         <p>No estás asignado a ningún hogar por el momento.</p>
//       )}

//       {activeRole === "guest" && (
//         <p>Rol: guest (sin acceso a funciones restringidas)</p>
//       )}

//       {activeRole === "family" && (
//         <button onClick={() => (window.location.href = "/control")}>Control del hogar</button>
//       )}

//       {activeRole === "owner" && (
//         <>
//           <button onClick={() => (window.location.href = "/manage")}>Gestionar</button>
//           <button onClick={() => (window.location.href = "/control")}>Control del hogar</button>
//         </>
//         )
//       }

//       </IonContent>
//     </IonPage>
//   );
// };

// export default Dashboard;
