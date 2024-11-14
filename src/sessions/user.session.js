import User from '../classes/models/user.class.js';
import { userSessions } from './sessions.js';

/**
 * 유저 세션 추가
 * @param {*} socket
 * @param {*} id
 */
export const addUser = (socket, id) => {
  const user = new User(socket, id);
  userSessions.push(user);
  return user;
};

/**
 * 유저 세션 삭제
 * @param {*} socket
 * @returns
 */
export const removeUserBySocket = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

/**
 * 유저 세션 조회
 * @param {*} id
 * @returns
 */
export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

/**
 * 유저 세션 조회
 * @param {*} socket
 * @returns
 */
export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
