import { ShiftMember } from "../types/shiftMember";

const endpoint = "/shifts"

export async function FetchShiftMemberOfDay(day: Date): Promise<ShiftMember | void> {
	var result: ShiftMember;
	const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
	const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
	const startTime = Math.floor(dayStart.getTime() / 1000);
	const endTime = Math.floor(dayEnd.getTime() / 1000);
	const url = `${process.env.API_URL}${endpoint}?start=${startTime}&end=${endTime}`;
	const response = await fetch(url);
	if (!response.ok) {
		console.error(`Failed to fetch from ${url}`);
		return;
	}
	result = await response.json();
	return result;
}
