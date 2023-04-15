/**
 *  pwm.h
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

#pragma once

#include "i2cdevice.h"

#define MODE1 0x00
#define MODE2 0x01
#define ALLCALLADR 0x05
#define LED0_ON_L 0x06
#define LED0_ON_H 0x07
#define LED0_OFF_L 0x08
#define LED0_OFF_H 0x09
#define ALL_LED_ON_L 0xFA
#define ALL_LED_ON_H 0xFB
#define ALL_LED_OFF_L 0xFC
#define ALL_LED_OFF_H 0xFD
#define PRE_SCALE 0xFE

class PCA9685
{
public:
	// Registers/etc.
	enum Registers
	{
		kSubAddress1 = 0x02,
		kSubAddress2 = 0x03,
		kSubAddress3 = 0x04,
	};

	// Bits
	enum Bits
	{
		kRestart = 0x80,
		kSleep = 0x10,
		kAllCall = 0x01,
		kInvert = 0x10,
		kOutDrive = 0x04,
	};

	PCA9685(int deviceAddress, int i2c_bus_number);

	/** Sets the PWM frequency */
	void setFrequency(double frequency);

	/** Sets a single PWM channel */
	void setChannel(int channel, int on, int off);

	/** Sets all the PWM channels */
	void setAll(int on, int off);

private:
	I2CDevice device;
};