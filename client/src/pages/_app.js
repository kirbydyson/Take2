import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import theme from '../../theme.js';
import '../app/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    '*, *::before, *::after': {
                        margin: 0,
                        padding: 0,
                        boxSizing: 'border-box',
                    },
                    html: {
                        height: '100%',
                        width: '100%',
                    },
                    body: {
                        height: '100%',
                        width: '100%',
                        margin: 0,
                        padding: 0,
                        fontFamily: 'Inter, sans-serif',
                        backgroundColor: '#fff',
                    },
                    '#__next': {
                        height: '100%',
                    },
                }}
            />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
