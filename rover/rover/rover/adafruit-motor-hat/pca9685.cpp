/**
 *  pwm.cpp
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

#include "pca9685.h"
#include "util.h"

#include <thread>
#include <chrono>

PCA9685::PCA9685(int deviceAddress, int i2c_bus_number)
	: device(deviceAddress, i2c_bus_number)
{
	if (device.isValid())
	{
		log::output("Resetting PCA9685 mode 1 (without sleep) and mode 2");

		setAll(0, 0);
		device.write8(MODE2, Bits::kOutDrive);
		device.write8(MODE1, Bits::kAllCall);

		// wait for oscillator
		std::this_thread::sleep_for(std::chrono::milliseconds(5));

		int mode = device.read8(MODE1);
		// reset sleep
		mode = mode & ~Bits::kSleep;
		log::output("sleep is " + std::to_string(mode));
		device.write8(MODE1, mode);

		// wait for oscillator
		std::this_thread::sleep_for(std::chrono::milliseconds(5));
	}
}

void PCA9685::setFrequency(double frequency)
{
	if (device.isValid())
	{
		// 25Mhz
		double preScaleValue = 25000000.0;
		// to 12-bit
		preScaleValue /= 4096.0;
		preScaleValue /= frequency;
		preScaleValue -= 1.0;

		log::output("Setting PWM frequency to " + std::to_string(frequency) + "Hz");
		log::output("Estimated pre-scale: " + std::to_string(preScaleValue));

		const int finalPreScale = static_cast<int> (preScaleValue + 0.5);

		log::output("Final pre-scale: " + std::to_string(finalPreScale));

		const int oldMode = device.read8(MODE1);
		const int newMode = (oldMode & 0x7F) | Bits::kSleep;

		// go to sleep
		device.write8(MODE1, newMode);
		// set prescale
		device.write8(PRE_SCALE, finalPreScale);
		// wake up
		device.write8(MODE1, oldMode);

		std::this_thread::sleep_for(std::chrono::milliseconds(5));

		// restart
		device.write8(MODE1, oldMode | Bits::kRestart);
	}
}

void PCA9685::setChannel(int channel, int on, int off)
{
	if (device.isValid())
	{
		device.write8(LED0_ON_L + 4 * channel, on & 0xFF);
		device.write8(LED0_ON_H + 4 * channel, on >> 8);
		device.write8(LED0_OFF_L + 4 * channel, off & 0xFF);
		device.write8(LED0_OFF_H + 4 * channel, off >> 8);
	}
}

void PCA9685::setAll(int on, int off)
{
	if (device.isValid())
	{
		device.write8(ALL_LED_ON_L, on & 0xFF);
		device.write8(ALL_LED_ON_H, on >> 8);
		device.write8(ALL_LED_OFF_L, off & 0xFF);
		device.write8(ALL_LED_OFF_H, off >> 8);
	}
}
