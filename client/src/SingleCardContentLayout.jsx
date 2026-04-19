const SingleCardContentLayout = ({title, content }) => {
    return (
        
            <div className="project-single-card">
                <h3 style={
                {    textAlign:'center'

                }}>{title}</h3>
                <h2>{content}</h2>
            </div>
            
        
    );
}

export default SingleCardContentLayout