import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function InstructionsModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                How To Play
                <IconButton
                    aria-label='close'
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
                    Guess the Scoredle in 6 tries.
                </Typography>
                <Typography gutterBottom>
                    Each guess must be a valid 5-letter word. The color of the
                    tiles will change to show how close your guess was to the
                    word, which should be the last name of a baseball player.
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <Typography variant='h6' gutterBottom>
                        Examples
                    </Typography>

                    <Grid container spacing={1} sx={{ mb: 1 }}>
                        {['A', 'V', 'E', 'R', 'Y'].map((letter, i) => (
                            <Grid item key={i}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor:
                                            i === 0
                                                ? '#6aaa64'
                                                : 'background.paper',
                                        color:
                                            i === 0
                                                ? 'common.white'
                                                : 'text.primary',
                                        border: '2px solid #ccc',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {letter}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography>
                        <b>A</b> is in the word and in the correct spot.
                    </Typography>

                    <Grid container spacing={1} sx={{ mt: 2, mb: 1 }}>
                        {['S', 'E', 'A', 'R', 'S'].map((letter, i) => (
                            <Grid item key={i}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor:
                                            i === 1
                                                ? '#c9b458'
                                                : 'background.paper',
                                        color:
                                            i === 1
                                                ? 'common.white'
                                                : 'text.primary',
                                        border: '2px solid #ccc',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {letter}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography>
                        <b>E</b> is in the word but in the wrong spot.
                    </Typography>

                    <Grid container spacing={1} sx={{ mt: 2, mb: 1 }}>
                        {['Y', 'O', 'U', 'N', 'G'].map((letter, i) => (
                            <Grid item key={i}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor:
                                            i === 3
                                                ? '#787c7e'
                                                : 'background.paper',
                                        color:
                                            i === 3
                                                ? 'common.white'
                                                : 'text.primary',
                                        border: '2px solid #ccc',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {letter}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography>
                        <b>N</b> is not in the word in any spot.
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
