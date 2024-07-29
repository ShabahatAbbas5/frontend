import React, { useState } from 'react';
import './Permits.css';
import ClearanceForm from './ClearanceForm';
import PropanePermitForm from './PropanePermitForm';
import SprinklerForm from './SprinklerForm';

function Permits() {
  const [currentForm, setCurrentForm] = useState('clearance');

  const renderForm = () => {
    switch (currentForm) {
      case 'clearance':
        return <ClearanceForm />;
      case 'propane':
        return <PropanePermitForm />;
      case 'sprinkler':
        return <SprinklerForm />;
      default:
        return <ClearanceForm />;
    }
  };

  return (
    <section id="Permits" className="col-md-8">
      <h2>South Summit Fire Protection District</h2>
      <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked/>
        <label className="btn btn-outline-primary" onClick={() => setCurrentForm('clearance')} htmlFor="btnradio1">Clearance Form</label>

        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off"/>
        <label className="btn btn-outline-primary" onClick={() => setCurrentForm('propane')} htmlFor="btnradio2">Propane Permit Form</label>

        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off"/>
        <label className="btn btn-outline-primary" onClick={() => setCurrentForm('sprinkler')} htmlFor="btnradio3">Sprinkler Form</label>
      </div>
      {renderForm()}
    </section>

  );
}

export default Permits;
