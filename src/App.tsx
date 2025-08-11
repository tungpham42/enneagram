import React, { useState, JSX } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Modal,
  Form,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faList,
  faCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

// Enneagram playful colorful design

type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Question {
  id: number;
  text: string;
  type: EnneagramType;
}

const QUESTIONS: Question[] = [
  { id: 1, text: "I try to be morally good and avoid mistakes.", type: 1 },
  { id: 2, text: "I want to be helpful and appreciated by others.", type: 2 },
  { id: 3, text: "I work hard to be successful and admired.", type: 3 },
  {
    id: 4,
    text: "I often feel different from others and seek identity.",
    type: 4,
  },
  { id: 5, text: "I value competence and need time to think.", type: 5 },
  {
    id: 6,
    text: "I seek security and often worry about what might go wrong.",
    type: 6,
  },
  {
    id: 7,
    text: "I try to keep my options open and look for exciting experiences.",
    type: 7,
  },
  { id: 8, text: "I assert myself and try to be in control.", type: 8 },
  { id: 9, text: "I prefer harmony and tend to avoid conflict.", type: 9 },
  {
    id: 10,
    text: "I want things to be fair and right; I critique when needed.",
    type: 1,
  },
  { id: 11, text: "I often put others' needs before my own.", type: 2 },
  {
    id: 12,
    text: "I focus on image and achieving measurable results.",
    type: 3,
  },
  { id: 13, text: "I feel intense emotions and value authenticity.", type: 4 },
  {
    id: 14,
    text: "I like deep study and prefer minimal distractions.",
    type: 5,
  },
  { id: 15, text: "I look for guidance and support when unsure.", type: 6 },
  { id: 16, text: "I avoid pain by staying upbeat and busy.", type: 7 },
  {
    id: 17,
    text: "I defend people I care about and dislike vulnerability.",
    type: 8,
  },
  { id: 18, text: "I adapt to others' wishes to keep peace.", type: 9 },
];

const TYPE_COLORS: Record<EnneagramType, string> = {
  1: "primary",
  2: "success",
  3: "warning",
  4: "info",
  5: "secondary",
  6: "danger",
  7: "warning",
  8: "dark",
  9: "success",
};

const TYPE_DESCRIPTIONS: Record<
  EnneagramType,
  { name: string; short: string }
> = {
  1: {
    name: "The Reformer (Type 1)",
    short: "Principled, idealistic, self-controlled.",
  },
  2: {
    name: "The Helper (Type 2)",
    short: "Generous, people-pleasing, empathetic.",
  },
  3: {
    name: "The Achiever (Type 3)",
    short: "Ambitious, image-conscious, adaptable.",
  },
  4: {
    name: "The Individualist (Type 4)",
    short: "Introspective, expressive, unique.",
  },
  5: {
    name: "The Investigator (Type 5)",
    short: "Curious, private, perceptive.",
  },
  6: {
    name: "The Loyalist (Type 6)",
    short: "Reliable, anxious, security-oriented.",
  },
  7: {
    name: "The Enthusiast (Type 7)",
    short: "Spontaneous, optimistic, adventurous.",
  },
  8: {
    name: "The Challenger (Type 8)",
    short: "Decisive, protective, assertive.",
  },
  9: {
    name: "The Peacemaker (Type 9)",
    short: "Easygoing, receptive, supportive.",
  },
};

export default function EnneagramTestApp(): JSX.Element {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  function handleAnswer(qid: number, value: number) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function calculateScores() {
    const typeScores: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };
    for (const q of QUESTIONS) {
      const val = answers[q.id] ?? 0;
      typeScores[q.type] += val;
    }
    return typeScores as Record<EnneagramType, number>;
  }

  function getTopTypes() {
    const scores = calculateScores();
    const entries = Object.entries(scores) as [string, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries
      .slice(0, 3)
      .map(([type, score]) => ({ type: Number(type) as EnneagramType, score }));
  }

  const answeredCount = QUESTIONS.filter(
    (q) => answers[q.id] !== undefined
  ).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center bg-light p-3 rounded shadow-sm">
        <Col>
          <h3 className="fw-bold text-primary">
            <FontAwesomeIcon icon={faList} /> Enneagram Quick Test
          </h3>
          <small className="text-muted">
            Answer honestly — 1=Strongly disagree ... 5=Strongly agree
          </small>
        </Col>
        <Col xs="auto">
          <Button
            variant="outline-danger"
            onClick={() => {
              setAnswers({});
              setShowResults(false);
            }}
          >
            <FontAwesomeIcon icon={faCheck} /> Reset
          </Button>
        </Col>
      </Row>

      <Card className="mb-4 border-0 shadow-sm bg-gradient bg-primary text-white">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <strong>Progress</strong>
              <ProgressBar
                now={progress}
                label={`${answeredCount}/${QUESTIONS.length}`}
                variant="success"
                className="mt-2"
              />
            </Col>
            <Col xs="auto">
              <Button
                disabled={answeredCount < QUESTIONS.length}
                variant="light"
                onClick={() => setShowResults(true)}
              >
                <FontAwesomeIcon icon={faSmile} /> See Results
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col md={8}>
          {QUESTIONS.map((q, i) => (
            <Card
              key={q.id}
              className={`mb-3 shadow-sm border-${
                TYPE_COLORS[q.type]
              } border-2`}
            >
              <Card.Body className={i % 2 === 0 ? "bg-light" : "bg-white"}>
                <Row>
                  <Col md={8}>
                    <div className="fw-bold">
                      Q{q.id}. {q.text}
                    </div>
                    <div className="text-muted small">
                      Maps to:{" "}
                      <Badge bg={TYPE_COLORS[q.type]}>
                        {TYPE_DESCRIPTIONS[q.type].name}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={4} className="d-flex align-items-center">
                    <Form className="d-flex justify-content-around w-100">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Form.Check
                          key={n}
                          type="radio"
                          name={`q-${q.id}`}
                          id={`q-${q.id}-${n}`}
                          label={n}
                          checked={answers[q.id] === n}
                          onChange={() => handleAnswer(q.id, n)}
                        />
                      ))}
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Live Scores</h5>
              {Object.entries(calculateScores()).map(([t, s]) => (
                <div
                  key={t}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <small>
                    {TYPE_DESCRIPTIONS[Number(t) as EnneagramType].name}
                  </small>
                  <Badge bg={TYPE_COLORS[Number(t) as EnneagramType]}>
                    {s}
                  </Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showResults}
        onHide={() => setShowResults(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FontAwesomeIcon icon={faStar} /> Your Enneagram Results
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {getTopTypes().map((t) => (
              <Col md={4} key={t.type} className="mb-3">
                <Card
                  className={`border-${TYPE_COLORS[t.type]} border-2 shadow-sm`}
                >
                  <Card.Body>
                    <h6>{TYPE_DESCRIPTIONS[t.type].name}</h6>
                    <p className="mb-1">
                      <strong>Score:</strong> {t.score}
                    </p>
                    <p className="small text-muted">
                      {TYPE_DESCRIPTIONS[t.type].short}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResults(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
