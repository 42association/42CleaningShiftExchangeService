import { User } from "./user";

export type Shift = {
	"ID" : number,
	"Date" : string,
	"UserID" : number,
	"User" : User,
};

export type ShiftList = Shift[];
