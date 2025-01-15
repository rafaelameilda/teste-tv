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

  //   async addMidia(id, params) {
  //     await this.repository.post(`playlist/add-midia/${id}`, params);
  //   }

  async deleteTv(id) {
    await this.repository.delete(`tv/delete/${id}`);
  }
}

export { TvsService };
