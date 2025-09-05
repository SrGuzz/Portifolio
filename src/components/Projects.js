import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import projImg1 from "../assets/img/barber-flow.png";
import projImg2 from "../assets/img/conselhos.png";
import projImg3 from "../assets/img/glet.png";
import projImg4 from "../assets/img/portal-dtic.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {

  const projects = [
    {
      title: "Barber Flow",
      description: "Finance & Operational control",
      imgUrl: projImg1,
      link: "http://barberflow.tecnologia.ws/"
    },
    {
      title: "Council Portal",
      description: "Public Management & Social Participation",
      imgUrl: projImg2,
      link: "https://portaldosconselhos.mg.gov.br/"  
    },
    {
      title: "GLET",
      description: "Logistic & Transport",
      imgUrl: projImg3,
      link: "https://github.com/SrGuzz/GLET"
    },
    {
      title: "Portal DTIC",
      description: "Internal Control",
      imgUrl: projImg4,
      link: "#"
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2>Projects</h2>
                <p>Below are some of my projects from GitHub, showcasing my work and learning journey.</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Tab 1</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Tab 2</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Tab 3</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
                      <Row>
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <p>shortly!</p>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <p>shortly!</p>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="Background decoration"></img>
    </section>
  )
}
