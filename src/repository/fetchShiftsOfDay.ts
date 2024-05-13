import { ShiftList } from "../types/shift";
import { ErrorMessage } from "../types/error-message";

const endpoint = "/shifts"

export async function FetchShiftsOfDay(day: Date): Promise<ShiftList | void> {
	const dateStr = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
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
