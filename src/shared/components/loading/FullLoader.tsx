import { Box, CircularProgress } from "@mui/material";

export const FullLoader: React.FC = () => (

    <Box sx={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',           
    }}>
        <CircularProgress color='secondary' />
    </Box>

)


export default FullLoader;