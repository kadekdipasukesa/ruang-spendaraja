import Leaderboard from '../../components/Leaderboard';

const LeaderboardWrapper = ({ data }) => {
  return (
    <Leaderboard
      data={data}
      scoreLabel="WPM"
      secondaryLabel="ACC"
    />
  );
};

export default LeaderboardWrapper;