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

Step 3: Observe changes in Resolume

![Observe changes in Resolume](https://github.com/sensimula/FlowToResolume/blob/master/resolumeReceivingData.png)
