import WalletConnectComponent from 'Components/WalletConnect/WalletConnectComponent';
import PollPage from 'Pages/PollPage';
import WelcomePage from 'Pages/WelcomePage';
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { usePoll } from 'Services/poll';
import { pollSelectAction } from 'redux/pollSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useCoinTresholdMutation } from 'redux/api';

const App = () => {
  const dispatch = useDispatch();
  const { pollSelected } = usePoll();
  const [coinTreshold] = useCoinTresholdMutation();
  const handleDeselectPoll = () => {
    // window.location.href = `${process.env.REACT_APP_URL}`;
    dispatch(pollSelectAction());
  };

  useEffect(() => {
    coinTreshold();
  }, [coinTreshold]);

  useEffect(() => {
    const urlParts = window.location.href.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const pollId = parseInt(lastPart);
    if (!isNaN(pollId)) {
      dispatch(pollSelectAction(pollId));
    } else {
      dispatch(pollSelectAction());
    }
  }, [dispatch]);

  const handleOpenTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container
      maxWidth="full"
      p={0}
      bg="transparent
    radial-gradient(closest-side at 50% 50%, #2866b9 0%, #1e3469 100%) 0% 0%
    no-repeat padding-box"
      h={{ base: '1360px', md: 'auto' }}
    >
      <Flex
        maxW="1920px"
        margin="auto"
        h={'100vh'}
        py={{ base: 5, md: 10 }}
        px={{ base: 5, md: 10 }}
      >
        <VStack w="full" h="full">
          {/* Header */}
          <Flex minWidth="full" alignItems="center" gap="2">
            <Box onClick={handleDeselectPoll} cursor="pointer">
              <Image
                h="100px"
                src="./assets/images/dosa_bomb_image.png"
              ></Image>
            </Box>
            <Spacer></Spacer>
            <Flex gap={2} direction={{ base: 'column', md: 'row' }}>
              <Button
                variant={'secondary'}
                backgroundColor="brand.900"
                onClick={() => handleOpenTab('https://www.dosa.finance')}
              >
                Mint &nbsp;
                <Text>NFT</Text>
              </Button>
              <Button
                variant={'secondary'}
                backgroundColor="brand.900"
                onClick={() => handleOpenTab('https://www.dosa.finance')}
              >
                Dosa website
              </Button>
              <WalletConnectComponent />
            </Flex>
          </Flex>
          {pollSelected ? <PollPage /> : <WelcomePage />}
        </VStack>
      </Flex>
    </Container>
  );
};

export default App;
