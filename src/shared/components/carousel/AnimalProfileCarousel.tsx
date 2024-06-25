import { IconButton } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface Medias {
    id: number;
    filaname_id: string;
}

interface AnimalMedia {
    media: Medias[] | undefined;
}

export const AnimalProfileCarousel = (props: AnimalMedia) => {
    const apiImageUrl = import.meta.env.VITE_URL_IMAGE;    

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
        background: '#ffffff25',
        cursor: 'pointer',
        width: 10,
        height: 10,
        borderRadius: '50%',
        display: 'inline-block',
        margin: '0 8px',        
        transition: 'width 0.5s ease',
    };

    return (
        <>
            <Carousel                                
                showThumbs={false}
                showStatus={false}                
                dynamicHeight={false}
                
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
                                style={{ ...indicatorStyles, background: '#fff' }}
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
                {props.media &&

                    props.media.map((media: any) => (
                        <img src={apiImageUrl + media.filename_id} alt="Imagem de perfil animal" style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '25rem',
                            borderRadius: '1rem'
                        }}/>
                    ))

                }
            </Carousel >
        </>

    )
};