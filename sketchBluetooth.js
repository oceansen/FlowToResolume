/* 
Web bluetooth api script for BreathZpot sensors. 
Adapted from the following source: https://googlechrome.github.io/samples/web-bluetooth/notifications-async-await.html

Copyright 2019 Eigil Aandahl

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

var myCharacteristic;
var bluetoothDevice;
var devices = {};

async function onButtonClick() {
  let serviceUuid = 0xffb0; // BreathZpot service
    serviceUuid = parseInt(serviceUuid);

  let characteristicUuid = 0xffb3; // BreathZpot characteristic
    characteristicUuid = parseInt(characteristicUuid);

  try {
    console.log('Requesting Bluetooth Device...');
   // const device = await navigator.bluetooth.requestDevice({
   //     filters: [{services: [serviceUuid]}]});
   const device = await navigator.bluetooth.requestDevice({
      filters: [{services: [serviceUuid]}]}).then(device => {
        bluetoothDevice = device;
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
        connect();
      })
      .catch(error => {
        console.log('Argh! ' + error);
      });

    console.log('Connecting to GATT Server...');
    const server = await bluetoothDevice.gatt.connect();

    console.log('Getting Service...');
    const service = await server.getPrimaryService(serviceUuid);

    console.log('Getting Characteristic...');
    myCharacteristic = await service.getCharacteristic(characteristicUuid);

    await myCharacteristic.startNotifications();

    console.log('> Notifications started');
    myCharacteristic.addEventListener('characteristicvaluechanged',
        handleNotifications);
  } catch(error) {
    console.log('Argh! ' + error);
  }
}

async function onStopButtonClick() {
  if (myCharacteristic) {
    try {
      await myCharacteristic.stopNotifications();
      console.log('> Notifications stopped');
      myCharacteristic.removeEventListener('characteristicvaluechanged',
          handleNotifications);
    } catch(error) {
      console.log('Argh! ' + error);
    }
  }
}

function handleNotifications(event) {
  let value = event.target.value;
  let id = event.target.service.device.id;
  let int16View = new Int16Array(value.buffer);

  Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};


  // TextDecoder to process raw data bytes.
  for (let i = 0; i < 7; i++) {
    //Takes the 7 first values as 16bit integers from each notification
    //This is then sent as a string with a sensor signifier as OSC using osc-web

    iput = ((int16View[i]/4096)).toFixedDown(2);
    
    //Assign arriving sensor data to respective device
    devices[id.toString()] = iput;
    if(devices[Object.keys(devices)[0]]!=undefined)
    {
      sensor1Value = devices[Object.keys(devices)[0]];
     
      console.log(sensor1Value);
    }
    if(devices[Object.keys(devices)[1]]!=undefined)
    {
      sensor2Value  = devices[Object.keys(devices)[1]];
      
      console.log(sensor2Value);
    }
    // Add more statements like this for the six sesnors

    //Send data to two different OSC addresses in Resolume
    socket.emit('message', "/composition/tempocontroller/tempo" + sensor1Value.toString());
    socket.emit('message', "/composition/master" + sensor2Value.toString());
   
	
  }



}

function connect() {
  exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
    function toTry() {
      time('Connecting to Bluetooth Device... ');
      return bluetoothDevice.gatt.connect();
    },
    function success() {
      log('> Bluetooth Device connected. Try disconnect it now.');
    },
    function fail() {
      time('Failed to reconnect.');
    });
}

function onDisconnected() {
  log('> Bluetooth Device disconnected');
  connect();
}

/* Utils */

// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
function exponentialBackoff(max, delay, toTry, success, fail) {
  toTry().then(result => success(result))
  .catch(_ => {
    if (max === 0) {
      return fail();
    }
    time('Retrying in ' + delay + 's... (' + max + ' tries left)');
    setTimeout(function() {
      exponentialBackoff(--max, delay * 2, toTry, success, fail);
    }, delay * 1000);
  });
}

function time(text) {
  log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
}