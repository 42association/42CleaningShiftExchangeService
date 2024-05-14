import { ShiftList } from "../types/shift";
import { ErrorMessage } from "../types/error-message";
import { DateToStr } from "../utils/date-to-str";

const endpoint = "/shift"

export async function FetchShiftsOfDay(day: Date): Promise<ShiftList | void> {
	const dateStr = DateToStr(day);
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
