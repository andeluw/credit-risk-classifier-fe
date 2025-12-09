import { NextResponse } from 'next/server';

export type User = {
  id: number;
  name: string;
  email: string;
  country: string;
};

const users: User[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@mail.com`,
  country: ['Indonesia', 'Malaysia', 'Singapore'][
    Math.floor(Math.random() * 3)
  ],
}));

export async function GET(req: Request) {
  const url = new URL(req.url);

  const pageSize = +(url.searchParams.get('per_page') || '10');
  const pageParam = url.searchParams.get('page');
  const pageNumber = pageParam ? +pageParam : null;
  const sort = url.searchParams.get('sort') as keyof User;
  const type = url.searchParams.get('type') as 'asc' | 'desc';
  const keyword = url.searchParams.get('keyword') || '';
  const country = url.searchParams.getAll('country');

  let data: User[] = [...users];

  if (keyword) {
    data = data.filter((user) =>
      user.name.toUpperCase().includes(keyword.toUpperCase()),
    );
  }

  if (country.length) {
    data = data.filter((user) => country.includes(user.country));
  }

  if (sort) {
    data = data.sort((a, b) =>
      (type === 'asc' ? a[sort] > b[sort] : a[sort] < b[sort]) ? 1 : -1,
    );
  }

  if (!pageNumber) {
    return NextResponse.json({
      code: 200,
      status: 'OK',
      data,
    });
  }

  const totalItems = data.length;
  const lastPage = Math.ceil(totalItems / pageSize);
  const returnedData = data.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize,
  );

  return NextResponse.json({
    code: 200,
    status: 'OK',
    data: returnedData,
    meta: {
      page: pageNumber,
      per_page: pageSize,
      count: totalItems,
      max_page: lastPage,
    },
  });
}
