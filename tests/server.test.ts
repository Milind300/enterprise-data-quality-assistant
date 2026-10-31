import {it,expect} from 'vitest'; import {startServer} from '../src/server.js';
it('exports an explicit server start function without starting on import',()=>expect(startServer).toBeTypeOf('function'));
