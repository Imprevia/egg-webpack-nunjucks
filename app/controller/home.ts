import { Controller } from "egg";

export default class HomeController extends Controller {
  public async index() {
    // await this.ctx.render('index.html');
    return await this.ctx.curl(`http://cloud-payment-service/payment/get/1`);
  }
}
