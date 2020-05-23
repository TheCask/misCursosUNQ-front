import React from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SideBar = () => {
    const sidebarItems = [
        {name: 'Home', link: '/', icon: 'home'},
        {name: 'Courses', link: '/courses', icon: 'chalkboard'},
        {name: 'Users', link: '/users', icon: 'chalkboard-teacher'},
        {name: 'Subjects', link: '/subjects', icon: 'university'},
        {name: 'Students', link: '/students', icon: 'user-graduate'},
        {name: 'GitHub', link: 'https://github.com/TheCask/misCursosUNQ-front.git/', icon: ['fab', 'github']}
    ];

    return (
    <Navbar dark style={{height: '100%', margin: '0px', alignItems: 'start', backgroundColor: 'rgb(88, 14, 14)', opacity: 0.7, paddingRight: '40px'}}>
        <Nav navbar vertical style={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}>
            {
                sidebarItems.map(item => 
                    <NavItem>
                        <NavLink href={item.link} style={{alignItems: 'center', display: 'block', width: 'inherit' }}>
                            <FontAwesomeIcon icon={item.icon} size="1x" color="light" style={{valign: 'center', width: '45px'}}/>
                               {item.name}
                        </NavLink>
                    </NavItem>
                )
            }
        </Nav>
    </Navbar>
    )
}

export default SideBar;