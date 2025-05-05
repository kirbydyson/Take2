import React, { useState, useEffect } from 'react';
import '../../styles/wordSeries.css';
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Grid from './Grid';

export default function WordSeriesGame() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [discoveredGroups, setDiscoveredGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);
    const [attempts, setAttempts] = useState(4);
    const [showError, setShowError] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);

    useEffect(() => {
        const fetchWordSeriesGroups = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/wordseries/get-words');
                const data = await res.json();

                if (data.groups) {
                    setGroups(data.groups);
                    const combinedPlayers = data.groups
                        .flatMap((group) => group.players.map(name => ({
                            id: `${group.category}-${name}`,
                            name,
                            category: group.category
                        })));
                    setPlayers(combinedPlayers);
                }
            } catch (err) {
                console.error('Error fetching word series groups:', err);
            }
        };

        fetchWordSeriesGroups();
    }, []);

    const handlePlayerClick = (player) => {
        if (discoveredGroups.some(group => group.players.some(p => p.id === player.id))) {
            return;
        }

        const isAlreadySelected = selectedPlayers.some(p => p.id === player.id);

        if (isAlreadySelected) {
            setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
        } else if (selectedPlayers.length < 4) {
            setSelectedPlayers(prev => [...prev, player]);
        }
    };

    const validate_groupings = (selectedPlayers) => {
        if (selectedPlayers.length !== 4) return false;

        const category = selectedPlayers.map(player => player.category);
        return categories.every(category => category === categories[0]);
    };

    const handleSubmit = () => {
        if (selectedPlayers.length !== 4) return;

        const isValid = validate_groupings(selectedPlayers);

        if (isValid) {
            const groupType = mapCategoryToType(selectedPlayers[0].category);
            const categoryName = selectedPlayers[0].category;

            const groupDescription = groups.find(g => g.category === categoryName)?.category || categoryName;

            setDiscoveredGroups(prev => [...prev, {
                players: selectedPlayers,
                type: groupType,
                description: groupDescription
            }]);

            setPlayers(prev => prev.filter(player =>
                !selectedPlayers.some(p => p.id === player.id)
            ));

            setSelectedPlayers([]);

            if (discoveredGroups.length + 1 >= groups.length) {
                setTimeout(() => {
                    alert("Congratulations! You've found all the groups!");
                }, 500);
            }
        } else {
            setShowError(true);
            setAttempts(prev => prev - 1);

            setTimeout(() => {
                setShowError(false);
                setSelectedPlayers([]);
            }, 2000);

            if (attempts - 1 === 0) {
                setShowGameOver(true);
            }
        }
    };

    const mapCategoryToType = (category) => {
        // Map category names to color types
        if (category.includes('BASEMEN') || category.includes('SHORTSTOPS') ||
            category.includes('OUTFIELDERS') || category.includes('PITCHERS') ||
            category.includes('CATCHERS')) {
            return 'position';
        }

        if (category.includes('YANKEES') || category.includes('RED_SOX') ||
            category.includes('DODGERS') || category.includes('GIANTS') ||
            category.includes('CARDINALS') || category.includes('CUBS') ||
            category.includes('ATHLETICS') || category.includes('BRAVES')) {
            return 'team';
        }

        if (category.includes('HALL_OF_FAME') || category.includes('MVP') ||
            category.includes('ALL_STAR')) {
            return 'award';
        }

        //Default return
        return 'era';
    };

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    const handleReset = () => {
        window.location.reload();
    }

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

            <div className="wordseries-button-area">
                <button className="wordseries-submit-button" onClick={() => {}}>Submit</button>
                <button className="wordseries-shuffle-button" onClick={() => setPlayers(shuffle([...players]))}>Shuffle</button>
            </div>

            {discoveredGroups.length > 0 && (
                <DiscoveredGroups groups={discoveredGroups} />
            )}

            <Grid
                players={players}
                selectedPlayers={selectedPlayers}
                onPlayerClick={handlePlayerClick}
                showError={showError}
            />

            {showGameOver && (
                <div className="wordseries-gameover-overlay">
                    <div className="wordseries-gameover-box">
                        <h2>Game Over</h2>
                        <p>No more attempts left!</p>
                        <button onClick={() => window.location.reload()}>Play Again</button>
                    </div>
                </div>
            )}
        </div>
    );
}
