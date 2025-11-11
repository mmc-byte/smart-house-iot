import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonIcon,
} from "@ionic/react";
import {
  menuOutline,
  personCircleOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface AppHeaderProps {
  title?: string;            // Título dinámico
  showMenu?: boolean;        // Mostrar botón de menú
  showProfile?: boolean;     // Mostrar botón de perfil
  showBackButton?: boolean;  // Mostrar botón de volver
  onMenuClick?: () => void;  // Acción al presionar menú
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "",
  showMenu = false,
  showProfile = true,
  showBackButton = false,
  onMenuClick,
}) => {
  const { user } = useAuthStore();
  const history = useHistory();

  return (
    <IonHeader>
      <IonToolbar>

        {/* Botón de menú o volver */}
        <IonButtons slot="start">
          {showBackButton ? (
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          ) : (
            showMenu && (
              <IonButton onClick={onMenuClick}>
                <IonIcon icon={menuOutline} />
              </IonButton>
            )
          )}
        </IonButtons>

        {/* Título dinámico */}
        <IonTitle>
          {title || `Hola ${user?.username || "usuario"}!`}
        </IonTitle>

        {/* Botón de perfil */}
        {showProfile && (
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/profile")}>
              <IonIcon icon={personCircleOutline} />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;