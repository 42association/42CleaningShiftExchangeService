import { ShiftList } from "../types/shift";
import { ErrorMessage } from "../types/error-message";

const endpoint = "/shifts"

function padding(num: number): string {
	return num < 10 ? `0${num}` : num.toString();
}

function dateToString(date: Date): string {
	return `${date.getFullYear()}-${padding(date.getMonth() + 1)}-${padding(date.getDate())}`;
}

export async function FetchShiftsOfDay(day: Date): Promise<ShiftList | void> {
	const dateStr = dateToString(day);
	const url = `${process.env.API_URL}${endpoint}?date=${dateStr}`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		const error: ErrorMessage = await response.json();
		console.error(`Failed to fetch from ${url}\nmessage: ${error.error}`);
		return;
	}
	const result: ShiftList = await response.json();
	return result;
}
