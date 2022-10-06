import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import Card from 'Components/Cards/Card';
import { usePoll } from 'Services/poll';
import AvailableNFTs from 'Components/Modals/AvailableTokensModal';
import { BsCircleFill } from 'react-icons/bs';
import { ReactElement, useEffect, useMemo } from 'react';
import { PollStatus, VoterData } from 'Models/Poll';
import CoinComponent from 'Components/PollPools/Coin';
import MiniCoinComponent from 'Components/PollPools/MiniCoin';
import ClaimModalComponent from 'Components/Modals/ClaimModal';
import { useContractCoinBalance } from 'Services/contract';
import { useUser } from 'Services/user';
import { pollSelectAction } from 'redux/pollSlice';
import { useDispatch } from 'react-redux';
import { useWallet } from 'Services/wallet';
import { useUserVotesMutation } from 'redux/api';
import { CSVLink } from 'react-csv';

const App = () => {
  const dispatch = useDispatch();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const { pollSelected } = usePoll();
  const coinBalance = useContractCoinBalance();
  const { userData } = useUser();
  const { wallet } = useWallet();
  const [getMyVotes] = useUserVotesMutation();

  useEffect(() => {
    if (
      !pollSelected ||
      !pollSelected.id ||
      pollSelected.status !== PollStatus.OPENED
    )
      return;
    getMyVotes(pollSelected.id!);
  }, [pollSelected, getMyVotes]);

  const pollSelectedIsOpen = useMemo(
    () => (pollSelected ? pollSelected.status === PollStatus.OPENED : false),
    [pollSelected],
  );

  const voteRemaining = useMemo(() => {
    if (!pollSelectedIsOpen) return 0;
    if (!coinBalance || coinBalance === 0) return 0;
    return userData.nftData.owneds.length - userData.votes.length;
  }, [userData, pollSelectedIsOpen, coinBalance]);

  const bomboWalletSliderValue = useMemo(() => {
    console.log('calc bomb wallet slider');
    if (!pollSelected) {
      return 0;
    }
    console.log(pollSelected);
    return (pollSelected.current / pollSelected.limit) * 100;
  }, [pollSelected]);

  const firstCoins = useMemo(() => {
    if (!pollSelected) return [];
    const a = [...pollSelected.coins];
    const appo = a
      .sort(
        (b, a) =>
          (a.voteCount ? a.voteCount : 0) - (b.voteCount ? b.voteCount : 0),
      )
      .slice(0, pollSelected.coins.length < 4 ? pollSelected.coins.length : 4);
    return appo;
  }, [pollSelected]);

  const handleDeselectPoll = () => {
    // window.location.href = `${process.env.REACT_APP_URL}`;
    dispatch(pollSelectAction());
  };

  const canVote = useMemo(() => {
    if (!coinBalance) return false;
    console.log(`canVote = ${coinBalance} >= ${userData.coinTreshold}`);
    return coinBalance >= userData.coinTreshold;
  }, [coinBalance, userData.coinTreshold]);

  const CSVHeaderVoters = [
    { label: 'WALLET_ADDRESS', key: 'address' },
    { label: 'VOTE_COUNT', key: 'quantity' },
  ];

  const CSVDataVoters = useMemo(() => {
    if (!pollSelected) return [];

    const pollVoters: VoterData[] = [];

    pollSelected.coins.forEach((coin) => {
      coin.voters?.forEach((coinVoter) => {
        const index = pollVoters.findIndex(
          (pollVoter) => coinVoter.address === pollVoter.address,
        );
        if (index === -1) {
          pollVoters.push(coinVoter);
        } else {
          pollVoters[index] = {
            address: coinVoter.address,
            quantity: coinVoter.quantity + pollVoters[index].quantity,
          };
        }
      });
    });
    return pollVoters;
  }, [pollSelected]);

  const {
    isOpen: availableTokenIsOpen,
    onOpen: availableTokenOnOpen,
    onClose: availableTokenOnClose,
  } = useDisclosure();
  const {
    isOpen: claimIsOpen,
    onOpen: claimOnOpen,
    onClose: claimOnClose,
  } = useDisclosure();

  const topVotedComponent = useMemo<ReactElement>(() => {
    if (!pollSelected) return <></>;
    if (pollSelected.status !== PollStatus.OPENED) {
      return (
        <Card>
          <Flex direction={'column'} w="full">
            <Heading marginBottom={'8px'} size={'md'}>
              winner coin
            </Heading>
            <MiniCoinComponent data={firstCoins[0]} index={1} />
            <Heading marginTop={'8px'} marginBottom={'8px'} size={'md'}>
              on the podium
            </Heading>
            {firstCoins.length > 1 && (
              <MiniCoinComponent data={firstCoins[1]} index={2} />
            )}
            {firstCoins.length > 2 && (
              <MiniCoinComponent data={firstCoins[2]} index={3} />
            )}
          </Flex>
        </Card>
      );
    } else {
      return (
        <Card>
          <Flex direction={'column'} w="full">
            <Heading marginBottom={'8px'} size={'md'}>
              Top voted
            </Heading>
            {firstCoins?.map((coin, key) => (
              <MiniCoinComponent key={key} data={coin} index={key + 1} />
            ))}
          </Flex>
        </Card>
      );
    }
  }, [pollSelected, firstCoins]);

  if (!pollSelected) return <></>;

  const dosaBalanceComponent: ReactElement =
    coinBalance === undefined ? (
      <Spinner />
    ) : (
      <Text>{coinBalance.toLocaleString()}</Text>
    );
  const nftBalanceComponent: ReactElement = userData.nftData ? (
    <Text>{userData.nftData.balance}</Text>
  ) : (
    <Spinner />
  );
  const voteRemainingComponent: ReactElement = <Text>{voteRemaining}</Text>;

  let headerComponent: ReactElement;
  if (isMobile) {
    headerComponent = (
      <>
        <Flex width={'full'} paddingY={4} color={'white'} direction={'column'}>
          <Card
            variant={'secondary'}
            style={{ width: '100%', margin: '8px 0px 8px 0px' }}
          >
            <Flex textAlign={'center'}>
              <Center>
                <VStack>
                  <Text
                    fontSize={'md'}
                    fontWeight="semibold"
                    color={'brand.500'}
                  >
                    DOSA BALANCE
                  </Text>
                  {dosaBalanceComponent}
                </VStack>
              </Center>
              <Divider
                marginLeft={4}
                w={4}
                height={'auto'}
                orientation="vertical"
              />
              <Center>
                <VStack alignItems={'center'}>
                  <Text
                    fontSize={'md'}
                    fontWeight="semibold"
                    color={'brand.500'}
                  >
                    NFT BALANCE
                  </Text>
                  {nftBalanceComponent}
                </VStack>
              </Center>
              <Divider
                marginLeft={4}
                w={4}
                height={'auto'}
                orientation="vertical"
              />
              <Center>
                <VStack>
                  <Text
                    fontSize={'md'}
                    fontWeight="semibold"
                    color={'brand.500'}
                  >
                    YOUR VOTES
                  </Text>
                  {voteRemainingComponent}
                </VStack>
              </Center>
            </Flex>
          </Card>
          <Flex h="full" w="full">
            <VStack flex={1} onClick={handleDeselectPoll}>
              <Text fontSize={'md'} fontWeight="semibold" color={'brand.500'}>
                Bomb n°
              </Text>
              <Text
                fontSize={'2xl'}
                fontWeight="semibold"
                style={{ margin: '0px' }}
              >
                {pollSelected.id}
              </Text>
              <Text style={{ margin: '0px' }} fontSize={'sm'}>
                View previous Bombs
              </Text>
            </VStack>
            <VStack flex={1}>
              <Text fontSize={'md'} fontWeight="semibold" color={'brand.500'}>
                Status
              </Text>
              <Icon
                as={BsCircleFill}
                color={pollSelectedIsOpen ? 'brand.green' : 'brand.red'}
                w={6}
                h={6}
              ></Icon>
              <Text fontSize={'sm'}>
                {pollSelectedIsOpen ? 'In Progress' : 'Closed'}
              </Text>
            </VStack>
          </Flex>
          <Text
            textAlign={'center'}
            fontSize={'md'}
            fontWeight="semibold"
            color={'brand.500'}
            marginY={2}
          >
            Bomb wallet
          </Text>
          <Flex>
            <VStack flex={1}>
              <>
                <Slider
                  aria-label="slider-ex-4"
                  defaultValue={bomboWalletSliderValue}
                  isReadOnly
                  cursor={'not-allowed'}
                >
                  {pollSelected.status === PollStatus.OPENED && (
                    <SliderMark
                      value={bomboWalletSliderValue}
                      w={20}
                      ml={-10}
                      mt={4}
                      textAlign="center"
                    >
                      {pollSelected.current.toLocaleString()}$
                    </SliderMark>
                  )}
                  <SliderTrack h={4} bg="brand.800">
                    <SliderFilledTrack bg="brand.100" />
                  </SliderTrack>
                  <SliderThumb backgroundColor={'inherit'} boxSize={8}>
                    <Image src="assets/images/dosa_bomb_image.png" />
                  </SliderThumb>
                </Slider>
              </>
            </VStack>
            <Center>
              <Text>{pollSelected.limit.toLocaleString()}$</Text>
            </Center>
          </Flex>
        </Flex>
      </>
    );
  } else {
    headerComponent = (
      <>
        <Card variant={'secondary'} style={{ width: '100%', margin: '0px' }}>
          <Flex h="full" w="full">
            <VStack onClick={handleDeselectPoll} cursor="pointer">
              <Text fontSize={'md'} fontWeight="semibold" color={'brand.500'}>
                Bomb n°
              </Text>
              <Text fontSize={'2xl'} fontWeight="semibold">
                {pollSelected.id}
              </Text>
              <Text fontSize={'sm'}>View previous Bombs</Text>
            </VStack>
            <Divider
              marginLeft={4}
              w={4}
              height={'auto'}
              orientation="vertical"
            />
            <VStack>
              <Text fontSize={'md'} fontWeight="semibold" color={'brand.500'}>
                Status
              </Text>
              <Icon
                as={BsCircleFill}
                color={pollSelectedIsOpen ? 'brand.green' : 'brand.red'}
                w={6}
                h={6}
              ></Icon>
              <Text fontSize={'sm'}>
                {pollSelectedIsOpen ? 'In Progress' : 'Closed'}
              </Text>
            </VStack>
            <Divider
              margin="0px 40px 0px 20px"
              w={4}
              height={'auto'}
              orientation="vertical"
            />
            <VStack flex={1}>
              <>
                <Text fontSize={'md'} fontWeight="semibold" color={'brand.500'}>
                  Bomb wallet
                </Text>
                <Slider
                  aria-label="slider-ex-4"
                  defaultValue={bomboWalletSliderValue}
                  isReadOnly
                  cursor={'not-allowed'}
                >
                  {pollSelected.status === PollStatus.OPENED && (
                    <SliderMark
                      value={bomboWalletSliderValue}
                      w={20}
                      ml={-10}
                      mt={4}
                      textAlign="center"
                    >
                      {pollSelected.current.toLocaleString()}$
                    </SliderMark>
                  )}
                  <SliderTrack h={4} bg="brand.800">
                    <SliderFilledTrack bg="brand.100" />
                  </SliderTrack>
                  <SliderThumb backgroundColor={'inherit'} boxSize={8}>
                    <Image src="assets/images/dosa_bomb_image.png" />
                  </SliderThumb>
                </Slider>
              </>
            </VStack>
            <Center margin="0px 40px 0px 20px">
              <Text>{pollSelected.limit.toLocaleString()}$</Text>
            </Center>
            <Divider w={4} height={'auto'} orientation="vertical" />
            <Center>
              <VStack>
                <Text fontSize={'md'} fontWeight="semibold" color={'brand.500'}>
                  DOSA BALANCE
                </Text>
                {dosaBalanceComponent}
              </VStack>
            </Center>
            <Divider
              marginLeft={4}
              w={4}
              height={'auto'}
              orientation="vertical"
            />
            <Center>
              <VStack alignItems={'center'}>
                <Text fontSize={'md'} fontWeight="semibold" color={'brand.500'}>
                  NFT BALANCE
                </Text>
                {nftBalanceComponent}
              </VStack>
            </Center>
            <Divider
              marginLeft={4}
              w={4}
              height={'auto'}
              orientation="vertical"
            />
            <Center>
              <VStack>
                <Text fontSize={'md'} fontWeight="semibold" color={'brand.500'}>
                  YOUR VOTES
                </Text>
                {voteRemainingComponent}
              </VStack>
            </Center>
          </Flex>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <Box
        w={'full'}
        display={'flex'}
        alignItems="center"
        justifyContent="space-between"
      >
        {headerComponent}
      </Box>
      {/* Content */}
      <Box minWidth={'full'}>
        <Flex
          minW={'full'}
          minHeight={'full'}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box flex={1} paddingBottom={4} paddingTop={0}>
            <CSVLink
              headers={CSVHeaderVoters}
              data={CSVDataVoters}
              enclosingCharacter={``}
              filename={`voters_poll_${pollSelected.id}.csv`}
              style={{ height: '24px' }}
            >
              <Text
                w="full"
                textAlign={'end'}
                color={'white'}
                paddingRight={4}
                paddingBottom={2}
                paddingTop={2}
                fontSize={'sm'}
              >
                Download all voters list
              </Text>
            </CSVLink>
            <Box
              flex={1}
              overflowY="auto"
              h={{
                base: '400px',
                md: 'calc(100vh - 80px - 100px - 120px - 32px)',
              }}
              paddingRight={{ base: 0, md: 4 }}
              sx={{
                '&::-webkit-scrollbar': {
                  width: '12px',
                  borderRadius: '9999px',
                  backgroundColor: 'white',
                },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: '9999px',
                  backgroundColor: 'brand.500',
                },
              }}
            >
              <>
                <VStack w={'full'}>
                  {pollSelected.coins.map((coin, key) => (
                    <CoinComponent
                      data={coin}
                      isOpen={pollSelected.status === PollStatus.OPENED}
                      canVote={canVote}
                      key={key}
                    />
                  ))}
                </VStack>
              </>
            </Box>
          </Box>
          <Box w={{ base: 'full', md: '400px' }}>
            {topVotedComponent}
            {/* <Flex direction={'row'} width={'full'}> */}
            <Flex>
              <Card w="168px">
                <Heading size={'sm'}>Top 100 Dosa holders</Heading>
                <Spacer />
                <Image
                  src={`assets/images/top100${
                    pollSelected && pollSelected.status === 2 ? 'on' : 'off'
                  }.png`}
                />
                <Button
                  disabled={
                    pollSelected.status !== PollStatus.CLAIMABLE ||
                    !wallet.address
                  }
                  onClick={claimOnOpen}
                >
                  CLAIM TOKEN
                </Button>
                <ClaimModalComponent
                  data={pollSelected}
                  onClose={claimOnClose}
                  isOpen={claimIsOpen}
                />
              </Card>
              <Card w="168px">
                <Heading size={'sm'}>Available NFTs for voting</Heading>
                <Spacer />
                <Image src="assets/images/searchID.png" />
                <Button
                  disabled={pollSelected.status !== PollStatus.OPENED}
                  variant={'secondary'}
                  onClick={availableTokenOnOpen}
                >
                  CHECK
                </Button>
                <AvailableNFTs
                  isOpen={availableTokenIsOpen}
                  onClose={availableTokenOnClose}
                />
              </Card>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default App;
