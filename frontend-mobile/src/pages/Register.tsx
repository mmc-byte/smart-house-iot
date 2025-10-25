import { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel, IonList } from "@ionic/react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHistory } from "react-router";

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const { registerUser, loading } = useAuth();
  const history = useHistory();

  // const handleChange = (e: any) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.detail.value }); // <-- e.detail.value
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log("Registrando:", form);
      const res = await registerUser(form);
      console.log("Respuesta:", res);
      history.push("/login");
    } catch (err) {
      console.error("Error registro:", err);
      alert("Error al registrar usuario");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput name="name" value={form.name} onIonChange={handleChange} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Usuario</IonLabel>
              <IonInput name="username" value={form.username} onIonChange={handleChange} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput name="email" type="email" value={form.email} onIonChange={handleChange} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput name="password" type="password" value={form.password} onIonChange={handleChange} required />
            </IonItem>
          </IonList>
          <IonButton expand="block" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};
