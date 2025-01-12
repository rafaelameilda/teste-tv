import { AxiosInstance } from 'axios';
import { api } from 'src/boot/axios';

class MidiaService {
  private repository: AxiosInstance;

  constructor() {
    this.repository = api;
  }

  async listMidia() {
    const { data } = await this.repository.get('midia/list');

    return data;
  }
}

export { MidiaService };
