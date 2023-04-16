# rc_rover

## platform

This project is intended to be run on a jetbot/jetson-nano.

## project: rover

* type: C++
* compile on target server machine
* copy binary exec-into `./server/exec` with name `rover`
* creates a named pipe `/tmp/rover`
* requires PCA9685 on `/dev/i2c-1` with address `0x60` like [Waveshare Jetbot](https://www.waveshare.com/wiki/JetBot_AI_Kit)
* __code durchschauen__

### command structure

__NO CHECKS OR VALIDATION VIA PIPE MIGHT THROW ERRORS ...__

* `0\n`
  * -> stop server
* `1 angle speed\n` -> set angle and speed 
  * `angle` INT 0..360 deg (0: turn right, 90: forward, 180: turn left, 270: backwards, and anything inbetween)
  * `speed` INT 0..100 in % (0: no movement, 100 full speed, and anything inbetween)

## project server

* type: nodejs
* version: 16.x
* build using `npm run build:prod` -> build/ directory
* execute `index.mjs`
* env:
  * `PORT`: INT any port will do

### events 
  * `socket.emit("rover", angle, power)` -> replay an rover named pipe

### tasks

* serves static UI files
* provides socketio connection

## project web

* type: react-app
* version: 16.x
* build using `npm run build` -> copy build directory to `./server/static`
* contains UI

## Build sequence

1. project: rover
2. project: web
3. project: server (requires build results from rover and web)
