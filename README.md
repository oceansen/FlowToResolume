# Flow to Resolume 
A cross-platform webbluetooth solution to connect the Flow sensors to Resolume via an OSC bridge.

To use web bluetooth and web osc
need to install osc-web\

Has certain dependencies, node and socket: <p>

https://nodejs.org/en/ <p>

Installation:<p>
$ git clone git://github.com/automata/osc-web.git <p>
$ cd osc-web/ <p>
$ npm install <p>
<p>
Using: <p>
$ cd osc-web <p>
$ node bridge.js <p>

This starts osc-web and must run in the background.<p>

Step 1: Open index.html in the Chrome Browser and connect to sensors (two sensors in this example)


![Connection to bluetooth](https://github.com/sensimula/FlowToResolume/blob/master/connectionWebBluetooth.png)


Step 2: Observe data in osc bridge

![Receiving OSC messages](https://github.com/sensimula/FlowToResolume/blob/master/receivingOSC.png)

Step 3: Observe changes in Resolume (see BPM for example)

![Observe changes in Resolume](https://github.com/sensimula/FlowToResolume/blob/master/resolumeReceivingData.png)


Step 4: You can change the address of OSC messages in Resolume by editing socket.emit statements in sketchBluetooth.js
One can also receiving data from more than two sensors based on the code below.

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
