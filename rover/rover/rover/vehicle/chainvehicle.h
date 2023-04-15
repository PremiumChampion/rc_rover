#pragma once

#include "../adafruit-motor-hat/adafruitmotorhat.h"
#include <iostream>

class ChainVehicle
{
public:
	ChainVehicle(int min_speed = 200, int max_speed = 255);
	void set(int target_degrees, int power);
	void setPower(int power);
	void setTargetDegrees(int target_degrees);
	void cleanup();
private:
	void updateMotors();
	int power = 0, target_degrees = 90, min_speed = 0, max_speed = 255;
	AdafruitMotorHAT hat;
	std::shared_ptr<AdafruitDCMotor> motor_l;
	std::shared_ptr<AdafruitDCMotor> motor_r;
};

