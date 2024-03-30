/**
 * @Description
 */

// 模拟用户数据
import { Request, Response } from 'express';
import audio from '../utils/audio'
const users = [
  { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
  { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
];

export const getPosts = (req: Request, res: Response) => {
  const { current, pageSize, sorter, filter } = req.query;
  console.log(current, pageSize, sorter, filter);
  // 这里可以根据查询参数对 userList 进行筛选、排序等操作，这里简单返回全部用户数据
  res.json({
    success: true,
    data: { list: users },
    errorCode: 0,
  });
};
