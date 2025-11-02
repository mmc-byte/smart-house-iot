#ifndef PROXIMITY_H
#define PROXIMITY_H

#include <Arduino.h>
#include <PubSubClient.h>
#include "servo_door.h"

// ====== Pines ======
#define TRIG_PIN 48
#define ECHO_PIN 46

// ====== Variables internas ======
bool lastCerca = false;  // Último estado detectado

void setupProximity()
{
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
}

// Devuelve la distancia en cm
int measureDistance()
{
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    int distance = duration * 0.034 / 2;
    return distance;
}

// Devuelve true si hay algo cerca (< 20 cm), con promedio de varias mediciones
bool detectObject()
{
    const int readings = 5;
    int sum = 0;
    for (int i = 0; i < readings; i++)
        sum += measureDistance();
    int distance = sum / readings;
    return (distance < 20);
}

// Llama a autoDoorControl solo si cambia el estado
void checkProximity(PubSubClient &client)
{
    bool cerca = detectObject();
    if (cerca != lastCerca)
    {
        autoDoorControl(cerca, client);
        lastCerca = cerca;
    }
}

#endif

// #ifndef PROXIMITY_H
// #define PROXIMITY_H

// #include <Arduino.h>
// #include <PubSubClient.h>
// #include "servo_door.h"

// // ====== Pines ======
// #define TRIG_PIN 11
// #define ECHO_PIN 12

// void setupProximity()
// {
//     pinMode(TRIG_PIN, OUTPUT);
//     pinMode(ECHO_PIN, INPUT);
// }

// // Devuelve true si hay algo cerca (< 20 cm)
// bool detectObject()
// {
//     digitalWrite(TRIG_PIN, LOW);
//     delayMicroseconds(2);
//     digitalWrite(TRIG_PIN, HIGH);
//     delayMicroseconds(10);
//     digitalWrite(TRIG_PIN, LOW);

//     long duration = pulseIn(ECHO_PIN, HIGH);
//     int distance = duration * 0.034 / 2;
//     return (distance < 20);
// }

// // Chequea periódicamente la distancia
// void checkProximity(PubSubClient &client)
// {
//     bool cerca = detectObject();
//     autoDoorControl(cerca, client);
// }

// #endif
