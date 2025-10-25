import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
} from "@ionic/react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHistory } from "react-router";

export const LoginPage = () => {
  const { loginUser, loading, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<"username" | "email">("username");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const history = useHistory();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await loginUser({
        username: tab === "username" ? form.username : undefined,
        email: tab === "email" ? form.email : undefined,
        password: form.password,
      });
      history.push("/home");
    } catch (err) {
      alert("Credenciales incorrectas o error de conexión");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Iniciar sesión</h2>

        {/* Tabs de login */}
        <div className="flex justify-center gap-3 mb-4">
          <IonButton
            fill={tab === "username" ? "solid" : "outline"}
            onClick={() => setTab("username")}
          >
            Usuario
          </IonButton>
          <IonButton
            fill={tab === "email" ? "solid" : "outline"}
            onClick={() => setTab("email")}
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
                  onIonChange={handleChange}
                  required
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
                  onIonChange={handleChange}
                  required
                />
              </IonItem>
            )}
            <IonItem>
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                name="password"
                type="password"
                value={form.password}
                onIonChange={handleChange}
                required
              />
            </IonItem>
          </IonList>

          <IonButton
            expand="block"
            type="submit"
            disabled={loading}
            className="mt-4"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </IonButton>
        </form>

        <div className="ion-text-center mt-4">
          <p>
            ¿No tienes cuenta?{" "}
            <a onClick={() => history.push("/register")}>Regístrate aquí</a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};
