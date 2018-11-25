import { Response } from "express";
import { ResponseResultPromise } from "./ResponseResultPromise";

export type ManualResponse = Response & ResponseResultPromise;