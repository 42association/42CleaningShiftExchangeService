import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('koukan')
        .setDescription('掃除シフトの日程を交換します')
        .addStringOption((option) =>
            option
                .setName('exchange_date')
                .setDescription('交換希望日程')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('original_cleaner_login')
                .setDescription('元の掃除担当者のlogin')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('partner_original_shift_date')
                .setDescription('交換相手の元のの掃除シフト日程')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('partner_login')
                .setDescription('交換相手ののlogin')
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const exchangeDate = interaction.options.get('exchange_date');
        const originalCleanerLogin = interaction.options.get('original_cleaner_login');
        const partnerOriginalShiftDate = interaction.options.get('partner_original_shift_date');
        const partnerLogin = interaction.options.get('partner_login');

        const apiurl = process.env.API_URL_FT_ACTIVITY + "/shifts/exchange";
        const requestBody = {
            "login1": originalCleanerLogin?.value,
            "login2": partnerLogin?.value,
            "date1": exchangeDate?.value,
            "date2": partnerOriginalShiftDate?.value
        };

        await interaction.deferReply();
        try {
            const response = await fetch(apiurl, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const responseData = await response.json();
                console.log(responseData)
                throw new Error('Failed to exchange shifts.');
            }
            
            const responseData = await response.json();
            console.log(responseData)
            
            const embed = new EmbedBuilder()
            .setTitle('掃除シフト交換成功')
            .setDescription(`元の掃除担当者: ${originalCleanerLogin?.value}\n交換希望日程: ${exchangeDate?.value}\n交換相手: ${partnerLogin?.value}\n交換相手の元の掃除シフト日程: ${partnerOriginalShiftDate?.value}`);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('掃除シフト交換に失敗しました。')
        }
    }
}
