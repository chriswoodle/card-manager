const int doorClosedPin = 2;
const int lockPin = 3;

int incomingByte = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("$");
  pinMode(doorClosedPin, INPUT);
  pinMode(lockPin, OUTPUT);
  digitalWrite(lockPin, HIGH);
}

void loop() {
  // check door is closed
  int doorClosedState = digitalRead(doorClosedPin);
  if (doorClosedState == HIGH) {
    digitalWrite(lockPin, HIGH);
  }
  if (Serial.available() > 0) {
    // read the incoming byte:
    incomingByte = Serial.read();
    if (incomingByte == 'U') {
      Serial.println("#");
      digitalWrite(lockPin, LOW);
      delay(5000);
    }
  }
  // slow down
  delay(50);
}