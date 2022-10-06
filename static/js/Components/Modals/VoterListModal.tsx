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
  HStack,
  Image,
  Input,
  Icon,
  Flex,
  Center,
  Spacer,
  useMediaQuery,
  Box,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { CoinData } from 'Models/Poll';
import { useMemo } from 'react';
import { IoSearchCircle } from 'react-icons/io5';
import { truncateLongAddress, useClipboard } from 'Services/global';

const App = ({
  data,
  isOpen,
  onClose,
}: {
  data: CoinData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const copy = useClipboard();
  const formik = useFormik({
    initialValues: {
      searchValue: '',
    },
    onSubmit: () => {},
  });

  const filteredValues = useMemo(() => {
    return data.voters!.filter((voter) =>
      voter.address.includes(formik.values.searchValue),
    );
  }, [formik.values.searchValue, data.voters]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent minW={{ base: 'auto', md: '650px' }}>
          <HStack position={'absolute'} top={4} left={6}>
            <Image src={data.urlImage} h={10} w={10} />
            <Text>{data.name}</Text>
          </HStack>
          <ModalHeader>
            <Spacer h={'30px'} />
            <Heading size={'md'}>List of voters</Heading>
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
              {filteredValues?.map((voter, key) => (
                <Flex
                  alignItems={'start'}
                  w='full'
                  key={key}
                  onClick={() => copy(voter.address)}
                >
                  <Box>
                    <Text variant={'address'}>
                      {isMobile
                        ? truncateLongAddress(voter.address)
                        : voter.address}
                    </Text>
                  </Box>
                  <Spacer />
                  <Box marginRight={'20px'}>
                    <Text>{voter.quantity}</Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
