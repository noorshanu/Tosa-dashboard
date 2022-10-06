import {
  Text,
  Flex,
  Icon,
  useDisclosure,
  Image,
  Heading,
} from '@chakra-ui/react';
import { CoinData } from 'Models/Poll';
import { IoHeartCircle } from 'react-icons/io5';
import VoterListModalComponent from "Components/Modals/VoterListModal";

const Component = ({ data, index }: { data: CoinData, index: number }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        direction={'row'}
        w={'full'}
        alignItems={'center'}
        gap={4}
        onClick={onOpen}
        cursor='pointer'
      >
        <Heading minW='24px' size={'md'}>{index}</Heading>
        <Image src={data.urlImage} h={8} w={8} />
        <Text flex={1} textAlign={'left'}>{data.name}</Text>
        <Icon as={IoHeartCircle} color={'brand.heartIcon'} h={6} w={6} />
        <Text minW='46px'>{data.voteCount}</Text>
      </Flex>
      <VoterListModalComponent isOpen={isOpen} onClose={onClose} data={data}/>
    </>
  );
};

export default Component;
