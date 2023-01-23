import React from 'react';

const Inu = ({InuBottom, InuWidth, InuHeight, InuLeft}) => {

    return (
        <div style={{
            position: 'absolute',
            backgroundImage: "url(https://arweave.net/7B4Kkqu8QobnRfqts35EmofBWW4sGg8JXw3VTnL5UEw)",
            width: InuWidth,
            height: InuHeight,
            left: InuLeft,
            bottom: InuBottom + (InuHeight/2),
        }}></div>
    )
}

export default Inu