import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'redux/userSlice';

export const useUser = () => {
  const userData = useSelector(selectUser);

  return useMemo(() => {
    const availableNfts = [
      ...userData.nftData.owneds.filter(
        (ownedTokenId) =>
          userData.votes.findIndex((vote) => vote.assetId === ownedTokenId) === -1,
      ),
    ];
    const consumedNfts = userData.votes.map((vote) => vote.assetId);

    return {
      userData,
      availableNfts,
      consumedNfts,
    };
  }, [userData]);
};
