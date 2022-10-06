import { PollStatus } from 'Models/Poll';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPollList, selectPollSelected } from 'redux/pollSlice';

export const usePoll = () => {
  const pollFullList = useSelector(selectPollList);
  const pollSelected = useSelector(selectPollSelected);
  return useMemo(() => {
    const pollCreatedList = pollFullList.filter(
      (poll) => poll.status === PollStatus.CREATED,
    );
    const pollOpenedList = pollFullList.filter(
      (poll) => poll.status === PollStatus.OPENED,
    );
    const pollClosedList = pollFullList.filter(
      (poll) => poll.status === PollStatus.CLOSED || poll.status === PollStatus.PENDING_CLAIM,
    );
    const pollClaimableList = pollFullList.filter(
      (poll) => poll.status === PollStatus.CLAIMABLE,
    );
    return {
      pollFullList,
      pollSelected,
      pollCreatedList,
      pollOpenedList,
      pollClosedList,
      pollClaimableList
    };
  }, [pollFullList, pollSelected]);
};
