import {IonPage, IonContent,} from "@ionic/react";
import React, { useEffect } from "react";
import  AppHeader  from "../components/AppHeader"; 

const ManagePage: React.FC = () => {
  
  return (
    <IonPage>
      <AppHeader title="Admin" showBackButton/>
      <IonContent className="ion-padding ion-text-center">
      <h1>En proceso</h1>
    </IonContent>
    </IonPage>
  );
};

export default ManagePage;