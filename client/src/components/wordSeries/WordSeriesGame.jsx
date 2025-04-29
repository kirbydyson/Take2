import React, { useState, useEffect } from 'react';
import '../../styles/wordSeries.css';
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function WordSeriesGame() {
    const [players, setPlayers] = useState([]);

    return (
        <div className="wordseries-container">
            <div className="wordseries-header">
                <h1>MLB WordSeries</h1>
                <IconButton
                    aria-label="instructions"
                    onClick={() => setShowInstructions(true)}
                    className="wordseries-help-button"
                >
                    <HelpOutlineIcon />
                </IconButton>
            </div>

            <div className="wordseries-message-area">

            </div>
        </div>
    );
}