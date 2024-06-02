import axios from "axios";
import { useForm } from "react-hook-form";

export const Checkout = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { handleSubmit } = useForm();

    const onSubmit = async () => {
        const data = {
            "user_id": 1,
            "value": 20.00,
            "type": "INCOME",
            "description": "Stubborn Attachments by Tyler Cowen",
        }
        try {
            const response = await axios.post(`${apiUrl}/api/finances`, data);
            console.log('Checkout successful');
            window.location.href = response.data.session.url;
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <section>
            <div className="product">
                <img
                    src="https://i.imgur.com/EHyR2nP.png"
                    alt="The cover of Stubborn Attachments"
                />
                <div className="description">
                    <h3>Stubborn Attachments</h3>
                    <h5>$20.00</h5>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <button type="submit">Checkout</button>
            </form>
        </section>
    )
}