import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Heading,
  Flex,
  Input,
  Center,
  Icon,
  Spacer,
  Spinner,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoSearchCircle } from 'react-icons/io5';
import { usePollAvailableTokensMutation } from 'redux/api';
import { usePoll } from 'Services/poll';

const Component = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [getAvailableTokens] = usePollAvailableTokensMutation();
  const {pollSelected} = usePoll();
  const [availableNfts, setAvailableNfts] = useState<number[]>();

  const formik = useFormik({
    initialValues: {
      searchValue: '',
    },
    onSubmit: () => {},
  });

  const fetchAvailableTokens = useCallback(async ()=> {
    if(!pollSelected){
      return;
    }
    const response = await getAvailableTokens(pollSelected.id!)
    if('data' in response){
      setAvailableNfts(response.data.ids);
      return;
    }
  }, [getAvailableTokens, pollSelected]);

  const filteredValues = useMemo(() => {
    if(!availableNfts){
      return undefined;
    }
    return availableNfts.filter((voter) =>
      voter.toString().includes(formik.values.searchValue),
    );
  }, [availableNfts, formik.values.searchValue]);

  useEffect(()=>{
    if(isOpen){
      fetchAvailableTokens();
    }
  },[isOpen, fetchAvailableTokens]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size={'md'}>Available NFTs for voting</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Input
              placeholder="search"
              border={'4px solid'}
              borderColor={'black'}
              id="searchValue"
              onChange={formik.handleChange}
              value={formik.values.searchValue}
            />
            <Center marginRight={-3}>
              <Icon
                cursor={'pointer'}
                as={IoSearchCircle}
                color="brand.500"
                h={10}
                w={10}
              />
            </Center>
          </Flex>
          <Spacer h={4} />
          <VStack
            h={200}
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
            align={'flex-start'}
            paddingLeft={4}
          >
            {!filteredValues && <Center w='full' h='full'><Spinner/></Center>}
            {filteredValues && filteredValues.map((value, key) => (
              <Text key={key}>ID {value}</Text>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Component;
