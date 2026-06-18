import './index.css'

const CheckoutProgress = ({currentStep}) => {
  const steps = ['Address', 'Payment', 'Review', 'Success']

  return (
    <div className="progress-container">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div
            key={step}
            className={`step ${isActive ? 'active' : ''} ${
              isCompleted ? 'completed' : ''
            }`}
          >
            <div className="step-number">{stepNumber}</div>
            <span className="step-label">{step}</span>
          </div>
        )
      })}
    </div>
  )
}
export default CheckoutProgress
