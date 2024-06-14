import { LocationOn, LocationOnOutlined } from "@mui/icons-material"
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material"

export const CardEvent = () => {
    return (
        <Card sx={{ maxWidth: 400, margin: '0.5rem', boxShadow: 'none' }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="200"                    
                    image="public\background-header-mobile.png"
                    alt="Imagem de evento"
                    sx={{ borderRadius: '0.5rem'}}
                />
                <CardContent>
                    <Typography gutterBottom variant="body1" component="p" textAlign={"left"} fontWeight={400} fontSize={'0.8rem'}>
                        30 de março - 10:00
                    </Typography>
                    <Typography variant="body2" color="text.secondary" justifyContent={'center'} textAlign={'left'} fontWeight={600} fontSize={'0.8rem'}>
                        <LocationOnOutlined color="secondary" sx={{ fontSize: '1rem' }} />
                        Centro, Braço do Norte - SC
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}