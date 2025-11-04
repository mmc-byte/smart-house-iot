import React from "react";
import { IonPage, IonContent, IonText, IonButton } from "@ionic/react";
import AppHeader from "../components/AppHeader";
import { useAuthStore } from "../store/authStore";
import { useHistory } from "react-router";

interface RoleResponse {
  name: string;
}

interface UserHouseResponse {
  house_id: number;
  role?: RoleResponse;
}

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const history = useHistory();
console.log('House ID:', user.houses_link[0]?.house_id);
  return (
    <IonPage>
      <AppHeader showBackButton/>
      <IonContent className="ion-padding">
        <IonText>
          <h2>Perfil del usuario</h2>
          <p><strong>Usuario:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <h3>Casas y roles:</h3>
          {user?.houses_link?.length ? (
            user.houses_link.map((uh: UserHouseResponse) => (
              <p key={uh.house_id}>
                Casa {uh.house_id} → Rol: {uh.role?.name || "sin asignar"}
              </p>
            ))
          ) : (
            <p>No tienes casas asignadas.</p>
          )}
        </IonText>
        <IonButton expand="block" onClick={() => history.push("/dashboard")}>
          Volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
