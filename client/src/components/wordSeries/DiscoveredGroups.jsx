/**
 * DiscoveredGroups.jsx
 *
 * This React component displays the groups of players that the user has correctly identified
 * in the MLB WordSeries game. Each group is shown with its description and a list of player names.
 *
 * Features:
 * - Renders a list of discovered groups with titles and player names.
 * - Formats and styles each group using neutral styling.
 *
 * Dependencies:
 * - React
 * - CSS classes for layout and styling
 */

import React from 'react';

export default function DiscoveredGroups({ groups }) {
    return (
        <div className='wordseries-discovered-container'>
            {groups.map((group, index) => {
                const playerNames = group.players.map((p) => p.name).join(', ');

                return (
                    <div
                        key={index}
                        className='wordseries-discovered-group neutral-style'
                    >
                        <div className='group-title'>
                            {group.description.toUpperCase()}
                        </div>
                        <div className='group-players'>({playerNames})</div>
                    </div>
                );
            })}
        </div>
    );
}
