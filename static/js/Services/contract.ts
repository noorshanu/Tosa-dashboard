import { BigNumber, ethers } from 'ethers';
import vaultContractABI from 'Assets/ContractsABI/vault.json';
import coinContractABI from 'Assets/ContractsABI/coin.json';
import nftContractABI from 'Assets/ContractsABI/nft.json';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectContract } from 'redux/contractSlice';
import { setWallet } from 'redux/walletSlice';
import { useWallet } from './wallet';
import { useLoginMutation, useNonceMutation } from 'redux/api';
import { userSetNftsAction } from 'redux/userSlice';
import { usePoll } from './poll';
import { useToast } from '@chakra-ui/react';

const weiToEth = (value: string) => {
  const ethString = value.substring(0, value.length - 18);
  const ethValue: number = +ethString;
  return ethValue;
};

interface Contracts {
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.providers.JsonRpcSigner;
  coinContract?: ethers.Contract;
  nftContract?: ethers.Contract;
}

const useWeb3 = () => {
  const [result, setResult] = useState<Contracts>({});

  useEffect(() => {
    console.log('preparing web3...');
    if (!window.ethereum) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(provider);
    const signer = provider.getSigner();
    // console.log(signer);
    const coinContract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_COIN!,
      coinContractABI,
      provider,
    );
    // console.log(coinContract);
    const nftContract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_NFT!,
      nftContractABI,
      provider,
    );
    // console.log(nftContract);
    console.log('web3 ready!');
    setResult({ provider, signer, coinContract, nftContract });
  }, []);

  return result;
};

export const useContractMetamaskLogin = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [nonce] = useNonceMutation();
  const [login] = useLoginMutation();
  useContractNftBalance();

  const { provider } = useWeb3();

  return useCallback(async () => {
    console.log('Requesting account...');

    if (provider) {
      try {
        // MetaMask requires requesting permission to connect users accounts
        const accounts = await provider.send('eth_requestAccounts', []);
        await provider.send('wallet_switchEthereumChain', [
          { chainId: process.env.REACT_APP_CHAIN_ID },
        ]);

        const wallet = ethers.utils.getAddress(accounts[0]);

        // ho l'address. chiedo il nonce da firmare
        const nonceResponse = await nonce(wallet);

        if ('data' in nonceResponse) {
          console.log(nonceResponse.data);

          // The MetaMask plugin also allows signing transactions to
          // send ether and pay to change state within the blockchain.
          // For this, you need the account signer...
          const signer = provider.getSigner();
          const signedMessage = await signer.signMessage(
            nonceResponse.data.value,
          );
          console.log(signedMessage);
          const loginResponse = await login({
            auth: signedMessage,
            walletid: wallet,
          });
          console.log(loginResponse);

          if ('data' in loginResponse) {
            if (loginResponse.data.resultCode !== 0) {
              toast({
                title: 'You are not Authorized',
                description: '',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
              return;
            }

            dispatch(
              setWallet({
                address: wallet,
                provider: 'metamask',
                authenticated:
                  process.env.REACT_APP_ADMIN_AUTH !== '0' ||
                  loginResponse.data.value,
              }),
            );
          }
        }
      } catch (error) {
        console.log('Error connecting...');
      }
    } else {
      toast({
        title: 'Use MetaMask Browser',
        status: 'warning',
        isClosable: true,
      });
    }
  }, [dispatch, login, nonce, provider, toast]);
};

export const useContractVaultTotalRewards = () => {
  const [totalRewards, setTotalRewards] = useState<number>();
  const { provider } = useWeb3();
  const { pollSelected } = usePoll();

  useEffect(() => {
    if (!provider || !pollSelected || !pollSelected.addressVault) {
      return;
    }

    const vaultContract = new ethers.Contract(
      pollSelected.addressVault,
      vaultContractABI,
      provider,
    );

    const getTotalRewards = async () => {
      const totalRewards: number = await vaultContract.totalRewards();
      const result = await totalRewards;
      return result;
    };

    getTotalRewards().then((value) => {
      setTotalRewards(value);
    });
  }, [provider, pollSelected]);

  return totalRewards;
};

export const useContractCoinBalance = () => {
  const [balance, setBalance] = useState<number>();
  const { wallet } = useWallet();
  const { pollSelected } = usePoll();
  const { coinContract } = useWeb3();

  useEffect(() => {
    if (!coinContract) {
      return;
    }

    const getBalanceOf = async () => {
      if (!wallet.address) {
        return undefined;
      }
      const result: BigNumber = await coinContract.balanceOf(wallet.address);
      return weiToEth(result.toString());
    };

    if (pollSelected) {
      getBalanceOf().then((value) => {
        setBalance(value);
      });
    }
  }, [wallet, pollSelected, coinContract]);

  return balance;
};

export const useContractNftBalance = () => {
  const { wallet } = useWallet();
  const { pollSelected } = usePoll();
  const dispatch = useDispatch();
  const { nftContract } = useWeb3();

  useEffect(() => {
    if (!nftContract) {
      return;
    }

    const getBalanceOf = async () => {
      if (!wallet.address) {
        return undefined;
      }
      let balance = 0;
      if (
        process.env.REACT_APP_CONTRACT_NFT ===
        '0x000000000000000000000000000000000000dEaD'
      ) {
        console.log('missing nft contract address');
      } else {
        const resultBalance: BigNumber = await nftContract.balanceOf(
          wallet.address,
        );
        balance = resultBalance.toNumber();
      }
      const promiseTokenIds = [];
      for (let i = 0; i < balance; i++) {
        promiseTokenIds.push(
          nftContract.tokenOfOwnerByIndex(wallet.address, i),
        );
      }
      const resultTokenIds: BigNumber[] = await Promise.all(promiseTokenIds);

      console.log(resultTokenIds);
      dispatch(
        userSetNftsAction(resultTokenIds.map((tokenId) => tokenId.toNumber())),
      );
    };

    if (pollSelected) {
      getBalanceOf();
    }
  }, [wallet, dispatch, pollSelected, nftContract]);
};

export const useContractClaimable = () => {
  const { wallet } = useWallet();
  const { provider } = useWeb3();
  const { pollSelected } = usePoll();

  return useCallback(async () => {
    if (
      !wallet.address ||
      !provider ||
      !pollSelected ||
      !pollSelected.addressVault
    ) {
      return;
    }

    const vaultContract = new ethers.Contract(
      pollSelected.addressVault,
      vaultContractABI,
      provider,
    );

    const resultHasClaimed: boolean = await vaultContract.hasClaimed(
      wallet.address,
    );
    if (resultHasClaimed) {
      console.log('user has already claimed');
      return -1;
    }
    const result: BigNumber = await vaultContract.getRewardsClaimablePerUser(
      wallet.address,
    );
    return weiToEth(result.toString());
  }, [wallet, provider, pollSelected]);
};

export const useContractClaim = () => {
  const { wallet } = useWallet();
  const { provider, signer } = useWeb3();
  const { pollSelected } = usePoll();

  return useCallback(async () => {
    if (!provider || !signer || !pollSelected || !pollSelected.addressVault) {
      return;
    }

    const vaultContract = new ethers.Contract(
      pollSelected.addressVault,
      vaultContractABI,
      provider,
    );
    if (!wallet.address) {
      console.error('wallet utente non trovato');
      return;
    }
    const vaultContractWithSigner = vaultContract.connect(signer);
    const result = await vaultContractWithSigner.claim();
    console.log(result);
  }, [wallet, provider, signer, pollSelected]);
};

// Non utilizzato perchè non so se è la scelta migliore
export const useContract = () => {
  const contract = useSelector(selectContract);

  return useMemo(() => ({ contract }), [contract]);
};
