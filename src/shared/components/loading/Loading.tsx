import { Box, Grid, LinearProgress } from "@mui/material";

export const Loading: React.FC = () => (
    <Grid item xs={12}>
        <Box sx={{ width: '80%', margin: '0 auto' }}>
            <LinearProgress color='secondary' />
        </Box>
    </Grid>
)