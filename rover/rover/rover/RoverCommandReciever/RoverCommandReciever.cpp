#include "RoverCommandReciever.h"
#include "../log/Logger.h"
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>
#include <iomanip>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sstream>

bool exists(const std::string& name);
std::string read_string(int file);
std::string read_including_seperator(int file, char seperator);

bool exists(const std::string& name) {
    struct stat buffer;
    return (stat(name.c_str(), &buffer) == 0);
}


std::string read_string(int file)
{
    return read_including_seperator(file, '\0');
}

std::string read_including_seperator(int file, char seperator)
{
    int readFROM = file;

    std::string output = "";

    char buffer[1];
    int done_reading = 0;

    do
    {
        int read_result = read(readFROM, &buffer, 1);

        if (read_result == -1 || read_result == 0)
            continue;

        if (buffer[0] == '\n')
        {
            done_reading = 1;
        }

        if (buffer[0] > 127)
            continue;

        output.push_back(buffer[0]);
    } while (done_reading == 0);

    return output;
}


RoverCommandReciever::RoverCommandReciever(std::string pathname, ChainVehicle* vehicle)
{
    this->vehicle = vehicle;
    this->pathname = pathname;
    if (exists(pathname)) {
        Logger::info("named pipe already exists");
        return;
    }

    if (mkfifo(pathname.c_str(), S_IRWXU | S_IRWXO | S_IRWXG) != 0) {
        Logger::error("Could not create named pipe");
    }
}

RoverCommandReciever::~RoverCommandReciever()
{
    if (this->read_pipe) {
        close(this->read_pipe);
    }

    remove(this->pathname.c_str());
}

void RoverCommandReciever::start()
{
    if ((this->read_pipe = open(this->pathname.c_str(), O_RDONLY | O_NONBLOCK)) < 0) {
        Logger::error("Could not open named pipe for reading");
        this->read_pipe = -1;
        return;
    }

    int command, direction, power;
    this->running = true;


    while (this->running) {
        if (this->parse(&command, &direction, &power)) {
            this->exec(command, direction, power);
        }
    }

}

bool RoverCommandReciever::parse(int* command, int* direction, int* power)
{
    std::string line = read_string(this->read_pipe);

    std::stringstream buf1;

    buf1 << line;


    Logger::info(line);

    buf1 >> *command;

    if (buf1.tellp() == std::streampos(0)) {
        return true;
    }
    buf1 >> *direction;
    if (buf1.tellp() == std::streampos(0)) {
        return false;
    }
    buf1 >> *power;
    return true;
}

void RoverCommandReciever::exec(int command, int direction, int power)
{
    switch (command) {
    case 0: // exit
        this->running = false;
        Logger::info("Exiting...");
        break;
    case 1: // set
        this->vehicle->set(direction, power);
        Logger::info("Setting...");
        break;
    default:
        break;
    }
}
