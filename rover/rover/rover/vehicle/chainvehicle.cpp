#include "chainvehicle.h"
#include "../adafruit-motor-hat/util.h"

ChainVehicle::ChainVehicle(int min_speed, int max_speed) : hat()
{
	this->min_speed = min_speed;
	this->max_speed = max_speed;
	motor_l = hat.getMotor(1);
	motor_r = hat.getMotor(2);
}

void ChainVehicle::set(int target_degrees, int power)
{
	this->power = power % 101; //0..100
	this->target_degrees = (target_degrees % 360) + 360 % 360;
	this->updateMotors();
}

void ChainVehicle::setPower(int power)
{
	this->power = power % 101;
	this->updateMotors();
}

void ChainVehicle::setTargetDegrees(int target_degrees)
{
	this->target_degrees = (target_degrees % 360) + 360 % 360;
	this->updateMotors();
}

void ChainVehicle::cleanup()
{
	motor_l->setCommand(AdafruitDCMotor::COAST);
	motor_r->setCommand(AdafruitDCMotor::COAST);
}

void ChainVehicle::updateMotors()
{
	int new_target_degrees = std::abs(this->target_degrees + 360) % 360;
	int motor_l_virtual_speed = 0;
	int motor_r_virtual_speed = 0;


#pragma region left motor
	if (new_target_degrees >= 0 && new_target_degrees <= 90)
	{
		motor_l_virtual_speed = 255;
	}
	else if (new_target_degrees > 90 && new_target_degrees <= 180)
	{
		double dx = 180 - 90;
		double dy = -255 - 255;

		double dNewDirection = new_target_degrees - 90;
		double steigung = dy / dx;

		motor_l_virtual_speed = 255 + steigung * dNewDirection;
	}
	else if (new_target_degrees > 180 && new_target_degrees <= 270)
	{
		motor_l_virtual_speed = -255;
	}
	else if (new_target_degrees > 270 && new_target_degrees <= 360)
	{
		double dx = 360 - 270;
		double dy = 255 - (-255);

		double dNewDirection = new_target_degrees - 270;
		double steigung = dy / dx;

		motor_l_virtual_speed = -255 + steigung * dNewDirection;
	}
#pragma endregion
#pragma region right motor
	if (new_target_degrees >= 0 && new_target_degrees <= 90)
	{
		double dx = 90 - 0;
		double dy = 255 - (-255);

		double dNewDirection = new_target_degrees - 0;
		double steigung = dy / dx;

		motor_r_virtual_speed = -255 + steigung * dNewDirection;
	}
	else if (new_target_degrees > 90 && new_target_degrees <= 180)
	{
		motor_r_virtual_speed = 255;
	}
	else if (new_target_degrees > 180 && new_target_degrees <= 270)
	{
		double dx = 270 - 180;
		double dy = -255 - 255;

		double dNewDirection = new_target_degrees - 180;
		double steigung = dy / dx;

		motor_r_virtual_speed = 255 + steigung * dNewDirection;
	}
	else if (new_target_degrees > 270 && new_target_degrees <= 360)
	{
		motor_r_virtual_speed = -255;
	}
#pragma endregion

	int new_max_speed = util::map(this->power, 0, 100, this->min_speed - 1, this->max_speed);

	motor_l_virtual_speed = util::map(std::abs(motor_l_virtual_speed), 0, 255, this->min_speed - 1, new_max_speed) * (motor_l_virtual_speed > 0 ? 1 : -1);
	int motor_l_real_speed = std::abs(motor_l_virtual_speed);
	if (motor_l_real_speed < this->min_speed) {
		motor_l_virtual_speed = 0;
		motor_l_real_speed = 0;
	}

	motor_r_virtual_speed = util::map(std::abs(motor_r_virtual_speed), 0, 255, this->min_speed - 1, new_max_speed) * (motor_r_virtual_speed > 0 ? 1 : -1);
	int motor_r_real_speed = std::abs(motor_r_virtual_speed);
	if (motor_r_real_speed < this->min_speed) {
		motor_r_virtual_speed = 0;
		motor_r_real_speed = 0;
	}


	AdafruitDCMotor::Command motor_l_command = AdafruitDCMotor::COAST;
	AdafruitDCMotor::Command motor_r_command = AdafruitDCMotor::COAST;

	if (motor_l_virtual_speed > 0)
		motor_l_command = AdafruitDCMotor::FORWARD;

	// Motor should move backwards
	if (motor_l_virtual_speed < 0)
		motor_l_command = AdafruitDCMotor::REVERSE;

	// Motor should stop
	if (motor_l_virtual_speed == 0)
		motor_l_command = AdafruitDCMotor::BRAKE;

	if (motor_r_virtual_speed > 0)
		motor_r_command = AdafruitDCMotor::FORWARD;

	// Motor should move backwards
	if (motor_r_virtual_speed < 0)
		motor_r_command = AdafruitDCMotor::REVERSE;

	// Motor should stop
	if (motor_r_virtual_speed == 0)
		motor_r_command = AdafruitDCMotor::BRAKE;

	this->motor_l->set(motor_l_real_speed, motor_l_command);
	this->motor_r->set(motor_r_real_speed, motor_r_command);
}
