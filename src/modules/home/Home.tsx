import React from 'react';
import Checkout from '../payment/checkout';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to our website!</h1>
            <p>Explore our services and learn more about what we do.</p>
            <img src="/path/to/image1.jpg" alt="Image 1" />
            <img src="/path/to/image2.jpg" alt="Image 2" />
            <Checkout />
        </div>
    );
};

export default Home;