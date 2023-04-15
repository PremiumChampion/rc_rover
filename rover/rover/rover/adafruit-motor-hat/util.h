/**
 *  util.h
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

#include <cerrno>
#include <cstring>
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include <regex>

#pragma once

namespace log
{
	/**
		Writes a message to stdout.
	*/
	template<typename MessageType>
	void output(MessageType message)
	{
		std::cout << message << std::endl;
	}

	/**
		Writes a message to stderr.
	*/
	template<typename MessageType>
	void error(MessageType message)
	{
		std::cerr << message << std::endl;
	}

	/**
		Writes a message to stderr with the errno string appended.
	*/
	template<typename MessageType>
	void strerror(MessageType message)
	{
		std::cerr << message << ": ";
		std::cerr << std::strerror(errno) << std::endl;
	}
}
namespace util {
	long map(long x, long in_min, long in_max, long out_min, long out_max);
}