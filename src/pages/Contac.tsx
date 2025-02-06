import { useState, useRef, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import "../styles/contact.css"; // Importa tu CSS

const Contacto = () => {
  const [mensajeEnviado, setMensajeEnviado] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null); // Referencia del formulario

  const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el envío real del formulario

    if (!formRef.current) return; // Evita errores si la referencia no está disponible

    emailjs
      .sendForm(
        "service_9gm0zwm",  // Service ID correcto
        "template_pge84ee", // Template ID correcto
        formRef.current, // Usamos la referencia del formulario
        "TXOwyzlbEeen_ErwM" // Clave pública
      )
      .then(() => {
        setMensajeEnviado(true);
        formRef.current?.reset(); // Usa ?. para evitar errores si es null
        setTimeout(() => setMensajeEnviado(false), 5000);
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        alert("Error al enviar el correo. Revisa la consola.");
      });
  };

  return (
    <div className="contacto-container">
      <form ref={formRef} onSubmit={manejarEnvio} className="contacto-form">
        <h2>Contacto</h2>
        <input type="text" name="nombre" placeholder="Nombre" required />
        <input type="email" name="correo" placeholder="Correo" required />
        <input type="text" name="asunto" placeholder="Asunto" required />
        <textarea name="mensaje" placeholder="Mensaje" required></textarea>
        <button type="submit">Enviar</button>
        {mensajeEnviado && <p className="mensaje-exito">✅ ¡Mensaje enviado con éxito!</p>}
      </form>

      {/* Mapa de Google Maps */}
      <div className="mapa-container">
        <h3>📍 Nuestra Ubicación</h3>
        <iframe
          title="Mapa"
          className="mapa"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.282293907825!2d-76.28503669999999!3d3.522091699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3a05268093642d%3A0x3bc2d19f8eb8889f!2sPARQUE%20CIUDADELA%20PALMIRA!5e0!3m2!1ses-419!2sco!4v1737158410635!5m2!1ses-419!2sco"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contacto;
