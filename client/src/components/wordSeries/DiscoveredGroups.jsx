import React from 'react';

export default function DiscoveredGroups({ groups }) {
    return (
        <div className="wordseries-discovered-container">
            {groups.map((group, index) => {
                let groupColorClass = '';
                switch (group.type) {
                    case 'team': groupColorClass = 'wordseries-yellow'; break;
                    case 'position': groupColorClass = 'wordseries-green'; break;
                    case 'award': groupColorClass = 'wordseries-purple'; break;
                    case 'era': groupColorClass = 'wordseries-blue'; break;
                    default: groupColorClass = '';
                }

                return (
                    <div key={index} className={`wordseries-discovered-group ${groupColorClass}`}>
                        <div className="wordseries-group-description">
                            {group.description}
                        </div>
                        <div className="wordseries-group-players">
                            {group.players.map(player => (
                                <div key={player.id} className="wordseries-group-player">
                                    {player.name}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}