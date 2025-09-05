import { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, FloatingLabel, Toast, ToastContainer, Spinner } from "react-bootstrap";
import contactImg from "../assets/img/contact-img.svg";
import "animate.css";
import TrackVisibility from "react-on-screen";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwpnnrzw"; // <-- seu endpoint

export const Contact = () => {
  const formRef = useRef(null);

  const [sending, setSending] = useState(false);
  const [validated, setValidated] = useState(false);
  const [toast, setToast] = useState({ show: false, title: "", body: "", bg: "success" });

  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    _gotcha: "", // honeypot (campo oculto)
  });

  const onFormUpdate = (field, value) =>
    setFormDetails((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // HTML5 validity + feedback do React-Bootstrap
    const form = formRef.current;
    const isValid = form.checkValidity();
    setValidated(true);
    if (!isValid) return;

    try {
      setSending(true);

      const data = new FormData();
      data.append("firstName", formDetails.firstName);
      data.append("lastName", formDetails.lastName);
      data.append("name", `${formDetails.firstName} ${formDetails.lastName}`.trim());
      data.append("email", formDetails.email);
      data.append("phone", formDetails.phone);
      data.append("message", formDetails.message);
      data.append("_gotcha", formDetails._gotcha); // honeypot

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        setToast({
          show: true,
          title: "Mensagem enviada ✅",
          body: "Obrigado pelo contato! Responderei em breve.",
          bg: "success",
        });
        setFormDetails({ firstName: "", lastName: "", email: "", phone: "", message: "", _gotcha: "" });
        setValidated(false);
        form.reset();
      } else {
        const payload = await res.json().catch(() => ({}));
        const msg = payload?.errors?.map((e) => e.message).join(", ") || "Falha no envio. Tente novamente.";
        setToast({ show: true, title: "Erro ❌", body: msg, bg: "danger" });
      }
    } catch {
      setToast({ show: true, title: "Erro de rede ❌", body: "Verifique sua conexão e tente novamente.", bg: "danger" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <img
                  className={isVisible ? "animate__animated animate__zoomIn" : ""}
                  src={contactImg}
                  alt="Contact"
                />
              )}
            </TrackVisibility>
          </Col>

          <Col xs={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2>Contact</h2>

                  <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                      <Col xs={12} sm={6} className="px-1">
                        <FloatingLabel label="First Name" className="mb-3">
                          <Form.Control
                            required
                            type="text"
                            name="firstName"
                            value={formDetails.firstName}
                            onChange={(e) => onFormUpdate("firstName", e.target.value)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Informe seu primeiro nome.
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>

                      <Col xs={12} sm={6} className="px-1">
                        <FloatingLabel label="Last Name" className="mb-3">
                          <Form.Control
                            required
                            type="text"
                            name="lastName"
                            value={formDetails.lastName}
                            onChange={(e) => onFormUpdate("lastName", e.target.value)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Informe seu sobrenome.
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>

                      <Col xs={12} sm={6} className="px-1">
                        <FloatingLabel label="Email Address" className="mb-3">
                          <Form.Control
                            required
                            type="email"
                            name="email"
                            value={formDetails.email}
                            onChange={(e) => onFormUpdate("email", e.target.value)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Informe um e-mail válido.
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>

                      <Col xs={12} sm={6} className="px-1">
                        <FloatingLabel label="Phone (opcional)" className="mb-3">
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formDetails.phone}
                            onChange={(e) => onFormUpdate("phone", e.target.value)}
                            pattern="^[0-9()+\-\s\.]{8,}$"
                          />
                          <Form.Control.Feedback type="invalid">
                            Informe um telefone válido (mín. 8 dígitos).
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>

                      <Col xs={12} className="px-1">
                        <FloatingLabel label="Message">
                          <Form.Control
                            required
                            as="textarea"
                            style={{ height: 140 }}
                            name="message"
                            value={formDetails.message}
                            onChange={(e) => onFormUpdate("message", e.target.value)}
                            minLength={10}
                          />
                          <Form.Control.Feedback type="invalid">
                            Escreva uma mensagem (mín. 10 caracteres).
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>

                      {/* Honeypot anti-spam (campo oculto) */}
                      <input
                        type="text"
                        name="_gotcha"
                        tabIndex="-1"
                        autoComplete="off"
                        value={formDetails._gotcha}
                        onChange={(e) => onFormUpdate("_gotcha", e.target.value)}
                        style={{ display: "none" }}
                      />

                      <Col xs={12} className="px-1 mt-3">
                        <button type="submit" disabled={sending} className="custom-btn">
                          <span>{sending ? "Sending..." : "Send"}</span>
                        </button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>

        {/* Toast de feedback */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            bg={toast.bg}
            show={toast.show}
            onClose={() => setToast((t) => ({ ...t, show: false }))}
            delay={4500}
            autohide
          >
            <Toast.Header closeButton>
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{toast.body}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </section>
  );
};
