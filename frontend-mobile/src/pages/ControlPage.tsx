import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { getRoomsByHouse } from "../services/roomService";
import { getDevicesByRoom } from "../services/deviceService";

const ControlPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [rooms, setRooms] = useState<any[]>([]);
  const [devices, setDevices] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Obtiene ID de la casa del usuario (houses_link viene de profile definido en authStore usando getCurrentUser -definido en authService- que retorna propiedades entre ellas houses_link
        const houseId = user?.houses_link?.[0]?.house_id;
        console.log("house id : ", houseId) //imprime 1
        if (!houseId) return;

        //  Get Rooms
        const fetchedRooms = await getRoomsByHouse(houseId);
        setRooms(fetchedRooms);

        // Get devices por room
        const devicesByRoom: Record<number, any[]> = {};
        for (const room of fetchedRooms) {
          const fetchedDevices = await getDevicesByRoom(room.id);
          devicesByRoom[room.id] = fetchedDevices;
        }
        setDevices(devicesByRoom);
      } catch (err) {
        console.error("Error cargando rooms/devices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel de Control </h1>
      {rooms.map((room) => (
        <div key={room.id} style={{ marginBottom: "1rem" }}>
          <h2>{room.name.toUpperCase()}</h2>
          {devices[room.id]?.length ? (
            <ul>
              {devices[room.id].map((dev) => (
                <li key={dev.id}>
                  {dev.name} — tipo: {dev.type}
                  <br />
                  <small>
                    Cmd: {dev.command_topic}
                    <br />
                    State: {dev.state_topic}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin dispositivos</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ControlPage;

// const ControlPage: React.FC = () => {
//   return (
//     <div style={{ textAlign: "center", marginTop: "40vh" }}>
//       <h1>Control Page</h1>
//     </div>
//   );
// };

// export default ControlPage;