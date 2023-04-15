import { NextFunction } from "express";
import { FrameworkRequest, FrameworkResponse } from "../controller";
import { HTTPErrorCallback } from "../errorHandling/http/HTTPErrorCallback";

export type RoutePropertyDescriptor = TypedPropertyDescriptor<(req: FrameworkRequest, res: FrameworkResponse, next: NextFunction, error: HTTPErrorCallback) => void>;

export type RouteDecorator = (...args) => (target: any, propertyKey: string, descriptor: RoutePropertyDescriptor) => void;