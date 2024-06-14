import { Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CardEvent } from "../cardEvent/CardEvent";
export const AnimalCarousel = () => {
    return (

        <Carousel
            centerMode
            centerSlidePercentage={20}
            showThumbs={false}
            showStatus={false}
            infiniteLoop                         
        >
            <Box>
               <CardEvent/>
            </Box>
            <Box>
                <CardEvent/>
            </Box>
            <Box>
                <CardEvent/>
            </Box>

            <Box>
                <CardEvent/>
            </Box>
            <Box>
                <CardEvent/>
            </Box>
            <Box>
                <CardEvent/>
            </Box>
            <Box>
                <CardEvent/>
            </Box>
            <Box>
                <CardEvent/>
            </Box>
            <Box>
                <CardEvent/>
            </Box>
        </Carousel>
    )
};