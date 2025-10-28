#ifndef PROXIMITY_H
#define PROXIMITY_H

#include <Arduino.h>
#include <NewPing.h>
#include <PubSubClient.h>
#include "servo_door.h"
#include "config.h"

#define TRIGGER_PIN 9
#define ECHO_PIN 10
#define MAX_DISTANCE 200

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
unsigned long lastCheck = 0;
bool doorOpen = false;

void setupProximity() {
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void checkProximity(PubSubClient& client) {
  unsigned long now = millis();
  if (now - lastCheck < 1000) return;  // cada 1 segundo
  lastCheck = now;

  int distance = sonar.ping_cm();
  if (distance > 0 && distance < 30) { // si hay objeto cerca
    if (!doorOpen) {
      handleServoDoor("OPEN", SERVO_PIN_PUERTA_GARAJE);
      client.publish(TOPIC_PUBLISH_PUERTA_GARAJE, "OPEN");
      doorOpen = true;
    }
  } else if (doorOpen) {
    handleServoDoor("CLOSE", SERVO_PIN_PUERTA_GARAJE);
    client.publish(TOPIC_PUBLISH_PUERTA_GARAJE, "CLOSE");
    doorOpen = false;
  }
}

#endif
