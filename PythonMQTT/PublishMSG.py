import paho.mqtt.client as mqtt
import time
import sys
#port websocket
PORT = 2532

#nom du client
client = mqtt.Client("samconnect")
#connection au broker
client.connect("91.224.148.106",PORT)
print("--------TEST MQTT WEBSOCKET--------\n\n")
while(True):
	ch = raw_input("Taper le msg que vous voulez envoyer : \n")
	nb = input("Entrez un entier correpsondant au nombre d'envoie : \n")
	y = 0
	while(y<int(nb)):
		#envoie de ch au nom de sampublie
		client.publish("sampublie",ch)
		time.sleep(0.01)
		y+=1
	print("Message envoye\n")
	client.publish("sampublie","Fin du message")
	time.sleep(1)
	ch = "a"
	while(not str(ch).isdigit()):
		ch = input("\nQuitter ? : 1 \nContinuer ? : 2\n")
	if(int(ch)==1):
		sys.exit()
		


