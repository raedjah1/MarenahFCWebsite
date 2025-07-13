import './Academies.css';

export const Academies = () => {
  return (
    <section className="academies-section">
      <div className="container">
        <div className="academies-content">
          <div className="academies-group">
            <h3 className="academies-title">OUR PARTNERS</h3>
            <div className="badges-row">
              <div className="badge-item">
                <div className="badge-circle orange">
                  <i className="fas fa-fire"></i>
                </div>
              </div>
              <div className="badge-item">
                <div className="badge-circle red">
                  <i className="fas fa-crown"></i>
                </div>
              </div>
              <div className="badge-item">
                <div className="badge-circle blue">
                  <i className="fas fa-gem"></i>
                </div>
              </div>
              <div className="badge-item">
                <div className="badge-circle green">
                  <i className="fas fa-handshake"></i>
                </div>
              </div>
              <div className="badge-item">
                <div className="badge-circle purple">
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 