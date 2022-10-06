import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export const truncateAddress = (address: string) => {
  if (!address) return 'No Account';
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/,
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const truncateLongAddress = (address: string) => {
  if (!address) return 'No Account';
  const match = address.match(
    /^(0x[a-zA-Z0-9]{5})[a-zA-Z0-9]+([a-zA-Z0-9]{7})$/,
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num: any) => {
  const val = Number(num);
  return '0x' + val.toString(16);
};

export const useClipboard = () => {
  const toast = useToast();
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: text,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };
  return copy;
};

export const useCheckMobile = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const _isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent,
      );
    console.log(`check device type: ${_isMobile ? 'mobile' : 'desktop'}`);
    setIsMobile(_isMobile);
  }, []);

  return isMobile;
};
