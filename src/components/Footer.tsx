import { FC } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import '../styles/footer.css';

const Footer: FC = () => {
  return (
    <footer className="container-footer">
      <Container>
        <Row>
          <Col md={4} className="text-center mb-3">
            <img
              src="/images/sakman37logo1.jpg"
              alt="q"
              className="footer-logo"
            />
          </Col>

          <Col md={4} className="text-center mb-3">
          </Col>

          <Col md={4} className="text-start mb-3">
            <p className='enlaces-text'>Contactame</p>
            <p className="contact-description">
              • Papayal, Palmira, Valle del Cauca   <br />
              • Palmira: +57 3206194957 <br />
              • sakman37xd@gmail.com
            </p>
            <div className="social-icons">
              <a href="https://web.facebook.com/juanCR337" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} className="text-white mx-2" />
              </a>
              <a href="https://api.whatsapp.com/send/?phone=573206194957&text=¡Hola+Juan%21&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={30} className="text-white mx-2" />
              </a>
              <a href="https://www.instagram.com/sakman_37/" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={30} className="text-white mx-2" />
              </a>
            </div>
          </Col>
        </Row>

        <Row>
          <Col className="text-start py-2">
            <p className="mb-0" style={{ fontSize: '15px' }}>
              &copy; {new Date().getFullYear()} Juan Pablo Canchala Rodriguez derechos reservados. Privacy | Terms of service
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
