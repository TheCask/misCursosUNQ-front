import React from 'react';
import AppNavbar from './AppNavbar';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'

export class Home extends ComponentWithErrorHandling {

  render() {
    return (
      <div>
        <AppNavbar>
        {this.renderErrorModal()}
        <br></br>
        <iframe id="CiSite" title="Embed CI Site" width="100%" height="100%"
          src="http://ciclointroductoriocyt.web.unq.edu.ar/"></iframe>
        </AppNavbar>
      </div>
    );
  }
}

export default Home;
