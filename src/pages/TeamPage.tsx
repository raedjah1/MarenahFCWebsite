import { Team } from '../components/Team';
import './TeamPage.css';

export const TeamPage = () => {
  return (
    <div className="team-page">
      <div className="page-header">
        <div className="container">
          <h1>Meet Our Team</h1>
          <p>The passionate founders behind POV Reality</p>
        </div>
      </div>
      <Team />
    </div>
  );
}; 