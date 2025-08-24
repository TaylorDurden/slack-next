import { atom, useAtom } from "jotai";

interface CreateWorkspaceModalState {
  isOpen: boolean;
}

const createWorkspaceModalAtom = atom<CreateWorkspaceModalState>({
  isOpen: false,
});

export const useCreateWorkspaceModal = () => {
  const [state, setState] = useAtom(createWorkspaceModalAtom);

  const setIsOpen = (isOpen: boolean) => {
    setState({ isOpen });
  };

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!state.isOpen);

  return { isOpen: state.isOpen, setIsOpen, open, close, toggle };
};
