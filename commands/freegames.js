const { EpicFreeGames } = require('epic-free-games');
const epicFreeGames = new EpicFreeGames({ country: 'US', locale: 'en-US', includeAll: true });

async function fetchEpicFreeGames() {
    try {
        const games = await epicFreeGames.getGames();
        return games.currentGames; // List of currently free games
    } catch (error) {
        console.error('Error fetching Epic free games:', error);
        return [];
    }
}

async function freeGamesCommand(sock, chatId) {
    const freeGames = await fetchEpicFreeGames();

    if (freeGames.length > 0) {
        let message = ' *Epic Free Games Available:*\n\n';
        freeGames.forEach(game => {
            message += `*${game.title}*\nLink: ${game.offerLink}\n\n`;
        });
        await sock.sendMessage(chatId, { text: message });
    } else {
        await sock.sendMessage(chatId, { text: 'No free games are currently available.' });
    }
}

module.exports = freeGamesCommand;
