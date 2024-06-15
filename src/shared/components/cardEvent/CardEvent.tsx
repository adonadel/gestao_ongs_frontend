import { LocationOnOutlined } from "@mui/icons-material"
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material"


export const CardEvent = () => {
    return (
        <Card sx={{ maxWidth: 400, margin: '0.5rem', boxShadow: 'none', marginBottom: '4rem'}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="300"
                    image="public\background-header-mobile.png"
                    alt="Imagem de evento"                    
                />
                <CardContent>
                    <Typography gutterBottom variant="body1" component="p" textAlign={"left"} fontWeight={400} fontSize={'0.8rem'}>
                        30 de março - 10:00
                    </Typography>
                    <Typography variant="body2" color="text.secondary" justifyContent={'center'} textAlign={'left'} fontWeight={600} fontSize={'0.8rem'} mt={1}>
                        <LocationOnOutlined color="secondary" sx={{ fontSize: '1rem', mr: 1 }} />
                        Centro, Braço do Norte - SC
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}