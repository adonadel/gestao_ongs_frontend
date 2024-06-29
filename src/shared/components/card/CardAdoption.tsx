import { Favorite } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material"
import { Link } from "react-router-dom";

export const CardAdoption = () => {
    return (
        <Box sx={
            {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                padding: '2rem',

                borderRadius: '1rem',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                border: '1px solid #E0E0E0',
                backgroundColor: 'white',
                textAlign: 'center'
            }

        }>
            <Typography variant="h2" color="secondary.main" fontWeight={'700'} fontSize={'1.2rem'}>QUERO ADOTAR</Typography>
            <img src="/card/card-adoption.svg" alt="" style={{
                objectFit: 'cover',
                maxWidth: '280px',
                maxHeight: '100px'

            }} />
            <Typography variant="body1" color="initial">Candidate-se para adoção responsável</Typography>

            <Button
                role={undefined}
                variant="contained"
                color="secondary"
                fullWidth
                tabIndex={-1}
                startIcon={<Favorite sx={{ color: '#ffffff50' }} />}
                sx={{
                    borderRadius: '2rem',
                    padding: '0.5rem 1.5rem',
                }}
                component={Link}
                to="/#adoption"
            >
                <Typography variant="body1" color="primary" fontWeight={'600'}>ADOTAR</Typography>
            </Button>
        </Box>
    )
}
