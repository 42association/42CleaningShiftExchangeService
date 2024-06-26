import { Client } from 'discord.js';
import dotenv from 'dotenv'
import { ShiftList } from '../types/shift';
import { FetchShiftsOfDay } from '../repository/fetchShiftsOfDay';
import { LoginToMention } from '../utils/login-to-mention';
import { DateToStr } from '../utils/date-to-str';
import { FetchMembers } from '../utils/fetch-discord-object';

dotenv.config()
const channelId = process.env.REPORT_CHANNEL_ID;

async function shiftsToString(shifts: ShiftList | void, client: Client) {
    if (!shifts) {
        return 'error';
    }

	const members = await FetchMembers(client);
    const mentions = await Promise.all(
        shifts.map(async (shift) => {
            const mention = await LoginToMention(shift.User.Login, members);
            return mention !== null ? mention : '';
        })
    );

    const filteredMentions = mentions.filter(mention => mention !== '');

    if (filteredMentions.length === 0) {
        return 'shift unregistered';
    }

    return filteredMentions.join(' ');
}

async function getReportMessage(client: Client): Promise<string> {
	var tommorow = new Date();
	tommorow.setDate(tommorow.getDate() + 1);
	var oneWeekAfter = new Date();
	oneWeekAfter.setDate(oneWeekAfter.getDate() + 7);
	const tommorowShift = await FetchShiftsOfDay(tommorow);
	const oneWeekAfterShift = await FetchShiftsOfDay(oneWeekAfter);
	const tommorowShiftString = await shiftsToString(tommorowShift, client);
	const oneWeekAfterShiftString = await shiftsToString(oneWeekAfterShift, client);
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
