import React, { useState, useEffect } from 'react';
import '../../styles/wordSeries.css';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Grid from './Grid';

export default function WordSeriesGame() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [discoveredGroups, setDiscoveredGroups] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const fetchWordSeriesGroups = async () => {
            try {
                const res = await fetch(
                    'http://localhost:8080/api/wordseries/get-words',
                );
                const data = await res.json();

                if (data.groups) {
                    const combinedPlayers = data.groups
                        .flatMap((group) => group.players)
                        .map((name, idx) => ({
                            id: idx + 1,
                            name,
                        }));
                    setPlayers(combinedPlayers);
                }
            } catch (err) {
                console.error('Error fetching word series groups:', err);
            }
        };

        fetchWordSeriesGroups();
    }, []);

    const handlePlayerClick = (player) => {
        const isAlreadySelected = selectedPlayers.some(
            (p) => p.id === player.id,
        );

        if (isAlreadySelected) {
            setSelectedPlayers((prev) =>
                prev.filter((p) => p.id !== player.id),
            );
        } else if (selectedPlayers.length < 4) {
            setSelectedPlayers((prev) => [...prev, player]);
        }
    };

    // shuffles the cards similar to the game
    const shufflePlayers = (array) => {

    };

    // VALIDATES GROUPS AUTOMATICALLY
    const validate_groupings = (selectedPlayers) => {
        const playerNames = selectedPlayers.map(player => player.name);

        let discoveredGroups = null;
        for (const group of allGroups) {
            const matchCount = playerNames.filter(name => group.players.includes(name)).length;

            if (matchCount === 4) {
                discoveredGroups = group;
                break;
            }
        }

        if (discoveredGroups) {
            setDiscoveredGroups([...discoveredGroups, {
                type: foundGroup.category.toLowerCase().includes('players') ? 'team' :
                       foundGroup.category.toLowerCase().includes('basemen') ||
                       foundGroup.category.toLowerCase().includes('shortstops') ||
                       foundGroup.category.toLowerCase().includes('outfielders') ||
                       foundGroup.category.toLowerCase().includes('pitchers') ||
                       foundGroup.category.toLowerCase().includes('catchers') ? 'position' :
                       foundGroup.category.toLowerCase().includes('mvp') ||
                       foundGroup.category.toLowerCase().includes('star') ||
                       foundGroup.category.toLowerCase().includes('fame') ? 'award' : 'era',
                category: foundGroup.category,
                players: selectedPlayers
            }]);
            setSelectedPlayers([]);

            if (discoveredGroups.length + 1 >= 4) {
                setTimeout(() => {
                    setShowGameOver(true);
                }, 1000);
            }
        } else {
            setShowError(true);
            setAttempts(attempts - 1);

            if (attempts <= 1) {
                setTimeout(() => {
                    setShowGameOver(true);
                }, 1500);
            }

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };

    const resetGame = () => {
        window.location.reload();
    };

    const gameOverDialog = () => {

    };

    return (
        <div className='wordseries-container'>
            <div className='wordseries-header'>
                <h1>MLB WordSeries</h1>
                <IconButton
                    aria-label='instructions'
                    onClick={() => setShowInstructions(true)}
                    className='wordseries-help-button'
                >
                    <HelpOutlineIcon />
                </IconButton>
            </div>

            <div className='wordseries-message-area'>
                {showInstructions && (
                    <p className='wordseries-message'>
                        🎯 Select 4 players that belong to the same group!
                    </p>
                )}
            </div>

            <Grid
                players={players}
                selectedPlayers={selectedPlayers}
                discoveredGroups={discoveredGroups}
                onPlayerClick={handlePlayerClick}
            />
        </div>
    );
}
