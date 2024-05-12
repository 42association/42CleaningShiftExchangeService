import { Client, Collection, GuildMember } from 'discord.js';
import dotenv from 'dotenv'
import { ShiftMember } from '../types/shiftMember';
import { FetchShiftMemberOfDay } from '../repository/fetchShiftMemberOfDay';

dotenv.config()
const channelId = process.env.REPORT_CHANNEL_ID;
const guildId = process.env.GUILD_ID;

function loginToDiscordId(login: string, members: Collection<string, GuildMember>): string | void {
	const member = members.find(member => member.user.username === login);
	if (!member) {
		return;
	}
	return member.id;
}

function shiftMemberToString(shiftMember: ShiftMember | void, client: Client): string | void {
	if (guildId === undefined) {
		console.error('GUILD_ID is not set');
		return;
	}
	const guild = client.guilds.cache.get(guildId)
	if (!guild) {
		console.error('Guild not found');
		return;
	}
	if (shiftMember === undefined) {
		return "No one is on shift."
	}
	const members = guild.members.cache;
	var arr: string[] = [];
	shiftMember.forEach(member => {
		const discordId = loginToDiscordId(member.login, members);
		if (discordId === undefined) {
			arr.push(member.login);
		}
		arr.push(`<@${discordId}>`);
	});
	return arr.join(' ');
}

async function getReportMessage(client: Client): Promise<string> {
	var curDate = new Date();
	curDate.setDate(curDate.getDate() + 1);
	const tommorowShift = await FetchShiftMemberOfDay(curDate);
	curDate.setDate(curDate.getDate() + 6);
	const oneWeekAfterShift = await FetchShiftMemberOfDay(curDate);
	const tommorowShiftString = shiftMemberToString(tommorowShift, client);
	const oneWeekAfterShiftString = shiftMemberToString(oneWeekAfterShift, client);
	var message: string;
	message = '掃除シフト通知\n';
	message += '> 明日: ' + tommorowShiftString + '\n';
	message += '> 一週間後	: ' + oneWeekAfterShiftString + '\n';
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
