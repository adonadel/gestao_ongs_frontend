import { LocationOnOutlined } from "@mui/icons-material";
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { parseISO, format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardEventProps {
    location: string;
    srcImage: string;
    schedule: string;
}

export const CardEvent = (props: CardEventProps) => {
    const apiImage = import.meta.env.VITE_URL_IMAGE;
    const [newDate, setNewDate] = useState<string>("");

    useEffect(() => {
        const formatDate = () => {            
            const parsedDate = parseISO(props.schedule);
            if (isValid(parsedDate)) {
                const formattedDate = format(parsedDate, "dd 'de' MMMM ' - ' yyyy", { locale: ptBR });
                setNewDate(formattedDate);
            } else {
                console.error("Data inválida após o parsing:", props.schedule);
            }
        };

        formatDate();
    }, [props.schedule]);

    return (
        <Card sx={{ maxWidth: 400, margin: '0.5rem', boxShadow: 'none', marginBottom: '4rem' }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="300"
                    image={apiImage + props.srcImage}
                    alt="Imagem de evento"
                />
                <CardContent>
                    <Typography gutterBottom variant="body1" component="p" textAlign={"left"} fontWeight={400} fontSize={'0.8rem'}>
                        {newDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" justifyContent={'center'} textAlign={'left'} fontWeight={600} fontSize={'0.8rem'} mt={1}>
                        <LocationOnOutlined color="secondary" sx={{ fontSize: '1rem', mr: 1 }} />
                        {props.location}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
