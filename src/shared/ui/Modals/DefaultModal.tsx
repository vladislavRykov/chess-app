import { type ReactNode } from "react";
import s from "./DefaultModal.module.scss";

interface DefaultModalT {
  onClose: () => void;
  children: ReactNode;
}

const DefaultModal = ({ children, onClose }: DefaultModalT) => {
  return (
    <div className={s.modal} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export default DefaultModal;
