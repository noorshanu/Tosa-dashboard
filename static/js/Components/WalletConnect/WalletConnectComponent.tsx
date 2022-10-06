import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  VStack,
  Text
} from '@chakra-ui/react';
import { setWallet } from 'redux/walletSlice';
import { useDispatch } from 'react-redux';
import { truncateAddress } from 'Services/global';
import { useWallet } from 'Services/wallet';
import { useContractMetamaskLogin } from 'Services/contract';
import { useLogoutMutation } from 'redux/api';

const App = () => {
  const dispatch = useDispatch();
  const { isOpen, onClose } = useDisclosure();
  const { wallet } = useWallet();
  const requestAccount = useContractMetamaskLogin();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    const response = await logout();
    if ('data' in response) {
      dispatch(
        setWallet({
          provider: undefined,
          address: undefined,
          authenticated: false,
        }),
      );
    }
  };

  const handleLogin = () => {
    requestAccount ? requestAccount() : alert("mobile hasn't web3 support");
  };

  return (
    <>
      {wallet.address ? (
        <Button onClick={handleLogout}>
          <Text>{wallet && truncateAddress(wallet.address)}</Text>
        </Button>
      ) : (
        <Button onClick={handleLogin}>Connect Wallet</Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Connection Method</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Button onClick={() => {}}>Coinbase Wallet</Button>
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                WalletConnect
              </Button>
              <Button
                onClick={() => {
                  handleLogin();
                  onClose();
                }}
              >
                Metamask
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
