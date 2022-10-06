import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectWallet } from 'redux/walletSlice';

export const useWallet = () => {
  const wallet = useSelector(selectWallet);

  return useMemo(() => ({ wallet }), [wallet]);
};
