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

// Interface for Borda count results
interface OrderPlayerResult {
    playerName: string;
    totalPoints: number;
    averagePoints: number;
}

// Define interface for player stats record
interface PlayerStatsRecord {
    [playerName: string]: PlayerStats;
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
    
    // Run Borda count analysis on all boards
    const bordaResults = calculateBordaCount(draftStats.data || [], maxPickPosition);
    const modePositionFrequencyResults = calculatePositionFrequencyRanking(draftStats.data || [], maxPickPosition);
    const results = {
        "borda": bordaResults,
        "modePositionFrequency": modePositionFrequencyResults
    }
    
    // Calculate stats for all players
    const allPlayerStats: PlayerStatsRecord = {};
    playersData.forEach(player => {
        const baseStats = calculatePlayerStats(player, draftStats.data || [], captainsData, maxPickPosition);
        allPlayerStats[player.name] = {
            ...baseStats,
            playerName: player.name
        };
    });
    
    // Player stats if a player was requested (for backward compatibility)
    let playerStats: PlayerStats | null = null;
    if (playerName && allPlayerStats[playerName]) {
        playerStats = allPlayerStats[playerName];
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
        allPlayerStats,
        results
    };
}

// Calculate Borda count for all players across all boards
function calculateBordaCount(boardsData: any[], maxPickPosition: number): OrderPlayerResult[] {
    // Object to track player Borda points
    const playerScores: Record<string, { 
        totalPoints: number,
        boardsAppearing: number
    }> = {};
    
    // Go through all draft boards
    if (boardsData && boardsData.length > 0) {
        boardsData.forEach(board => {
            if (board.selections) {
                // For each player in this board
                board.selections.forEach((playerName: string | null, index: number) => {
                    if (playerName) {
                        // In Borda count, higher positions get more points
                        // If there are maxPickPosition possible positions, first place gets maxPickPosition points,
                        // second place gets maxPickPosition-1 points, etc.
                        const bordaPoints = maxPickPosition - index;
                        
                        // Initialize player data if needed
                        if (!playerScores[playerName]) {
                            playerScores[playerName] = { 
                                totalPoints: 0,
                                boardsAppearing: 0
                            };
                        }
                        
                        // Add points for this board
                        playerScores[playerName].totalPoints += bordaPoints;
                        playerScores[playerName].boardsAppearing += 1;
                    }
                });
            }
        });
    }
    
    // Convert to array and calculate average points
    const results: OrderPlayerResult[] = Object.entries(playerScores).map(([playerName, data]) => ({
        playerName,
        totalPoints: data.totalPoints,
        averagePoints: data.boardsAppearing > 0 
            ? Math.round((data.totalPoints / data.boardsAppearing) * 10) / 10 
            : 0,
        boardsAppearing: data.boardsAppearing
    }));
    
    // Sort by total points (highest first)
    return results.sort((a, b) => b.totalPoints - a.totalPoints);
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

// Function to calculate position frequency-based ranking
function calculatePositionFrequencyRanking(boardsData: any[], maxPickPosition: number): OrderPlayerResult[] {
  // Track position frequencies for each player
  const playerPositionData: Record<string, {
    positionCounts: Record<number, number>,
    totalAppearances: number,
    mostCommonPosition: number,
    highestFrequency: number,
    confidence: number
  }> = {};
  
  // Process all draft boards
  if (boardsData && boardsData.length > 0) {
    boardsData.forEach(board => {
      if (board.selections) {
        board.selections.forEach((playerName: string | null, index: number) => {
          if (playerName) {
            const position = index + 1; // 1-indexed position
            
            // Initialize player data if needed
            if (!playerPositionData[playerName]) {
              playerPositionData[playerName] = {
                positionCounts: {},
                totalAppearances: 0,
                mostCommonPosition: 0,
                highestFrequency: 0,
                confidence: 0
              };
            }
            
            // Count this position
            playerPositionData[playerName].positionCounts[position] = 
              (playerPositionData[playerName].positionCounts[position] || 0) + 1;
            
            // Track total appearances
            playerPositionData[playerName].totalAppearances += 1;
          }
        });
      }
    });
  }
  
  // Find most common position for each player
  Object.keys(playerPositionData).forEach(playerName => {
    const data = playerPositionData[playerName];
    let mostCommonPosition = 0;
    let highestFrequency = 0;
    
    Object.entries(data.positionCounts).forEach(([position, count]) => {
      const posNum = parseInt(position);
      if (count > highestFrequency) {
        highestFrequency = count;
        mostCommonPosition = posNum;
      }
    });
    
    // Calculate confidence (% of appearances at most common position)
    const confidence = data.totalAppearances > 0 
      ? (highestFrequency / data.totalAppearances) * 100 
      : 0;
    
    data.mostCommonPosition = mostCommonPosition;
    data.highestFrequency = highestFrequency;
    data.confidence = confidence;
  });
  
  // Convert to array for sorting
  const results: OrderPlayerResult[] = Object.entries(playerPositionData).map(([playerName, data]) => ({
    playerName,
    // For total points, we use position as primary factor, then confidence as tiebreaker
    totalPoints: (data.mostCommonPosition * -10000) + data.confidence * 100 + data.highestFrequency,
    averagePoints: data.mostCommonPosition
  }));
  
  // Sort by position (ascending) and then by confidence (descending) for ties
  return results.sort((a, b) => a.totalPoints - b.totalPoints);
}