/**
 * WordSeriesInstructionsModal.jsx
 *
 * This React component renders a modal dialog that explains how to play the MLB WordSeries game.
 * It provides gameplay instructions and category examples for the player.
 *
 * Features:
 * - Modal dialog with title and close button.
 * - Step-by-step instructions for submitting guesses.
 * - Example player group categories to guide the user.
 * - Styled using Material UI components and layout.
 *
 * Dependencies:
 * - React
 * - Material UI (Dialog, DialogTitle, DialogContent, IconButton, CloseIcon, Typography, Box)
 *
 */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function InstructionsModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                How to Play
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    Find groups of four players that share something in common.
                </Typography>
                <Box sx={{ ml: 2 }}>
                    <Typography component="ul">
                        <li>
                            <Typography component="span">
                                Select four players and tap <b>'Submit'</b> to check if your guess is correct.
                            </Typography>
                        </li>
                        <li>
                            <Typography component="span">
                                Find all the groups without making 4 mistakes!
                            </Typography>
                        </li>
                    </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Category Examples
                    </Typography>
                    <Typography sx={{ ml: 2 }}>
                        • <b>Catchers</b>: Johnny Bench, Mike Piazza, Yogi Berra, Carlton Fisk
                    </Typography>
                    <Typography sx={{ ml: 2 }}>
                        • <b>Players Named “Doc”</b>: Doc Gooden, Doc Medich, Doc White, Doc Crandall
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
