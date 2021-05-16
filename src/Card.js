

function Card({url, rotateDeg}) {
    
    return (
        <div className="card" style={{
            transform: `rotate(${rotateDeg}deg)`
        }}>
            <img src={url} />
        </div>
    )
}

export default Card