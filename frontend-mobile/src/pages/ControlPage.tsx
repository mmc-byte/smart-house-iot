import React, { useEffect, useState } from "react";
import {IonPage, IonButton, IonIcon, IonGrid, IonRow, IonCol,} from "@ionic/react";
import { homeOutline } from "ionicons/icons";
import { motion } from "framer-motion";
import { getRoomsByHouse } from "../services/roomService";
import { getDevicesByRoom } from "../services/deviceService";
import { useAuthStore } from "../store/authStore";

import  DeviceCard  from "../components/DeviceCard";
import  AppHeader  from "../components/AppHeader"; 

const ControlPage: React.FC = () => {
  
  const { user } = useAuthStore();

  const houseId= user.houses_link[0].house_id;
  const [rooms, setRooms] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | "global">("global");
  const environment = "lan";
//^^^ Cambiar a local si se quiere usar los dummy

  // Simulación o fetch real
  useEffect(() => {
    const loadRoomsAndDevices = async () => {
      if (environment === "lan") {
          try {
          const roomsData = await getRoomsByHouse(houseId);
          setRooms(roomsData);

          // Si es global, carga todos los devices
          const allDevices = [];
          
          for (const room of roomsData) {
            const roomDevices = await getDevicesByRoom(room.id);
            allDevices.push(...roomDevices);
          }
          setDevices(allDevices);
        } catch (err) {
          console.error("Error loading rooms/devices:", err);
        }
      } else {
        // Dummy local data (modo entorno 1)
        const dummyRooms = [
          { id: 1, name: "Sala" },
          { id: 2, name: "Cocina" },
          { id: 3, name: "Dormitorio" },
        ];
        const dummyDevices = [
          { id: 1, name: "Luz principal", type: "led", roomId: 1 },
          { id: 2, name: "Sensor temp", type: "sensor", roomId: 1 },
          { id: 3, name: "Cámara", type: "camera", roomId: 3 },
        ];
        setRooms(dummyRooms);
        setDevices(dummyDevices);
      }
    };

    loadRoomsAndDevices();
  }, [user]);

  const handleRoomClick = (roomId: number | "global") => {
    setSelectedRoom(roomId);
  };

  // Filtra devices según room
  const filteredDevices =
    selectedRoom === "global"
      ? devices
      : devices.filter((d) => d.room_id === selectedRoom);
  return (
    <IonPage>
      <AppHeader />

        {/* Selector de Rooms */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <IonButton
            fill={selectedRoom === "global" ? "solid" : "outline"}
            onClick={() => handleRoomClick("global")}
          >
            <IonIcon icon={homeOutline} slot="start" />
            Global
          </IonButton>

          {rooms.map((room) => (
            <IonButton
              key={room.id}
              fill={selectedRoom === room.id ? "solid" : "outline"}
              onClick={() => handleRoomClick(room.id)}
            >
              {room.name} 
              
            </IonButton>
          ))}
        </div>

        {/* Grid de Devices */}
        <IonGrid>
          <IonRow>
            {filteredDevices.map((device) => (
              <IonCol
                key={device.id}
                size="6"
                sizeMd="4"
                sizeLg="3"
                className="flex justify-center"
              >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {/* version LAN - cambiar 'local' a 'lan'*/}
                  <DeviceCard device={device} environment="lan" /> 
                </motion.div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

    </IonPage>
  );
};
export default ControlPage;