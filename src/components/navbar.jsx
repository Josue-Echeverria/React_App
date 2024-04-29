import React from 'react';
import NavButton from './navbutton';

function NavBar() {
    
  return (
    <div> 
        
        <NavButton title="Inicio"/>
        <NavButton title="Organización"/>
        <NavButton title="Laboratorios"/>
        <NavButton title="Webmail"/>
        <NavButton title="Foro"/>
        <NavButton title="Alianza Microsoft"/>
        <NavButton title="Sitio del ITCR"/>
        <NavButton title="Contactenos"/>
    </div>
  );
}

export default NavBar;
