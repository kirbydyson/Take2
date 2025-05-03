// WordSeriesGame.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/wordSeries.css';
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Grid from './Grid';

export default function WordSeriesGame() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [discoveredGroups, setDiscoveredGroups] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);

    const correctGroups = [
        {
            type: 'team',
            players: ['Derek Jeter', 'Babe Ruth', 'Lou Gehrig', 'Aaron Judge'],
        },
        {
            type: 'position',
            players: ['Mike Trout', 'Ken Griffey Jr.', 'Willie Mays', 'Ronald Acuña Jr.'],
        },
        {
            type: 'era',
            players: ['Jackie Robinson', 'Hank Aaron', 'Mickey Mantle', 'Shohei Ohtani'],
        },
        {
            type: 'award',
            players: ['Clayton Kershaw', 'Justin Verlander', 'Max Scherzer', 'Freddie Freeman'],
        },
    ];

    useEffect(() => {
        setPlayers([
            { id: 1, name: "Derek Jeter" },
            { id: 2, name: "Babe Ruth" },
            { id: 3, name: "Jackie Robinson" },
            { id: 4, name: "Ken Griffey Jr." },
            { id: 5, name: "Willie Mays" },
            { id: 6, name: "Mickey Mantle" },
            { id: 7, name: "Hank Aaron" },
            { id: 8, name: "Lou Gehrig" },
            { id: 9, name: "Shohei Ohtani" },
            { id: 10, name: "Mike Trout" },
            { id: 11, name: "Clayton Kershaw" },
            { id: 12, name: "Justin Verlander" },
            { id: 13, name: "Max Scherzer" },
            { id: 14, name: "Aaron Judge" },
            { id: 15, name: "Freddie Freeman" },
            { id: 16, name: "Ronald Acuña Jr." },
        ]);
    }, []);

    const handlePlayerClick = (player) => {
        const isAlreadySelected = selectedPlayers.some(p => p.id === player.id);

        if (isAlreadySelected) {
            setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
        } else if (selectedPlayers.length < 4) {
            setSelectedPlayers(prev => [...prev, player]);
        }
    };

    const handleSubmit = () => {
        if (selectedPlayers.length !== 4) return;

        const names = selectedPlayers.map((p) => p.name).sort();

        const foundGroup = correctGroups.find((group) =>
            group.players.slice().sort().every((name, i) => name === names[i])
        );

        if (foundGroup) {
            setDiscoveredGroups([...discoveredGroups, {
                type: foundGroup.type,
                players: selectedPlayers,
            }]);
            setSelectedPlayers([]);
        } else {
            alert("❌ Not a valid group!");
            setSelectedPlayers([]);
        }
    };

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    return (
        <div className="wordseries-container">
            <div className="wordseries-header">
                <h1 className="wordseries-title">MLB WordSeries</h1>
                <IconButton
                    aria-label="instructions"
                    onClick={() => setShowInstructions(true)}
                    className="wordseries-help-button"
                >
                    <HelpOutlineIcon />
                </IconButton>
            </div>

            {showInstructions && (
                <div className="wordseries-message-area">
                    <p className="wordseries-message">🎯 Select 4 players that belong to the same group!</p>
                </div>
            )}

            <Grid
                players={players}
                selectedPlayers={selectedPlayers}
                discoveredGroups={discoveredGroups}
                onPlayerClick={handlePlayerClick}
            />

            <div className="wordseries-button-area">
                <button className="wordseries-submit-button" onClick={handleSubmit}>Submit</button>
                <button className="wordseries-deselect-button" onClick={() => setSelectedPlayers([])}>Deselect</button>
                <button className="wordseries-shuffle-button" onClick={() => setPlayers(shuffle([...players]))}>Shuffle</button>
            </div>

            {discoveredGroups.length === correctGroups.length && (
                <div className="wordseries-summary">
                    <h2>🎉 You found all the groups!</h2>
                </div>
            )}
        </div>
    );
}