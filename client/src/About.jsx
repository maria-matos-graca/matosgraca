import ContentLayout from "./ContentLayout.jsx";
import TextFile from "./components/TextFile.jsx";

const About = ({ English }) => {
    if (English) {
        return (
            <ContentLayout
                isFirstRender={false}
                label="Who am I"
                title1="My Approach"
                content1={<TextFile filePath="/content/en/who-am-i.md" />}
                title2="My Vision"
                content2={<TextFile filePath="/content/en/my-approach.md" />}
            />
        );
    } else {
        return (
            <ContentLayout
                isFirstRender={false}
                label="Sobre Mim"
                title1="Quem sou"
                content1={<TextFile filePath="/content/pt/quem-sou.md" />}
                title2="A minha abordagem"
                content2={<TextFile filePath="/content/pt/a-minha-abordagem.md" />}
            />
        );
    }
};

export default About;