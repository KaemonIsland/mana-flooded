import React from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import FocusTrap from 'focus-trap-react'

const ModalBackdrop = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  transform: translateZ(0);
  background-color: hsla(0, 0%, 49%, 0.35);
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.spaceScale(1)};
  padding: ${({ theme }) => theme.spaceScale(5)};
  padding-top: ${({ theme }) => theme.spaceScale(7)};
  background-color: #ffffff;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media screen and (min-width: 500px) {
    left: 50%;
    top: 50%;
    height: auto;
    transform: translate(-50%, -50%);
    max-width: ${({ theme }) => theme.spaceScale(14)};
    max-height: calc(100% - 1em);
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5em;
  line-height: 1;
  background: ${({ theme }) => theme.color.grey[1]};
  border: 2px solid ${({ theme }) => theme.color.grey[1]};
  border-radius: 0 ${({ theme }) => theme.spaceScale(1)} 0 0;
  box-shadow: 0;
  cursor: pointer;
  outline: none;

  &:focus,
  &:active,
  &:hover {
    border: 2px solid ${({ theme }) => theme.color.grey[3]};
  }
`

const CloseButtonIcon = styled.svg`
  width: 25px;
  height: 25px;
  fill: transparent;
  stroke: black;
  stroke-linecap: round;
  stroke-width: 2;
`

const ModalMainContent = styled.div`
  padding-top: 0.25em;
`

const CloseButtonText = styled.span`
  border: 0 !important;
  clip: rect(0 0 0 0) !important;
  height: 1px !important;
  margin: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
`

/**
 * Modal component that uses React Portals!
 *
 * @param {boolean} isOpen - Determines if we should render the modal
 * @param {function} onClose - Function that gets called when the close icon is clicked
 * @param {string} role - The role of the modal
 * @param {string} ariaLabel - A label describing the Modal's current content
 * @param {ref} modalRef - Used to reference the modal for onClickOutside handling
 * @param {ref} buttonRef - Allows focusing and un-focusing of the modal when it's opened/closed.
 * @param {function} onClickOutside - Handles clicking outside the modal, used for closing it automatically.
 *
 * @returns {function} React component that is rendered at the end of the content
 */
export const Modal = ({
  isOpen,
  onClose,
  role = 'dialog',
  ariaLabel = 'modal',
  modalRef,
  buttonRef,
  onClickOutside,
  children,
  ...props
}) => {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <FocusTrap as="aside">
      <ModalBackdrop
        aria-modal="true"
        tabIndex="-1"
        role={role}
        aria-label={ariaLabel}
        onClick={onClickOutside}
        {...props}
      >
        <ModalContainer ref={modalRef}>
          <CloseButton onClick={onClose} aria-labelledby="close-modal" ref={buttonRef}>
            <CloseButtonText id="close-modal">Close Modal</CloseButtonText>
            <CloseButtonIcon viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
            </CloseButtonIcon>
          </CloseButton>
          <ModalMainContent>{children}</ModalMainContent>
        </ModalContainer>
      </ModalBackdrop>
    </FocusTrap>,
    document.body,
  )
}
