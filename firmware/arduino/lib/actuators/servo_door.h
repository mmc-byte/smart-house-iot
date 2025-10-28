#ifndef SERVO_DOOR_H
#define SERVO_DOOR_H

#include <Servo.h>

#define SERVO_PIN_PUERTA_PRINCIPAL 7
#define SERVO_PIN_PUERTA_GARAJE 8

Servo servoPuertaPrincipal;
Servo servoPuertaGaraje;

void setupServos() {
  servoPuertaPrincipal.attach(SERVO_PIN_PUERTA_PRINCIPAL);
  servoPuertaGaraje.attach(SERVO_PIN_PUERTA_GARAJE);
}

// Controla el movimiento de un servo según mensaje MQTT
void handleServoDoor(String message, int pin) {
  Servo* servo;
  if (pin == SERVO_PIN_PUERTA_PRINCIPAL) servo = &servoPuertaPrincipal;
  else servo = &servoPuertaGaraje;

  if (message == "OPEN") {
    servo->write(90);
  } else if (message == "CLOSE") {
    servo->write(0);
  }
}

#endif
