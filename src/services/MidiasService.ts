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

  async createMidia(params) {
    await this.repository.post('midia/create', params);
  }

  async deleteMidia(id) {
    await this.repository.delete(`midia/delete/${id}`);
  }
}

export { MidiaService };
