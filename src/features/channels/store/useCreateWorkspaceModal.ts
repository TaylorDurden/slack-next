import { atom, useAtom } from "jotai";
import { useCallback } from "react";

interface CreateChannelModalState {
  isOpen: boolean;
}

const createChannelModalAtom = atom<CreateChannelModalState>({
  isOpen: false,
});

export const useCreateChannelModal = () => {
  const [state, setState] = useAtom(createChannelModalAtom);

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
