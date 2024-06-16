
import { LocationOnOutlined } from "@mui/icons-material"
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material"

interface CardEventProps {
    location: string,
    srcImage: string,
    schedule: string
}

export const CardEvent = (props: CardEventProps) => {
    return (
        <Card sx={{ maxWidth: 400, margin: '0.5rem', boxShadow: 'none', marginBottom: '4rem'}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="300"
                    image={props.srcImage}
                    alt="Imagem de evento"                    
                />
                <CardContent>
                    <Typography gutterBottom variant="body1" component="p" textAlign={"left"} fontWeight={400} fontSize={'0.8rem'}>
                        {props.schedule}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" justifyContent={'center'} textAlign={'left'} fontWeight={600} fontSize={'0.8rem'} mt={1}>
                        <LocationOnOutlined color="secondary" sx={{ fontSize: '1rem', mr: 1 }} />
                        {props.location}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}