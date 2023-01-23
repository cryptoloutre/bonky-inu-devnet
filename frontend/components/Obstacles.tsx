import React from 'react';

const Obstacles = ({
    obstacleWidth, 
    obstacleHeight,
    obstaclesLeft,
    gap,
    height
}) => {

    return (
        <>
            <div style={{
                position: 'absolute',
                backgroundColor: "black",
                width: obstacleWidth,
                height: height - obstacleHeight - gap,
                left: obstaclesLeft,
                bottom: 0 + obstacleHeight + gap,
            }}></div>
            <div style={{
                position: 'absolute',
                backgroundColor: "black",
                width: obstacleWidth,
                height: obstacleHeight,
                left: obstaclesLeft,
                bottom: 0,
            }}></div>
        </>
    )
}

export default Obstacles