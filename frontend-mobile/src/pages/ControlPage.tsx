import React, { useEffect, useState } from "react";
import {IonPage, IonButton, IonIcon, IonGrid, IonRow, IonCol,} from "@ionic/react";
import { homeOutline } from "ionicons/icons";
import { motion } from "framer-motion";
import { getRoomsByHouse } from "../services/roomService";
import { getDevicesByRoom } from "../services/deviceService";
import { useAuthStore } from "../store/authStore";

import  DeviceCard  from "../components/DeviceCard";
import  AppHeader  from "../components/AppHeader"; 

interface Room {
  id: number;
  name: string;
}

interface Device {
  id: number;
  name: string;
  type: string;
  room_id: number;
}

const ControlPage: React.FC = () => {
  const { user } = useAuthStore();
  const houseId = user.houses_link[0].house_id;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number>(1);


  useEffect(() => {
    const loadRoomsAndDevices = async () => {
        try {
          const roomsData: Room[] = await getRoomsByHouse(houseId);

          // Ordena para que el global (id = 0) quede primero
          const sortedRooms = roomsData.sort((a, b) => a.id - b.id);
          setRooms(sortedRooms);

          // Cargar devices de todos los rooms
          const allDevices: Device[] = [];
          for (const room of sortedRooms) {
            const roomDevices = await getDevicesByRoom(room.id);
            allDevices.push(...roomDevices);
          }
          setDevices(allDevices);
        } catch (err) {
          console.error("Error loading rooms/devices:", err);
        }
    };

    loadRoomsAndDevices();
  }, [user, houseId]);

  const handleRoomClick = (roomId: number) => {
    setSelectedRoom(roomId);
  };

  // 🔹 Filtra solo los del room seleccionado y excluye los tipo 'sensor'
  const filteredDevices = devices.filter(
    (device) => device.room_id === selectedRoom && device.type !== "sensor"
  );

  return (
    <IonPage>
      <AppHeader />

      {/* Selector de Rooms */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {rooms.map((room) => (
          <IonButton
            key={room.id}
            fill={selectedRoom === room.id ? "solid" : "outline"}
            onClick={() => handleRoomClick(room.id)}
          >
            {/* Icono + nombre especial si es Global */}
            {room.id === 1 ? (
              <>
                <IonIcon icon={homeOutline} slot="start" />
                Global
              </>
            ) : (
              room.name
            )}
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <DeviceCard device={device} />
              </motion.div>
            </IonCol>
          ))}

          {/*  En caso de que no haya devices visibles */}
          {filteredDevices.length === 0 && (
            <IonCol size="12" className="text-center text-gray-500 py-4">
              No hay dispositivos disponibles en esta habitación.
            </IonCol>
          )}
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

export default ControlPage;
// const ControlPage: React.FC = () => {
//   const { user } = useAuthStore();
//   const houseId = user.houses_link[0].house_id;
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [devices, setDevices] = useState<any[]>([]);
//   const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
//   const environment = "lan";

//   useEffect(() => {
//     const loadRoomsAndDevices = async () => {
//       if (environment === "lan") {
//         try {
//           const roomsData = await getRoomsByHouse(houseId);

//           // Ordenar los rooms para que el "global" (id = 0) aparezca primero
//           const sortedRooms = roomsData.sort((a: any, b: any) => a.id - b.id);
//           setRooms(sortedRooms);

//           // Seleccionar por defecto el room global (id = 0)
//           setSelectedRoom(0);

//           // Cargar devices de todos los rooms
//           const allDevices: any[] = [];
//           for (const room of sortedRooms) {
//             const roomDevices = await getDevicesByRoom(room.id);
//             allDevices.push(...roomDevices);
//           }
//           setDevices(allDevices);
//         } catch (err) {
//           console.error("Error loading rooms/devices:", err);
//         }
//       }
//     };

//     loadRoomsAndDevices();
//   }, [user]);

//   const handleRoomClick = (roomId: number) => {
//     setSelectedRoom(roomId);
//   };

//   // Filtrar devices por room seleccionado
//   const filteredDevices = devices.filter(
//     (device) => device.room_id === selectedRoom
//   );

//   return (
//     <IonPage>
//       <AppHeader />

//       {/* Selector de Rooms */}
//       <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//         {rooms.map((room) => (
//           <IonButton
//             key={room.id}
//             fill={selectedRoom === room.id ? "solid" : "outline"}
//             onClick={() => handleRoomClick(room.id)}
//           >
//             {/* Muestra ícono si es el global */}
//             {room.id === 0 && <IonIcon icon={homeOutline} slot="start" />}
//             {room.name}
//           </IonButton>
//         ))}
//       </div>

//       {/* Grid de Devices */}
//       <IonGrid>
//         <IonRow>
//           {filteredDevices.map((device) => (
//             <IonCol
//               key={device.id}
//               size="6"
//               sizeMd="4"
//               sizeLg="3"
//               className="flex justify-center"
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <DeviceCard device={device} />
//               </motion.div>
//             </IonCol>
//           ))}
//         </IonRow>
//       </IonGrid>
//     </IonPage>
//   );
// };

// export default ControlPage;