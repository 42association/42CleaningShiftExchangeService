import { Client } from 'discord.js';
import dotenv from 'dotenv'
import { ShiftList } from '../types/shift';
import { FetchShiftsOfDay } from '../repository/fetchShiftsOfDay';
import { LoginToMention } from '../utils/login-to-mention';
import { DateToStr } from '../utils/date-to-str';

dotenv.config()
const channelId = process.env.REPORT_CHANNEL_ID;

function shiftsToString(shifts: ShiftList | void, client: Client): string | void {
	if (!shifts) {
		return 'error: no shifts inputted';
	}
	const guildId = process.env.GUILD_ID;
	if (!guildId) {
		return 'error: GUILD_ID is not set';
	}
	const guild = client.guilds.cache.get(guildId);
	if (!guild) {
		return 'error: guild not found';
	}
	const members = guild.members.cache;
	var arr: string[] = [];
	shifts.forEach(shift => {
		const mention = LoginToMention(shift.User.Login, members);
		arr.push(mention);
	});
	if (arr.length === 0) {
		return 'shift unregistered';
	}
	return arr.join(' ');
}

async function getReportMessage(client: Client): Promise<string> {
	var tommorow = new Date();
	tommorow.setDate(tommorow.getDate() + 1);
	var oneWeekAfter = new Date();
	oneWeekAfter.setDate(oneWeekAfter.getDate() + 7);
	const tommorowShift = await FetchShiftsOfDay(tommorow);
	const oneWeekAfterShift = await FetchShiftsOfDay(oneWeekAfter);
	const tommorowShiftString = shiftsToString(tommorowShift, client);
	const oneWeekAfterShiftString = shiftsToString(oneWeekAfterShift, client);
	var message: string = `
	掃除シフト通知です。
	> 明日(${DateToStr(tommorow)}): ${tommorowShiftString}
	> 一週間後(${DateToStr(oneWeekAfter)}) : ${oneWeekAfterShiftString}
	`
	return message;
}

export async function ReportDailyShift(client: Client) {
	if (!channelId) {
		console.error('REPORT_CHANNEL_ID is not set');
		return;
	}
	const channel = client.channels.cache.get(channelId);
	if (!channel) {
		console.error('Channel not found');
		return;
	}
	if (!channel.isTextBased()) {
		console.error('Channel is not a text channel');
		return;
	}
	const message = await getReportMessage(client);
	await channel.send(message);
}
