import React from "react";
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonIcon } from "@ionic/react";
import { personCircleOutline, menuOutline } from "ionicons/icons";
import { useAuthStore } from "../store/authStore";
import { useHistory } from "react-router";

const AppHeader: React.FC = () => {
  const { user } = useAuthStore();
  const history = useHistory();

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton>
            <IonIcon icon={menuOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle>Hola {user?.username || "usuario"}!</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => history.push("/profile")}>
            <IonIcon icon={personCircleOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
