import { useMemo, useState } from 'react'
import './App.css'

const quizData = [
  {
    question: 'Which planet is known as the Red Planet?',
    choices: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    answer: 'Mars',
    note: 'Mars looks reddish because of iron oxide on its surface.',
  },
  {
    question: 'What is the largest ocean on Earth?',
    choices: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    answer: 'Pacific Ocean',
    note: 'The Pacific Ocean is the largest and deepest ocean on Earth.',
  },
  {
    question: 'How many continents are there?',
    choices: ['5', '6', '7', '8'],
    answer: '7',
    note: 'The commonly accepted model counts Asia, Africa, North America, South America, Europe, Australia, and Antarctica.',
  },
  {
    question: 'What gas do plants mainly absorb from the air?',
    choices: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    answer: 'Carbon Dioxide',
    note: 'Plants use carbon dioxide during photosynthesis.',
  },
  {
    question: 'Who painted the Mona Lisa?',
    choices: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Claude Monet'],
    answer: 'Leonardo da Vinci',
    note: 'Leonardo da Vinci painted the Mona Lisa in the early 16th century.',
  },
]

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState([])

  const currentQuestion = quizData[currentIndex]
  const isLastQuestion = currentIndex === quizData.length - 1
  const isCorrect = selected === currentQuestion.answer

  const progressLabel = useMemo(
    () => `${currentIndex + 1} / ${quizData.length}`,
    [currentIndex],
  )

  const handleSubmit = () => {
    if (!selected || submitted) return

    const correct = selected === currentQuestion.answer
    if (correct) setScore((prev) => prev + 1)

    setHistory((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected,
        answer: currentQuestion.answer,
        correct,
      },
    ])

    setSubmitted(true)
  }

  const handleNext = () => {
    if (!submitted) return
    setSelected('')
    setSubmitted(false)
    setCurrentIndex((prev) => prev + 1)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelected('')
    setSubmitted(false)
    setScore(0)
    setHistory([])
  }

  const finished = currentIndex >= quizData.length

  if (finished) {
    return (
      <main className="page-shell">
        <section className="quiz-card result-card">
          <span className="badge">Quiz Complete</span>
          <h1>Quiz Bite</h1>
          <p className="subtitle">A tiny general knowledge quiz for a quick brain warm-up.</p>

          <div className="score-ring">
            <strong>{score}</strong>
            <span>out of {quizData.length}</span>
          </div>

          <div className="result-copy">
            {score === quizData.length
              ? 'Perfect score. Your trivia instincts are suspiciously good.'
              : score >= 3
                ? 'Nice. Solid everyday knowledge power.'
                : 'Not bad. The quiz wins today, but not forever.'}
          </div>

          <div className="history-list">
            {history.map((item) => (
              <article key={item.question} className={`history-item ${item.correct ? 'good' : 'bad'}`}>
                <h2>{item.question}</h2>
                <p>
                  Your answer: <strong>{item.selected}</strong>
                </p>
                {!item.correct ? (
                  <p>
                    Correct answer: <strong>{item.answer}</strong>
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <button type="button" className="primary-button" onClick={handleRestart}>
            Play Again
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="quiz-card">
        <div className="topbar">
          <span className="badge">Simple Web Quiz</span>
          <span className="score-chip">Score {score}</span>
        </div>

        <h1>Quiz Bite</h1>
        <p className="subtitle">Five quick general knowledge questions. Pick, submit, and see how you do.</p>

        <div className="progress-block">
          <div className="progress-copy">
            <strong>Question {progressLabel}</strong>
            <span>{Math.round(((currentIndex + 1) / quizData.length) * 100)}% complete</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }}
            />
          </div>
        </div>

        <article className="question-card">
          <h2>{currentQuestion.question}</h2>
          <div className="choices">
            {currentQuestion.choices.map((choice) => {
              const checked = selected === choice
              const revealClass = submitted
                ? choice === currentQuestion.answer
                  ? 'correct'
                  : checked
                    ? 'wrong'
                    : ''
                : ''

              return (
                <button
                  key={choice}
                  type="button"
                  className={`choice ${checked ? 'selected' : ''} ${revealClass}`}
                  onClick={() => !submitted && setSelected(choice)}
                >
                  {choice}
                </button>
              )
            })}
          </div>
        </article>

        {submitted ? (
          <section className={`feedback ${isCorrect ? 'success' : 'fail'}`}>
            <strong>{isCorrect ? 'Correct!' : 'Not this time.'}</strong>
            <p>{currentQuestion.note}</p>
          </section>
        ) : null}

        <div className="actions">
          {!submitted ? (
            <button
              type="button"
              className="primary-button"
              onClick={handleSubmit}
              disabled={!selected}
            >
              Submit Answer
            </button>
          ) : (
            <button type="button" className="primary-button" onClick={isLastQuestion ? () => setCurrentIndex(quizData.length) : handleNext}>
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </button>
          )}

          <button type="button" className="ghost-button" onClick={handleRestart}>
            Restart
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
