import { ShiftList } from "../types/shift";
import { ErrorMessage } from "../types/error-message";
import { DateToStr } from "../utils/date-to-str";

export async function FetchShiftsOfDay(day: Date): Promise<ShiftList | void> {
	const dateStr = DateToStr(day);
	const url = `${process.env.API_URL_FT_ACTIVITY}/shifts?date=${dateStr}`;
	const api_key = process.env.API_KEY_FT_ACTIVITY;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${api_key}`,
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
