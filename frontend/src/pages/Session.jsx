import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExerciseById } from '../data/exercises'
import './Session.css'

export default function Session() {
  const { id } = useParams()
  const navigate = useNavigate()
  const exercise = getExerciseById(id)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [reps] = useState(0)
  const [cameraError, setCameraError] = useState(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(() => setCameraError('Camera access denied or unavailable.'))

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function handleFinish() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    navigate(`/exercises/${id}`)
  }

  if (!exercise) {
    return (
      <div className="session-page">
        <p>Exercise not found.</p>
        <button onClick={() => navigate('/exercises')}>Back</button>
      </div>
    )
  }

  return (
    <div className="session-page">
      <div className="session-header">
        <span className="session-exercise-name">{exercise.name}</span>
        <button className="finish-btn" onClick={handleFinish}>
          Finish
        </button>
      </div>

      <div className="camera-container">
        {cameraError ? (
          <div className="camera-error">{cameraError}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="camera-feed" />
        )}

        <div className="rep-overlay">
          <span className="rep-count">{reps}</span>
          <span className="rep-label">reps</span>
        </div>
      </div>

    </div>
  )
}
