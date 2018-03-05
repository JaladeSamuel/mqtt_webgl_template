import serial
import paho.mqtt.client as mqtt

client = mqtt.Client("toto")
client.username_pw_set("student", "student")
client.connect("iot.iut-blagnac.fr", 1883)

#on ouvre le port usb
capteur = serial.Serial('/dev/ttyACM0', baudrate=115200)

print (capteur.name)
while(True):
	coord = capteur.readline()
	x,y,z = coord.split(";")
	client.publish("sandbox/templateToto",str(x))
	client.publish("sandbox/templateToto",str(y))
	client.publish("sandbox/templateToto",str(z))
