import {
  Text,
  Flex,
  Button,
  Icon,
  VStack,
  Image,
  HStack,
  useMediaQuery,
  Center,
} from '@chakra-ui/react';
import Card from 'Components/Cards/Card';
import { BsCircleFill } from 'react-icons/bs';
import { PollData, PollStatus } from 'Models/Poll';
import { useMemo } from 'react';
import { pollSelectAction } from 'redux/pollSlice';
import { useDispatch } from 'react-redux';

const Component = ({ data }: { data: PollData }) => {
  const dispatch = useDispatch();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const isOpen = useMemo(() => data.status === PollStatus.OPENED, [data]);

  const selectPoll = () => {
    // window.location.href = `${process.env.REACT_APP_URL}${data.id}`;
    dispatch(pollSelectAction(data.id));
  };

  const isViewable = useMemo(
    () => data.status === PollStatus.OPENED || data.status === PollStatus.CLAIMABLE,
    [data.status],
  );

  return (
    <Card display={'block'} minWidth={'full'}>
      <Flex w="full">
        <Flex
          flex={1}
          textAlign={'left'}
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'start', md: 'center' }}
          gap={{ base: 0, md: 4 }}
          margin={0}
        >
          <Text marginRight={'20px'}>
            Bomb &nbsp;<span style={{ fontWeight: 'bold' }}>{data.id}</span>
          </Text>
          <Flex
            direction={{ base: 'row', md: 'column' }}
            alignItems={'center'}
            gap={2}
          >
            <Text
              textAlign="center"
              w="full"
              minW={'60px'}
              fontSize={'md'}
              fontWeight="semibold"
            >
              Status
            </Text>
            <Icon
              as={BsCircleFill}
              color={isOpen ? 'brand.green' : 'brand.red'}
              w={6}
              h={6}
            ></Icon>
            <Text fontSize={'sm'}>{isOpen ? 'In Progress' : 'Closed'}</Text>
          </Flex>
          {data.winner && isMobile && (
            <HStack>
              <Text minW={'60px'} textAlign={'center'}>
                Winner
              </Text>
              <Image src={data.winner.urlImage} h={6} w={6} />
              <Text fontSize={'sm'}>{data.winner.name}</Text>
            </HStack>
          )}
          {data.winner && !isMobile && (
            <HStack>
              <Image src={data.winner.urlImage} h={10} w={10} />
              <VStack align={'flex-start'}>
                <Text textAlign={'center'}>Winner</Text>
                <Text>{data.winner.name}</Text>
              </VStack>
            </HStack>
          )}
        </Flex>
        <Center>
          <Button variant={'secondary'} onClick={selectPoll} disabled={!isViewable}>
            {isViewable ? 'VIEW' : 'CALCULATING'}
          </Button>
        </Center>
      </Flex>
    </Card>
  );
};

export default Component;
