import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useHistory } from "react-router";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
} from "@ionic/react";
import type { InputCustomEvent, InputInputEventDetail } from "@ionic/react";

const LoginPage = () => {
  const { login, initializing, isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState<"username" | "email">("username");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const history = useHistory();


  const handleChange = (e: InputCustomEvent<InputInputEventDetail>) => {
    try {
      const input = e.currentTarget as HTMLIonInputElement;
      const name = input.name;
      const value = e.detail.value ?? "";
      setForm((prev) => ({ ...prev, [name]: value }));
    } catch (err) {
      console.error("Error en handleChange:", err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await login({
        username: tab === "username" ? form.username : undefined,
        email: tab === "email" ? form.email : undefined,
        password: form.password,
      });
      history.push("/dashboard");
    } catch (err) {
      alert("Credenciales incorrectas o error de conexión");
    }
  };

  // Redirige si ya está autenticado
  if (isAuthenticated) {
    history.replace("/dashboard");
    return null;
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding ion-text-center">
       <IonText color="primary">
        <h2 >Iniciar sesión</h2>
       </IonText>
        

        <div className="flex justify-center gap-3 mb-4">
          <IonButton
            fill={tab === "username" ? "solid" : "outline"}
            onClick={() => {
              setTab("username");
            }}
          >
            Usuario
          </IonButton>
          <IonButton color="secondary"
            fill={tab === "email" ? "solid" : "outline"}
            onClick={() => {
              setTab("email");
            }}
          >
            Email
          </IonButton>
        </div>

        <form onSubmit={handleSubmit}>
          <IonList>
            {tab === "username" && (
              <IonItem>
                <IonLabel position="stacked">Usuario</IonLabel>
                <IonInput
                  name="username"
                  value={form.username}
                  onIonInput={handleChange}
                  required
                  disabled={initializing}
                />
              </IonItem>
            )}
            {tab === "email" && (
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  name="email"
                  type="email"
                  value={form.email}
                  onIonInput={handleChange}
                  required
                  disabled={initializing}
                />
              </IonItem>
            )}
            <IonItem>
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                name="password"
                type="password"
                value={form.password}
                onIonInput={handleChange}
                required
                disabled={initializing}
              />
            </IonItem>
          </IonList>

          <IonButton expand="block" type="submit" disabled={initializing}>
            {initializing ? "Cargando..." : "Iniciar sesión"}
          </IonButton>

          <p className="ion-text-center">
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;


// import {
//   IonPage,
//   IonContent,
//   IonInput,
//   IonButton,
//   IonItem,
//   IonLabel,
//   IonList,
// } from "@ionic/react";
// import { useState } from "react";
// import { useAuthStore } from "../store/authStore";
// import { useHistory } from "react-router";

// const LoginPage = () => {
//   const { login, initializing, isAuthenticated } = useAuthStore();
//   const [tab, setTab] = useState<"username" | "email">("username");
//   const [form, setForm] = useState({ username: "", email: "", password: "" });
//   const history = useHistory();

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.detail.value });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     try {
//       await login({
//         username: tab === "username" ? form.username : undefined,
//         email: tab === "email" ? form.email : undefined,
//         password: form.password,
//       });
//       console.log("Login exitoso");
//       history.push("/dashboard");
//     } catch (err) {
//       console.error("Error en login:", err);
//       alert("Credenciales incorrectas o error de conexión");
//     }
//   };

//   // Redirige si ya está autenticado
//   if (isAuthenticated) {
//     history.replace("/dashboard");
//     return null;
//   }

//   return (
//     <IonPage>
//       <IonContent fullscreen className="ion-padding ion-text-center">
//         <h2>Iniciar sesión</h2>

//         {/*  Tabs simples */}
//         <div className="flex justify-center gap-3 mb-4">
//           <IonButton
//             fill={tab === "username" ? "solid" : "outline"}
//             onClick={() => setTab("username")}
//           >
//             Usuario
//           </IonButton>
//           <IonButton
//             fill={tab === "email" ? "solid" : "outline"}
//             onClick={() => setTab("email")}
//           >
//             Email
//           </IonButton>
//         </div>

//         {/* Formulario */}
//         <form onSubmit={handleSubmit}>
//           <IonList>
//             {tab === "username" && (
//               <IonItem>
//                 <IonLabel position="stacked">Usuario</IonLabel>
//                 <IonInput
//                   name="username"
//                   value={form.username}
//                   onIonChange={handleChange}
//                   required
//                   disabled={initializing}
//                 />
//               </IonItem>
//             )}
//             {tab === "email" && (
//               <IonItem>
//                 <IonLabel position="stacked">Email</IonLabel>
//                 <IonInput
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onIonChange={handleChange}
//                   required
//                   disabled={initializing}
//                 />
//               </IonItem>
//             )}
//             <IonItem>
//               <IonLabel position="stacked">Contraseña</IonLabel>
//               <IonInput
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onIonChange={handleChange}
//                 required
//                 disabled={initializing}
//               />
//             </IonItem>
//           </IonList>

//           <IonButton expand="block" type="submit" disabled={initializing}>
//             {initializing ? "Cargando..." : "Iniciar sesión"}
//           </IonButton>

//           {/* Enlace a registro */}
//           <p className="ion-text-center">
//             ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
//           </p>
//         </form>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default LoginPage;
