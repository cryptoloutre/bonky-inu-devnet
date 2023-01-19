import React from 'react';

const Inu = ({InuBottom, InuWidth, InuHeight, InuLeft}) => {

    return (
        <div style={{
            position: 'absolute',
            // backgroundColor: '#FA6E00',
            // backgroundImage: "url(https://7cmaaot3ehh4fm7uzgou5l4rkangnios5tyxf2zanybhh4ga5j2q.arweave.net/-JgAOnshz8Kz9MmdTq-RUBpmodLs8XLrIG4Cc_DA6nU)",
            backgroundImage: "url(https://arweave.net/7B4Kkqu8QobnRfqts35EmofBWW4sGg8JXw3VTnL5UEw)",
            width: InuWidth,
            height: InuHeight,
            left: InuLeft,
            bottom: InuBottom + (InuHeight/2),
        }}></div>
    )
}

export default Inu