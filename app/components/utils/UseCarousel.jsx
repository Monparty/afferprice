import { Carousel } from "antd";

function UseCarousel({ children, autoplay = false }) {
    return (
        <Carousel autoplay={autoplay} arrows>
            {children}
        </Carousel>
    );
}

export default UseCarousel;
