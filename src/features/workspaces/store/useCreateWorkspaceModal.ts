import { atom, useAtom } from "jotai";
import { useCallback } from "react";

interface CreateWorkspaceModalState {
  isOpen: boolean;
}

const createWorkspaceModalAtom = atom<CreateWorkspaceModalState>({
  isOpen: false,
});

export const useCreateWorkspaceModal = () => {
  const [state, setState] = useAtom(createWorkspaceModalAtom);

  const setIsOpen = useCallback(
    (isOpen: boolean) => {
      setState({ isOpen });
    },
    [setState]
  );

  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggle = useCallback(() => setIsOpen(!state.isOpen), [setIsOpen, state.isOpen]);

  return { isOpen: state.isOpen, setIsOpen, open, close, toggle };
};
