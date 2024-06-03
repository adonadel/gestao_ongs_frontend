import React, { useEffect, useState } from 'react';
import { Checkout } from '../payment/checkout';
import { useLocation } from 'react-router-dom';
import { Message } from '../../shared/components/message/Message';

const Home: React.FC = () => {
    const location = useLocation();
    const [message, setMessage] = useState<string>("");
    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [typeMessage, setTypeMessage] = useState<string>("success");

    useEffect(() => {
        if (location.pathname.includes("success")) {
            setMessage("Contribuição feita com sucesso.");
            setTypeMessage("success");
            setOpenMessage(true);
        }

        if (location.pathname.includes("cancel")) {
            setMessage("Contribuição cancelada.");
            setTypeMessage("error");
            setOpenMessage(true);
        }
    }, []);

    return (
        <div>
            <h1>Welcome to our website!</h1>
            <p>Explore our services and learn more about what we do.</p>
            <img src="/path/to/image1.jpg" alt="Image 1" />
            <img src="/path/to/image2.jpg" alt="Image 2" />
            <Checkout />
            <Message
                message={message}
                open={openMessage}
                type={typeMessage}
                onClose={() => setOpenMessage(false)}
            />
        </div>
    );
};

export default Home;