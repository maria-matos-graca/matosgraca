const ContentLayout = ({title1, content1, title2, content2 }) => {
    return (
        <main className="container">
        <div className="project-grid">
            <div className="project-card">
                <h3>{title1}</h3>
                {content1}
            </div>
            <div className="project-card">
                <h3>{title2}</h3>
                {content2}
            </div>
        </div>
        </main>
    );
}

export default ContentLayout