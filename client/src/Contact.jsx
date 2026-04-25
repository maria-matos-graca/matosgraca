import SingleCardContentLayout from "./components/SingleCardContentLayout";
import ContactForm from "./components/ContactForm";

const Contact = ({English}) => {
    if(English)
    return (
        <SingleCardContentLayout
            isFirstRender={false}
            label="Contact"
            content={
                ContactForm({English})
            }
           />
        
    )
    return (
        <SingleCardContentLayout
            isFirstRender={false}
            label="Contacto"
            content={
                ContactForm({English})
            }
           />
    )
}

export default Contact;
