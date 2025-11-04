import { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel, IonList } from "@ionic/react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHistory } from "react-router";
import type { InputCustomEvent, InputInputEventDetail } from '@ionic/react';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { initializing } = useAuth();
  const history = useHistory();

  // Manejo de cambios seguro para Ionic
  const handleChange = (e: InputCustomEvent<InputInputEventDetail>) => {
    const input = e.target as HTMLIonInputElement;
    const name = input.name;
    const value = e.detail.value ?? '';
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Registrando usuario con datos:", form); // 🔹 log para depuración
      const { register } = await import("../services/authService");
      const res = await register(form);
      console.log("Registro exitoso:", res);
      alert("Usuario registrado correctamente. Ahora inicia sesión.");
      history.push("/login");
    } catch (err) {
      console.error("Error en registro:", err);
      alert("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput
                name="name"
                value={form.name}
                onIonInput={handleChange}
                required
                disabled={initializing || loading}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Usuario</IonLabel>
              <IonInput
                name="username"
                value={form.username}
                onIonInput={handleChange}
                required
                disabled={initializing || loading}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                name="email"
                type="email"
                value={form.email}
                onIonInput={handleChange}
                required
                disabled={initializing || loading}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                name="password"
                type="password"
                value={form.password}
                onIonInput={handleChange}
                required
                disabled={initializing || loading}
              />
            </IonItem>
          </IonList>

          <IonButton expand="block" type="submit" disabled={initializing || loading} className="mt-4">
            {loading ? "Registrando..." : "Registrarse"}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;

// import { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel, IonList } from "@ionic/react";
// import { useState } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { useHistory } from "react-router";


// const RegisterPage = () => {
//   const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false); // Loading local para registrar
//   const { initializing } = useAuth();
//   const history = useHistory();

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.detail.value });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       console.log("Registrando:", form);
//       const { register } = await import("../services/authService"); // importa dinámicamente
//       const res = await register(form);
//       console.log("Registro exitoso:", res);
//       alert("Usuario registrado correctamente. Ahora inicia sesión.");
//       history.push("/login");
//     } catch (err) {
//       console.error("Error registro:", err);
//       alert("Error al registrar usuario");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <IonPage>
      
//       <IonContent fullscreen className="ion-padding ion-text-center">
//         <h2>Crear cuenta</h2>
//         <form onSubmit={handleSubmit}>
//           <IonList>
//             <IonItem>
//               <IonLabel position="stacked">Nombre</IonLabel>
//               <IonInput
//                 name="name"
//                 value={form.name}
//                 onIonChange={handleChange}
//                 required
//                 disabled={initializing || loading}
//               />
//             </IonItem>
//             <IonItem>
//               <IonLabel position="stacked">Usuario</IonLabel>
//               <IonInput
//                 name="username"
//                 value={form.username}
//                 onIonChange={handleChange}
//                 required
//                 disabled={initializing || loading}
//               />
//             </IonItem>
//             <IonItem>
//               <IonLabel position="stacked">Email</IonLabel>
//               <IonInput
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onIonChange={handleChange}
//                 required
//                 disabled={initializing || loading}
//               />
//             </IonItem>
//             <IonItem>
//               <IonLabel position="stacked">Contraseña</IonLabel>
//               <IonInput
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onIonChange={handleChange}
//                 required
//                 disabled={initializing || loading}
//               />
//             </IonItem>
//           </IonList>

//           <IonButton expand="block" type="submit" disabled={initializing || loading} className="mt-4">
//             {loading ? "Registrando..." : "Registrarse"}
//           </IonButton>
//         </form>
//         </IonContent>
//     </IonPage>
//   );
// };

// export default RegisterPage;

// const RegisterPage = () => {
//   const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
//   const { registerUser, loading } = useAuth();
//   const history = useHistory();


//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.detail.value }); 
//   };
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     try {
//       console.log("Registrando:", form);
//       const res = await registerUser(form);
//       console.log("Respuesta:", res);
//       history.push("/login");
//     } catch (err) {
//       console.error("Error registro:", err);
//       alert("Error al registrar usuario");
//     }
//   };

//   return (
//     <IonPage>
//       <IonContent className="ion-padding">
//         <h2>Crear cuenta</h2>
//         <form onSubmit={handleSubmit}>
//           <IonList>
//             <IonItem>
//               <IonLabel position="stacked">Nombre</IonLabel>
//               <IonInput name="name" value={form.name} onIonChange={handleChange} required />
//             </IonItem>
//             <IonItem>
//               <IonLabel position="stacked">Usuario</IonLabel>
//               <IonInput name="username" value={form.username} onIonChange={handleChange} required />
//             </IonItem>
//             <IonItem>
//               <IonLabel position="stacked">Email</IonLabel>
//               <IonInput name="email" type="email" value={form.email} onIonChange={handleChange} required />
//             </IonItem>
//             <IonItem>
//               <IonLabel position="stacked">Contraseña</IonLabel>
//               <IonInput name="password" type="password" value={form.password} onIonChange={handleChange} required />
//             </IonItem>
//           </IonList>
//           <IonButton expand="block" type="submit" disabled={loading}>
//             {loading ? "Registrando..." : "Registrarse"}
//           </IonButton>
//         </form>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default RegisterPage;