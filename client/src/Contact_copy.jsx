import SingleCardContentLayout from "./SingleCardContentLayout";
import ContactForm from "./ContactForm_copy";

const Contact = ({English}) => {
    if(English)
    return (
        <SingleCardContentLayout
            isFirstRender={false}
            label="Contact"
            title="Get in Touch"
            content={
                ContactForm({English})
            }
           />
        
    )
    return (
        <SingleCardContentLayout
            isFirstRender={false}
            label="Contacto"
            title="Contacta-me"
            content={
                ContactForm({English})
            }
           />
    )
}

export default Contact;
