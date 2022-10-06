import { VStack, Text } from '@chakra-ui/react';
import Poll from 'Components/PollPools/Poll';
import { usePoll } from 'Services/poll';

const Component = () => {
const {pollOpenedList} = usePoll();

  return (
    <VStack>
      <Text fontWeight={'semibold'} color={'white'} minWidth={'full'}>
        Active bomb
      </Text>
      {
        pollOpenedList.map((poll, key) => (
          <Poll data={poll} key={key} />
        ))
      }
    </VStack>
  );
};

export default Component;
