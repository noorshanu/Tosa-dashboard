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
  Image,
  Spacer,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { PollData } from 'Models/Poll';
import { ReactElement, useEffect, useState } from 'react';
import { useContractClaim, useContractClaimable } from 'Services/contract';

const Component = ({
  data,
  isOpen,
  onClose,
}: {
  data: PollData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasClaimed, setHasClaimed] = useState(true);
  const [reward, setReward] = useState<string>();
  const claimable = useContractClaimable();
  const claim = useContractClaim();

  const handleClaim = () => {
    if (claim) {
      claim();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      if (claimable) {
        claimable().then((value) => {
          setHasClaimed(value === -1);
          setIsLoading(false);
          setReward(value!.toLocaleString());
        });
      }
    }
  }, [isOpen, claimable]);

  let content: ReactElement;
  if (!reward) {
    content = (
      <ModalContent w="400px">
        <ModalHeader>
          <Spinner />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
      </ModalContent>
    );
  } else if (hasClaimed){
    content = (
      <ModalContent w="400px">
        <ModalHeader>
          <Heading size={'md'} color="brand.400">
          Congratulations!!
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Heading size="md">You claimed</Heading>
            <Spacer h={4} />
            <Image w="40px" h="40px" src={data.winner?.urlImage} />
            <Text size="sm">{data.winner?.name}</Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    );
  }
   else if (reward === '0') {
    content = (
      <ModalContent w="400px">
        <ModalHeader>
          <Heading size={'md'} color="brand.400">
            Sorry!!
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack gap={4}>
            <Image h="40px" src="./assets/images/pic_notelegible.png"></Image>
            <Heading w="280px" size="md">
              your wallet is not elegible to claim tokens
            </Heading>
          </VStack>
        </ModalBody>
      </ModalContent>
    );
  } else {
    content = (
      <ModalContent w="400px">
        <ModalHeader>
          <Heading size={'md'} color="brand.400">
            Congratulations!!
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Heading size="md">You can claim</Heading>
            <Text>{reward.toLocaleString()}</Text>
            <Spacer h={4} />
            <Image w="40px" h="40px" src={data.winner?.urlImage} />
            <Text size="sm">{data.winner?.name}</Text>
            <Spacer h={4} />
            <Button onClick={handleClaim}>CLAIM NOW</Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        {isLoading ? <Spinner /> : <>{content}</>}
      </Modal>
    </>
  );
};

export default Component;
