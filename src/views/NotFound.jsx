
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>404 Page not found!</h1>
      <p>We're sorry, the page you're looking for doesn't exist.</p>
      <button className="back-home-btn" onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
}
