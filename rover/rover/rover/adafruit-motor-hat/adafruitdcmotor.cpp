/**
 *  adafruitdcmotor.cpp
 *
 *  MIT License
 *
 *  Copyright (c) 2018, Tom Clarke
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

#include "adafruitdcmotor.h"
#include "util.h"

#include <iostream>
#include <algorithm>

#define LED0PIN 6
#define LED0CHANNEL 0
#define LED1PIN 7
#define LED1CHANNEL 1
#define LED2PIN 8
#define LED2CHANNEL 2
#define LED3PIN 9
#define LED3CHANNEL 3

AdafruitDCMotor::AdafruitDCMotor(PCA9685& pwm, int index)
	: controller(pwm)
{
	switch (index)
	{
	case 0: // A
		in1Pin = LED0CHANNEL;
		in2Pin = LED1CHANNEL;
		break;
	case 1: // B
		in1Pin = LED2CHANNEL;
		in2Pin = LED3CHANNEL;
		break;

	default:
		log::error("Motor index out-of-range. Must be between 0 and 2 inclusive.");
		break;
	}
}


void AdafruitDCMotor::set(int speed, Command command) {
	speed %= 256;
	speed = (int)util::map(speed, 0, 255, 0, 4095);
	speed = std::min(4095, speed);
	switch (command)
	{
	case COAST:
		// in1: LOW; in2 LOW;
		controller.setChannel(this->in1Pin, 0x0000, 0x1000);
		controller.setChannel(this->in2Pin, 0x0000, 0x1000);
		break;

	case REVERSE:
		// in1: LOW; in2 HIGH;
		controller.setChannel(this->in1Pin, 0x0000, 0x1000);
		controller.setChannel(this->in2Pin, 0x0000, speed);
		break;
	case FORWARD:
		// in1: HIGH; in2 LOW;
		controller.setChannel(this->in1Pin, 0x0000, speed);
		controller.setChannel(this->in2Pin, 0x0000, 0x1000);
		break;
	case BRAKE:
		// in1: HIGH; in2 HIGH;
		controller.setChannel(this->in1Pin, 0x1000, 0x0000);
		controller.setChannel(this->in2Pin, 0x1000, 0x0000);
		break;
	default:
		break;
	}
}

void AdafruitDCMotor::setCommand(Command command)
{
	this->command = command;
	this->set(this->speed, this->command);
}

void AdafruitDCMotor::setSpeed(int speed)
{
	this->speed = speed;
	this->set(this->speed, this->command);
}
