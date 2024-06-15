import { EventAvailable } from "@mui/icons-material"
import { Box } from "@mui/material"


export const TagTitle = () => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',            
            borderRadius: '1rem',
            width: '4rem',
            height: '4rem',
            backgroundColor: '#15b6b125',            
        
        }}>
            <EventAvailable color="secondary" sx={{ fontSize: '1.5rem'}} />
        </Box>
    )
}