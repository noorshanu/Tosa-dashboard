import { VStack, Text } from '@chakra-ui/react';
import Poll from 'Components/PollPools/Poll';
import { usePoll } from 'Services/poll';

const Component = () => {
  const { pollClosedList, pollClaimableList } = usePoll();

  return (
    <>
      <VStack>
        <Text fontWeight={'semibold'} color={'white'} minWidth={'full'}>
          Closed bombs
        </Text>
        {pollClosedList.map((poll, key) => (
          <Poll data={poll} key={key} />
        ))}
        {pollClaimableList.map((poll, key) => (
          <Poll data={poll} key={key} />
        ))}
      </VStack>
    </>
  );
};

export default Component;
