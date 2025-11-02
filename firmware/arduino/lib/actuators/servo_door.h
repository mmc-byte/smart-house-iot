#ifndef SERVO_DOOR_H
#define SERVO_DOOR_H

#include <Arduino.h>
#include <Servo.h>
#include <PubSubClient.h>
#include "config.h"

// ====== Pines ======
#define SERVO_PIN_PUERTA_PRINCIPAL 7
#define SERVO_PIN_PUERTA_GARAJE 8
#define LED_VERDE_PIN 9
#define LED_ROJO_PIN 10

// ====== Objetos Servo ======
Servo servoPrincipal;
Servo servoGaraje;

// ====== Variables de estado ======
int anguloPrincipal = 0;  // 0 = cerrado, 90 = abierto
int anguloGaraje = 0;     // 0 = cerrado, 90 = abierto

// ====== Inicialización ======
void setupServos()
{
    servoPrincipal.attach(SERVO_PIN_PUERTA_PRINCIPAL);
    servoGaraje.attach(SERVO_PIN_PUERTA_GARAJE);

    pinMode(LED_VERDE_PIN, OUTPUT);
    pinMode(LED_ROJO_PIN, OUTPUT);

    digitalWrite(LED_VERDE_PIN, LOW);
    digitalWrite(LED_ROJO_PIN, LOW);

    servoPrincipal.write(anguloPrincipal);
    servoGaraje.write(anguloGaraje);
}

// ====== Función auxiliar: publicar estado real del servo ======
void publishDoorState(PubSubClient &client, const char *stateTopic, int angle)
{
    String state = (angle >= 90) ? "on" : "off";
    client.publish(stateTopic, state.c_str());
}

// ====== Control manual por MQTT ======
void handleServoDoor(String message, int servoPin, PubSubClient &client, const char *stateTopic)
{
    Servo *servo = (servoPin == SERVO_PIN_PUERTA_PRINCIPAL) ? &servoPrincipal : &servoGaraje;
    int *angulo = (servoPin == SERVO_PIN_PUERTA_PRINCIPAL) ? &anguloPrincipal : &anguloGaraje;

    if (message.equalsIgnoreCase("on"))
        *angulo = 90;
    else if (message.equalsIgnoreCase("off"))
        *angulo = 0;

    servo->write(*angulo);

    // Publica estado real
    publishDoorState(client, stateTopic, *angulo);
}

// ====== Control automático (por proximidad) ======
void autoDoorControl(bool objetoCercano, PubSubClient &client)
{
    if (objetoCercano)
    {
        anguloGaraje = 90;
        servoGaraje.write(anguloGaraje);
        digitalWrite(LED_VERDE_PIN, HIGH);
        digitalWrite(LED_ROJO_PIN, LOW);
    }
    else
    {
        anguloGaraje = 0;
        servoGaraje.write(anguloGaraje);
        digitalWrite(LED_VERDE_PIN, LOW);
        digitalWrite(LED_ROJO_PIN, HIGH);
    }

    // Publica estado real
    publishDoorState(client, TOPIC_GARAJE_PUERTA_STATE, anguloGaraje);
}

#endif

// #ifndef SERVO_DOOR_H
// #define SERVO_DOOR_H

// #include <Arduino.h>
// #include <Servo.h>
// #include <PubSubClient.h>
// #include "config.h"

// // ====== Pines ======
// #define SERVO_PIN_PUERTA_PRINCIPAL 7
// #define SERVO_PIN_PUERTA_GARAJE 8
// #define LED_VERDE_PIN 9
// #define LED_ROJO_PIN 10

// Servo servoPrincipal;
// Servo servoGaraje;

// // ====== Inicialización ======
// void setupServos()
// {
//     servoPrincipal.attach(SERVO_PIN_PUERTA_PRINCIPAL);
//     servoGaraje.attach(SERVO_PIN_PUERTA_GARAJE);

//     pinMode(LED_VERDE_PIN, OUTPUT);
//     pinMode(LED_ROJO_PIN, OUTPUT);

//     digitalWrite(LED_VERDE_PIN, LOW);
//     digitalWrite(LED_ROJO_PIN, LOW);
// }

// // ====== Control manual por MQTT ======
// void handleServoDoor(String message, int servoPin, PubSubClient &client, const char *stateTopic)
// {
//     Servo *servo = (servoPin == SERVO_PIN_PUERTA_PRINCIPAL) ? &servoPrincipal : &servoGaraje;

//     if (message == "on")
//         servo->write(90);
//     else if (message == "off")
//         servo->write(0);

//     String state = (message == "on") ? "on" : "off";
//     client.publish(stateTopic, state.c_str());
// }

// // ====== Control automático (por proximidad) ======
// void autoDoorControl(bool objetoCercano, PubSubClient &client)
// {
//     if (objetoCercano)
//     {
//         servoGaraje.write(90);
//         digitalWrite(LED_VERDE_PIN, HIGH);
//         digitalWrite(LED_ROJO_PIN, LOW);
//         client.publish(TOPIC_GARAJE_PUERTA_STATE, "on");
//     }
//     else
//     {
//         servoGaraje.write(0);
//         digitalWrite(LED_VERDE_PIN, LOW);
//         digitalWrite(LED_ROJO_PIN, HIGH);
//         client.publish(TOPIC_GARAJE_PUERTA_STATE, "off");
//     }
// }

// #endif
