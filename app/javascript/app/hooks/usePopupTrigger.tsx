import { useState, useEffect, useRef } from 'react'
import scrollLock from 'scroll-lock'

/**
 * Hook for handling popup accessability.
 * Should be used for components that have triggers and steal a users focus.
 *
 * This hook returns utility function close/open along with whether the state is open or not.
 *
 * @param {object} popupOptions - Options object for trigger or popupProps
 *
 * @returns {object} - components necessary for accessibility.
 */
export const usePopupTrigger = (popupOptions = {}) => {
  const { triggerProps = {}, popupProps = {} } = popupOptions
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef()
  const buttonRef = useRef()
  const triggerRef = useRef()

  /**
   * Sets isOpen to false
   */
  const handleClose = () => {
    setIsOpen(false)
  }

  /**
   * Sets isOpen to true
   */
  const handleOpen = () => {
    setIsOpen(true)
  }

  /**
   * Sets isOpen to false when the escape key is clicked and isOpen is true
   */
  const handleKeyDown = (event) => event.keyCode === 27 && isOpen && handleClose()

  /**
   * Sets isOpen to false when the user clicks outside of the modal content
   */
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose()
    }
  }

  const trigger = { onClick: handleOpen, ref: triggerRef, ...triggerProps }

  const popup = {
    onClickOutside: handleClickOutside,
    onKeyDown: handleKeyDown,
    isOpen,
    role: 'dialog',
    onClose: handleClose,
    modalRef,
    buttonRef,
    ...popupProps,
  }

  /**
   * Decides whether to enable/disable scrolling when the modal is open/closed.
   */
  useEffect(() => {
    if (isOpen) {
      scrollLock.disablePageScroll()
    } else {
      scrollLock.enablePageScroll()
    }
  }, [isOpen])

  /**
   * Moves focus to the modal close button when it is opened
   */
  useEffect(() => {
    if (isOpen) {
      buttonRef.current && buttonRef.current.focus()
    } else {
      triggerRef.current && triggerRef.current.focus()
    }
  }, [isOpen])

  return {
    popup,
    trigger,
    isOpen,
    close: handleClose,
    open: handleOpen,
  }
}
