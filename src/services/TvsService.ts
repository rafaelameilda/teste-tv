import { AxiosInstance } from 'axios';
import { api } from 'src/boot/axios';

class TvsService {
  private repository: AxiosInstance;

  constructor() {
    this.repository = api;
  }

  async listTvs() {
    const { data } = await this.repository.get('tv/list');

    return data;
  }

  async createTvs(params) {
    await this.repository.post('tv/create', params);
  }

  async deleteTv(id) {
    await this.repository.delete(`tv/delete/${id}`);
  }

  async getMidiasByTv(id) {
    const { data } = await this.repository.get(`tv/midias/${id}`);
    return data;
  }
}

export { TvsService };
