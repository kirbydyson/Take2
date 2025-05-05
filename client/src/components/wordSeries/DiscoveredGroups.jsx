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
