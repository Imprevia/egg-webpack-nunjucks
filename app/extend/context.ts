import { Context } from 'egg';
import * as _ from 'lodash';
import { RequestOptions2 as RequestOptions } from 'urllib';
export default {
    async fetch(url: string, obj?: RequestOptions) {
        // @ts-ignore;
        const ctx: Context = this;
        if (!obj) obj = {};
        const def = {
            dataType: 'json',
            headers: {
                Accept: 'application/json',
                AppType: 'pc',
                Cookie: ctx.header.cookie,
                posTypeNewFlag: 'true',
            },
        };

        if (!_.startsWith(url.toLowerCase(), 'http://')) {
            url = ctx.app.locals.eyasApi + url;
        }
        if (url.indexOf('?') !== -1) {
            url += '&t=' + new Date().getTime();
        } else {
            url += '?t=' + new Date().getTime();
        }
        _.merge(obj, def);
        try {
            const result = await ctx.curl(url, obj);
            return result.data;
        } catch (e) {
            ctx.logger.error(e);
            throw e;
        }
    }
};