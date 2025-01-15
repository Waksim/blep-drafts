import './socials_renderer.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const YOUTUBE_LINK = "https://www.youtube.com/@blepthecat"
const FEEDBACK_LINK = "https://forms.gle/PSLmSzCvsxnsuWKP6"
const BUG_LINK = "https://forms.gle/61V8gk3MdsanSeG3A"

export function SocialsRenderer() {
    return (
        <Container className={"mt-5"}>
            <Row className={"justify-content-center g-2"}>
                <Col className="version-box justify-content-center">
                    <label className="version-title">Genius Invokation Drafter v1.0</label>
                    <label className="version-text">Updated with v4.8 cards band balance changes!</label>
                </Col>
                <Col className="socials-bar text-center">
                    <a className="youtube" target="_blank" rel="noreferrer" href={YOUTUBE_LINK}>🎓Visit Invokation
                        Akademy
                        on Youtube</a>
                    <a className="youtube" target="_blank" rel="noreferrer" href={FEEDBACK_LINK}>🗒️Provide Feedback</a>
                    <a className="youtube" target="_blank" rel="noreferrer" href={BUG_LINK}>⚠️Report an Issue</a>
                </Col>
            </Row>
        </Container>
    )
}
