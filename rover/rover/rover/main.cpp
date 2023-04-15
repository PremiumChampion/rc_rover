#include <cstdio>
#include <cstdlib>
#include <thread>
#include <chrono>
#include <iostream>
#include "log/Logger.h"
#include "vehicle/chainvehicle.h"
#include "RoverCommandReciever/RoverCommandReciever.h"

int main()
{
    ChainVehicle vehicle = ChainVehicle(200, 255);
    vehicle.set(90, 0);

    RoverCommandReciever rcv = RoverCommandReciever("/tmp/rover", &vehicle);

    rcv.start();

    vehicle.cleanup();
    return 0;
}