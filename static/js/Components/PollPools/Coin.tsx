import {
  Text,
  Flex,
  Spacer,
  Button,
  Icon,
  VStack,
  Center,
  useDisclosure,
  Image,
  useMediaQuery,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  MenuGroup,
  Tooltip,
} from '@chakra-ui/react';
import Card from 'Components/Cards/Card';
import { CoinData, VoteData, VoteType } from 'Models/Poll';
import { ImHome } from 'react-icons/im';
import { FaDownload, FaUser } from 'react-icons/fa';
import { IoHeartCircle } from 'react-icons/io5';
import VoterListModal from 'Components/Modals/VoterListModal';
import { truncateLongAddress, useClipboard } from 'Services/global';
import { ReactElement, useCallback, useMemo } from 'react';
import { usePollVoteCoinMutation } from 'redux/api';
import { useWallet } from 'Services/wallet';
import { useUser } from 'Services/user';
import { useDispatch } from 'react-redux';
import { userAddVoteAction } from 'redux/userSlice';
import { pollAddVoteAction } from 'redux/pollSlice';
import { CSVLink } from 'react-csv';

const Component = ({
  data,
  isOpen,
  canVote,
}: {
  data: CoinData;
  isOpen: boolean;
  canVote: boolean;
}) => {
  const dispatch = useDispatch();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [isTablet] = useMediaQuery('(max-width: 1300px)');
  const { wallet } = useWallet();
  const { availableNfts, userData } = useUser();
  const {
    isOpen: voterListIsOpen,
    onOpen: voterListOpen,
    onClose: voterListClose,
  } = useDisclosure();
  const copyToClipboard = useClipboard();
  const [vote] = usePollVoteCoinMutation();
  const handleVote = useCallback(
    async (assetId: number) => {
      const voteData: VoteData = {
        assetId,
        assetType: assetId === -1 ? VoteType.COIN : VoteType.NFT,
        coinId: data.id!,
      };
      const responseVote = await vote({ pollId: data.poll, voteData });
      console.log(responseVote);
      if ('data' in responseVote) {
        dispatch(userAddVoteAction(voteData));
        dispatch(
          pollAddVoteAction({
            address: wallet.address!,
            data: voteData,
          }),
        );
      }
    },
    [data, dispatch, vote, wallet.address],
  );

  const CSVHeaderVoters = [
    { label: 'WALLET_ADDRESS', key: 'address' },
    { label: 'VOTE_COUNT', key: 'quantity' },
  ];

  const CSVDataVoters = useMemo(() => {
    if (!data.voters) return [];
    return data.voters;
  }, [data]);

  const isFirstVote = useMemo(() => {
    return availableNfts.findIndex((tokenId) => tokenId === -1) !== -1;
  }, [availableNfts]);

  const voteButtonComponent = useMemo<ReactElement>(() => {
    if (isFirstVote) {
      const content: ReactElement = (
        <Button
          variant="secondary"
          disabled={!wallet.authenticated || !isOpen || !canVote}
          onClick={() => handleVote(-1)}
        >
          Vote
        </Button>
      );
      if (isOpen || canVote) {
        return content;
      } else {
        return (
          <Tooltip
            hasArrow
            label={`You must hold ${userData.coinTreshold.toLocaleString()} $DOSA to vote`}
            shouldWrapChildren
            mt="3"
          >
            {content}
          </Tooltip>
        );
      }
    } else {
      return (
        <Menu>
          <MenuButton
            as={Button}
            variant="secondary"
            disabled={!wallet.authenticated || !isOpen || !canVote}
          >
            Vote
          </MenuButton>
          <Portal>
            <MenuList
              maxH={{ base: '300px', md: '300px' }}
              overflow="auto"
              sx={{
                '&::-webkit-scrollbar': {
                  width: '12px',
                  borderRadius: '9999px',
                  backgroundColor: 'gray.200',
                },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: '9999px',
                  backgroundColor: 'brand.500',
                },
              }}
              paddingLeft={4}
            >
              <MenuGroup title="Available">
                {availableNfts.map((tokenId, key) => (
                  <MenuItem key={key} onClick={() => handleVote(tokenId)}>
                    {`ID ${tokenId}`}
                  </MenuItem>
                ))}
              </MenuGroup>

              {/* <MenuGroup title="Consumed">
              {consumedNfts.map((tokenId, key) => (
                <MenuItem
                  isDisabled
                  key={key}
                  onClick={() => handleVote(tokenId)}
                >
                  {tokenId === -1 ? 'Free' : `ID ${tokenId}`}
                </MenuItem>
              ))}
            </MenuGroup> */}
              {}
            </MenuList>
          </Portal>
        </Menu>
      );
    }
  }, [
    isFirstVote,
    wallet.authenticated,
    canVote,
    handleVote,
    isOpen,
    availableNfts,
    userData.coinTreshold
  ]);

  let content: ReactElement;
  if (isMobile) {
    content = (
      <Flex direction={'column'} alignItems={'start'} gap={0}>
        <Flex alignItems={'center'} direction={'row'} gap={4}>
          <Image src={data.urlImage} h={8} w={8} />
          <Text fontSize={'md'} fontWeight="semibold">
            {data.name}
          </Text>
        </Flex>
        <Text
          variant={'address'}
          fontSize={'sm'}
          onClick={() => copyToClipboard(data.address)}
        >
          {data.address}
        </Text>
        <Flex alignItems={'center'} direction={'row'} width={'full'} gap={4}>
          <Icon
            as={ImHome}
            onClick={() => {
              window.open(data.url);
            }}
            h={6}
            w={6}
            color="brand.500"
          />
          <Icon
            as={FaUser}
            onClick={voterListOpen}
            h={6}
            w={6}
            color="brand.500"
          />
          <Spacer height={'full'} flex={1} />
          {voteButtonComponent}
          <Icon as={IoHeartCircle} color={'brand.heartIcon'} h={10} w={10} />
          <Center>
            <Text fontSize={'large'} fontWeight={'bold'}>
              {data.voteCount}
            </Text>
          </Center>
        </Flex>
      </Flex>
    );
  } else {
    content = (
      <Flex padding="0px 20px 0px 20px" alignItems={'center'} gap={4}>
        <Image src={data.urlImage} h={10} w={10} />
        <VStack alignItems={'start'}>
          <Text fontSize={'md'} fontWeight="semibold">
            {data.name}
          </Text>
          <Text
            variant={'address'}
            fontSize={'sm'}
            onClick={() => copyToClipboard(data.address)}
          >
            {isTablet ? truncateLongAddress(data.address) : data.address}
          </Text>
        </VStack>
        <Spacer />
        <Icon
          as={ImHome}
          onClick={() => {
            window.open(data.url);
          }}
          h={6}
          w={6}
          color="brand.500"
          cursor="pointer"
        />
        <Icon
          as={FaUser}
          onClick={voterListOpen}
          h={6}
          w={6}
          color="brand.500"
          cursor="pointer"
        />
        <CSVLink
          headers={CSVHeaderVoters}
          data={CSVDataVoters}
          enclosingCharacter={``}
          filename={`voters_poll_${data.poll}_coin_${data.name}_${data.address}.csv`}
          style={{ height: '24px' }}
        >
          <Icon
            as={FaDownload}
            h={6}
            w={6}
            color="brand.500"
            cursor={'pointer'}
          />
        </CSVLink>
        <Spacer />
        {voteButtonComponent}
        <Icon as={IoHeartCircle} color={'brand.heartIcon'} h={10} w={10} />
        <Text minW="46px" fontSize={'large'} fontWeight={'bold'}>
          {data.voteCount}
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <VoterListModal
        isOpen={voterListIsOpen}
        onClose={voterListClose}
        data={data}
      />
      <Card display={'block'} width={{ base: '80vw', md: 'full' }} margin={0}>
        {content}
      </Card>
    </>
  );
};

export default Component;
