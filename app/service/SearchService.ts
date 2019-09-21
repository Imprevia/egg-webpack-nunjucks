import { Service } from 'egg';

/**
 * Test Service
 */
export default class SearchService extends Service {

    public async getSearchPosNet() {
        try {
            return await this.ctx.fetch('/search/pos/net');
        } catch (e) {
            return {}
        }
    }
}
