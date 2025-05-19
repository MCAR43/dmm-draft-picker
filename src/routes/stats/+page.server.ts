import { getDraftStats } from '$lib/services/draftService';
import playersData from '$lib/data/players.json';
import captainsData from '$lib/data/captains.json';

// Define interface for player stats
interface PlayerStats {
    playerName: string;
    pickPositions: number[];
    averagePickPosition: number;
    mostLikelyTeam: {
        captain: any;
        count: number;
        percentage: number;
    };
}

// Define the return type of calculatePlayerStats
interface PlayerStatsBase {
    pickPositions: number[];
    averagePickPosition: number;
    mostLikelyTeam: {
        captain: any;
        count: number;
        percentage: number;
    };
}

// Interface for team composition data
interface TeamCompositionData {
    [playerName: string]: {
        [captainName: string]: number;
    };
}

export async function load({ url }) {
    // This is my test ID It is DOGSHIT data
    // const draftStats = await getDraftStats(null);
    const draftStats = await getDraftStats('7b20c7d5-0946-446b-a0df-6f11a4f7a71d');
    
    // Get playerName from URL query if it exists
    const playerName = url.searchParams.get('player');
    
    // Calculate most popular first pick
    let firstPickCounts: Record<string, number> = {};
    let mostPopularFirstPick = { name: 'None', count: 0 };
    
    if (draftStats.data && draftStats.data.length > 0) {
        // Count occurrences of each first pick
        draftStats.data.forEach(board => {
            if (board.selections && board.selections.length > 0) {
                const firstPick = board.selections[0];
                firstPickCounts[firstPick] = (firstPickCounts[firstPick] || 0) + 1;
                
                // Update most popular if this one has more occurrences
                if (firstPickCounts[firstPick] > mostPopularFirstPick.count) {
                    mostPopularFirstPick = { 
                        name: firstPick, 
                        count: firstPickCounts[firstPick] 
                    };
                }
            }
        });
    }
    
    // Calculate percentage if there are boards
    const totalBoards = draftStats.data ? draftStats.data.length : 0;
    const firstPickPercentage = totalBoards > 0 
        ? Math.round((mostPopularFirstPick.count / totalBoards) * 100) 
        : 0;
    
    // Maximum pick position (assuming it's the number of players)
    const maxPickPosition = 24; // Based on the positions in captains.json
    
    // Calculate team composition data for heatmap
    // Player stats if a player was requested
    let playerStats: PlayerStats | null = null;
    if (playerName) {
        const player = playersData.find(p => p.name === playerName);
        if (player) {
            const baseStats = calculatePlayerStats(player, draftStats.data || [], captainsData, maxPickPosition);
            playerStats = {
                ...baseStats,
                playerName: player.name
            };
        }
    }
    
    return {
        draftStats,
        stats: {
            totalBoards,
            mostPopularFirstPick,
            firstPickPercentage,
            maxPickPosition
        },
        playerStats,
    };
}

// Calculate stats for a specific player
function calculatePlayerStats(player: any, boardsData: any[], captainsData: any[], maxPickPosition: number): PlayerStatsBase {
    const pickPositions: number[] = [];
    
    // Reset team counts
    const teamCounts = captainsData.map(captain => ({
        captain,
        count: 0
    }));
    
    // Go through all draft boards to find where this player was picked
    if (boardsData) {
        boardsData.forEach(board => {
            if (board.selections) {
                const position = board.selections.indexOf(player.name);
                if (position !== -1) {
                    // Add 1 because array is 0-indexed but pick positions are 1-indexed
                    const pickPosition = position + 1;
                    pickPositions.push(pickPosition);
                    
                    // Find which captain's team this position belongs to
                    for (const teamData of teamCounts) {
                        if (teamData.captain.positions.includes(pickPosition)) {
                            teamData.count++;
                            break;
                        }
                    }
                }
            }
        });
    }
    
    // Calculate average pick position
    let averagePickPosition = 0;
    if (pickPositions.length > 0) {
        const sum = pickPositions.reduce((acc, pos) => acc + pos, 0);
        averagePickPosition = Math.round((sum / pickPositions.length) * 10) / 10; // Round to 1 decimal place
    }
    
    // Find most likely team
    let maxTeamCount = 0;
    let maxTeamCaptain = null;
    
    for (const teamData of teamCounts) {
        if (teamData.count > maxTeamCount) {
            maxTeamCount = teamData.count;
            maxTeamCaptain = teamData.captain;
        }
    }
    
    // Calculate percentage
    const percentage = pickPositions.length > 0
        ? Math.round((maxTeamCount / pickPositions.length) * 100)
        : 0;
    
    return {
        pickPositions,
        averagePickPosition,
        mostLikelyTeam: {
            captain: maxTeamCaptain,
            count: maxTeamCount,
            percentage
        }
    };
}
