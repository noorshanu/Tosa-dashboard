import OpenedPollPool from 'Components/PollPools/OpenedPollPool';
import ClosedPollPool from 'Components/PollPools/ClosedPollPool';
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Spacer,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import Card from 'Components/Cards/Card';
import { AiFillPlayCircle } from 'react-icons/ai';
import { useMediaQuery } from '@chakra-ui/react';
import { useTotalRewardsMutation } from 'redux/api';
import { useCallback, useEffect, useState } from 'react';

const App = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [totalRewardsValue, setTotalRewardsValue] = useState<number>();
  const [totalRewards] = useTotalRewardsMutation();

  const fetchTotalRewards = useCallback(async () => {
    const result = await totalRewards();
    console.log('fetchTotalRewards');
    if ('data' in result && result.data.resultCode === 0) {
      console.log(result.data);
      setTotalRewardsValue(result.data.value);
    }
  }, [totalRewards]);

  useEffect(() => {
    fetchTotalRewards();
  }, [fetchTotalRewards]);

  const handleOpenTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const pollsComponent = (
    <>
      <Box
        flex={1}
        overflowY="auto"
        h={{ base: '500px', md: 'calc(100vh - 80px - 100px - 120px - 32px)' }}
        paddingRight={4}
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
        <OpenedPollPool></OpenedPollPool>
        <Spacer h={10} />
        <ClosedPollPool></ClosedPollPool>
      </Box>
    </>
  );

  return (
    <>
      {/* Header */}
      <Box
        w={'auto'}
        h={'120px'}
        display={{ base: 'block', md: 'flex' }}
        alignItems="center"
        justifyContent="space-between"
      >
        <>
          <Heading color={'brand.500'}>Welcome to &nbsp;</Heading>
          <Image src="assets/images/dosa_bomb_title.png"></Image>
        </>
      </Box>
      {/* Content */}
      <Box minWidth={'full'}>
        <Flex
          minW={'full'}
          minHeight={'full'}
          direction={{
            base: 'column-reverse',
            md: 'row',
          }}
        >
          <Box flex={1} paddingBottom={4} paddingTop={4}>
            {isMobile ? (
              <Card variant="secondary" display="block">
                {pollsComponent}
              </Card>
            ) : (
              pollsComponent
            )}
          </Box>
          <Box w={{ base: 'full', md: '450px' }}>
            <Card variant={'secondary'}>
              <Text fontWeight={600}>What is DOSA BOMB?</Text>
              <Text fontSize={'sm'}>
                The Dosa Bomb is a DeFi wallet-integrated tool that entitles
                Dosa Fuses to vote on where the Dosa Bomb Wallet is spent.
              </Text>
              <HStack alignSelf={'start'} spacing={4}>
                <HStack
                  cursor={'pointer'}
                  onClick={() =>
                    handleOpenTab('https://www.youtube.com/watch?v=o371s4BFu6g')
                  }
                >
                  <Icon
                    as={AiFillPlayCircle}
                    color="brand.500"
                    w={12}
                    h={12}
                  ></Icon>
                  <Text style={{ marginLeft: '0px' }}>PLAY VIDEO</Text>
                </HStack>
              </HStack>
            </Card>
            <Card>
              <Heading size={'md'}>All time distributed</Heading>
              <Center
                border={'11px solid #85AAEB;'}
                borderRadius="full"
                h="216px"
                w="216px"
              >
                <VStack>
                  <Heading>
                    {totalRewardsValue !== undefined ? (
                      <>{totalRewardsValue.toLocaleString()}</>
                    ) : (
                      <>
                        <Spinner />
                      </>
                    )}
                  </Heading>
                  <Text>Total $ Rewarded</Text>
                </VStack>
              </Center>
            </Card>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default App;
