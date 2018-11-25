import { Response } from "express";
import { ResponseWithResultPromise } from "./ResponseWithResultPromise";

export type ManualResponse = Response & ResponseWithResultPromise;