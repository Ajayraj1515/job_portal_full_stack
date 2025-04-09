import React from 'react';
 import styled from 'styled-components';

 const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px 20px;
  }
 `;

 const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 24px;
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
  }
 `;

 const NavItem = styled.li`
  a {
    text-decoration: none;
    color: #333;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    padding-bottom: 4px;
    transition: color 0.3s ease;

    &:hover {
      color: #007bff;
    }

    &::after {
      content: "";
      position: absolute;
      height: 2px;
      width: 0;
      bottom: 0;
      left: 0;
      background-color: #007bff;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
 `;

 const CreateJobButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    margin-top: 10px;
  }
 `;

 function Navbar({ onCreateJobClick }) {
  return (
    <NavbarContainer>
      <NavList>
        <NavItem><a href="/">Home</a></NavItem>
        <NavItem><a href="/find-job">Find Job</a></NavItem>
        <NavItem><a href="/about-us">About Us</a></NavItem>
        <NavItem><a href="/testimonials">Testimonials</a></NavItem>
      </NavList>
      <CreateJobButton onClick={onCreateJobClick}>Create Job</CreateJobButton>
    </NavbarContainer>
  );
 }

 export default Navbar;