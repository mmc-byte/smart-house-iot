import React from "react";
import { IonCard, IonCardContent, IonLabel, IonText } from "@ionic/react";
import "./stateCard.css";

interface StateCardProps {
  temperature?: number;
  litRooms?: number;
}

const StateCard: React.FC<StateCardProps> = ({
  temperature = 22, // valor dummy
  litRooms = 3, // valor dummy
}) => {
  return (
    <IonCard className="state-card" >
      <IonCardContent className="state-card-content">
        {/* Círculo de temperatura */}
        <div className="temperature">
          <IonText className="circle-title">Temperatura registrada</IonText>
          <div className="state-circle temperature-circle">
            <IonLabel className="circle-label">
              {/* {temperature} */}{" "}
              {/* Descomentar para usar valor real del backend */}
              {temperature}°C
            </IonLabel>
          </div>
        </div>

        {/* Círculo de habitaciones iluminadas */}
        <div className="rooms-lit">
          <IonText className="circle-title">Habitaciones Iluminadas</IonText>
          <div className="state-circle rooms-lit-circle">
            <IonLabel className="circle-label">
              {/* {litRooms} */}{" "}
              {/* Descomentar para usar valor real del backend */}
              {litRooms}
            </IonLabel>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default StateCard;
