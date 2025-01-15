import { AxiosInstance } from 'axios';
import { api } from 'src/boot/axios';

class PlayListService {
  private repository: AxiosInstance;

  constructor() {
    this.repository = api;
  }

  async listPlayList() {
    const { data } = await this.repository.get('playlist/list');

    return data;
  }

  async createPlayList(params) {
    await this.repository.post('playlist/create', params);
  }

  async addMidia(id, params) {
    await this.repository.post(`playlist/add-midia/${id}`, params);
  }

  async deletePlayList(id) {
    await this.repository.delete(`playlist/delete/${id}`);
  }
}

export { PlayListService };
