import dev from './env.dev';
import prod from './env.prod';

const config = process.env.DEV ? dev : prod;

export default config;
