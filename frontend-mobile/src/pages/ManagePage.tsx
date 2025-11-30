import {IonPage, IonContent,} from "@ionic/react";
import React, { useEffect } from "react";
import  AppHeader  from "../components/AppHeader"; 
import { getNoRoleUsers } from "../services/authService";
import { getCurrentUser } from "../services/authService";

const ManagePage: React.FC = () => {
    useEffect(() => {
      const loadUsersNoRole = async () => {
          try {
            const usersNoRole = await getNoRoleUsers();
            console.log("🟡 Here. ")
            console.log(usersNoRole);
          } catch (err) {
            console.error("❌ Error loading users with no role:", err);
          }
        };

        loadUsersNoRole();
      }, []);
  
  
  return (
    <IonPage>
      <AppHeader title="Configuración" showBackButton/>
      <IonContent className="ion-padding ion-text-center">
      <h1>En proceso</h1>
    </IonContent>
    </IonPage>
  );
};

export default ManagePage;