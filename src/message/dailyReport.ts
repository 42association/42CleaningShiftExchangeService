import { Client, Collection, GuildMember } from 'discord.js';
import dotenv from 'dotenv'
import { ShiftList } from '../types/shift';
import { FetchShiftsOfDay } from '../repository/fetchShiftsOfDay';
import { LoginToMention } from '../utils/login-to-mention';

dotenv.config()
const channelId = process.env.REPORT_CHANNEL_ID;
const guildId = process.env.GUILD_ID;

function shiftsToString(shifts: ShiftList | void, client: Client): string | void {
	if (!shifts) {
		return 'error';
	}
	if (guildId === undefined) {
		console.error('GUILD_ID is not set');
		return;
	}
	const guild = client.guilds.cache.get(guildId)
	if (!guild) {
		console.error('Guild not found');
		return;
	}
	const members = guild.members.cache;
	var arr: string[] = [];
	shifts.forEach(shift => {
		const mention = LoginToMention(shift.Shift.User.Login, members);
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
	> 明日(${tommorow.getMonth() + 1}/${tommorow.getDate}): ${tommorowShiftString}
	> 一週間後(${oneWeekAfter.getMonth() + 1}/${oneWeekAfter.getDate}) : ${oneWeekAfterShiftString}
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
