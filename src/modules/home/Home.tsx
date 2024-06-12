import React, { useEffect, useState } from 'react';
import { Checkout } from '../payment/checkout';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Message } from '../../shared/components/message/Message';
import axios from 'axios';

const Home: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");
    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [typeMessage, setTypeMessage] = useState<string>("success");
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (location.pathname.includes("success")) {
            try {
                axios.put(`${apiUrl}/api/finances/${id}/success`, {
                    message: "Contribuição feita com sucesso."
                })
                setMessage("Contribuição feita com sucesso.");
                setTypeMessage("success");
                setOpenMessage(true);
                navigate("/")
            }
            catch (error) {
                setMessage("Erro ao fazer a contribuição.");
                setTypeMessage("error");
                setOpenMessage(true);
            }
        }

        if (location.pathname.includes("cancel")) {
            try {
                axios.put(`${apiUrl}/api/finances/${id}/cancel`, {
                    message: "Contribuição cancelada."
                });
                setMessage("Contribuição cancelada.");
                setTypeMessage("error");
                setOpenMessage(true);
                navigate("/")
            } catch (error) {
                setMessage("Erro ao cancelar a contribuição.");
                setTypeMessage("error");
                setOpenMessage(true);
            }
        }
    }, []);

    return (
        <>                    
                      
    
        </>
    );
};

export default Home;