import { IconButton, Typography } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CardEvent } from "../cardEvent/CardEvent";
import { ChevronLeft, ChevronRight, EventAvailable } from "@mui/icons-material";
import { useEffect, useState } from "react";
import TagTitle from "../tagTitle/TagTitle";
import axios from "axios";


export const EventsCarousel = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [events, setEvents] = useState<EventsWithDetails[]>([]);

    interface Medias {
        id: number;
        filaname_id: string;
    }

    interface EventsWithDetails {
        id: number;
        name: string;
        description: string;
        location: string;
        event_date: string;
        medias: Medias[];
    }

    interface ApiResponse {
        current_page: number;
        data: EventsWithDetails[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: { url: string | null; label: string; active: boolean }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    }

    const getCenterSlidePercentage = () => {
        if (window.innerWidth < 400) {
            return 100;
        } else if (window.innerWidth < 600) {
            return 80;
        } else if (window.innerWidth < 960) {
            return 50;
        } else {
            return 30;
        }
    };

    const [centerSlidePercentage, setCenterSlidePercentage] = useState(getCenterSlidePercentage());

    useEffect(() => {
        const handleResize = () => {
            setCenterSlidePercentage(getCenterSlidePercentage());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        try {
            axios.get<ApiResponse>(`${apiUrl}/api/events`)
                .then(response => {                    
                    setEvents(response.data.data);
                })
        } catch (error) {
            console.log(error);
        }
    }, []);



    const arrowStyles = {
        position: 'absolute',
        zIndex: 999,
        top: 'calc(50% - 15px)',
        width: 30,
        height: 30,
        cursor: 'pointer',
        background: '#fff',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
    };

    const indicatorStyles = {
        background: '#15b6b135',
        cursor: 'pointer',
        width: 10,
        height: 10,
        borderRadius: '50%',
        display: 'inline-block',
        margin: '0 8px',
        bottom: '-2rem',
        transition: 'width 0.5s ease',
    };


    return (
        <>
            <Typography variant="h2" color="secondary.dark" fontWeight={600} display={'flex'} alignItems={'center'} gap={2} sx={{
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}>
                <TagTitle backgroundColor="#15b6b125" icon={EventAvailable} iconColor="secondary.light" />

                Eventos
            </Typography>

            <Typography variant="body1" color="grey.600" mt={2} sx={{
                fontSize: { xs: '0.8rem', sm: '1rem' },
                mb: { xs: '1rem', sm: '2rem' }

            }}>
                Fique por dentro de todos nossos eventos, lives, sorteios e feirinhas!
            </Typography>


            <Carousel

                centerMode
                centerSlidePercentage={centerSlidePercentage}
                showThumbs={false}
                showStatus={false}
                infiniteLoop


                renderArrowPrev={(onClickHandler, hasPrev) =>
                    hasPrev && (
                        <IconButton color="secondary" onClick={onClickHandler} aria-label="left" sx={{
                            ...arrowStyles, left: 15,
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}>
                            <ChevronLeft />
                        </IconButton>
                    )
                }

                renderArrowNext={(onClickHandler, hasNext) =>
                    hasNext && (
                        <IconButton color="secondary" onClick={onClickHandler} aria-label="right" sx={{
                            ...arrowStyles, right: 15, '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}>
                            <ChevronRight />
                        </IconButton>
                    )
                }

                renderIndicator={(onClickHandler, isSelected, index, label) => {
                    if (isSelected) {
                        return (
                            <li
                                style={{ ...indicatorStyles, background: '#15b6b1' }}
                                aria-label={`Selected: ${label} ${index + 1}`}
                                title={`Selected: ${label} ${index + 1}`}
                            />
                        );
                    }
                    return (
                        <li
                            style={indicatorStyles}
                            onClick={onClickHandler}
                            onKeyDown={onClickHandler}
                            value={index}
                            key={index}
                            role="button"
                            tabIndex={0}
                            title={`${label} ${index + 1}`}
                            aria-label={`${label} ${index + 1}`}
                        />
                    );
                }}
            >
                {events &&

                    events.map((event: any) => (
                        <CardEvent location={event.location} schedule={event.event_date} srcImage={event.medias[0].filename_id} />
                    ))

                }
            </Carousel >
        </>

    )
};