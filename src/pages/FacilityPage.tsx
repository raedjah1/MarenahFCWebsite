
import { useTranslation } from 'react-i18next';
import './FacilityPage.css';
import futureFacilityImage from '../assets/images/futurefacility.png';

export const FacilityPage = () => {
  const { t } = useTranslation();

  // Get features arrays with proper typing
  const youthFeatures = t('facility.programs.youth.features', { returnObjects: true }) as string[];
  const preProFeatures = t('facility.programs.pre_professional.features', { returnObjects: true }) as string[];
  const eliteFeatures = t('facility.programs.elite.features', { returnObjects: true }) as string[];

  return (
    <div className="facility-page">
      <div className="facility-content">
        <div className="academy-section">
          <div className="section-header">
            <h2>{t('facility.title')}</h2>
            <p>{t('facility.subtitle')}</p>
          </div>

          {/* Future Facility Showcase */}
          <div className="future-facility-showcase">
            <div className="facility-image-container">
              <img 
                src={futureFacilityImage} 
                alt={t('facility.future_complex')}
                className="facility-image"
              />
              <div className="facility-overlay">
                <h3>{t('facility.future_complex')}</h3>
                <p>{t('facility.architectural_vision')}</p>
              </div>
            </div>
            <div className="facility-quick-stats">
              <div className="quick-stat">
                <i className="fas fa-futbol"></i>
                <span>{t('facility.stats.pitches')}</span>
              </div>
              <div className="quick-stat">
                <i className="fas fa-users"></i>
                <span>{t('facility.stats.players')}</span>
              </div>
              <div className="quick-stat">
                <i className="fas fa-graduation-cap"></i>
                <span>{t('facility.stats.education')}</span>
              </div>
            </div>
          </div>

          <div className="academy-content">
            <div className="academy-overview">
              <div className="academy-vision">
                <h3>{t('facility.vision.title')}</h3>
                <p>{t('facility.vision.description')}</p>

                <div className="programs-grid">
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-child"></i>
                    </div>
                    <div className="program-content">
                      <h4>{t('facility.programs.youth.title')}</h4>
                      <p>{t('facility.programs.youth.description')}</p>
                      <ul className="program-features">
                        {youthFeatures.map((feature, index) => (
                          <li key={index}><i className="fas fa-check"></i>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-user-graduate"></i>
                    </div>
                    <div className="program-content">
                      <h4>{t('facility.programs.pre_professional.title')}</h4>
                      <p>{t('facility.programs.pre_professional.description')}</p>
                      <ul className="program-features">
                        {preProFeatures.map((feature, index) => (
                          <li key={index}><i className="fas fa-check"></i>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                    <div className="program-content">
                      <h4>{t('facility.programs.elite.title')}</h4>
                      <p>{t('facility.programs.elite.description')}</p>
                      <ul className="program-features">
                        {eliteFeatures.map((feature, index) => (
                          <li key={index}><i className="fas fa-check"></i>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="academy-facilities">
              <h3>{t('facility.facilities.title')}</h3>
              <div className="academy-features">
                <div className="academy-feature">
                  <i className="fas fa-futbol"></i>
                  <div>
                    <h4>{t('facility.facilities.training.title')}</h4>
                    <p>{t('facility.facilities.training.description')}</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-home"></i>
                  <div>
                    <h4>{t('facility.facilities.accommodation.title')}</h4>
                    <p>{t('facility.facilities.accommodation.description')}</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-book"></i>
                  <div>
                    <h4>{t('facility.facilities.education.title')}</h4>
                    <p>{t('facility.facilities.education.description')}</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-heartbeat"></i>
                  <div>
                    <h4>{t('facility.facilities.medical.title')}</h4>
                    <p>{t('facility.facilities.medical.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 