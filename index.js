const mqtt = require('mqtt');
const fs = require('fs');

var client = mqtt.connect('mqtt://127.0.0.1');

var record = (addNum) => {
    var waterFlow = parseFloat(fs.readFileSync('waterFlow.dat'));
    waterFlow += Number(addNum);
    waterFlow = "" + waterFlow;
    console.log(waterFlow);
    fs.writeFileSync('waterFlow.dat', waterFlow);
    return waterFlow;
}


client.on('connect', ()=>{
    client.subscribe('hass/snsr/wc0/#', (err)=>{
        if(!err){
            client.publish('hass/ctl/wc0/flowmeter', '1');
            console.log(new Date().toTimeString() + ' - MQTT Connected!!');
        }
    });  
});

client.on('message', (subject, content)=>{
    if(subject == "hass/snsr/wc0/flowmeter"){
       client.publish('hass/snsr/wc0/flowmeterTotal', record(content));
       client.publish('hass/ctl/wc0/flowmeterGotten', '1');
    }
});

