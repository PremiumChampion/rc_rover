#include <stdio.h>
#include <cstdlib>
#include <thread>
#include <chrono>
#include <iostream>
#include "../vehicle/chainvehicle.h"

#pragma once
class RoverCommandReciever
{
private:
    int read_pipe = -1;
    std::string pathname;
    ChainVehicle* vehicle;
    bool running;
    bool parse(int* command, int* direction, int* power);
    void exec(int command, int direction, int power);

public:
    RoverCommandReciever(std::string pathname, ChainVehicle* vehicle);
    ~RoverCommandReciever();
    void start();
};

