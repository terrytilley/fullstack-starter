import DataLoader from 'dataloader';
import { User } from '../entities/User';

// [1, 78, 8, 9]
// [{id: 1, username: 'tim'}, {}, {}, {}]
export const createUserLoader = () => {
  return new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const usersById: Record<number, User> = {};
    users.forEach((user) => {
      usersById[user.id] = user;
    });
    // return sorted users
    return userIds.map((userId) => usersById[userId]);
  });
};
