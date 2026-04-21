import ContentLayout from "./ContentLayout.jsx";
import TextFile from "./components/TextFile.jsx";
import profilePhoto from "./assets/foto-perfil.jpg";

const About = ({ English }) => {
    const TextWithImage = ({ filePath }) => (
        <div className="text-with-image">
            <img 
                src={profilePhoto} 
                alt="Profile" 
                className="inline-profile-photo"
            />
            <TextFile filePath={filePath} />
        </div>
    );

    if (English) {
        return (
            <ContentLayout
                isFirstRender={false}
                label="Who am I"
                title1="Who am I"
                content1={<TextWithImage filePath="/content/en/who-am-i.md" />}
                title2="My approach"
                content2={<TextFile filePath="/content/en/my-approach.md" />}
            />
        );
    } else {
        return (
            <ContentLayout
                isFirstRender={false}
                label="Sobre Mim"
                title1="Quem sou"
                content1={<TextWithImage filePath="/content/pt/quem-sou.md" />}
                title2="A minha abordagem"
                content2={<TextFile filePath="/content/pt/a-minha-abordagem.md" />}
            />
        );
    }
};

export default About;