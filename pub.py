import paho.mqtt.client as mqtt
import time

PORT = 2532
client = mqtt.Client("samconnect")
client.connect("91.224.148.106",PORT)
i = 0
debut=time.time()
while(i<=500):
	client.publish("sampublie","test du broker "+str(i))
	#client.publish("de-sam","")
	i+=1
	time.sleep(0.01)
fin = time.time()
temp = fin - debut
client.publish("sampublie","TEMPS ECOULE : "+str(temp))
print(str(temp))
