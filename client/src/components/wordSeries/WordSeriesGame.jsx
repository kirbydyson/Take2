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
