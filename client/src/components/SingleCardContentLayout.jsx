const SingleCardContentLayout = ({title, content }) => {
    return (
        
            <div className="project-card">
                <h3 style={
                {    textAlign:'center'

                }}>{title}</h3>
                {content}
            </div>
                   
    );
}

export default SingleCardContentLayout