import React, { useEffect, useState } from "react";
import { IonPage, IonHeader, IonTitle, IonContent, IonToolbar } from "@ionic/react";
import { getDevicesByRoom } from "../services/deviceService";
import MqttTestButton from "../components/MqttTestButton";

interface Device {
  id: number;
  name: string;
  room_id: number;
  command_topic: string;
  state_topic: string;
}

const ControlPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Por ahora puedes usar un room_id fijo o pasado por contexto/estado
        const data = await getDevicesByRoom(3);       
        setDevices(data);
      } catch (error) {
        console.error("Error loading devices:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDevices();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Control de Dispositivos</IonTitle>
        </IonToolbar>
      </IonHeader>

        {loading ? (
          <p>Cargando dispositivos...</p>
        ) : devices.length === 0 ? (
          <p>No hay dispositivos registrados.</p>
        ) : (
          devices.map((device) => (
            
            <div key={device.id} className="p-3 border-b">
              <h2 className="text-lg font-semibold">{device.name}</h2>
              <p className="text-sm text-gray-500">
                Topic: <code>{device.command_topic}</code>
              </p>
              <MqttTestButton deviceId={device.id} />
            </div>
          ))
        )}
    </IonPage>
  );
};

export default ControlPage;