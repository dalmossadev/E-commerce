import 'reflect-metadata';
import { cache } from '@infrastructure/cache/cache';

beforeEach(() => {
  cache.clear();
});

afterAll(() => {
  cache.clear();
});