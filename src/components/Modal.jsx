import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = function Modal({ open, children }) {
  const dialog = useRef();

  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal();
  //     },
  //     close: () => {
  //       dialog.current.close();
  //     },
  //   };
  // });
useEffect(()=>{
if(open){
  dialog.current.showModal();
}else{
  dialog.current.close();
}
},[open]);

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
